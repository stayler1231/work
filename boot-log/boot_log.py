"""View Windows startup and shutdown events."""
import csv
import os
import subprocess
import threading
import tkinter as tk
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from queue import Empty, Queue
from tkinter import filedialog, messagebox, ttk


EVENT_TYPES = {
    ("Microsoft-Windows-Kernel-General", 12): "Запуск Windows",
    ("Microsoft-Windows-Kernel-General", 13): "Начало выключения Windows",
    ("Microsoft-Windows-Kernel-Power", 41): "Запуск после некорректного выключения",
    ("USER32", 1074): "Запрос на выключение или перезагрузку",
    ("EventLog", 6008): "Обнаружено неожиданное выключение",
    ("Microsoft-Windows-WER-SystemErrorReporting", 1001): "Перезагрузка после системного сбоя",
}
NS = {"e": "http://schemas.microsoft.com/win/2004/08/events/event"}
DISPLAY_FORMAT = "%d.%m.%Y %H:%M:%S %z"


@dataclass(frozen=True)
class Event:
    time: datetime
    event_id: int
    provider: str
    record_id: str
    kind: str
    details: str


def event_query(days):
    providers = " or ".join(
        f"(Provider[@Name='{provider}'] and EventID={event_id})"
        for provider, event_id in EVENT_TYPES
    )
    return f"*[System[({providers}) and TimeCreated[timediff(@SystemTime) <= {days * 86400000}]]]"


def parse_events(xml):
    if not xml.strip():
        return []
    events = []
    for node in ET.fromstring(xml).findall("e:Event", NS):
        system = node.find("e:System", NS)
        provider = system.find("e:Provider", NS).attrib["Name"]
        event_id = int(system.findtext("e:EventID", namespaces=NS))
        timestamp = system.find("e:TimeCreated", NS).attrib["SystemTime"]
        message = node.findtext("e:RenderingInfo/e:Message", namespaces=NS)
        fields = [
            f"{field.get('Name') or index}: {field.text}"
            for index, field in enumerate(node.findall("e:EventData/e:Data", NS), 1)
            if field.text
        ]
        events.append(Event(
            datetime.fromisoformat(timestamp).astimezone(),
            event_id,
            provider,
            system.findtext("e:EventRecordID", default="", namespaces=NS),
            EVENT_TYPES.get((provider, event_id), "Системное событие"),
            "\n\n".join(filter(None, [message, "\n".join(fields)])),
        ))
    return sorted(events, key=lambda event: event.time, reverse=True)


def read_events(days):
    executable = Path(os.environ["SystemRoot"]) / "System32" / "wevtutil.exe"
    result = subprocess.run(
        [str(executable), "qe", "System", f"/q:{event_query(days)}",
         "/f:RenderedXml", "/e:Events", "/rd:true", "/uni:true"],
        capture_output=True,
        creationflags=subprocess.CREATE_NO_WINDOW,
        timeout=30,
        check=False,
    )
    if result.returncode:
        error = result.stderr.decode("utf-16-le", errors="replace").strip("\ufeff\r\n ")
        raise RuntimeError(error or f"wevtutil завершился с кодом {result.returncode}.")
    return parse_events(result.stdout.decode("utf-16-le").lstrip("\ufeff"))


def spreadsheet_text(value):
    if value.lstrip().startswith(("=", "+", "-", "@")) or value.startswith(("\t", "\r", "\n")):
        return "'" + value
    return value


def save_csv(path, events):
    with open(path, "w", encoding="utf-8-sig", newline="") as output:
        writer = csv.writer(output, delimiter=";")
        writer.writerow(["Время", "Событие", "Код", "Источник", "Номер записи", "Подробности"])
        for event in events:
            writer.writerow([
                event.time.isoformat(), event.kind, event.event_id,
                spreadsheet_text(event.provider), event.record_id, spreadsheet_text(event.details),
            ])


class BootLogApp:
    def __init__(self, root):
        self.root = root
        self.events = []
        self.days = tk.StringVar(value="30")
        self.status = tk.StringVar()
        root.title("Журнал запусков ПК")
        root.geometry("950x620")
        root.minsize(700, 440)

        body = ttk.Frame(root, padding=16)
        body.pack(fill="both", expand=True)
        toolbar = ttk.Frame(body)
        toolbar.pack(fill="x", pady=(0, 12))
        ttk.Label(toolbar, text="Последние дни").pack(side="left")
        self.period = ttk.Combobox(
            toolbar, values=("7", "30", "90", "365"), textvariable=self.days,
            state="readonly", width=6,
        )
        self.period.pack(side="left", padx=8)
        self.period.bind("<<ComboboxSelected>>", self.refresh)
        self.reload = ttk.Button(toolbar, text="Обновить", command=self.refresh)
        self.reload.pack(side="left")
        self.export = ttk.Button(toolbar, text="Сохранить CSV", command=self.export_csv)
        self.export.pack(side="right")

        table = ttk.Frame(body)
        table.pack(fill="both", expand=True)
        self.tree = ttk.Treeview(
            table, columns=("time", "kind", "code"), show="headings", selectmode="browse",
        )
        for column, label, width, stretch in [
            ("time", "Местное время", 200, False),
            ("kind", "Событие", 425, True),
            ("code", "Код", 75, False),
        ]:
            self.tree.heading(column, text=label)
            self.tree.column(column, width=width, stretch=stretch)
        scrollbar = ttk.Scrollbar(table, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        scrollbar.pack(side="right", fill="y")
        self.tree.pack(side="left", fill="both", expand=True)
        self.tree.bind("<<TreeviewSelect>>", self.show_details)

        ttk.Label(body, text="Подробности события").pack(anchor="w", pady=(12, 4))
        details_frame = ttk.Frame(body)
        details_frame.pack(fill="x")
        self.details = tk.Text(details_frame, height=8, wrap="word", state="disabled")
        details_scroll = ttk.Scrollbar(details_frame, orient="vertical", command=self.details.yview)
        self.details.configure(yscrollcommand=details_scroll.set)
        details_scroll.pack(side="right", fill="y")
        self.details.pack(side="left", fill="x", expand=True)
        ttk.Label(body, textvariable=self.status).pack(anchor="w", pady=(8, 0))
        self.refresh()

    def refresh(self, _event=None):
        days = int(self.days.get())
        self.period.configure(state="disabled")
        self.reload.state(["disabled"])
        self.export.state(["disabled"])
        self.status.set("Чтение системного журнала Windows…")
        result = Queue()

        def load():
            try:
                result.put(read_events(days))
            except Exception as error:
                result.put(error)

        threading.Thread(target=load, daemon=True).start()
        self.root.after(50, self.finish_refresh, result)

    def finish_refresh(self, result):
        try:
            items = result.get_nowait()
        except Empty:
            self.root.after(50, self.finish_refresh, result)
            return
        self.period.configure(state="readonly")
        self.reload.state(["!disabled"])
        self.tree.delete(*self.tree.get_children())
        self.events = []
        self.show_details()
        if isinstance(items, Exception):
            self.status.set("Не удалось прочитать системный журнал.")
            messagebox.showerror("Ошибка чтения", str(items), parent=self.root)
            return
        self.events = items
        for index, event in enumerate(items):
            self.tree.insert("", "end", iid=str(index), values=(
                event.time.strftime(DISPLAY_FORMAT), event.kind, event.event_id,
            ))
        self.status.set(f"Найдено событий: {len(items)}" if items else "За выбранный период событий нет.")
        if items:
            self.export.state(["!disabled"])
            self.tree.selection_set("0")
            self.show_details()

    def show_details(self, _event=None):
        selected = self.tree.selection()
        self.details.configure(state="normal")
        self.details.delete("1.0", "end")
        if selected:
            event = self.events[int(selected[0])]
            self.details.insert("1.0", f"{event.provider}  •  Запись № {event.record_id}\n\n{event.details}")
        self.details.configure(state="disabled")

    def export_csv(self):
        path = filedialog.asksaveasfilename(
            parent=self.root, defaultextension=".csv", initialfile="boot-log.csv",
            filetypes=[("CSV", "*.csv")],
        )
        if path:
            try:
                save_csv(path, self.events)
            except OSError as error:
                messagebox.showerror("Ошибка сохранения", str(error), parent=self.root)
            else:
                self.status.set(f"В CSV сохранено событий: {len(self.events)}")


if __name__ == "__main__":
    if os.name != "nt":
        raise SystemExit("Приложение читает системный журнал Windows. Запустите его на Windows.")
    window = tk.Tk()
    BootLogApp(window)
    window.mainloop()

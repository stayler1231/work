// Boot Log launches the embedded Windows Forms interface.
package main

import (
	_ "embed"
	"encoding/base64"
	"encoding/binary"
	"os"
	"os/exec"
	"path/filepath"
	"syscall"
	"unicode/utf16"
	"unsafe"
)

//go:embed boot-log.ps1
var interfaceScript string

//go:embed capture.ps1
var captureScript string

func main() {
	script := interfaceScript
	if len(os.Args) == 2 && os.Args[1] == "--capture-at-sign-in" {
		script = captureScript
	}
	words := utf16.Encode([]rune(script))
	data := make([]byte, 2*len(words))
	for i, word := range words {
		binary.LittleEndian.PutUint16(data[i*2:], word)
	}
	encoded := base64.StdEncoding.EncodeToString(data)
	powerShell := filepath.Join(os.Getenv("SystemRoot"), "System32", "WindowsPowerShell", "v1.0", "powershell.exe")
	command := exec.Command(powerShell, "-NoLogo", "-NoProfile", "-STA", "-EncodedCommand", encoded)
	if executable, err := os.Executable(); err == nil {
		command.Env = append(os.Environ(), "BOOTLOG_EXECUTABLE="+executable)
	}
	command.SysProcAttr = &syscall.SysProcAttr{CreationFlags: 0x08000000} // CREATE_NO_WINDOW
	if err := command.Run(); err != nil {
		title, _ := syscall.UTF16PtrFromString("Журнал запусков ПК")
		message, _ := syscall.UTF16PtrFromString("Не удалось запустить интерфейс через Windows PowerShell.\n" + err.Error())
		syscall.NewLazyDLL("user32.dll").NewProc("MessageBoxW").Call(
			0, uintptr(unsafe.Pointer(message)), uintptr(unsafe.Pointer(title)), 0x10,
		)
	}
}

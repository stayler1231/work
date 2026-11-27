$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[Windows.Forms.Application]::EnableVisualStyles()

$eventTypes = [ordered]@{
    'Microsoft-Windows-Kernel-General/12' = 'Запуск Windows'
    'Microsoft-Windows-Kernel-General/13' = 'Начало выключения Windows'
    'Microsoft-Windows-Kernel-Power/41' = 'Запуск после некорректного выключения'
    'USER32/1074' = 'Запрос на выключение или перезагрузку'
    'EventLog/6008' = 'Обнаружено неожиданное выключение'
    'Microsoft-Windows-WER-SystemErrorReporting/1001' = 'Перезагрузка после системного сбоя'
}

function Read-BootEvents([int]$days) {
    $selectors = foreach ($key in $eventTypes.Keys) {
        $provider, $id = $key -split '/'
        "(Provider[@Name='$provider'] and EventID=$id)"
    }
    $milliseconds = [long]$days * 86400000
    $query = "*[System[($($selectors -join ' or ')) and TimeCreated[timediff(@SystemTime) <= $milliseconds]]]"
    try {
        Get-WinEvent -LogName System -FilterXPath $query -ErrorAction Stop
    } catch {
        if ($_.FullyQualifiedErrorId -notlike 'NoMatchingEventsFound,*') { throw }
    }
}

function Protect-CsvText([string]$value) {
    if ($value -match '^\s*[-+=@]|^[\t\r\n]') { return "'" + $value }
    return $value
}

$form = New-Object Windows.Forms.Form
$form.Text = 'Журнал запусков ПК'
$form.ClientSize = New-Object Drawing.Size(950, 620)
$form.MinimumSize = New-Object Drawing.Size(830, 440)
$form.StartPosition = 'CenterScreen'
$form.AutoScaleMode = 'Dpi'

$toolbar = New-Object Windows.Forms.FlowLayoutPanel
$toolbar.Dock = 'Top'
$toolbar.Height = 43
$toolbar.Padding = New-Object Windows.Forms.Padding(8, 6, 8, 0)
$periodLabel = New-Object Windows.Forms.Label
$periodLabel.Text = 'Последние дни'
$periodLabel.AutoSize = $true
$periodLabel.Margin = New-Object Windows.Forms.Padding(2, 7, 6, 0)
$period = New-Object Windows.Forms.ComboBox
$period.DropDownStyle = 'DropDownList'
$period.Width = 60
$period.Items.AddRange([object[]]@('7', '30', '90', '365'))
$period.SelectedIndex = 1
$refresh = New-Object Windows.Forms.Button
$refresh.Text = 'Обновить'
$refresh.AutoSize = $true
$export = New-Object Windows.Forms.Button
$export.Text = 'Сохранить CSV'
$export.AutoSize = $true
$export.Enabled = $false
$startupFolder = [Environment]::GetFolderPath([Environment+SpecialFolder]::Startup)
$startupLink = Join-Path $startupFolder 'BootLog Camera.lnk'
$photoFolder = Join-Path $env:LOCALAPPDATA 'BootLog\Photos'

$camera = New-Object Windows.Forms.Button
$camera.AutoSize = $true
function Update-CameraButton {
    $camera.Text = if (Test-Path -LiteralPath $startupLink) {
        'Выключить съёмку при входе'
    } else { 'Включить съёмку при входе' }
}
Update-CameraButton
$camera.Add_Click({
    try {
        if (Test-Path -LiteralPath $startupLink) {
            Remove-Item -LiteralPath $startupLink
        } else {
            $answer = [Windows.Forms.MessageBox]::Show(
                $form,
                'При входе в эту учётную запись BootLog покажет предупреждение и через 5 секунд сделает один снимок. Снимок можно отменить. Фотографии хранятся на этом ПК. Включить?',
                'Съёмка при входе', 'YesNo', 'Question'
            )
            if ($answer -ne [Windows.Forms.DialogResult]::Yes) { return }
            if (-not [IO.File]::Exists($env:BOOTLOG_EXECUTABLE)) {
                throw 'Запустите настройки из BootLog.exe.'
            }
            $shell = New-Object -ComObject WScript.Shell
            $link = $shell.CreateShortcut($startupLink)
            $link.TargetPath = $env:BOOTLOG_EXECUTABLE
            $link.Arguments = '--capture-at-sign-in'
            $link.WorkingDirectory = [IO.Path]::GetDirectoryName($env:BOOTLOG_EXECUTABLE)
            $link.Save()
        }
        Update-CameraButton
    } catch {
        [void][Windows.Forms.MessageBox]::Show($form, $_.Exception.Message, 'Ошибка настройки съёмки')
    }
})

$photos = New-Object Windows.Forms.Button
$photos.Text = 'Открыть снимки'
$photos.AutoSize = $true
$photos.Add_Click({
    try {
        [void][IO.Directory]::CreateDirectory($photoFolder)
        Invoke-Item -LiteralPath $photoFolder
    } catch {
        [void][Windows.Forms.MessageBox]::Show($form, $_.Exception.Message, 'Ошибка открытия папки')
    }
})
$toolbar.Controls.AddRange(@($periodLabel, $period, $refresh, $export, $camera, $photos))

$grid = New-Object Windows.Forms.DataGridView
$grid.Dock = 'Fill'
$grid.ReadOnly = $true
$grid.AllowUserToAddRows = $false
$grid.AllowUserToDeleteRows = $false
$grid.RowHeadersVisible = $false
$grid.MultiSelect = $false
$grid.SelectionMode = 'FullRowSelect'
[void]$grid.Columns.Add('time', 'Местное время')
[void]$grid.Columns.Add('kind', 'Событие')
[void]$grid.Columns.Add('code', 'Код')
$grid.Columns[0].Width = 195
$grid.Columns[1].AutoSizeMode = 'Fill'
$grid.Columns[2].Width = 68

$details = New-Object Windows.Forms.TextBox
$details.Dock = 'Bottom'
$details.Height = 145
$details.Multiline = $true
$details.ReadOnly = $true
$details.ScrollBars = 'Vertical'
$details.AccessibleName = 'Подробности события'

$status = New-Object Windows.Forms.StatusStrip
$statusLabel = New-Object Windows.Forms.ToolStripStatusLabel
[void]$status.Items.Add($statusLabel)
$form.Controls.AddRange(@($grid, $details, $status, $toolbar))

$grid.Add_SelectionChanged({
    $record = if ($grid.CurrentRow) { $grid.CurrentRow.Tag }
    $details.Text = if ($record) {
        "$($record.Source)  |  Запись № $($record.RecordId)`r`n`r`n$($record.Details)"
    } else { '' }
})

function Refresh-Journal {
    $form.UseWaitCursor = $true
    $export.Enabled = $false
    $statusLabel.Text = 'Чтение системного журнала Windows…'
    $status.Refresh()
    try {
        $grid.Rows.Clear()
        foreach ($event in (Read-BootEvents ([int]$period.SelectedItem))) {
            try {
                $message = try { $event.FormatDescription() } catch { '' }
                $fields = foreach ($field in $event.Properties) {
                    if ($null -ne $field.Value) { [string]$field.Value }
                }
                $record = [pscustomobject]@{
                    Time = $event.TimeCreated
                    Kind = $eventTypes["$($event.ProviderName)/$($event.Id)"]
                    Code = $event.Id
                    Source = $event.ProviderName
                    RecordId = $event.RecordId
                    Details = (@($message) + @($fields) | Where-Object { $_ }) -join "`r`n"
                }
                $row = $grid.Rows[$grid.Rows.Add(
                    $record.Time.ToString('dd.MM.yyyy HH:mm:ss zzz'), $record.Kind, $record.Code
                )]
                $row.Tag = $record
            } finally {
                $event.Dispose()
            }
        }
        $statusLabel.Text = if ($grid.Rows.Count) {
            "Найдено событий: $($grid.Rows.Count)"
        } else { 'За выбранный период событий нет.' }
        $export.Enabled = $grid.Rows.Count -gt 0
        if ($grid.Rows.Count) {
            $grid.ClearSelection()
            $grid.CurrentCell = $grid.Rows[0].Cells[0]
            $grid.Rows[0].Selected = $true
            $first = $grid.Rows[0].Tag
            $details.Text = "$($first.Source)  |  Запись № $($first.RecordId)`r`n`r`n$($first.Details)"
        }
    } catch {
        $statusLabel.Text = 'Не удалось прочитать системный журнал.'
        [void][Windows.Forms.MessageBox]::Show($form, $_.Exception.Message, 'Ошибка чтения')
    } finally {
        $form.UseWaitCursor = $false
    }
}

$refresh.Add_Click({ Refresh-Journal })
$period.Add_SelectedIndexChanged({ Refresh-Journal })
$form.Add_Shown({ Refresh-Journal })
$export.Add_Click({
    $dialog = New-Object Windows.Forms.SaveFileDialog
    try {
        $dialog.Filter = 'CSV (*.csv)|*.csv'
        $dialog.FileName = 'boot-log.csv'
        if ($dialog.ShowDialog($form) -ne [Windows.Forms.DialogResult]::OK) { return }
        $grid.Rows | ForEach-Object {
            $record = $_.Tag
            [pscustomobject][ordered]@{
                Время = $record.Time.ToString('o')
                Событие = $record.Kind
                Код = $record.Code
                Источник = Protect-CsvText $record.Source
                'Номер записи' = $record.RecordId
                Подробности = Protect-CsvText $record.Details
            }
        } | Export-Csv -LiteralPath $dialog.FileName -Encoding UTF8 -Delimiter ';' -NoTypeInformation
        $statusLabel.Text = "В CSV сохранено событий: $($grid.Rows.Count)"
    } catch {
        [void][Windows.Forms.MessageBox]::Show($form, $_.Exception.Message, 'Ошибка сохранения')
    } finally {
        $dialog.Dispose()
    }
})
[void]$form.ShowDialog()
$form.Dispose()

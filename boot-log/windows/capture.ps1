$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[Windows.Forms.Application]::EnableVisualStyles()

function Wait-WinRtOperation($operation, [type]$resultType) {
    if ($null -eq $resultType) {
        $task = $script:asTaskAction.Invoke($null, @($operation))
    } else {
        $method = $script:asTaskOperation.MakeGenericMethod(@($resultType))
        $task = $method.Invoke($null, @($operation))
    }
    if (-not $task.Wait(15000)) {
        $operation.Cancel()
        throw 'Камера или хранилище не ответили вовремя.'
    }
    $task.GetAwaiter().GetResult()
}

function Save-SignInPhoto {
    Add-Type -AssemblyName System.Runtime.WindowsRuntime
    $methods = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
        $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1
    }
    $script:asTaskAction = $methods | Where-Object {
        $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction'
    }
    $script:asTaskOperation = $methods | Where-Object {
        $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
    }
    $captureType = [Windows.Media.Capture.MediaCapture, Windows.Media.Capture, ContentType=WindowsRuntime]
    $settingsType = [Windows.Media.Capture.MediaCaptureInitializationSettings, Windows.Media.Capture, ContentType=WindowsRuntime]
    $folderType = [Windows.Storage.StorageFolder, Windows.Storage, ContentType=WindowsRuntime]
    $fileType = [Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime]
    $imageType = [Windows.Media.MediaProperties.ImageEncodingProperties, Windows.Media.MediaProperties, ContentType=WindowsRuntime]
    $path = Join-Path $env:LOCALAPPDATA 'BootLog\Photos'
    [void][IO.Directory]::CreateDirectory($path)
    $capture = [Activator]::CreateInstance($captureType)
    $pending = $null
    try {
        $settings = [Activator]::CreateInstance($settingsType)
        $settings.StreamingCaptureMode = 'Video'
        Wait-WinRtOperation ($capture.InitializeAsync($settings))
        $folder = Wait-WinRtOperation ($folderType::GetFolderFromPathAsync($path)) $folderType
        $name = '{0:yyyy-MM-dd_HH-mm-ss-fff}_{1}.jpg' -f (Get-Date), $PID
        $file = Wait-WinRtOperation ($folder.CreateFileAsync($name)) $fileType
        $pending = Join-Path $path $file.Name
        Wait-WinRtOperation ($capture.CapturePhotoToStorageFileAsync($imageType::CreateJpeg(), $file))
        $pending = $null
    } finally {
        $capture.Dispose()
        if ($pending) { Remove-Item -LiteralPath $pending -ErrorAction SilentlyContinue }
    }
}

$form = New-Object Windows.Forms.Form
$form.Text = 'BootLog — снимок при входе'
$form.ClientSize = New-Object Drawing.Size(300, 60)
$form.StartPosition = 'CenterScreen'
$form.FormBorderStyle = 'FixedDialog'
$form.MaximizeBox = $false
$label = New-Object Windows.Forms.Label
$label.Dock = 'Fill'
$label.TextAlign = 'MiddleCenter'
$label.Text = 'Съёмка с веб-камеры…'
$form.Controls.Add($label)
$form.Add_Shown({
    $form.Refresh()
    try {
        Save-SignInPhoto
    } catch {
        [void][Windows.Forms.MessageBox]::Show(
            $form, $_.Exception.GetBaseException().Message, 'BootLog — снимок не сохранён'
        )
    } finally {
        $form.Close()
    }
})
try {
    [void]$form.ShowDialog()
} finally {
    $form.Dispose()
}

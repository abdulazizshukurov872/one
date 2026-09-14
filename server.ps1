# SmartKutubxona - Windows o'rnatilgan PowerShell HTTP Serveri
# Bu server ishlashi uchun Python yoki Node.js umuman kerak emas!
# Windows 10/11 dagi barcha kompyuterlarda standart ishlaydi.

$port = 5500
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "===================================================" -ForegroundColor Cyan
    Write-Host "  SmartKutubxona Serveri Muvaffaqiyatli Ishga Tushdi!" -ForegroundColor Green
    Write-Host "  Manzil: http://localhost:$port/" -ForegroundColor Yellow
    Write-Host "  (Python yoki boshqa dastur o'rnatish shart emas)" -ForegroundColor Gray
    Write-Host "===================================================" -ForegroundColor Cyan
    
    Start-Process "http://localhost:$port/"

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($localPath)) { 
            $localPath = "index.html" 
        }

        $fullPath = Join-Path $PSScriptRoot $localPath

        if (Test-Path $fullPath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $mime = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                default { "application/octet-stream" }
            }
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $err = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $localPath")
            $response.OutputStream.Write($err, 0, $err.Length)
        }
        $response.OutputStream.Close()
    }
} catch {
    Write-Host "Server xatosi: $_" -ForegroundColor Red
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
}


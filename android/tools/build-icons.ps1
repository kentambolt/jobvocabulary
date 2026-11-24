# Render the existing JobVocabulary vector mark, not a replacement brand.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
function Write-BrandIcon([int]$Size, [string]$RelativePath) {
    $destination = Join-Path $projectRoot $RelativePath
    [IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($destination)) | Out-Null
    $bitmap = [Drawing.Bitmap]::new($Size, $Size)
    $graphics = [Drawing.Graphics]::FromImage($bitmap)
    try {
        $graphics.Clear([Drawing.ColorTranslator]::FromHtml('#153f2e'))
        $graphics.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $graphics.ScaleTransform($Size / 64.0, $Size / 64.0)
        # Keep the mark inset when the icon is cropped to a circle.
        $graphics.TranslateTransform(32,32)
        $graphics.ScaleTransform(0.9,0.9)
        $graphics.TranslateTransform(-32,-32)
        $pen = [Drawing.Pen]::new([Drawing.Color]::White, 5)
        $pen.StartCap = [Drawing.Drawing2D.LineCap]::Round
        $pen.EndCap = [Drawing.Drawing2D.LineCap]::Round
        $pen.LineJoin = [Drawing.Drawing2D.LineJoin]::Round
        $j = [Drawing.Drawing2D.GraphicsPath]::new()
        $j.AddLine(14,18,28,18)
        $j.AddLine(28,18,28,38)
        $j.AddBezier(28,38,28,44,24,47,19,47)
        $j.AddLine(19,47,15,47)
        $v = [Drawing.Drawing2D.GraphicsPath]::new()
        $v.AddLine(36,18,45,46)
        $v.AddLine(45,46,54,18)
        $graphics.DrawPath($pen,$j)
        $graphics.DrawPath($pen,$v)
        $bitmap.Save($destination,[Drawing.Imaging.ImageFormat]::Png)
        $j.Dispose(); $v.Dispose(); $pen.Dispose()
    } finally { $graphics.Dispose(); $bitmap.Dispose() }
}
Write-BrandIcon 192 'images/app/icon-192.png'
Write-BrandIcon 512 'images/app/icon-512.png'
Write-BrandIcon 512 'android/play/icon-512.png'
Write-Host 'Rendered project icons from the existing JV vector mark.'

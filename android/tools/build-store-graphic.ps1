# Store graphic derived from the existing wordmark and colours.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$bitmap = [Drawing.Bitmap]::new(1024,500)
$graphics = [Drawing.Graphics]::FromImage($bitmap)
$brand = [Drawing.SolidBrush]::new([Drawing.ColorTranslator]::FromHtml('#153f2e'))
$cream = [Drawing.SolidBrush]::new([Drawing.ColorTranslator]::FromHtml('#f7f4ee'))
$titleFont = [Drawing.Font]::new('Georgia',55,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel)
$bodyFont = [Drawing.Font]::new('Segoe UI',29,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel)
$icon = [Drawing.Image]::FromFile((Join-Path $root 'android/play/icon-512.png'))
try {
 $graphics.Clear($cream.Color)
 $graphics.TextRenderingHint = [Drawing.Text.TextRenderingHint]::AntiAliasGridFit
 $graphics.DrawImage($icon,68,166,160,160)
 $graphics.DrawString('JobVocabulary',$titleFont,$brand,270,163)
 $graphics.DrawString("Language for work`nand everyday life",$bodyFont,$brand,274,243)
 $bitmap.Save((Join-Path $root 'android/play/feature-graphic-en.png'),[Drawing.Imaging.ImageFormat]::Png)
} finally {
 $icon.Dispose(); $titleFont.Dispose(); $bodyFont.Dispose(); $brand.Dispose(); $cream.Dispose(); $graphics.Dispose(); $bitmap.Dispose()
}

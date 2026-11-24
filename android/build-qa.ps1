param(
    [Parameter(Mandatory)][string]$SdkPath,
    [Parameter(Mandatory)][string]$GradlePath,
    [switch]$Offline,
    [int]$VersionCode = 1,
    [string]$VersionName = '1.0.0'
)
$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    $env:ANDROID_HOME = (Resolve-Path -LiteralPath $SdkPath).Path
    $env:GRADLE_USER_HOME = Join-Path $PSScriptRoot '.gradle-cache'
    $env:ANDROID_USER_HOME = Join-Path $PSScriptRoot '.tools/user-home'
    New-Item -ItemType Directory -Force -Path '.keys', $env:ANDROID_USER_HOME | Out-Null
    if (!(Test-Path -LiteralPath '.keys/test.keystore')) {
        & keytool -genkeypair -keystore '.keys/test.keystore' -alias androiddebugkey -storepass android -keypass android -keyalg RSA -keysize 3072 -validity 3650 -dname 'CN=JobVocabulary QA, O=JobVocabulary, C=DK'
        if ($LASTEXITCODE -ne 0) { throw 'QA key generation failed.' }
    }
    $gradleArgs = @('--no-daemon', '--console=plain', "-PjvVersionCode=$VersionCode", "-PjvVersionName=$VersionName", 'assembleDebug', 'lintDebug', 'bundleRelease')
    if ($Offline) { $gradleArgs += '--offline' }
    & $GradlePath @gradleArgs
    if ($LASTEXITCODE -ne 0) { throw 'Android build or lint failed.' }
    Write-Host 'QA APK: app/build/outputs/apk/debug/app-debug.apk'
    Write-Host 'Release bundle is unsigned unless the separate JV_ANDROID signing environment is provided.'
} finally { Pop-Location }

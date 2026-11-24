param(
 [Parameter(Mandatory)][string]$SdkPath,
 [Parameter(Mandatory)][string]$GradlePath,
 [switch]$InitializeUploadKey,
 [switch]$Offline,
 [int]$VersionCode = 2,
 [string]$VersionName = '1.0.1'
)
$ErrorActionPreference = 'Stop'
$keyDir = Join-Path $PSScriptRoot '.keys'
$keyPath = Join-Path $keyDir 'upload.keystore'
$secretPath = Join-Path $keyDir 'upload-password.dpapi'
New-Item -ItemType Directory -Force -Path $keyDir | Out-Null
if ($InitializeUploadKey) {
 if ((Test-Path -LiteralPath $keyPath) -or (Test-Path -LiteralPath $secretPath)) { throw 'Upload key material already exists. Never replace it automatically.' }
 $randomBytes = New-Object byte[] 48
 $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
 try { $rng.GetBytes($randomBytes) } finally { $rng.Dispose() }
 $env:JV_ANDROID_STORE_PASSWORD = [Convert]::ToBase64String($randomBytes)
 $secret = ConvertTo-SecureString $env:JV_ANDROID_STORE_PASSWORD -AsPlainText -Force
 ConvertFrom-SecureString $secret | Set-Content -LiteralPath $secretPath -Encoding ASCII
 try {
  & keytool -genkeypair -keystore $keyPath -alias upload -storepass:env JV_ANDROID_STORE_PASSWORD -keypass:env JV_ANDROID_STORE_PASSWORD -keyalg RSA -keysize 3072 -validity 10000 -dname 'CN=JobVocabulary Upload, O=Munthe Systems, C=DK'
  if ($LASTEXITCODE -ne 0) { throw 'Upload key generation failed. Preserve the partial key files for inspection.' }
 } finally { Remove-Item Env:JV_ANDROID_STORE_PASSWORD -ErrorAction SilentlyContinue }
}
if (!(Test-Path -LiteralPath $keyPath) -or !(Test-Path -LiteralPath $secretPath)) { throw 'Initialize a separate upload key first, or supply a reviewed external signing workflow.' }
$secret = (Get-Content -LiteralPath $secretPath -Raw).Trim() | ConvertTo-SecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
try {
 $env:JV_ANDROID_STORE_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
 $env:JV_ANDROID_KEY_PASSWORD = $env:JV_ANDROID_STORE_PASSWORD
 $env:JV_ANDROID_KEYSTORE = $keyPath
 $env:JV_ANDROID_KEY_ALIAS = 'upload'
 $env:ANDROID_HOME = (Resolve-Path -LiteralPath $SdkPath).Path
 $env:GRADLE_USER_HOME = Join-Path $PSScriptRoot '.gradle-cache'
 $env:ANDROID_USER_HOME = Join-Path $PSScriptRoot '.tools/user-home'
 Push-Location $PSScriptRoot
 try {
  $arguments = @('--no-daemon','--console=plain',"-PjvVersionCode=$VersionCode","-PjvVersionName=$VersionName",'lintRelease','bundleRelease')
  if ($Offline) { $arguments += '--offline' }
  & $GradlePath @arguments
  if ($LASTEXITCODE -ne 0) { throw 'Signed release build failed.' }
  & jarsigner -verify app/build/outputs/bundle/release/app-release.aab
  if ($LASTEXITCODE -ne 0) { throw 'Release bundle signature verification failed.' }
  Write-Host 'Upload-signed bundle prepared. This is not yet the Google-signed installable app.'
 } finally { Pop-Location }
} finally {
 [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
 foreach ($name in @('JV_ANDROID_STORE_PASSWORD','JV_ANDROID_KEY_PASSWORD','JV_ANDROID_KEYSTORE','JV_ANDROID_KEY_ALIAS')) { Remove-Item -LiteralPath ('Env:'+$name) -ErrorAction SilentlyContinue }
}

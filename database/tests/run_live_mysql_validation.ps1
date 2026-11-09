# CodeArena — Live MySQL Integration & Integrity PowerShell Runner
# Prompts securely for MySQL password or uses $env:MYSQL_PWD
# Runs the complete automated test against a disposable database.

param(
    [string]$User = "root",
    [string]$HostName = "127.0.0.1",
    [int]$Port = 3306
)

$ErrorActionPreference = "Stop"

# Force UTF-8 encoding across PowerShell console, pipeline, and Python environment
$env:PYTHONUTF8 = "1"
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "  CODEARENA LIVE MYSQL INTEGRATION & VALIDATION RUNNER (POWERSHELL)" -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan

$MySqlBin = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if (-not (Test-Path $MySqlBin)) {
    $MySqlBin = "mysql.exe"
}

$Password = $env:MYSQL_PWD
if (-not $Password) {
    $SecurePass = Read-Host "Enter MySQL Password for '$User'" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePass)
    $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

$env:MYSQL_PWD = $Password
$env:MYSQL_USER = $User
$env:MYSQL_HOST = $HostName
$env:MYSQL_PORT = $Port

# Function to compute normalized SHA-256 checksum in PowerShell
function Get-MigrationChecksum([string]$FilePath) {
    $content = Get-Content -Path $FilePath -Raw -Encoding UTF8
    $normalized = $content -replace "\r\n", "`n"
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($normalized)
    $hasher = [System.Security.Cryptography.SHA256]::Create()
    $hashBytes = $hasher.ComputeHash($bytes)
    return [BitConverter]::ToString($hashBytes).Replace("-", "").ToLower()
}

# Run the python runner
python (Join-Path $PSScriptRoot "run_live_mysql_validation.py")


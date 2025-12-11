# Stop all Node processes
Write-Host "Stopping all Node processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq 'node'} | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait a moment
Start-Sleep -Seconds 2

# Remove .next lock
Write-Host "Cleaning .next directory..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
}

# Start dev server
Write-Host "Starting dev server..." -ForegroundColor Green
npm run dev


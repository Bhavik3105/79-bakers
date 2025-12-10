# Generate Secure JWT Secret

# For Windows PowerShell:
$guid1 = [guid]::NewGuid().ToString()
$guid2 = [guid]::NewGuid().ToString()
$combined = $guid1 + $guid2
$bytes = [System.Text.Encoding]::UTF8.GetBytes($combined)
$secret = [Convert]::ToBase64String($bytes)

Write-Host "Your secure JWT_SECRET:" -ForegroundColor Green
Write-Host $secret -ForegroundColor Yellow
Write-Host "`nCopy this and update your .env.local file:" -ForegroundColor Cyan
Write-Host "JWT_SECRET=$secret" -ForegroundColor White

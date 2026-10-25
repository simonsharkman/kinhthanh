param(
    [Parameter(Mandatory=$false)]
    [string]$RepoUrl
)

Set-Location "E:\kinhthanh"

if (-not $RepoUrl) {
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  DAY TRANG WEB KINH THANH LEN GITHUB PAGES" -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Cyan
    $RepoUrl = Read-Host "Dan link GitHub Repository cua ban vao day (vi du: https://github.com/ten-ban/kinhthanh.git)"
}

if (-not $RepoUrl) {
    Write-Host "Ban chua nhap URL GitHub Repository!" -ForegroundColor Red
    exit 1
}

git branch -M main
$existing = git remote
if ($existing -contains "origin") {
    git remote set-url origin $RepoUrl
} else {
    git remote add origin $RepoUrl
}

Write-Host "Dang day toan bo ma nguon va du lieu Kinh Thanh len GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "HOAN TAT! Hay vao Settings -> Pages tren GitHub va chon Source: GitHub Actions (hoac Deploy from a branch -> main)" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green

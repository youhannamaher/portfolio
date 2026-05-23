# Portfolio Image Renaming & Metadata Optimization Script
# Run from y:\Portfolio directory

$ErrorActionPreference = "Continue"

function Rename-GalleryImages {
    param($folder, $renames)
    # renames = array of [oldName, newName] pairs in desired display order
    $imagesDir = "projects\$folder\images"
    
    # Step 1: Rename all to temp names first to avoid collisions
    $tempMap = @{}
    $i = 0
    foreach ($pair in $renames) {
        $old = $pair[0]; $new = $pair[1]
        $oldPath = "$imagesDir\$old"
        if (Test-Path $oldPath) {
            $tempName = "temp_$i" + [System.IO.Path]::GetExtension($old)
            Rename-Item -Path $oldPath -NewName $tempName -Force
            $tempMap["temp_$i" + [System.IO.Path]::GetExtension($old)] = $new
            $i++
        } else {
            Write-Host "  [SKIP] Not found: $old"
        }
    }
    # Step 2: Rename temps to finals
    foreach ($tempName in $tempMap.Keys) {
        $tempPath = "$imagesDir\$tempName"
        $finalName = $tempMap[$tempName]
        if (Test-Path $tempPath) {
            Rename-Item -Path $tempPath -NewName $finalName -Force
            Write-Host "  [OK] $tempName -> $finalName"
        }
    }
}

function Set-Thumbnail {
    param($folder, $sourceFile, $thumbExt)
    # Remove old root images (except metadata.json)
    $rootDir = "projects\$folder"
    Get-ChildItem -Path $rootDir -File | Where-Object { $_.Extension -match "\.(png|jpg|jpeg|webp|gif)$" } | Remove-Item -Force
    # Copy first gallery image as thumbnail
    $src = "$rootDir\images\$sourceFile"
    $dst = "$rootDir\thumbnail$thumbExt"
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dst -Force
        Write-Host "  [THUMB] Set thumbnail: $sourceFile -> thumbnail$thumbExt"
        return "thumbnail$thumbExt"
    } else {
        Write-Host "  [WARN] Thumbnail source not found: $src"
        return $null
    }
}

Write-Host "`n=== PROJECT IMAGE REORGANIZATION ===" -ForegroundColor Cyan

# ============================================================
# 1. MStack360 CRM - Order: Client Mgmt, Projects, Finance, Invoicing, Email
# ============================================================
Write-Host "`n[1] MStack360 CRM" -ForegroundColor Yellow
Rename-GalleryImages "1- CRM - Mstack360" @(
    @("Client Management page.jpeg", "1.jpeg"),
    @("Projects.jpeg", "2.jpeg"),
    @("Finance.jpeg", "3.jpeg"),
    @("Invoice Creation.jpeg", "4.jpeg"),
    @("Invoice PDF.jpeg", "5.jpeg"),
    @("Invoice PDF and Email.jpeg", "6.jpeg"),
    @("Invoice Email.jpeg", "7.jpeg"),
    @("Follow Up HTML Email .jpeg", "8.jpeg"),
    @("Employee Management Page.jpeg", "9.jpeg")
)
Set-Thumbnail "1- CRM - Mstack360" "1.jpeg" ".jpeg"

# ============================================================
# 2. Federon CMS - Order: Home, All Contracts, Specific Contract, Kanban, Line Items, Gantt, Flows, BI
# ============================================================
Write-Host "`n[2] Federon CMS" -ForegroundColor Yellow
Rename-GalleryImages "2- CMS - Federon" @(
    @("Home Page.png", "1.png"),
    @("All Contracts Tabular.png", "2.png"),
    @("Specific Contract Page.png", "3.png"),
    @("Kanban View.png", "4.png"),
    @("Creating Line Items.png", "5.png"),
    @("Contract Line Items and Gant Chart.png", "6.png"),
    @("One of the Many Flows.png", "7.png"),
    @("Powerbi Dashboard.png", "8.png")
)
Set-Thumbnail "2- CMS - Federon" "1.png" ".png"

# ============================================================
# 3. ASU Registration - Order: Main page first, then numbered
# ============================================================
Write-Host "`n[3] ASU Registration" -ForegroundColor Yellow
Rename-GalleryImages "3- ASU Caree Center" @(
    @("MainPage.png", "1.png"),
    @("WhatsApp Image 2025-02-28 at 02.05.25_119dc703.jpg", "2.jpg"),
    @("Screenshot 2025-02-19 003104.png", "3.png"),
    @("Screenshot 2025-01-23 150346.png", "4.png"),
    @("3.png", "5.png"),
    @("4.png", "6.png"),
    @("5.png", "7.png"),
    @("6.png", "8.png"),
    @("7.png", "9.png"),
    @("8.png", "10.png")
)
Set-Thumbnail "3- ASU Caree Center" "2.jpg" ".jpg"

# ============================================================
# 4. HR ATS - already numbered 1-7
# ============================================================
Write-Host "`n[4] HR ATS (already numbered)" -ForegroundColor Yellow
Set-Thumbnail "4 - HR Demo System" "1.png" ".png"

# ============================================================
# 5. Nestle Nominations - Rename descriptive names to numbers
# ============================================================
Write-Host "`n[5] Nestle Nominations" -ForegroundColor Yellow
Rename-GalleryImages "5 - Nestle Nominations" @(
    @("Nominee Opening Page - Deep Linking.png", "1.png"),
    @("Nomination Details.png", "2.png"),
    @("Nominator Details.png", "3.png"),
    @("Nominee Details.png", "4.png"),
    @("Nominee - Modern People Picker.png", "5.png"),
    @("All New Nomination - HR View.png", "6.png"),
    @("Mancom View After Video Upload.png", "7.png"),
    @("Attachments.png", "8.png"),
    @("Email to Nominee.png", "9.png")
)
Set-Thumbnail "5 - Nestle Nominations" "1.png" ".png"

# ============================================================
# 6. Nestle Quality Tracking - Rename screenshots to numbers
# ============================================================
Write-Host "`n[6] Nestle Quality Tracking" -ForegroundColor Yellow
Rename-GalleryImages "6- Nestle Quality Tracking" @(
    @("Screenshot 2026-03-17 145306.png", "1.png"),
    @("Screenshot 2026-03-17 145503.png", "2.png"),
    @("Screenshot 2026-03-17 145536.png", "3.png"),
    @("Screenshot 2026-03-17 145601.png", "4.png"),
    @("Screenshot 2026-03-17 145621.png", "5.png"),
    @("Screenshot 2026-03-17 145655.png", "6.png")
)
Set-Thumbnail "6- Nestle Quality Tracking" "1.png" ".png"

# ============================================================
# 7. Orange Business Apps - Rename screenshot to number
# ============================================================
Write-Host "`n[7] Orange Business Apps" -ForegroundColor Yellow
Rename-GalleryImages "7- Orange Business Apps" @(
    @("Screenshot 2024-12-27 133129.png", "4.png")
)
Set-Thumbnail "7- Orange Business Apps" "1.png" ".png"

# ============================================================
# 8. Bondy Inventory - already numbered
# ============================================================
Write-Host "`n[8] Bondy Inventory (already numbered)" -ForegroundColor Yellow
Set-Thumbnail "8- Bondy Inventory System" "1.png" ".png"

# ============================================================
# 9. YM Store - Rename screenshots to continue numbering
# ============================================================
Write-Host "`n[9] YM Store" -ForegroundColor Yellow
Rename-GalleryImages "9- YM Store" @(
    @("Screenshot 2026-03-14 231743.png", "5.png"),
    @("Screenshot 2026-03-14 231816.png", "6.png"),
    @("Screenshot 2026-03-14 232102.png", "7.png")
)
Set-Thumbnail "9- YM Store" "1.png" ".png"

# ============================================================
# 10. RATP Dev - root file is 1.png, check images dir
# ============================================================
Write-Host "`n[10] RATP Dev" -ForegroundColor Yellow
$ratpImagesDir = "projects\10 - RATP Dev\images"
if (-not (Test-Path $ratpImagesDir)) {
    New-Item -ItemType Directory -Path $ratpImagesDir -Force | Out-Null
    Copy-Item "projects\10 - RATP Dev\1.png" "$ratpImagesDir\1.png" -Force
    Write-Host "  [OK] Moved 1.png to images/"
}
Set-Thumbnail "10 - RATP Dev" "1.png" ".png"

# ============================================================
# 11. Interview Scheduling - move screenshot to images
# ============================================================
Write-Host "`n[11] Interview Scheduling" -ForegroundColor Yellow
$intDir = "projects\11 - Interviews Scheduling\images"
if (-not (Test-Path $intDir)) {
    New-Item -ItemType Directory -Path $intDir -Force | Out-Null
}
$intSrc = "projects\11 - Interviews Scheduling\Scheduling The Interview Through PowerApp.png"
if (Test-Path $intSrc) {
    Copy-Item $intSrc "$intDir\1.png" -Force
    Write-Host "  [OK] Copied scheduling image to images/1.png"
}
Set-Thumbnail "11 - Interviews Scheduling" "1.png" ".png"

# ============================================================
# 12. Certificate Generation - move screenshot to images
# ============================================================
Write-Host "`n[12] Certificate Generation" -ForegroundColor Yellow
$certDir = "projects\12- Certificate Generatiom\images"
if (-not (Test-Path $certDir)) {
    New-Item -ItemType Directory -Path $certDir -Force | Out-Null
}
$certSrc = "projects\12- Certificate Generatiom\Screenshot 2026-03-17 022803.png"
if (Test-Path $certSrc) {
    Copy-Item $certSrc "$certDir\1.png" -Force
    Write-Host "  [OK] Copied cert image to images/1.png"
}
Set-Thumbnail "12- Certificate Generatiom" "1.png" ".png"

# ============================================================
# 13. Excel Dashboard - move Slide1.PNG to images
# ============================================================
Write-Host "`n[13] Excel Dashboard" -ForegroundColor Yellow
$xlDir = "projects\13- Excel Dashboard\images"
if (-not (Test-Path $xlDir)) {
    New-Item -ItemType Directory -Path $xlDir -Force | Out-Null
}
$xlSrc = "projects\13- Excel Dashboard\Slide1.PNG"
if (Test-Path $xlSrc) {
    Copy-Item $xlSrc "$xlDir\1.png" -Force
    Write-Host "  [OK] Copied Excel dashboard image to images/1.png"
}
Set-Thumbnail "13- Excel Dashboard" "1.png" ".png"

# ============================================================
# 14. Federon Dashboard - move screenshot to images
# ============================================================
Write-Host "`n[14] Federon Dashboard" -ForegroundColor Yellow
$fedDir = "projects\14 - Federon Dashboard\images"
if (-not (Test-Path $fedDir)) {
    New-Item -ItemType Directory -Path $fedDir -Force | Out-Null
}
$fedSrc = "projects\14 - Federon Dashboard\Screenshot 2026-04-03 161214.png"
if (Test-Path $fedSrc) {
    Copy-Item $fedSrc "$fedDir\1.png" -Force
    Write-Host "  [OK] Copied dashboard image to images/1.png"
}
Set-Thumbnail "14 - Federon Dashboard" "1.png" ".png"

# ============================================================
# 15. Finance Pro - move screenshot to images
# ============================================================
Write-Host "`n[15] Finance Pro" -ForegroundColor Yellow
$fpDir = "projects\15 - Finance Tracker\images"
if (-not (Test-Path $fpDir)) {
    New-Item -ItemType Directory -Path $fpDir -Force | Out-Null
}
$fpSrc = "projects\15 - Finance Tracker\Screenshot 2026-04-23 002512.png"
if (Test-Path $fpSrc) {
    Copy-Item $fpSrc "$fpDir\1.png" -Force
    Write-Host "  [OK] Copied Finance Pro image to images/1.png"
}
Set-Thumbnail "15 - Finance Tracker" "1.png" ".png"

# ============================================================
# 16. PathWise - move screenshot to images
# ============================================================
Write-Host "`n[16] PathWise" -ForegroundColor Yellow
$pwDir = "projects\16 - PathWise\images"
if (-not (Test-Path $pwDir)) {
    New-Item -ItemType Directory -Path $pwDir -Force | Out-Null
}
$pwSrc = "projects\16 - PathWise\Screenshot 2026-05-11 220430.png"
if (Test-Path $pwSrc) {
    Copy-Item $pwSrc "$pwDir\1.png" -Force
    Write-Host "  [OK] Copied PathWise image to images/1.png"
}
Set-Thumbnail "16 - PathWise" "1.png" ".png"

# ============================================================
# 17. Fabula - move screenshot to images
# ============================================================
Write-Host "`n[17] Fabula Portfolio" -ForegroundColor Yellow
$fabDir = "projects\17 - Fabula Portfolio\images"
if (-not (Test-Path $fabDir)) {
    New-Item -ItemType Directory -Path $fabDir -Force | Out-Null
}
$fabSrc = "projects\17 - Fabula Portfolio\Screenshot 2026-05-10 232113.png"
if (Test-Path $fabSrc) {
    Copy-Item $fabSrc "$fabDir\1.png" -Force
    Write-Host "  [OK] Copied Fabula image to images/1.png"
}
Set-Thumbnail "17 - Fabula Portfolio" "1.png" ".png"

# ============================================================
# 18. Bondy Platform - move screenshot to images
# ============================================================
Write-Host "`n[18] Bondy Platform" -ForegroundColor Yellow
$bondyDir = "projects\18 - Bondy\images"
if (-not (Test-Path $bondyDir)) {
    New-Item -ItemType Directory -Path $bondyDir -Force | Out-Null
}
$bondySrc = "projects\18 - Bondy\Screenshot 2026-05-10 232737.png"
if (Test-Path $bondySrc) {
    Copy-Item $bondySrc "$bondyDir\1.png" -Force
    Write-Host "  [OK] Copied Bondy image to images/1.png"
}
Set-Thumbnail "18 - Bondy" "1.png" ".png"

# ============================================================
# 19. Nestle Absenteeism - keep good images (1-11 range), remove blurred/huge ones
# ============================================================
Write-Host "`n[19] Nestle Absenteeism" -ForegroundColor Yellow
$absDir = "projects\19 - Nestle - Abs & Ovr\images"
# Remove bad files (blurred, old, huge AI-generated)
@("3.blur.png", "6. blur.png", "ai_3.png", "ai_6.png", "11111.png", "old 1.png", "old 2.png") | ForEach-Object {
    $f = "$absDir\$_"
    if (Test-Path $f) { Remove-Item $f -Force; Write-Host "  [DEL] $_" }
}
# Rename remaining: 1->1, 2->2, 4->3, 5->4, 9->5, 10->6, 11->7, Screenshot->8
Rename-GalleryImages "19 - Nestle - Abs & Ovr" @(
    @("4.png", "3.png"),
    @("5.png", "4.png"),
    @("9.png", "5.png"),
    @("10.png", "6.png"),
    @("11.png", "7.png"),
    @("Screenshot 2026-05-23 025407.png", "8.png")
)
Set-Thumbnail "19 - Nestle - Abs & Ovr" "1.png" ".png"

# ============================================================
# 20. Financial Habits Dashboard - already numbered 1-5
# ============================================================
Write-Host "`n[20] Financial Habits (already numbered)" -ForegroundColor Yellow
Set-Thumbnail "20 - Miryam - Financial Habits Analysis" "1.png" ".png"

# ============================================================
# 21. Turnover Analysis - already numbered 1-2
# ============================================================
Write-Host "`n[21] Turnover Analysis (already numbered)" -ForegroundColor Yellow
Set-Thumbnail "21 - Nadine - Analysis" "1.png" ".png"

Write-Host "`n=== ALL DONE ===" -ForegroundColor Green

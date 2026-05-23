# ============================================================
# SAFE IMAGE RENAMING SCRIPT - NO DELETIONS, RENAME ONLY
# Renames all images in each project's images/ folder to 1, 2, 3...
# Uses temp names to avoid collisions. Extension preserved per file.
# ============================================================

$ErrorActionPreference = "Stop"

function Rename-ToSequence {
    param(
        [string]$imagesDir,
        [string[]]$orderedNames  # desired display order
    )
    
    if (-not (Test-Path $imagesDir)) {
        Write-Host "  [SKIP] No images folder: $imagesDir"
        return
    }

    # Step 1: Rename all to temp_ prefixed names to avoid any collision
    $tempMap = [ordered]@{}  # tempName -> finalName
    $i = 0
    foreach ($name in $orderedNames) {
        $srcPath = Join-Path $imagesDir $name
        if (-not (Test-Path $srcPath)) {
            Write-Host "  [MISS] $name"
            continue
        }
        $ext = [System.IO.Path]::GetExtension($name)
        $tempName = "zztemp_$i$ext"
        $finalName = "$($i + 1)$ext"
        Rename-Item -Path $srcPath -NewName $tempName -Force
        $tempMap[$tempName] = $finalName
        $i++
    }

    # Step 2: Rename temps to final sequential names
    foreach ($tempName in $tempMap.Keys) {
        $tempPath = Join-Path $imagesDir $tempName
        $finalName = $tempMap[$tempName]
        if (Test-Path $tempPath) {
            Rename-Item -Path $tempPath -NewName $finalName -Force
            Write-Host "  [OK] $($tempName -replace 'zztemp_\d+','*') -> $finalName"
        }
    }
}

Write-Host "`n=== RENAMING IMAGES TO SEQUENTIAL NUMBERS ===" -ForegroundColor Cyan

# ============================================================
# 1. MStack360 CRM
# Order: Overview (Client Mgmt) -> Projects -> Finance -> 
#        Invoice Creation -> Invoice PDF -> Invoice PDF+Email -> Invoice Email -> Follow Up Email -> Employee Mgmt
# ============================================================
Write-Host "`n[1] MStack360 CRM" -ForegroundColor Yellow
Rename-ToSequence "projects\1- CRM - Mstack360\images" @(
    "Client Management page.jpeg",
    "Projects.jpeg",
    "Finance.jpeg",
    "Invoice Creation.jpeg",
    "Invoice PDF.jpeg",
    "Invoice PDF and Email.jpeg",
    "Invoice Email.jpeg",
    "Follow Up HTML Email .jpeg",
    "Employee Management Page.jpeg"
)

# ============================================================
# 2. Federon CMS
# Order: Home -> All Contracts -> Specific Contract -> Kanban -> Creating Line Items -> Gantt Chart -> Flows -> Power BI
# ============================================================
Write-Host "`n[2] Federon CMS" -ForegroundColor Yellow
Rename-ToSequence "projects\2- CMS - Federon\images" @(
    "Home Page.png",
    "All Contracts Tabular.png",
    "Specific Contract Page.png",
    "Kanban View.png",
    "Creating Line Items.png",
    "Contract Line Items and Gant Chart.png",
    "One of the Many Flows.png",
    "Powerbi Dashboard.png"
)

# ============================================================
# 3. ASU Registration
# Order: Main page first, then event shot, then analytics screenshots, then numbered (3-8)
# ============================================================
Write-Host "`n[3] ASU Registration" -ForegroundColor Yellow
Rename-ToSequence "projects\3- ASU Caree Center\images" @(
    "MainPage.png",
    "WhatsApp Image 2025-02-28 at 02.05.25_119dc703.jpg",
    "Screenshot 2025-02-19 003104.png",
    "Screenshot 2025-01-23 150346.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
    "8.png"
)

# ============================================================
# 4. HR ATS - already 1-7, perfect order, nothing to do
# ============================================================
Write-Host "`n[4] HR ATS - already sequential, skipping" -ForegroundColor Gray

# ============================================================
# 5. Nestle Nominations
# Order: Opening/Landing -> Nomination Details -> Nominator Details -> Nominee Details ->
#        People Picker -> HR View -> Mancom View -> Attachments -> Email
# ============================================================
Write-Host "`n[5] Nestle Nominations" -ForegroundColor Yellow
Rename-ToSequence "projects\5 - Nestle Nominations\images" @(
    "Nominee Opening Page - Deep Linking.png",
    "Nomination Details.png",
    "Nominator Details.png",
    "Nominee Details.png",
    "Nominee - Modern People Picker.png",
    "All New Nomination - HR View.png",
    "Mancom View After Video Upload.png",
    "Attachments.png",
    "Email to Nominee.png"
)

# ============================================================
# 6. Nestle Quality Tracking
# Order: chronological screenshot order (timestamp order)
# ============================================================
Write-Host "`n[6] Nestle Quality Tracking" -ForegroundColor Yellow
Rename-ToSequence "projects\6- Nestle Quality Tracking\images" @(
    "Screenshot 2026-03-17 145306.png",
    "Screenshot 2026-03-17 145503.png",
    "Screenshot 2026-03-17 145536.png",
    "Screenshot 2026-03-17 145601.png",
    "Screenshot 2026-03-17 145621.png",
    "Screenshot 2026-03-17 145655.png"
)

# ============================================================
# 7. Orange Business Apps
# Order: 1, 2, 3 already good, rename screenshot to 4
# ============================================================
Write-Host "`n[7] Orange Business Apps" -ForegroundColor Yellow
Rename-ToSequence "projects\7- Orange Business Apps\images" @(
    "1.png",
    "2.png",
    "3.png",
    "Screenshot 2024-12-27 133129.png"
)

# ============================================================
# 8. Bondy Inventory - already 1-5.png + 6.jpg, sequential, skip
# ============================================================
Write-Host "`n[8] Bondy Inventory - already sequential, skipping" -ForegroundColor Gray

# ============================================================
# 9. YM Store - 1-4 good, screenshots need to continue as 5, 6, 7
# ============================================================
Write-Host "`n[9] YM Store" -ForegroundColor Yellow
Rename-ToSequence "projects\9- YM Store\images" @(
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "Screenshot 2026-03-14 231743.png",
    "Screenshot 2026-03-14 231816.png",
    "Screenshot 2026-03-14 232102.png"
)

# ============================================================
# 10. RATP Dev - 1, 2 good, Flow.jpeg needs to be 3
# ============================================================
Write-Host "`n[10] RATP Dev" -ForegroundColor Yellow
Rename-ToSequence "projects\10 - RATP Dev\images" @(
    "1.png",
    "2.png",
    "Flow.jpeg"
)

# ============================================================
# 11. Interview Scheduling
# Order: Scheduling app (the main screen) -> Interview Scheduled -> Getting Email -> 1.png (duplicate of scheduling)
# NOTE: 1.png is a copy of Scheduling screen created earlier - keep it at end
# ============================================================
Write-Host "`n[11] Interview Scheduling" -ForegroundColor Yellow
Rename-ToSequence "projects\11 - Interviews Scheduling\images" @(
    "Scheduling The Interview Through PowerApp.png",
    "Interview Scheduled.png",
    "Getting the Interview Email.png",
    "1.png"
)

# ============================================================
# 12. Certificate Generation
# NOTE: This folder mistakenly has interview images - rename in current order, user can sort later
# ============================================================
Write-Host "`n[12] Certificate Generation" -ForegroundColor Yellow
Rename-ToSequence "projects\12- Certificate Generatiom\images" @(
    "1.png",
    "Scheduling The Interview Through PowerApp.png",
    "Interview Scheduled.png",
    "Getting the Interview Email.png"
)

# ============================================================
# 13. Excel Dashboard - 1.png good, Slide1-4.PNG continue as 2-5
# ============================================================
Write-Host "`n[13] Excel Dashboard" -ForegroundColor Yellow
Rename-ToSequence "projects\13- Excel Dashboard\images" @(
    "1.png",
    "Slide1.PNG",
    "Slide2.PNG",
    "Slide3.PNG",
    "Slide4.PNG"
)

# ============================================================
# 14. Federon Dashboard - 1.png good, Screenshots continue 2-8 (chronological)
# ============================================================
Write-Host "`n[14] Federon Dashboard" -ForegroundColor Yellow
Rename-ToSequence "projects\14 - Federon Dashboard\images" @(
    "1.png",
    "Screenshot 2026-04-03 161129.png",
    "Screenshot 2026-04-03 161200.png",
    "Screenshot 2026-04-03 161214.png",
    "Screenshot 2026-04-03 161227.png",
    "Screenshot 2026-04-03 161240.png",
    "Screenshot 2026-04-03 161252.png",
    "Screenshot 2026-04-03 161305.png"
)

# ============================================================
# 15. Finance Pro - 1.png good, Screenshots continue 2-9 (chronological)
# ============================================================
Write-Host "`n[15] Finance Pro" -ForegroundColor Yellow
Rename-ToSequence "projects\15 - Finance Tracker\images" @(
    "1.png",
    "Screenshot 2026-04-22 232016.png",
    "Screenshot 2026-04-22 232033.png",
    "Screenshot 2026-04-22 232056.png",
    "Screenshot 2026-04-22 232103.png",
    "Screenshot 2026-04-22 232140.png",
    "Screenshot 2026-04-22 232200.png",
    "Screenshot 2026-04-23 002512.png",
    "Screenshot 2026-04-23 002621.png"
)

# ============================================================
# 16. PathWise - 1.png good, then jpg, then Screenshots chronological
# ============================================================
Write-Host "`n[16] PathWise" -ForegroundColor Yellow
Rename-ToSequence "projects\16 - PathWise\images" @(
    "1.png",
    "1778527722854.jpg",
    "Screenshot 2026-05-10 231520.png",
    "Screenshot 2026-05-10 231535.png",
    "Screenshot 2026-05-10 231609.png",
    "Screenshot 2026-05-10 231623.png",
    "Screenshot 2026-05-10 231641.png",
    "Screenshot 2026-05-11 220430.png",
    "Screenshot 2026-05-11 220534.png"
)

# ============================================================
# 17. Fabula Portfolio - 1.png good, then Screenshots chronological
# ============================================================
Write-Host "`n[17] Fabula Portfolio" -ForegroundColor Yellow
Rename-ToSequence "projects\17 - Fabula Portfolio\images" @(
    "1.png",
    "Screenshot 2026-05-10 232102.png",
    "Screenshot 2026-05-10 232113.png",
    "Screenshot 2026-05-10 232129.png",
    "Screenshot 2026-05-10 232141.png",
    "Screenshot 2026-05-10 232151.png",
    "Screenshot 2026-05-10 232200.png",
    "Screenshot 2026-05-10 232209.png"
)

# ============================================================
# 18. Bondy Platform - clean up 8.1, 12.1, 12.2, 15 etc. into pure sequence
# Order: 1, 2, 3, 4, 5, 6, 7, 8.1, 9, 10, 11, 12.1, 12.2, 13, 15
# ============================================================
Write-Host "`n[18] Bondy Platform" -ForegroundColor Yellow
Rename-ToSequence "projects\18 - Bondy\images" @(
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
    "8.1.png",
    "9.png",
    "10.jpeg",
    "11.jpeg",
    "12.1.png",
    "12.2.png",
    "13.png",
    "15.png"
)

# ============================================================
# 19. Nestle Absenteeism
# Order: 1, 2 (clean named) -> 4, 5, 9, 10, 11 (numbered data) -> Screenshot (latest) 
#        -> old 1, old 2 (at end) -> 3.blur, 6.blur, ai_3, ai_6, 11111 (at very end)
# ============================================================
Write-Host "`n[19] Nestle Absenteeism" -ForegroundColor Yellow
Rename-ToSequence "projects\19 - Nestle - Abs & Ovr\images" @(
    "1.png",
    "2.png",
    "4.png",
    "5.png",
    "9.png",
    "10.png",
    "11.png",
    "Screenshot 2026-05-23 025407.png",
    "old 1.png",
    "old 2.png",
    "3.blur.png",
    "6. blur.png",
    "ai_3.png",
    "ai_6.png",
    "11111.png"
)

# ============================================================
# 20. Financial Habits - already 1-5, skip
# ============================================================
Write-Host "`n[20] Financial Habits - already sequential, skipping" -ForegroundColor Gray

# ============================================================
# 21. Turnover Analysis - already 1-2, skip
# ============================================================
Write-Host "`n[21] Turnover Analysis - already sequential, skipping" -ForegroundColor Gray

Write-Host "`n=== ALL RENAMES COMPLETE - NO FILES DELETED ===" -ForegroundColor Green
Write-Host "Run: node tools/generate-content.js" -ForegroundColor Cyan

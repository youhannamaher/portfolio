# Power Platform Developer Portfolio - Admin Guide

Welcome to the documentation for your premium portfolio! 


Check this Out! 
https://youhannamaher.github.io/portfolio/





As requested, this system uses a **Folder-Driven Automation approach (Option A)**. This means you will **NEVER** edit any HTML, CSS, or JSON array files directly to add a project.

Instead, you just drop a folder into the `portfolio/` directory, click the updater script, and the website magically updates itself!

---

## 🛑 REQUIRED PRE-REQUISITE (DO THIS ONCE)

Before the magic `update-portfolio.cmd` system works, **you must install Node.js.** 

1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download and install the **"LTS" (Long Term Support)** version for Windows.
3. Keep clicking **Next** through the entire installer (default options are perfect).
4. **Restart your computer** (or restart VS Code) so your computer recognizes the new command.

If you skip this step, clicking `update-portfolio.cmd` will give you a black screen error saying *"node is not recognized"*.

---

## ⚡ Quick Start: How to Update Your Portfolio

1. Add your project or certificate into a new folder inside `portfolio/projects` or `portfolio/certificates`.
2. Double-click the **`update-portfolio.cmd`** file located in your main project folder.
3. Refresh your Live Server browser tab. 
*That's it! The system handles everything else.*

---

## 1. How to Add a Project (Step-by-Step)

To make things extremely easy, I have created a `!_project-template` folder for you inside `portfolio/projects/`. You'll also see a `0-demo-case-study` folder which is a fully working demo with local images and an embedded video.

### Step 1: Create the Folder
1. Go to `portfolio/projects/` and copy the `!_project-template` folder.
2. Rename the pasted folder to your project's short name (e.g., `hr-desktop-app`).

### Step 2: Edit the Text Details
1. Open the `metadata.json` file inside your new folder.
2. Fill out the details. You can leave `"videoEmbed": ""` empty if you don't have a video.

### Step 3: Add Your Local Images (100% Auto-Detected)
You **never** need to manually type the names of your images into your `metadata.json`. The generator script is extremely smart and auto-detects them exactly as instructed below:

- **Supported File Types:** `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`
- **Do Local Images Work Locally?:** YES! As long as you are using your VS Code "Live Server" extension, all local images placed in these folders will load flawlessly in your browser (just like the `0-demo-case-study`).

**1. The Thumbnail (Preview Photo)**
- Where to place: Drop a single image directly into your project's main folder (e.g., inside `hr-desktop-app/`).
- Naming rule: The script will look for `thumbnail.png` first. If it doesn't find it, **it will automatically grab the first image it finds in that folder** and make it the thumbnail. 

**2. The Modal Gallery (Multiple Photos)**
- Where to place: Create an `images/` folder inside your project folder (e.g., `hr-desktop-app/images/`).
- How to sort them: The generator script guarantees **Strict Alphabetical File-Name Ordering**. If you drop 3 images into the `images/` folder, name them `1_login.png`, `2_dashboard.png`, `3_reports.png`. The script will output them to your portfolio gallery in that exact 1, 2, 3 sequence.
- **✨ Fullscreen Lightbox Viewer:** Any images you place here will automatically become interactive! When a visitor clicks a gallery image inside the project window, it will launch a cinematic, full-screen lightbox viewer. They can navigate through the full-resolution screenshots using on-screen arrows or their keyboard (Left/Right/ESC).

### Step 4: Add an Embedded Video (Optional)
If you have a YouTube video demonstrating the app:
1. Copy the embed URL from YouTube (e.g., `https://www.youtube.com/embed/dQw4w9WgXcQ`).
2. Paste it directly into the `"videoEmbed"` field in your `metadata.json`.
3. The system will natively generate a perfectly responsive 16:9 cinematic video player right inside your gallery.

### Step 5: Run the Updater
Double-click `update-portfolio.cmd`. Done! Refresh your Live Server browser and your images/content will be there.

---

## 2. How to Add a Certificate

Adding a certificate works just like adding a project! The system now supports single images, multi-image Lightbox galleries (like front & back), and full `.pdf` documents.

1. Copy the `!_certificate-template` folder inside `portfolio/certificates/` and rename it (e.g., `pl-900`).
2. Add your certificate file inside the folder:
   - **For a Single Image:** Just drop your `.jpg` or `.png` into the folder.
   - **For Multiple Images (Front & Back):** Drop all `.png` / `.jpg` images directly into the folder and name them alphabetically (e.g., `1_front.jpg`, `2_back.jpg`). When clicked, it will turn into a full-screen Lightbox viewer!
   - **For a PDF Document:** Drop any `.pdf` file into the folder. The system will auto-detect it and replace the image viewer with a sleek `Access PDF Document` button that opens the raw PDF in your browser securely!
3. Update the `metadata.json` with the title and your Credly Validate link.
4. Double-click `update-portfolio.cmd`.

---

## 3. How to Edit Profile, Experience & Education

Because these are static details about your career that rarely change (unlike adding new portfolio case studies), you edit these specific files manually:

- **`data/profile.json`**: This controls your Hero name, your title, your "About Me" paragraphs, your statistics (e.g., 15k+ Users), your technical expertise tools, and your contact info (Email, Phone, Upwork, LinkedIn).
- **`data/experience.json`**: This manages your Professional Timeline. It is an array of jobs. Just copy one block and edit the `"company"`, `"role"`, `"period"`, and `"achievements"` array.
- **`data/education.json`**: Manages the education cards.

### ⚠️ Golden Rule of JSON
When working inside `.json` files, always ensure that lines end with a comma `,` EXCEPT for the very last item in an array or object. 

---

## 4. Common Errors & Fixes

**Issue:** I double-clicked the updater but the site is broken / blank!
**Fix:** You most likely made a syntax error in your `metadata.json` file (forgot a comma, or left a trailing comma). Open the `metadata.json` file in VS Code and look for red squiggly lines.

**Issue:** The project isn't showing up in the exact order I want.
**Fix:** Open `metadata.json` and change the `"order": 1` number. The system automatically sorts projects from lowest to highest. Use `1` for the most important, `99` for the least important.

**Issue:** An image isn't showing up.
**Fix:** Ensure the image is actually a valid photo file (`.png`, `.jpg`, `.webp`) and that you didn't accidentally include typos in the folder name. Run `update-portfolio.cmd` again after fixing the name.

---

## Why this Architecture? (Content-First)

This architecture prevents you from ever breaking the HTML or CSS layouts when you just want to add a simple case study. By generating cleanly formatted JSON files through the `.cmd` script, your portfolio remains totally responsive and completely scalable whether you have 3 projects or 300 projects!

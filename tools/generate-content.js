const fs = require('fs');
const path = require('path');

// Configuration Paths
const SRC_DIR = path.join(__dirname, '../portfolio');
const PROJECTS_DIR = path.join(SRC_DIR, 'projects');
const CERTS_DIR = path.join(SRC_DIR, 'certificates');
const EDU_DIR = path.join(SRC_DIR, 'education');
const DATA_DIR = path.join(__dirname, '../data');

// Utility to ensure directory exists
function ensureDirExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Generate an ID/slug from a string
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function scanProjects() {
    setupSamplesIfNeeded();
    
    if (!fs.existsSync(PROJECTS_DIR)) return [];

    const projectFolders = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const projects = [];

    projectFolders.forEach(folder => {
        // Skip template or hidden folders
        if (folder.startsWith('_') || folder.startsWith('.')) return;

        const folderPath = path.join(PROJECTS_DIR, folder);
        const metadataPath = path.join(folderPath, 'metadata.json');
        const descPath = path.join(folderPath, 'description.txt');
        const imagesPath = path.join(folderPath, 'images');
        
        // Skip if no metadata.json
        if (!fs.existsSync(metadataPath)) {
            console.warn(`[WARN] Skipping folder "${folder}": Missing metadata.json`);
            return;
        }

        try {
            // Read metadata
            const metadataContent = fs.readFileSync(metadataPath, 'utf8');
            const projectData = JSON.parse(metadataContent);

            // Inherit physical folder details
            projectData.folder = folder;
            projectData.id = projectData.slug || slugify(projectData.title || folder);

            // Read long description optionally
            if (fs.existsSync(descPath)) {
                projectData.longDescription = fs.readFileSync(descPath, 'utf8');
            }

            // Auto-detect gallery images
            projectData.images = [];
            if (fs.existsSync(imagesPath)) {
                const imageFiles = fs.readdirSync(imagesPath)
                    .filter(file => /\.(png|jpe?g|gif|webp)$/i.test(file))
                    .sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'})); // Sort alphabetically and numerically
                projectData.images = imageFiles;
            }

            // Auto-detect thumbnail if not explicitly set
            if (!projectData.thumbnail) {
                const rootFiles = fs.readdirSync(folderPath);
                
                // First try to find a file named 'thumbnail'
                let thumbFile = rootFiles.find(f => /^thumbnail\.(png|jpe?g|gif|webp)$/i.test(f));
                
                // If not found, just grab the first image file available in the root folder
                if (!thumbFile) {
                    thumbFile = rootFiles.find(f => /(?<!metadata.json)$/i.test(f) && /\.(png|jpe?g|gif|webp)$/i.test(f));
                }

                if (thumbFile) {
                    projectData.thumbnail = thumbFile;
                } else {
                    console.warn(`[WARN] Project "${folder}" is missing a thumbnail image in its root folder.`);
                }
            }

            projects.push(projectData);
            console.log(`[SUCCESS] Processed Project: ${projectData.title || folder}`);

        } catch (error) {
            console.error(`[ERROR] processing project folder "${folder}":`, error.message);
        }
    });

    // Ensure projects are sorted by order if available
    projects.sort((a, b) => (a.order || 99) - (b.order || 99));

    return projects;
}

function scanCertificates() {
    if (!fs.existsSync(CERTS_DIR)) return [];

    const certFolders = fs.readdirSync(CERTS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const certificates = [];

    certFolders.forEach(folder => {
        // Skip template or hidden folders
        if (folder.startsWith('_') || folder.startsWith('.')) return;

        const folderPath = path.join(CERTS_DIR, folder);
        const metadataPath = path.join(folderPath, 'metadata.json');

        if (!fs.existsSync(metadataPath)) {
            console.warn(`[WARN] Skipping cert folder "${folder}": Missing metadata.json`);
            return;
        }

        try {
            const metadataContent = fs.readFileSync(metadataPath, 'utf8');
            const certData = JSON.parse(metadataContent);
            
            certData.folder = folder;
            certData.id = slugify(certData.title || folder);

            // 1. Auto-detect valid PDF
            const files = fs.readdirSync(folderPath);
            const pdfFile = files.find(file => /\.pdf$/i.test(file));
            if (pdfFile) {
                certData.pdf = pdfFile;
            }

            // 2. Auto-detect Multiple Images and sort them alphabetically
            const imageFiles = files
                .filter(file => /\.(png|jpe?g|gif|webp)$/i.test(file) && file !== 'metadata.json')
                .sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}));
                
            if (imageFiles.length > 0) {
                // Ensure there is a primary image (usually the first alphabetically)
                certData.image = certData.image || imageFiles[0];
                // Keep the full array for the Lightbox gallery
                certData.images = imageFiles;
            }

            certificates.push(certData);
            console.log(`[SUCCESS] Processed Certificate: ${certData.title || folder}`);

        } catch (error) {
            console.error(`[ERROR] processing cert folder "${folder}":`, error.message);
        }
    });

    // Sort by order if available (matching project behavior)
    certificates.sort((a, b) => (a.order || 99) - (b.order || 99));

    return certificates;
}

function scanEducation() {
    if (!fs.existsSync(EDU_DIR)) return [];

    const folders = fs.readdirSync(EDU_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const education = [];

    folders.forEach(folder => {
        if (folder.startsWith('_') || folder.startsWith('.')) return;

        const folderPath = path.join(EDU_DIR, folder);
        const metadataPath = path.join(folderPath, 'metadata.json');

        if (!fs.existsSync(metadataPath)) {
            console.warn(`[WARN] Skipping edu folder "${folder}": Missing metadata.json`);
            return;
        }

        try {
            const metadataContent = fs.readFileSync(metadataPath, 'utf8');
            const eduData = JSON.parse(metadataContent);
            
            eduData.folder = folder;
            eduData.id = slugify(eduData.school || folder);

            const files = fs.readdirSync(folderPath);
            const pdfFile = files.find(file => /\.pdf$/i.test(file));
            if (pdfFile) eduData.pdf = pdfFile;

            const imageFiles = files
                .filter(file => /\.(png|jpe?g|gif|webp)$/i.test(file) && file !== 'metadata.json')
                .sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}));
                
            if (imageFiles.length > 0) {
                eduData.image = eduData.image || imageFiles[0];
                eduData.images = imageFiles;
            }

            education.push(eduData);
            console.log(`[SUCCESS] Processed Education: ${eduData.school || folder}`);

        } catch (error) {
            console.error(`[ERROR] processing edu folder "${folder}":`, error.message);
        }
    });

    education.sort((a, b) => (a.order || 99) - (b.order || 99));
    return education;
}

// Ensure the portfolio content directories exist (for first run out of the box)
function setupSamplesIfNeeded() {
    ensureDirExists(PROJECTS_DIR);
    ensureDirExists(CERTS_DIR);
    ensureDirExists(EDU_DIR);
    ensureDirExists(DATA_DIR);
}

// Main execution
console.log('--- Portolio Content Generator ---');

const projectsData = scanProjects();
fs.writeFileSync(path.join(DATA_DIR, 'projects.json'), JSON.stringify(projectsData, null, 2), 'utf8');

const certsData = scanCertificates();
fs.writeFileSync(path.join(DATA_DIR, 'certificates.json'), JSON.stringify(certsData, null, 2), 'utf8');

const eduData = scanEducation();
fs.writeFileSync(path.join(DATA_DIR, 'education.json'), JSON.stringify(eduData, null, 2), 'utf8');

console.log('----------------------------------');
console.log('Generation completed successfully!');

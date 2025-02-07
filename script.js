let projectData = {}; // Store project data

// Fetch project data from JSON
fetch("projects.json")
  .then(response => response.json())
  .then(data => {
    projectData = data;
  })
  .catch(error => console.error("Error loading projects:", error));

function openGallery(category) {
  const modal = document.getElementById("categoryModal");
  const title = document.getElementById("categoryTitle");
  const projectsList = document.getElementById("projectsList");

  const { title: categoryTitle, projects } = projectData[category];

  title.textContent = categoryTitle;
  projectsList.innerHTML = projects
    .map(
      (project, index) => `
      <div class="project-item" onclick="openProject(${index}, '${category}')">
        <img src="${project.thumbnail}" alt="${project.name}">
        <p>${project.name}</p>
      </div>
    `
    )
    .join("");

  modal.style.display = "flex";
}

// Open Project Modal & Auto Load Images from Folder
let currentProject = null;
let currentImages = [];
let currentImageIndex = 0;

function openProject(index, category) {
  const project = projectData[category].projects[index];
  const folderPath = project.folder;

  fetchImagesFromFolder(folderPath).then(images => {
    currentProject = project;
    currentImages = images;
    currentImageIndex = 0;
    updateProjectImage();
    document.getElementById("projectModal").style.display = "flex";
  });
}

// Fetch All Images from Folder
function fetchImagesFromFolder(folderPath) {
  return fetch(folderPath)
    .then(response => response.json()) // This assumes you generate a list of files (see Note)
    .catch(error => console.error("Error fetching images:", error));
}

function updateProjectImage() {
  const imageElement = document.getElementById("projectImage");
  if (currentImages.length > 0) {
    imageElement.src = currentImages[currentImageIndex];
  }
}

function closeModal() {
  document.getElementById("categoryModal").style.display = "none";
}

function closeProjectModal() {
  document.getElementById("projectModal").style.display = "none";
  currentProject = null;
  currentImageIndex = 0;
}

// Image Navigation
function prevImage() {
  if (currentProject) {
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    updateProjectImage();
  }
}

function nextImage() {
  if (currentProject) {
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateProjectImage();
  }
}

// Keyboard Navigation
document.addEventListener("keydown", event => {
  if (document.getElementById("projectModal").style.display === "flex") {
    if (event.key === "ArrowLeft") prevImage();
    if (event.key === "ArrowRight") nextImage();
    if (event.key === "Escape") closeProjectModal();
  }
});

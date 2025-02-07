// Project Data with Thumbnails
const projectData = {
  automation: {
    title: "Business Applications & Automation",
    projects: [
      { name: "ASU Registration Application", thumbnail: "assets/images/experience/ASU_Career_Center_png", images: ["assets/images/experience/ASU_Career_Center_png", "assets/images/experience/Orange_png", "assets/images/experience/RATP_png"] },
      { name: "Change Request Management", thumbnail: "crm_thumbnail.jpg", images: ["crm1.jpg", "crm2.jpg"] },
      { name: "Global PO Tracker", thumbnail: "po_thumbnail.jpg", images: ["po1.jpg", "po2.jpg", "po3.jpg", "po4.jpg"] },
    ],
  },
  data: {
    title: "Data Management & Analysis",
    projects: [
      { name: "Data Visualization Dashboard", thumbnail: "data_thumbnail.jpg", images: ["data1.jpg", "data2.jpg"] },
      { name: "SQL Performance Analysis", thumbnail: "sql_thumbnail.jpg", images: ["sql1.jpg", "sql2.jpg", "sql3.jpg"] },
    ],
  },
  presentation: {
    title: "Presentation & Documentation",
    projects: [
      { name: "Corporate Pitch Deck", thumbnail: "pitch_thumbnail.jpg", images: ["pitch1.jpg", "pitch2.jpg"] },
    ],
  },
};

// To Open the Category Modal
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

// To Open the Project Image Modal
let currentProject = null;
let currentImageIndex = 0;

function openProject(index, category) {
  const modal = document.getElementById("projectModal");
  const imageElement = document.getElementById("projectImage");

  currentProject = projectData[category].projects[index];
  currentImageIndex = 0;

  imageElement.src = currentProject.images[currentImageIndex];
  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("categoryModal").style.display = "none";
}

function closeProjectModal() {
  document.getElementById("projectModal").style.display = "none";
  currentProject = null;
  currentImageIndex = 0;
}

// To Navigate Images
function prevImage() {
  if (currentProject) {
    currentImageIndex = (currentImageIndex - 1 + currentProject.images.length) % currentProject.images.length;
    document.getElementById("projectImage").src = currentProject.images[currentImageIndex];
  }
}

function nextImage() {
  if (currentProject) {
    currentImageIndex = (currentImageIndex + 1) % currentProject.images.length;
    document.getElementById("projectImage").src = currentProject.images[currentImageIndex];
  }
}

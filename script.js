// Project Data with Thumbnails
const projectData = {
  automation: {
    title: "Business Applications & Automation",
    projects: [
      {
        name: "ASU Registration Application",
        thumbnail: "assets/images/experience/ASU_Career_Center.png",
         description: "A web app for students to register easily at Ain Shams University.",
        images: [
          "assets/images/BusinessAppsAndAutomation/ASUApp/1.png",
          "assets/images/BusinessAppsAndAutomation/ASUApp/2.jpg",
          "assets/images/BusinessAppsAndAutomation/ASUApp/3.png",
          "assets/images/BusinessAppsAndAutomation/ASUApp/4.png",
          "assets/images/BusinessAppsAndAutomation/ASUApp/5.png",
          "assets/images/BusinessAppsAndAutomation/ASUApp/6.png",
          "assets/images/BusinessAppsAndAutomation/ASUApp/7.png",
          "assets/images/BusinessAppsAndAutomation/ASUApp/8.png"
        ]
      },
      {
        name: "Change Request Management",
        thumbnail: "crm_thumbnail.jpg",
         description: "A web app for students to register easily at Ain Shams University.",
        images: ["crm1.jpg", "crm2.jpg"]
      },
      {
        name: "Global PO Tracker",
        thumbnail: "po_thumbnail.jpg",
         description: "A web app for students to register easily at Ain Shams University.",
        images: ["po1.jpg", "po2.jpg", "po3.jpg", "po4.jpg"]
      }
    ]
  },
  data: {
    title: "Data Management & Analysis",
    projects: [
      {
        name: "Data Visualization Dashboard",
        thumbnail: "data_thumbnail.jpg",
         description: "A web app for students to register easily at Ain Shams University.",
        images: ["data1.jpg", "data2.jpg"]
      },
      {
        name: "SQL Performance Analysis",
        thumbnail: "sql_thumbnail.jpg",
         description: "A web app for students to register easily at Ain Shams University.",
        images: ["sql1.jpg", "sql2.jpg", "sql3.jpg"]
      }
    ]
  },
  presentation: {
    title: "Presentation & Documentation",
    projects: [
      {
        name: "Corporate Pitch Deck",
        thumbnail: "pitch_thumbnail.jpg",
         description: "A web app for students to register easily at Ain Shams University.",
        images: ["pitch1.jpg", "pitch2.jpg"]
      }
    ]
  }
};

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
        <h3>${project.name}</h3>
        <p>${project.description}</p> <!-- Add description here -->
      </div>
    `
    )
    .join("");

  modal.style.display = "flex";
}

// Open the Project Image Modal
let currentProject = null;
let currentImageIndex = 0;

function openProject(index, category) {
  const modal = document.getElementById("projectModal");
  const imageElement = document.getElementById("projectImage");

  currentProject = projectData[category].projects[index];
  currentImageIndex = 0;

  updateProjectImage();
  modal.style.display = "flex";
}

// Update Displayed Image
function updateProjectImage() {
  const imageElement = document.getElementById("projectImage");
  if (currentProject && currentProject.images.length > 0) {
    imageElement.src = currentProject.images[currentImageIndex];
    imageElement.style.objectFit = "contain"; // Prevents stretching
    imageElement.style.width = "100%";
    imageElement.style.maxHeight = "80vh"; // Keeps modal consistent
  }
}

// Close Modals
function closeModal() {
  document.getElementById("categoryModal").style.display = "none";
}

function closeProjectModal() {
  document.getElementById("projectModal").style.display = "none";
  currentProject = null;
  currentImageIndex = 0;
}

// Navigate Images
function prevImage() {
  if (currentProject) {
    currentImageIndex =
      (currentImageIndex - 1 + currentProject.images.length) %
      currentProject.images.length;
    updateProjectImage();
  }
}

function nextImage() {
  if (currentProject) {
    currentImageIndex =
      (currentImageIndex + 1) % currentProject.images.length;
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

// Close modal when clicking outside
window.onclick = function(event) {
  const projectModal = document.getElementById("projectModal");
  const categoryModal = document.getElementById("categoryModal");

  if (event.target === projectModal) {
    closeProjectModal();
  }
  if (event.target === categoryModal) {
    closeModal();
  }
};

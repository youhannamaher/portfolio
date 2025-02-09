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
        name: "Digital HR System Demo",
        thumbnail: "crm_thumbnail.jpg",
         description: "A Digital HR System with an ATS for the recruitment and automated payroll",
        images: ["assets/images/BusinessAppsAndAutomation/Digital_HR_System/1.png", "assets/images/BusinessAppsAndAutomation/Digital_HR_System/2.png", "assets/images/BusinessAppsAndAutomation/Digital_HR_System/3.png", "assets/images/BusinessAppsAndAutomation/Digital_HR_System/4.png",, "assets/images/BusinessAppsAndAutomation/Digital_HR_System/5.png",, "assets/images/BusinessAppsAndAutomation/Digital_HR_System/6.png",, "assets/images/BusinessAppsAndAutomation/Digital_HR_System/7.png"]
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
        name: "Data Visualization Excel Dashboard",
        thumbnail: "assets/images/Data_Analysis/Excel_Dashboards/MainDashboard.jpg",
         description: "Dashboards made Totally in Excel using pivot tables and VBA and Excel Charts ",
        images: ["assets/images/Data_Analysis/Excel_Dashboards/Dashboard.mp4", "assets/images/Data_Analysis/Excel_Dashboards/Dashboard1.png", "assets/images/Data_Analysis/Excel_Dashboards/Dashboard2.png","assets/images/Data_Analysis/Excel_Dashboards/Data Entry option.png"]
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
  const mediaContainer = document.getElementById("projectMedia");

  currentProject = projectData[category].projects[index];
  currentImageIndex = 0;

  // Ensure mediaContainer exists and is empty before adding new content
  if (mediaContainer) {
    mediaContainer.innerHTML = "";
  }

  updateProjectImage();
  modal.style.display = "flex";
}


// Update Displayed Image
function updateProjectImage() {
  const mediaContainer = document.getElementById("projectMedia");

  if (!currentProject || currentProject.images.length === 0) return;

  // Get the current file
  const currentFile = currentProject.images[currentImageIndex];

  // Clear previous content
  mediaContainer.innerHTML = "";

  if (currentFile.endsWith(".mp4") || currentFile.endsWith(".webm") || currentFile.endsWith(".ogg")) {
    // Create a video element if the file is a video
    const videoElement = document.createElement("video");
    videoElement.src = currentFile;
    videoElement.controls = true;
    videoElement.style.width = "100%";
    videoElement.style.maxHeight = "80vh";
    mediaContainer.appendChild(videoElement);
  } else {
    // Otherwise, display as an image
    const imageElement = document.createElement("img");
    imageElement.src = currentFile;
    imageElement.style.objectFit = "contain";
    imageElement.style.width = "100%";
    imageElement.style.maxHeight = "80vh";
    mediaContainer.appendChild(imageElement);
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

// Select the hamburger menu button and navbar links
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navbarLinks = document.querySelector('.navbar-links');

// Add click event listener to toggle the "active" class
hamburgerMenu.addEventListener('click', () => {
  navbarLinks.classList.toggle('active');
});

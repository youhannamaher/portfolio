// Project Data with Thumbnails
const projectData = {
  automation: {
    title: "Business Applications & Automation",
    projects: [
      {
        name: "ASU Registration Application",
        thumbnail: "assets/images/experience/ASU_Career_Center.png",
        description: "A web app for students to register at Ain Shams University easily.",
        detailedDescription: "This application was built to streamline the registration process, allowing students to register efficiently while reducing paperwork and human errors. It integrates a powerful backend to handle thousands of students with real-time updates and notifications.",
        video: "https://www.youtube.com/embed/VkqxCcYTvqI",
        images: [
          "assets/images/BusinessAppsAndAutomation/ASUApp/1.png",
          "assets/images/BusinessAppsAndAutomation/ASUApp/2.jpg",
          "assets/images/BusinessAppsAndAutomation/ASUApp/3.png"
        ]
      },
      {
    name: "Digital HR System Demo",
    thumbnail: "crm_thumbnail.jpg",
    description: "A Digital HR System with an ATS for recruitment and automated payroll.",
    video: "https://www.youtube.com/embed/zJimL4T-EwU",
    detailedDescription: "🔹 HR Digital System – Automating Recruitment & Payroll 🔹\n\n" +
    "This HR digital system is a comprehensive, AI-powered solution designed to automate and enhance recruitment and payroll management, making HR operations faster, smarter, and more efficient.",
    
    images: [
        "assets/images/BusinessAppsAndAutomation/Digital_HR_System/1.png",
        "assets/images/BusinessAppsAndAutomation/Digital_HR_System/2.png"
    ]
}
,
      {
        name: "YM Store",
        thumbnail: "crm_thumbnail.jpg",
        description: "A Digital Store fully dynamic for the clients and administration",
        detailedDescription: "A complete HR solution that allows organizations to manage recruitment, onboarding, payroll, and employee performance tracking with automation tools. It enhances decision-making with real-time reports and analytics.",
        images: [
          "assets/images/BusinessAppsAndAutomation/Digital_HR_System/1.png",
          "assets/images/BusinessAppsAndAutomation/Digital_HR_System/2.png"
        ]
      },
      {
        name: "Bondy Inventory Management",
        thumbnail: "crm_thumbnail.jpg",
        description: "A dynamic app that tracks all the inventory, production and all the transactions made",
        detailedDescription: "A complete HR solution that allows organizations to manage recruitment, onboarding, payroll, and employee performance tracking with automation tools. It enhances decision-making with real-time reports and analytics.",
        images: [
          "assets/images/BusinessAppsAndAutomation/Digital_HR_System/1.png",
          "assets/images/BusinessAppsAndAutomation/Digital_HR_System/2.png"
        ]
      }
    ]
  },
  data: {
    title: "Data Management & Analysis",
    projects: [
      {
        name: "Data Visualization Excel Dashboard",
        thumbnail: "assets/images/Data_Analysis/Excel_Dashboards/MainDashboard.jpg",
        description: "Excel dashboards with pivot tables, VBA, and advanced charts.",
        detailedDescription: "A powerful Excel-based business intelligence dashboard that enables users to analyze and visualize complex datasets. It includes interactive pivot tables, VBA automation, and Power Query integrations.",
        video: "https://www.youtube.com/embed/your_video_id",
        images: [
          "assets/images/Data_Analysis/Excel_Dashboards/Dashboard1.png",
          "assets/images/Data_Analysis/Excel_Dashboards/Dashboard2.png"
        ]
      }
    ]
  },
  presentation: {
    title: "Presentation & Documentation",
    projects: [
      {
        name: "Corporate Pitch Deck",
        thumbnail: "pitch_thumbnail.jpg",
        description: "A professional business presentation for investors.",
        detailedDescription: "A visually stunning presentation designed for investor meetings and business proposals. It uses high-impact slides, clear storytelling, and engaging data visualizations to impress stakeholders.",
        images: [
          "assets/images/Presentation/PitchDeck1.png",
          "assets/images/Presentation/PitchDeck2.png"
        ]
      }
    ]
  }
}









// Open the Category Modal
function openGallery(category) {
  if (!projectData[category]) return;

  const modal = document.getElementById("categoryModal");
  const title = document.getElementById("categoryTitle");
  const projectsList = document.getElementById("projectsList");

  const { title: categoryTitle, projects } = projectData[category];
  title.textContent = categoryTitle;
  
  projectsList.innerHTML = projects
    .map((project, index) => `
      <div class="project-item" onclick="openProject(${index}, '${category}')">
        <img src="${project.thumbnail}" alt="${project.name}">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
      </div>
    `)
    .join("");

  modal.style.display = "flex";
}

// Open the Project Modal
let currentProject = null;
let currentImageIndex = 0;

function openProject(index, category) {
  const modal = document.getElementById("projectModal");
  const titleElement = document.getElementById("projectTitle");
  const shortDesc = document.getElementById("projectShortDescription");
  const fullDesc = document.getElementById("projectFullDescription");
  const mediaContainer = document.getElementById("projectMedia");
  const viewImagesBtn = document.getElementById("viewImagesBtn");

  currentProject = projectData[category].projects[index];
  currentImageIndex = 0;

  // Update content
  titleElement.textContent = currentProject.name;
  shortDesc.textContent = currentProject.description;
  fullDesc.textContent = currentProject.detailedDescription;
  mediaContainer.innerHTML = "";

  // Ensure "View Images" button is visible when images exist
  viewImagesBtn.style.display = currentProject.images.length > 0 ? "block" : "none";

  // Hide next & previous buttons on the homepage
  document.getElementById("prevImageBtn").style.display = "none";
  document.getElementById("nextImageBtn").style.display = "none";

  // Display video if available
  if (currentProject.video) {
    const iframe = document.createElement("iframe");
    iframe.src = currentProject.video;
    iframe.width = "100%";
    iframe.height = "400px";
    iframe.allow = "autoplay; encrypted-media";
    iframe.allowFullscreen = true;
    mediaContainer.appendChild(iframe);
  }

  modal.style.display = "flex";
}

// Show Project Images
function showProjectImages() {
  const mediaContainer = document.getElementById("projectMedia");
  mediaContainer.innerHTML = "";

  const titleElement = document.getElementById("projectTitle");
  titleElement.textContent = currentProject.name; // Keep only the title

  // Hide descriptions and view images button in image mode
  document.getElementById("projectShortDescription").style.display = "none";
  document.getElementById("projectFullDescription").style.display = "none";
  document.getElementById("viewImagesBtn").style.display = "none";

  // Create and display first image
  const imageElement = document.createElement("img");
  imageElement.id = "projectImage";
  imageElement.src = currentProject.images[currentImageIndex];
  imageElement.style.objectFit = "contain";
  imageElement.style.width = "100%";
  imageElement.style.maxHeight = "80vh";

  mediaContainer.appendChild(imageElement);

  // Show next & previous buttons for image navigation
  document.getElementById("prevImageBtn").style.display = "block";
  document.getElementById("nextImageBtn").style.display = "block";
}

// Navigate Images
function prevImage() {
  if (!currentProject || currentProject.images.length === 0) return;

  currentImageIndex = (currentImageIndex - 1 + currentProject.images.length) % currentProject.images.length;
  document.getElementById("projectImage").src = currentProject.images[currentImageIndex];
}

function nextImage() {
  if (!currentProject || currentProject.images.length === 0) return;

  currentImageIndex = (currentImageIndex + 1) % currentProject.images.length;
  document.getElementById("projectImage").src = currentProject.images[currentImageIndex];
}


// Close Modals
function closeModal() {
  document.getElementById("categoryModal").style.display = "none";
}

function closeProjectModal() {
  document.getElementById("projectModal").style.display = "none";
  document.getElementById("projectShortDescription").style.display = "block";
  document.getElementById("projectFullDescription").style.display = "block";
  document.getElementById("viewImagesBtn").style.display = "block";
  document.getElementById("prevImageBtn").style.display = "none";
  document.getElementById("nextImageBtn").style.display = "none";
}

document.addEventListener("keydown", event => {
  if (document.getElementById("projectModal").style.display === "flex") {
    if (event.key === "ArrowLeft") prevImage();
    if (event.key === "ArrowRight") nextImage();
    if (event.key === "Escape") closeProjectModal();
  }
});

// Hamburger Menu Fix for Mobile
const hamburgerMenu = document.querySelector(".hamburger-menu");
const navbarLinks = document.querySelector(".navbar-links");

hamburgerMenu.addEventListener("click", () => {
  navbarLinks.classList.toggle("active");
});

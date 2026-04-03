/* =========================================================================
   YOUHANNA MAHER ABADIR - MAIN JAVASCRIPT
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// App State
const state = {
    profile: null,
    projects: [],
    certificates: [],
    experience: [],
    education: []
};

let allProjects = [];
let allCertificates = [];
let currentGalleryImages = [];
let currentGalleryIndex = 0;

async function initApp() {
    console.log("🚀 App Initializing...");
    setupUI();
    
    try {
        console.log("📂 Fetching data files...");
        await Promise.all([
            fetchData('profile'),
            fetchData('projects'),
            fetchData('certificates'),
            fetchData('experience'),
            fetchData('education')
        ]);
        
        console.log("✅ Data loaded. Starting renderApp...");
        renderApp();
    } catch (error) {
        console.error("❌ Failed to load portfolio data:", error);
    }
}

async function fetchData(type) {
    try {
        const response = await fetch(`data/${type}.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        state[type] = data;
    } catch (e) {
        console.error(`Fetch failed for ${type}.json.`, e);
        
        // --- EMERGENCY FAIL-SAFE FOR LOCAL FILE BROWSING ---
        if (type === 'profile') {
            state.profile = {
                "name": "Youhanna Maher",
                "title": "I Build Business Applications That Actually Save Time",
                "subtitle": "Specializing in Power Platform, SharePoint, and Business Automation to transform manual processes into scalable digital systems.",
                "about": [
                    "As a dual-degree management student and power platform developer, I bridge the gap between business needs and technical solutions.",
                    "I don't just build apps; I create systems that save hundreds of hours by automating what shouldn't be manual."
                ],
                "highlights": [
                    { "icon": "fa-bolt", "text": "Rapid Deployment" },
                    { "icon": "fa-shield-halved", "text": "Scalable Architecture" },
                    { "icon": "fa-users", "text": "15k+ Users Managed" }
                ],
                "stats": [
                    { "value": "15k+", "label": "Users Managed" },
                    { "value": "4+", "label": "Enterprise Systems" },
                    { "value": "1st", "label": "In Class Performance" }
                ]
            };
            console.warn("⚠️ Using Emergency Inline Profile Data (Local File Mode)");
            renderApp();
        }

        const debugInfo = document.createElement('div');
        debugInfo.style.cssText = 'padding:10px; background:rgba(239, 68, 68, 0.1); border:1px solid rgba(239, 68, 68, 0.3); border-radius:4px; margin-top:5px; font-size:12px; font-family:monospace; color:#ef4444;';
        debugInfo.textContent = `❌ [DEBUG] Fetch failed for data/${type}.json: ${e.message}`;
        document.body.appendChild(debugInfo);
        
        if (window.location.protocol === 'file:') {
            showCorsWarning();
        }
        state[type] = type === 'profile' ? state.profile : [];
    }
}

function showCorsWarning() {
    if (document.getElementById('cors-warning')) return;
    const warning = document.createElement('div');
    warning.id = 'cors-warning';
    warning.style.cssText = 'position:fixed; top:0; left:0; width:100%; background-color:#ef4444; color:white; text-align:center; padding:15px; z-index:9999; font-weight:bold; box-shadow:0 4px 6px rgba(0,0,0,0.3);';
    warning.innerHTML = '⚠️ Local File Security Restriction: The browser blocked loading the portfolio data. To view the site, please open it using a local web server (e.g., VS Code "Live Server" extension) instead of double-clicking the HTML file.';
    document.body.prepend(warning);
}

function renderApp() {
    renderProfile();
    renderExpertise();
    renderProjects();
    renderExperience();
    renderCertificates();
    renderEducation();
    
    setupObservers();
    initAnimations();
}

/* =========================================================================
   UI & NAVIGATION SETUP
   ========================================================================= */
function setupUI() {
    // Current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    
    mobileBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        if (mobileNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileBtn.querySelector('i').className = 'fa-solid fa-bars';
        });
    });

    // Navbar scroll effect & Active section highlight
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Correct for 0.75x zoom on desktop (window.scrollY remains 1:1 with pixels, but offsetTop is scaled down)
        const isDesktop = window.innerWidth > 768;
        const zoomFactor = isDesktop ? 0.75 : 1;
        const adjustedScroll = window.scrollY / zoomFactor;

        // Sticky nav shadow
        if (window.scrollY > 50) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (adjustedScroll >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });

    // Modal Close Events
    const modals = document.querySelectorAll('.modal');
    document.querySelectorAll('[data-close="modal"]').forEach(btn => {
        btn.addEventListener('click', () => {
            modals.forEach(m => m.classList.remove('active'));
            document.body.style.overflow = ''; // Restore scrolling
        });
    });

    // Global ESC key event for modals and lightboxes
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') {
            const lightbox = document.getElementById('lightbox');
            if(lightbox && lightbox.classList.contains('active')) {
                closeLightbox();
            } else {
                modals.forEach(m => m.classList.remove('active'));
                document.body.style.overflow = ''; // Restore scrolling
            }
        }
        
        // Navigation array keys for Lightbox
        if(e.key === 'ArrowRight' && document.getElementById('lightbox').classList.contains('active')) {
            nextLightboxImage();
        }
        if(e.key === 'ArrowLeft' && document.getElementById('lightbox').classList.contains('active')) {
            prevLightboxImage();
        }
    });

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeBtn.querySelector('i');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        themeIcon.className = 'fa-solid fa-moon';
    }

    themeBtn.addEventListener('click', () => {
        const root = document.documentElement;
        root.classList.toggle('light-theme');
        
        if (root.classList.contains('light-theme')) {
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('portfolio-theme', 'dark');
        }
    });

    // Seamless Formspree Integration via AJAX
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const statusDiv = document.getElementById('contact-status');
            const btn = document.getElementById('contact-submit-btn');
            const originalBtnText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
            statusDiv.innerHTML = "";
            
            try {
                const response = await fetch(e.target.action, {
                    method: e.target.method,
                    body: new FormData(e.target),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    statusDiv.innerHTML = '<span style="color: var(--accent-secondary);"><i class="fa-solid fa-circle-check"></i> Message sent successfully! I will get back to you soon.</span>';
                    e.target.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        statusDiv.innerHTML = `<span style="color: #ef4444;"><i class="fa-solid fa-circle-exclamation"></i> ${data.errors.map(err => err.message).join(', ')}</span>`;
                    } else {
                        statusDiv.innerHTML = '<span style="color: #ef4444;"><i class="fa-solid fa-circle-exclamation"></i> Oops! There was a problem submitting your form.</span>';
                    }
                }
            } catch (error) {
                statusDiv.innerHTML = '<span style="color: #ef4444;"><i class="fa-solid fa-circle-exclamation"></i> Network error. Please try again later.</span>';
            }
            
            btn.innerHTML = originalBtnText;
            btn.disabled = false;
        });
    }

    initContactHub();
    initFAQ();
}

/**
 * FAQ Accordion Logic
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}



function setupObservers() {
    // 1. Hero Animation Trigger
    const hero = document.getElementById('hero');
    if (hero) {
        setTimeout(() => {
            hero.classList.add('hero-animate');
        }, 100);
    }

    // 2. Add reveal classes to dynamically rendered elements
    document.querySelectorAll('.expertise-card').forEach((el, i) => {
        el.classList.add('reveal-scale');
        if (i < 5) el.classList.add(`stagger-${i + 1}`);
    });
    document.querySelectorAll('.timeline-item').forEach(el => {
        el.classList.add('reveal-left');
    });
    document.querySelectorAll('.cert-card').forEach((el, i) => {
        el.classList.add('reveal');
        if (i < 5) el.classList.add(`stagger-${i + 1}`);
    });
    document.querySelectorAll('.education-card').forEach(el => {
        el.classList.add('reveal-right');
    });
    document.querySelectorAll('.stat-card').forEach((el, i) => {
        el.classList.add('reveal-scale');
        if (i < 5) el.classList.add(`stagger-${i + 1}`);
    });

    // 3. IntersectionObserver for all reveal variants
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    // Observe all reveal variants
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Staggering for initial load
    const gridContainers = document.querySelectorAll('.expertise-grid, .about-stats, .education-grid, .certifications-grid');
    gridContainers.forEach(container => {
        applyStagger(container.children);
    });
}



/**
 * Magnetic Button Effect: Disabled
 */
function initMagneticButtons() {
    // Effect disabled for stability
}

/**
 * Parallax Background: Disabled
 */
function initBackgroundParallax() {
    // Effect disabled for stability
}

/**
 * Adds reveal class, observes elements, and optionally applies staggering
 * @param {NodeList|Array} elements 
 */
function revealOnScroll(elements) {
    if (!elements || !revealObserver) return;
    elements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
}

function applyStagger(elements, limit = 5) {
    Array.from(elements).forEach((child, index) => {
        if (index < limit) {
            child.classList.add(`stagger-${index + 1}`);
        }
    });
}

/* =========================================================================
   RENDERING LOGIC
   ========================================================================= */

function renderProfile() {
    const p = state.profile;
    if (!p) return;

    // Hero
    if (p.name) document.getElementById('hero-name').textContent = p.name;
    if (p.title) document.getElementById('hero-title').textContent = p.title;
    if (p.subtitle) document.getElementById('hero-subtitle').textContent = p.subtitle;
    
    const cvBtn = document.getElementById('hero-cv-btn');
    if (cvBtn && p.cvLink) {
        cvBtn.href = p.cvLink;
    }

    if (p.highlights && p.highlights.length) {
        const hContainer = document.getElementById('hero-highlights');
        hContainer.innerHTML = p.highlights.map(h => `
            <span class="highlight-tag">
                <i class="fa-solid ${h.icon || 'fa-check'}"></i> ${h.text}
            </span>
        `).join('');
    }

    // About
    if (p.about) {
        document.getElementById('about-text').innerHTML = p.about.map(paragraph => `<p>${paragraph}</p>`).join('');
    }

    if (p.stats && p.stats.length) {
        document.getElementById('about-stats').innerHTML = p.stats.map(s => `
            <div class="stat-card">
                <div class="stat-number">${s.value}</div>
                <div class="stat-label">${s.label}</div>
            </div>
        `).join('');
    }

    // Contact Social Icons (Footer only)
    if (p.contact) {
        const footerSocial = document.getElementById('footer-social');
        if (footerSocial) {
            const c = p.contact;
            const iconLinks = [];

            if (c.email) iconLinks.push(`<a href="mailto:${c.email}" class="social-link" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>`);
            if (c.phone) iconLinks.push(`<a href="tel:${c.phone}" class="social-link" aria-label="Phone"><i class="fa-solid fa-phone"></i></a>`);
            if (c.social?.linkedin) iconLinks.push(`<a href="${c.social.linkedin}" target="_blank" class="social-link" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>`);
            if (c.social?.upwork) iconLinks.push(`<a href="${c.social.upwork}" target="_blank" class="social-link" aria-label="Upwork"><span style="--icon: url('https://img.icons8.com/ios-filled/50/upwork.png'); -webkit-mask: var(--icon) no-repeat center / contain; mask: var(--icon) no-repeat center / contain; width: 22px; height: 22px; display: inline-block; background-color: currentColor; vertical-align: middle;"></span></a>`);

            footerSocial.innerHTML = iconLinks.join('');
        }
    }
}

function renderExpertise() {
    const defaultExpertise = [
        { title: "Power Apps", icon: "fa-mobile-screen", desc: "Custom business applications, role-based workflows, and internal tools." },
        { title: "Power Automate", icon: "fa-bolt", desc: "Process automation, integration logic, and workflow acceleration." },
        { title: "Power BI", icon: "fa-chart-pie", desc: "KPI dashboards, operational analytics, and data visualization." },
        { title: "SharePoint & Dataverse", icon: "fa-database", desc: "Structured data, app backends, scalable process support." }
    ];

    const data = state.profile.expertise || defaultExpertise;
    
    document.getElementById('expertise-grid').innerHTML = data.map(item => `
        <div class="expertise-card">
            <div class="expertise-icon"><i class="fa-solid ${item.icon}"></i></div>
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
        </div>
    `).join('');
    
    const expertiseCards = document.querySelectorAll('#expertise-grid .expertise-card');
    applyStagger(expertiseCards);
}

function createProjectCard(project) {
    const stackTags = project.stack ? project.stack.slice(0, 3).map(s => `<span class="stack-tag">${s}</span>`).join('') : '';
    const imgUrl = project.thumbnail ? `portfolio/projects/${project.folder}/${project.thumbnail}` : 'https://placehold.co/600x400/121216/ededf0?text=No+Preview';
    
    // Display the first category if available
    const primaryCategory = project.categories && project.categories.length > 0 ? project.categories[0] : '';

    return `
        <div class="project-card" data-id="${project.id}">
            <div class="project-img-wrapper" style="cursor:pointer;" onclick="openProjectModal('${project.id}')">
                <img src="${imgUrl}" alt="${project.title}" class="project-img" loading="lazy">
                ${primaryCategory ? `<span class="project-category">${primaryCategory}</span>` : ''}
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-summary">${project.summary || ''}</p>
                <div class="project-stack">${stackTags}</div>
                <button class="btn btn-outline w-100 mt-2" onclick="openProjectModal('${project.id}')">View Details <i class="fa-solid fa-arrow-right ml-2"></i></button>
            </div>
        </div>
    `;
}

function renderProjects() {
    if (!state.projects || state.projects.length === 0) return;

    const container = document.getElementById('projects-grid');
    const viewModes = document.getElementById('view-modes');
    const filtersArea = document.getElementById('projects-filters-area');
    const categoryContainer = document.getElementById('project-categories');
    const searchInput = document.getElementById('project-search');
    const paginationDiv = document.getElementById('projects-pagination');
    const showMoreBtn = document.getElementById('show-more-projects-btn');

    if (!container || !viewModes || !filtersArea || !categoryContainer || !searchInput) return;

    // 1. Build Dynamic Categories
    const uniqueCategories = new Set();
    state.projects.forEach(p => {
        if (p.categories && Array.isArray(p.categories)) {
            p.categories.forEach(cat => uniqueCategories.add(cat));
        }
    });
    const sortedCategories = Array.from(uniqueCategories).sort();

    // 2. Logic & State
    const getInitialLimit = () => window.innerWidth <= 768 ? 3 : 6;
    let currentLimit = getInitialLimit();
    let currentFilteredProjects = [];

    const updateGrid = () => {
        if (currentFilteredProjects.length === 0) {
            container.innerHTML = `<div class="w-100 text-center text-muted py-5 col-span-full">No projects found matching your criteria.</div>`;
            paginationDiv.style.display = 'none';
        } else {
            const visibleProjects = currentFilteredProjects.slice(0, currentLimit);
            container.innerHTML = visibleProjects.map(p => createProjectCard(p)).join('');
            
            const cards = container.querySelectorAll('.project-card');
            applyStagger(cards);
            
            if (currentFilteredProjects.length > currentLimit) {
                paginationDiv.style.display = 'block';
                showMoreBtn.innerHTML = 'Show More Projects <i class="fa-solid fa-chevron-down" style="margin-left: 0.5rem;"></i>';
                showMoreBtn.onclick = () => {
                    currentLimit += 6;
                    updateGrid();
                };
            } else if (currentLimit > 6 && currentFilteredProjects.length > 6) {
                paginationDiv.style.display = 'block';
                showMoreBtn.innerHTML = 'Show Less Projects <i class="fa-solid fa-chevron-up" style="margin-left: 0.5rem;"></i>';
                showMoreBtn.onclick = () => {
                    currentLimit = 6;
                    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
                    updateGrid();
                };
            } else {
                paginationDiv.style.display = 'none';
            }
        }
    };

    const applyView = () => {
        const activeViewBtn = viewModes.querySelector('.view-btn.active');
        const viewMode = activeViewBtn.dataset.view;
        const searchTerm = searchInput.value.toLowerCase();
        
        // Hide/Show Filter Area based on view mode
        if (viewMode === 'all') {
            filtersArea.style.display = 'flex';
        } else {
            filtersArea.style.display = 'none';
            // Optional: reset search when hiding? User said "Featured remains curated and focused".
            // I'll clear the search for a truly curated featured view.
            if (searchTerm) {
                searchInput.value = '';
            }
        }

        const activeCatBtn = categoryContainer.querySelector('.cat-btn.active');
        const activeCategory = activeCatBtn ? activeCatBtn.dataset.filter : 'all';

        currentFilteredProjects = state.projects.filter(p => {
            // mode filter
            if (viewMode === 'featured' && !p.featured) return false;

            // search filter (only in 'all' mode or if we want search in featured too)
            // The user wants Featured to be curated, so I'll only apply search in 'all' mode.
            if (viewMode === 'all') {
                const matchSearch = p.title.toLowerCase().includes(searchTerm) || 
                                    (p.stack && p.stack.some(s => s.toLowerCase().includes(searchTerm))) ||
                                    (p.summary && p.summary.toLowerCase().includes(searchTerm));
                
                if (!matchSearch) return false;

                // category filter
                if (activeCategory !== 'all') {
                    const matchCat = p.categories && p.categories.some(c => c.toLowerCase() === activeCategory.toLowerCase());
                    if (!matchCat) return false;
                }
            }

            return true;
        });

        // Unique projects only (no duplicates)
        currentFilteredProjects = [...new Set(currentFilteredProjects)];
        
        // Sort
        currentFilteredProjects.sort((a,b) => (a.order || 99) - (b.order || 99));

        currentLimit = getInitialLimit();
        updateGrid();
    };

    // 3. Render Initial Category Buttons
    const renderCategories = () => {
        categoryContainer.innerHTML = `
            <button class="cat-btn active" data-filter="all">All</button>
            ${sortedCategories.map(cat => `
                <button class="cat-btn" data-filter="${cat.toLowerCase()}">${cat}</button>
            `).join('')}
        `;
        
        // Setup Scroll Buttons Logic
        const prevBtn = document.getElementById('cat-scroll-prev');
        const nextBtn = document.getElementById('cat-scroll-next');
        
        if (prevBtn && nextBtn && categoryContainer) {
            const scrollAmount = 200;
            
            prevBtn.onclick = () => {
                categoryContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            };
            
            nextBtn.onclick = () => {
                categoryContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            };

            // Optional: Toggle visibility of buttons based on scroll
            const updateScrollButtons = () => {
                const { scrollLeft, scrollWidth, clientWidth } = categoryContainer;
                prevBtn.style.opacity = scrollLeft > 0 ? '1' : '0.3';
                prevBtn.style.pointerEvents = scrollLeft > 0 ? 'auto' : 'none';
                
                nextBtn.style.opacity = scrollLeft + clientWidth < scrollWidth - 5 ? '1' : '0.3';
                nextBtn.style.pointerEvents = scrollLeft + clientWidth < scrollWidth - 5 ? 'auto' : 'none';
            };

            categoryContainer.addEventListener('scroll', updateScrollButtons);
            window.addEventListener('resize', updateScrollButtons);
            
            // Initial check
            setTimeout(updateScrollButtons, 100);
        }
    };

    // 4. Setup Events
    viewModes.addEventListener('click', (e) => {
        const btn = e.target.closest('.view-btn');
        if (btn) {
            viewModes.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyView();
        }
    });

    categoryContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.cat-btn');
        if (btn) {
            categoryContainer.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyView();
        }
    });

    searchInput.addEventListener('input', applyView);

    // Initial load
    renderCategories();
    applyView();
}

/**
 * Professional Timeline Rendering
 */
function renderExperience() {
    if (!state.experience || state.experience.length === 0) return;

    // Sort by order field (lower = first)
    const sorted = [...state.experience].sort((a, b) => (a.order || 99) - (b.order || 99));

    document.getElementById('experience-timeline').innerHTML = sorted.map(item => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <span class="timeline-date">${item.period}</span>
                <h3 class="timeline-role">${item.role}</h3>
                <div class="timeline-company">${item.company}</div>
                <div class="timeline-desc">
                    <ul style="padding-left:1.5rem; margin-top:0.5rem; list-style-type:disc; color:var(--text-secondary); font-size:0.95rem;">
                        ${item.achievements.map(a => `<li style="margin-bottom:0.25rem;">${a}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `).join('');
}

function renderCertificates() {
    if (!state.certificates || state.certificates.length === 0) return;

    // Sort by order field (lower = first)
    const sorted = [...state.certificates].sort((a, b) => (a.order || 99) - (b.order || 99));

    document.getElementById('certifications-grid').innerHTML = sorted.map(cert => `
        <div class="cert-card" onclick="openCertModal('${cert.id}')">
            <div class="cert-icon"><i class="fa-solid fa-award"></i></div>
            <div class="cert-info">
                <h3>${cert.title}</h3>
                <p>${cert.issuer} ${cert.year ? `• ${cert.year}` : ''}</p>
            </div>
        </div>
    `).join('');

    const certCards = document.querySelectorAll('#certifications-grid .cert-card');
    applyStagger(certCards);
}

function renderEducation() {
    if (!state.education || state.education.length === 0) return;

    document.getElementById('education-grid').innerHTML = state.education.map(edu => `
        <div class="education-card" onclick="openEduModal('${edu.id}')" style="cursor: pointer;">
            <h3 class="edu-school">${edu.school}</h3>
            <div class="edu-degree">${edu.degree}</div>
            <p class="text-secondary mb-3" style="font-size:0.9rem; margin-bottom:1rem;">${edu.period}</p>
            <ul class="edu-highlights">
                ${edu.details.map(d => `<li>${d}</li>`).join('')}
            </ul>
        </div>
    `).join('');

    const eduCards = document.querySelectorAll('#education-grid .education-card');
    applyStagger(eduCards);
}

/* =========================================================================
   MODALS LOGIC
   ========================================================================= */

// Lightbox State & Touch Logic
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let isZoomed = false;
let lastTap = 0;

window.openLightbox = function(index) {
    currentGalleryIndex = index;
    updateLightboxUI();
    document.getElementById('lightbox').classList.add('active');
};

window.closeLightbox = function() {
    document.getElementById('lightbox').classList.remove('active');
    // Reset zoom when closing
    isZoomed = false;
    document.getElementById('lightbox-img').style.transform = 'scale(1)';
};

window.nextLightboxImage = function(e) {
    if(e) e.stopPropagation();
    currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryImages.length;
    updateLightboxUI();
};

window.prevLightboxImage = function(e) {
    if(e) e.stopPropagation();
    currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    updateLightboxUI();
};

function updateLightboxUI() {
    const lbImg = document.getElementById('lightbox-img');
    const lbCounter = document.getElementById('lightbox-counter');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    // Reset zoom automatically when navigating
    isZoomed = false;
    lbImg.style.transform = 'scale(1)';
    
    lbImg.src = currentGalleryImages[currentGalleryIndex];
    lbCounter.textContent = `${currentGalleryIndex + 1} / ${currentGalleryImages.length}`;
    
    if(currentGalleryImages.length <= 1) {
        if(prevBtn) prevBtn.style.display = 'none';
        if(nextBtn) nextBtn.style.display = 'none';
    } else {
        if(prevBtn) prevBtn.style.display = 'flex';
        if(nextBtn) nextBtn.style.display = 'flex';
    }
}

// Global Touch Listeners for Swipe and Zoom
document.addEventListener('DOMContentLoaded', () => {
    const lbContent = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    
    if (lbContent) {
        lbContent.addEventListener('touchstart', e => {
            if (e.touches.length === 1) {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }
        }, { passive: true });

        lbContent.addEventListener('touchend', e => {
            if (e.changedTouches.length === 1) {
                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                handleSwipe();
            }
        }, { passive: true });
    }

    if (lbImg) {
        lbImg.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            // Detect Double Tap (between 0 and 300ms)
            if (tapLength < 300 && tapLength > 0) {
                e.preventDefault(); 
                isZoomed = !isZoomed;
                // Double tap scales it to 2.5x smoothly, or reverts to 1x
                this.style.transform = isZoomed ? 'scale(2.5)' : 'scale(1)';
            }
            lastTap = currentTime;
        });
    }
});

function handleSwipe() {
    // Only detect swipe if we are NOT zoomed in (to allow panning)
    if (isZoomed) return;
    
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // Threshold ensures it is an intentional swipe and not a stray tap
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX < 0) {
            // Swipe Left -> Next
            nextLightboxImage();
        } else {
            // Swipe Right -> Prev
            prevLightboxImage();
        }
    }
}

window.openProjectModal = function(id) {
    const project = state.projects.find(p => p.id === id);
    if (!project) return;

    const modal = document.getElementById('project-modal');
    const body = document.getElementById('project-modal-body');
    const imgUrl = project.thumbnail ? `portfolio/projects/${project.folder}/${project.thumbnail}` : 'https://placehold.co/1200x500/121216/ededf0?text=No+Cover+Image';

    let html = `
        <img src="${imgUrl}" alt="${project.title}" class="modal-hero">
        <div class="modal-details">
            <div class="modal-header">
                <h2 class="modal-title">${project.title}</h2>
                <div class="modal-meta">
                    ${project.clientOrOrganization ? `<span><i class="fa-solid fa-briefcase"></i> ${project.clientOrOrganization}</span>` : ''}
                    ${project.period ? `<span><i class="fa-regular fa-calendar"></i> ${project.period}</span>` : ''}
                    ${project.role ? `<span><i class="fa-solid fa-user"></i> ${project.role}</span>` : ''}
                </div>
                <div class="project-stack">
                    ${project.stack ? project.stack.map(s => `<span class="stack-tag">${s}</span>`).join('') : ''}
                </div>
            </div>

            <div class="modal-body">
                ${project.longDescription ? `
                    <h3>Overview</h3>
                    <p>${project.longDescription.replace(/\\n/g, '<br>')}</p>
                ` : `<p>${project.summary}</p>`}
                
                ${project.problem ? `<h3>Problem</h3><p>${project.problem}</p>` : ''}
                ${project.solution ? `<h3>Solution</h3><p>${project.solution}</p>` : ''}
                
                ${project.impact && project.impact.length ? `
                    <h3>Business Impact & Results</h3>
                    <ul>
                        ${project.impact.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                ` : ''}

                ${project.videoEmbed ? `
                    <h3>Video Demonstration</h3>
                    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px; margin-bottom: 2rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-md);">
                        <iframe src="${project.videoEmbed}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                ` : ''}

                ${project.images && project.images.length > 0 ? `
                    <h3>Gallery</h3>
                    <div class="modal-gallery">
                        ${(() => {
                            // Assign image URLs to our global state for the Lightbox router
                            currentGalleryImages = project.images.map(img => `portfolio/projects/${project.folder}/images/${img}`);
                            // Generate the clickable thumbnail tags
                            return project.images.map((img, idx) => `<img src="portfolio/projects/${project.folder}/images/${img}" alt="Project screenshot" loading="lazy" onclick="openLightbox(${idx})" aria-label="View fullscreen image">`).join('');
                        })()}
                    </div>
                ` : ''}
            </div>

            <div class="modal-actions">
                ${project.liveLink ? `<a href="${project.liveLink}" target="_blank" class="btn btn-primary"><i class="fa-solid fa-external-link-alt"></i> Live Demo</a>` : ''}
                ${project.caseStudyFile ? `<a href="portfolio/projects/${project.folder}/files/${project.caseStudyFile}" target="_blank" class="btn btn-secondary"><i class="fa-solid fa-file-pdf"></i> View Case Study</a>` : ''}
            </div>
        </div>
    `;

    body.innerHTML = html;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

window.openCertModal = function (id) {
    const cert = state.certificates.find(c => c.id === id);
    if (!cert) return;

    const modal = document.getElementById('cert-modal');
    const body = document.getElementById('cert-modal-body');

    // Create a list of all images for this cert (handling both image and images array)
    const certImages = cert.images && cert.images.length > 0 
        ? cert.images.map(img => `portfolio/certificates/${cert.folder}/${img}`)
        : (cert.image ? [`portfolio/certificates/${cert.folder}/${cert.image}`] : []);

    currentGalleryImages = certImages;
    let certIdx = 0;

    const updateCertView = () => {
        body.innerHTML = `
            <div class="cert-modal-header" style="text-align: center; margin-bottom: 1.5rem; margin-top: -0.5rem;">
                <h2 class="cert-modal-title" style="font-size: 1.5rem;">${cert.title}</h2>
                <p class="cert-modal-issuer" style="color: var(--text-secondary); margin-bottom: 0;">${cert.issuer} ${cert.year ? `• ${cert.year}` : ''}</p>
            </div>

            <div class="cert-visual-container" style="margin-bottom: 1.5rem;">
                ${certImages.length > 0 ? `
                    <div class="cert-slider">
                        ${certImages.length > 1 ? `
                            <button class="cert-nav-btn prev" id="cert-prev-btn"><i class="fa-solid fa-chevron-left"></i></button>
                        ` : ''}
                        
                        <div class="cert-img-wrapper" id="cert-img-container" onclick="openLightbox(${certIdx})">
                            <img src="${certImages[certIdx]}" alt="${cert.title}" class="cert-main-img">
                            <div class="cert-img-hint"><i class="fa-solid fa-expand"></i> Click to expand</div>
                        </div>

                        ${certImages.length > 1 ? `
                            <button class="cert-nav-btn next" id="cert-next-btn"><i class="fa-solid fa-chevron-right"></i></button>
                        ` : ''}
                    </div>
                ` : !cert.pdf ? `
                    <div class="cert-placeholder">No image available</div>
                ` : ''}
            </div>

            <div class="cert-modal-actions">
                ${cert.link ? `
                    <a href="${cert.link}" target="_blank" class="btn btn-outline cert-verify-btn">
                        Verify Credential <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                ` : ''}
                ${cert.pdf ? `
                    <a href="portfolio/certificates/${cert.folder}/${cert.pdf}" target="_blank" rel="noopener noreferrer" class="btn btn-primary cert-pdf-btn">
                        <i class="fa-solid fa-file-pdf"></i> Access PDF
                    </a>
                ` : ''}
            </div>
            ${certImages.length > 1 ? `<div class="cert-counter" style="margin-top: 1rem; text-align: center; color: var(--text-secondary);">${certIdx + 1} / ${certImages.length}</div>` : ''}
        `;

        // Re-attach navigation logic
        if (certImages.length > 1) {
            document.getElementById('cert-prev-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                navigate(1);
            });
            document.getElementById('cert-next-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                navigate(-1);
            });
        }
    };

    const navigate = (dir) => {
        certIdx = (certIdx - dir + certImages.length) % certImages.length;
        updateCertView();
    };

    // Keyboard Support
    const keyHandler = (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'ArrowRight') navigate(-1);
        if (e.key === 'ArrowLeft') navigate(1);
    };

    // Swipe Support
    let startX = 0;
    const touchStart = (e) => startX = e.touches[0].clientX;
    const touchEnd = (e) => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) navigate(-1); // Swipe left
        if (endX - startX > 50) navigate(1);  // Swipe right
    };

    document.addEventListener('keydown', keyHandler);
    modal.addEventListener('touchstart', touchStart, {passive: true});
    modal.addEventListener('touchend', touchEnd, {passive: true});

    // Cleanup logic handled by event lifecycle
    updateCertView();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.openEduModal = function (id) {
    const edu = state.education.find(e => e.id === id);
    if (!edu) return;

    const modal = document.getElementById('edu-modal');
    const body = document.getElementById('edu-modal-body');

    const eduImages = edu.images && edu.images.length > 0 
        ? edu.images.map(img => `portfolio/education/${edu.folder}/${img}`)
        : (edu.image ? [`portfolio/education/${edu.folder}/${edu.image}`] : []);

    currentGalleryImages = eduImages;
    let eduIdx = 0;

    const updateEduView = () => {
        body.innerHTML = `
            <div class="cert-modal-header" style="text-align: center; margin-bottom: 1.5rem; margin-top: -0.5rem;">
                <h2 class="cert-modal-title" style="font-size: 1.5rem;">${edu.school}</h2>
                <p class="cert-modal-issuer" style="color: var(--text-secondary); margin-bottom: 0;">${edu.degree} • ${edu.period}</p>
            </div>

            <div class="cert-visual-container" style="margin-bottom: 1.5rem;">
                ${eduImages.length > 0 ? `
                    <div class="cert-slider">
                        ${eduImages.length > 1 ? `
                            <button class="cert-nav-btn prev" id="edu-prev-btn"><i class="fa-solid fa-chevron-left"></i></button>
                        ` : ''}
                        
                        <div class="cert-img-wrapper" id="edu-img-container" onclick="openLightbox(${eduIdx})">
                            <img src="${eduImages[eduIdx]}" alt="${edu.school}" class="cert-main-img">
                            <div class="cert-img-hint"><i class="fa-solid fa-expand"></i> Click to expand</div>
                        </div>

                        ${eduImages.length > 1 ? `
                            <button class="cert-nav-btn next" id="edu-next-btn"><i class="fa-solid fa-chevron-right"></i></button>
                        ` : ''}
                    </div>
                ` : !edu.pdf ? `
                    <div class="cert-placeholder">No image available</div>
                ` : ''}
            </div>

            <div class="cert-modal-actions">
                ${edu.pdf ? `
                    <a href="portfolio/education/${edu.folder}/${edu.pdf}" target="_blank" rel="noopener noreferrer" class="btn btn-primary cert-pdf-btn">
                        <i class="fa-solid fa-file-pdf"></i> Access PDF
                    </a>
                ` : ''}
            </div>
            ${eduImages.length > 1 ? `<div class="cert-counter" style="margin-top: 1rem; text-align: center; color: var(--text-secondary);">${eduIdx + 1} / ${eduImages.length}</div>` : ''}
        `;

        // Re-attach navigation logic
        if (eduImages.length > 1) {
            document.getElementById('edu-prev-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                navigate(1);
            });
            document.getElementById('edu-next-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                navigate(-1);
            });
        }
    };

    const navigate = (dir) => {
        eduIdx = (eduIdx - dir + eduImages.length) % eduImages.length;
        updateEduView();
    };

    // Keyboard Support
    const keyHandler = (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'ArrowRight') navigate(-1);
        if (e.key === 'ArrowLeft') navigate(1);
    };

    // Swipe Support
    let startX = 0;
    const touchStart = (e) => startX = e.touches[0].clientX;
    const touchEnd = (e) => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) navigate(-1); // Swipe left
        if (endX - startX > 50) navigate(1);  // Swipe right
    };

    document.addEventListener('keydown', keyHandler);
    modal.addEventListener('touchstart', touchStart, {passive: true});
    modal.addEventListener('touchend', touchEnd, {passive: true});

    updateEduView();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

/**
 * Initialize the Dual-Mode Contact/Booking Hub
 */
function initContactHub() {
    const tabs = document.getElementById('contact-tabs');
    const messageContainer = document.getElementById('contact-mode-message');
    const bookingContainer = document.getElementById('contact-mode-booking');

    if (!tabs || !messageContainer || !bookingContainer) return;

    const btns = tabs.querySelectorAll('.contact-tab-btn');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;

            // Update Tabs
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update Containers
            if (mode === 'message') {
                messageContainer.classList.add('active');
                bookingContainer.classList.remove('active');
            } else {
                messageContainer.classList.remove('active');
                bookingContainer.classList.add('active');
            }
        });
    });
}

/* =========================================================================
   PREMIUM ANIMATION SYSTEM
   ========================================================================= */

/**
 * Master animation initializer — called after all content is rendered
 */
function initAnimations() {
    initScrollProgress();
    initCounters();
    initCardTilt();
    initRipple();
    initParallaxGlows();
    initBackToTop();
}

/**
 * 1. Scroll Progress Bar — glowing bar at the very top of the viewport
 */
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.prepend(bar);

    const update = () => {
        const scrollTop = document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (docHeight > 0) {
            bar.style.width = ((scrollTop / docHeight) * 100) + '%';
        }
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
}

/**
 * 2. Animated Counters — metric values count up when scrolled into view
 */
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent.trim();
                const match = text.match(/^(\d+)(.*)$/);
                if (match) {
                    animateCounter(el, parseInt(match[1]), match[2]);
                }
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.metric-value').forEach(el => observer.observe(el));
}

function animateCounter(element, target, suffix, duration = 2000) {
    const start = performance.now();
    const initial = element.textContent; // Store in case of error

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/**
 * 3. 3D Card Tilt — cards follow mouse with perspective transform
 */
function initCardTilt() {
    // Only on devices with a fine pointer (mouse)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cards = document.querySelectorAll('.expertise-card, .stat-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/**
 * 4. Button Ripple — material-design style click ripple on all buttons
 */
function initRipple() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            ripple.className = 'ripple';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
}

/**
 * 5. Parallax Background Glows — glows follow mouse position
 */
function initParallaxGlows() {
    const glows = document.querySelectorAll('.bg-glow');
    if (glows.length === 0) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    let ticking = false;

    window.addEventListener('mousemove', (e) => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            glows.forEach((glow, i) => {
                const speed = (i + 1) * 12;
                glow.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
            ticking = false;
        });
    }, { passive: true });
}

/**
 * 6. Back-to-Top Button — appears after scrolling, smooth scroll back up
 */
function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

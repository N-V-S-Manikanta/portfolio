/* ==========================================================================
   MANIKANTA'S PORTFOLIO INTERACTION CONTROLLER
   Fluid Unhurried Theme Waves, Interactive Flight & Rocket Scroll Travelers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Active Section Tracker
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 110;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Update Interactive Flight & Rocket Travelers on Scroll
    updateTimelineTravelers();
  });

  // 2. Unhurried Fluid Theme Switcher (1200ms Easing Wave)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
      const rect = themeToggleBtn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      // Check if browser supports modern View Transition API
      if (document.startViewTransition) {
        const transition = document.startViewTransition(() => {
          applyThemeChange(newTheme);
        });

        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
              ]
            },
            {
              duration: 1200,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        });
      } else {
        // Fallback Fluid Circular Wave Overlay
        createFluidRippleOverlay(x, y, endRadius, newTheme);
      }
    });
  }

  function applyThemeChange(newTheme) {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'light') {
      themeToggleBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
      themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
    } else {
      themeToggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
      themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
    }
  }

  function createFluidRippleOverlay(x, y, endRadius, newTheme) {
    let overlay = document.querySelector('.theme-ripple-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'theme-ripple-overlay';
      document.body.appendChild(overlay);
    }

    const circle = document.createElement('div');
    circle.className = 'theme-ripple-circle';
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.width = `${endRadius * 2}px`;
    circle.style.height = `${endRadius * 2}px`;
    circle.style.background = newTheme === 'light' ? '#ffffff' : '#0b0f19';

    overlay.appendChild(circle);

    requestAnimationFrame(() => {
      circle.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    setTimeout(() => {
      applyThemeChange(newTheme);
    }, 600);

    setTimeout(() => {
      circle.style.opacity = '0';
      setTimeout(() => {
        circle.remove();
      }, 500);
    }, 1200);
  }

  // 3. Interactive Flight & Rocket Scroll Travelers on Timelines
  function updateTimelineTravelers() {
    const travelers = [
      { containerId: 'experience-timeline', travelerId: 'experience-traveler', baseAngle: 135 },
      { containerId: 'education-timeline', travelerId: 'education-traveler', baseAngle: 180 }
    ];

    travelers.forEach(({ containerId, travelerId, baseAngle }) => {
      const container = document.getElementById(containerId);
      const traveler = document.getElementById(travelerId);

      if (!container || !traveler) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress ratio inside the timeline section
      const totalHeight = rect.height;
      const currentScroll = windowHeight * 0.6 - rect.top;

      let progress = currentScroll / totalHeight;
      progress = Math.max(0, Math.min(1, progress));

      const topPos = progress * totalHeight;
      traveler.style.top = `${topPos}px`;

      // Dynamic rotation angle simulating flight banking and rocket steering
      const flightBank = (progress - 0.5) * 45;
      traveler.style.transform = `translate(-50%, -50%) rotate(${baseAngle + flightBank}deg) scale(1.15)`;
    });
  }

  // Initial call on DOM ready
  updateTimelineTravelers();

  // 4. Interactive Mouse Spotlight Glow on Cards
  document.querySelectorAll('.project-card, .cert-card, .profile-card, .skill-category-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 5. Typing Effect in Hero
  const typedElement = document.getElementById('typed-text');
  if (typedElement) {
    const phrases = [
      'Capability Development Specialist',
      'Creator of ToriiMinds Multi-AI Agents',
      'ServiceNow Certified CAD & CSA Specialist',
      'AWS Certified Cloud Practitioner & AI Developer',
      'Competitive Problem Solver (400+ CodeChef)'
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentPhrase = phrases[phraseIdx];
      
      if (isDeleting) {
        typedElement.textContent = currentPhrase.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typedElement.textContent = currentPhrase.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIdx === currentPhrase.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed = 500;
      }

      setTimeout(typeLoop, speed);
    }
    typeLoop();
  }

  // 6. Real Official Certificate Data Store & Modal Viewer
  const certData = {
    'servicenow-cad': {
      title: 'ServiceNow Certified Application Developer (CAD)',
      issuer: 'ServiceNow',
      date: 'Sep 2024',
      src: 'assets/certs/ServiceNowCAD.pdf',
      skills: ['GlideScript', 'Business Rules', 'Client Scripts', 'REST API Integration', 'Flow Designer'],
      desc: 'Official ServiceNow CAD certification validating professional skills in creating custom enterprise applications, automating workflows, designing catalog items, and implementing REST integrations on ServiceNow.'
    },
    'servicenow-csa': {
      title: 'ServiceNow Certified System Administrator (CSA)',
      issuer: 'ServiceNow',
      date: 'Sep 2024',
      src: 'assets/certs/ServiceNowCSA (1).pdf',
      skills: ['ServiceNow ITSM', 'System Administration', 'Flow Designer', 'User & Access Mgmt'],
      desc: 'Official ServiceNow CSA credentials validating complete expertise in managing, configuring, administering, and troubleshooting enterprise ServiceNow ITSM platforms.'
    },
    'aws-cloud-practitioner': {
      title: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services (AWS)',
      date: 'Nov 2023',
      src: 'assets/certs/AWS Certified Cloud Practitioner.pdf',
      skills: ['AWS EC2', 'AWS S3', 'IAM Security', 'CloudWatch', 'Cloud Architecture'],
      desc: 'Official AWS credential validating overall understanding of Amazon Web Services cloud architecture, core compute/storage services, IAM security roles, and cloud deployment models.'
    },
    'ibm-prompt': {
      title: 'IBM Prompt Engineering & AI Fundamentals',
      issuer: 'IBM',
      date: '2024',
      src: 'assets/certs/IBM Prompt Engineering.pdf',
      skills: ['Prompt Engineering', 'LLM Fine-Tuning', 'Generative AI', 'System Prompting'],
      desc: 'Professional certification from IBM covering advanced prompt engineering design, system instructions, temperature tuning, and real-world generative AI integration.'
    },
    'genai-agents': {
      title: 'Introduction to Generative AI and Agents',
      issuer: 'Google Cloud / AI Academy',
      date: '2024',
      src: 'assets/certs/Introduction to generative AI and agents.pdf',
      skills: ['AI Agents', 'Autonomous Workflows', 'Multi-Agent Frameworks', 'Tool Binding'],
      desc: 'Comprehensive specialization in designing and deploying goal-driven AI agents, function calling, tool binding, and autonomous multi-agent learning systems.'
    },
    'jpmorgan-swe': {
      title: 'JPMorgan Chase & Co. Software Engineering',
      issuer: 'JPMorgan Chase & Co.',
      date: '2023',
      src: 'assets/certs/gWbW5qHAChqQBGWpA_JPMorgan Chase & Co._sYEWgTRXawKyDJ3BZ_1687531652157_completion_certificate (1).pdf',
      skills: ['Software Engineering', 'Financial Systems', 'Data Visualization', 'Python & React'],
      desc: 'Prestigious engineering specialization from JPMorgan Chase & Co. focusing on financial data visualization, system architecture, and interface integration.'
    },
    'gemini-faculty': {
      title: 'Gemini Certified Faculty',
      issuer: 'Google for Education / Gemini',
      date: '2024',
      src: 'assets/certs/Gemini Certified Faculty.pdf',
      skills: ['Google Gemini AI', 'AI Pedagogy', 'Interactive Learning', 'Prompt Systems'],
      desc: 'Certification in applying Google Gemini AI models for capacity building, capability development, and interactive digital learning workflows.'
    },
    'claude-edu': {
      title: 'Claude AI Fluency for Educators & Developers',
      issuer: 'Anthropic / Learning Academy',
      date: '2024',
      src: 'assets/certs/Claude AI Fluency for Educators.pdf',
      skills: ['Claude 3.5 Sonnet', 'Long Context Prompting', 'AI Reasoning', 'Code Analysis'],
      desc: 'Validation of advanced capabilities in leveraging Anthropic Claude models for deep reasoning, code generation, and structured technical analysis.'
    },
    'rovo-agents': {
      title: 'Rovo Agents & Fundamentals',
      issuer: 'Atlassian',
      date: '2024',
      src: 'assets/certs/Rovo Agents.pdf',
      skills: ['Atlassian Rovo', 'Enterprise AI', 'Knowledge Graph', 'Workflow Automation'],
      desc: 'Specialized certification in Atlassian Rovo AI agents for searching, organizing, and automating enterprise technical workflows.'
    },
    'snowflake': {
      title: 'SnowPro Associate / Snowflake Certification',
      issuer: 'Snowflake Data Cloud',
      date: '2024',
      src: 'assets/certs/Snowflake certificate.pdf',
      skills: ['Data Warehousing', 'Cloud Data Lake', 'SQL Analytics', 'Data Security'],
      desc: 'Certification in cloud data management, scalable data warehousing, and SQL data transformations on Snowflake.'
    },
    'oracle-foundation': {
      title: 'Oracle Certified Foundation Associate',
      issuer: 'Oracle University',
      date: 'Aug 2023',
      src: 'assets/certs/22A95A1203 oracle.pdf',
      skills: ['Oracle Cloud Infrastructure', 'Database Mgmt', 'Cloud Security'],
      desc: 'Official Oracle credentials covering Oracle Cloud Infrastructure core concepts, security, networking, and enterprise database administration.'
    },
    'postman-api': {
      title: 'Postman API Fundamentals Student Expert',
      issuer: 'Postman',
      date: '2024',
      src: 'assets/certs/Postman API Fundamentals.pdf',
      skills: ['REST APIs', 'Postman Collections', 'API Testing', 'HTTP Methods', 'JSON Validation'],
      desc: 'Practical expertise in designing, consuming, testing, and documenting RESTful web APIs using Postman.'
    },
    'ibm-python': {
      title: 'Python for Data Science & AI',
      issuer: 'IBM / Cognitive Class',
      date: '2023',
      src: 'assets/certs/IBM PY0101EN Certificate _ Cognitive Class.pdf',
      skills: ['Python 3', 'Data Science', 'Pandas & NumPy', 'Data Visualization'],
      desc: 'IBM credentials validating Python programming for data science, data manipulation, Pandas, and machine learning data pipelines.'
    },
    'codechef-500': {
      title: 'CodeChef Problem Solver (400+ Solved)',
      issuer: 'CodeChef',
      date: '2024',
      src: 'assets/certs/CodeChef 500 Difficulty Rating.pdf',
      skills: ['Data Structures', 'Algorithms', 'Competitive Programming', '400+ Solved'],
      desc: 'Recognition of solving 400+ algorithmic challenges across dual CodeChef profiles, dynamic programming, and data structures.'
    },
    'hackerrank-python': {
      title: 'HackerRank Python Basic Certification',
      issuer: 'HackerRank',
      date: '2023',
      src: 'assets/certs/HackerRank Python Basic.pdf',
      skills: ['Python 3', 'Data Types', 'Control Flow', 'Object-Oriented Programming'],
      desc: 'Verified skills in core Python programming, data structures, and algorithmic logic formulation.'
    }
  };

  const modalOverlay = document.getElementById('cert-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalViewer = document.getElementById('modal-viewer-content');
  const modalTitle = document.getElementById('modal-title');
  const modalIssuer = document.getElementById('modal-issuer');
  const modalDesc = document.getElementById('modal-desc');
  const modalSkills = document.getElementById('modal-skills');
  const modalDownload = document.getElementById('modal-download-btn');

  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      const certKey = card.getAttribute('data-cert');
      const data = certData[certKey];

      if (!data) return;

      modalTitle.textContent = data.title;
      modalIssuer.textContent = `${data.issuer} • ${data.date}`;
      modalDesc.textContent = data.desc;

      modalSkills.innerHTML = data.skills
        .map(skill => `<span class="tag">${skill}</span>`)
        .join('');

      modalViewer.innerHTML = `<iframe src="${data.src}" class="modal-cert-iframe" title="${data.title}"></iframe>`;
      modalDownload.href = data.src;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    modalViewer.innerHTML = '';
  }

  // 7. Certification Tabs Filtering
  const certTabBtns = document.querySelectorAll('.cert-tab-btn');
  const certCards = document.querySelectorAll('.cert-card');

  certTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      certTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      certCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 8. Project Filtering
  const projectTabBtns = document.querySelectorAll('.project-tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});

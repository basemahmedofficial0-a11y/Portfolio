(function () {
    'use strict';

    // ==========================================
    // ELEMENT REFERENCES
    // ==========================================
    const nav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('[data-nav-section]');
    const btt = document.getElementById('back-to-top');
    const hamburger = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileClose = document.getElementById('mobile-close');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const heroImage = document.getElementById('hero-image');
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    // ==========================================
    // 1. NAVBAR — Scroll effect + active section
    // ==========================================
    function updateNav() {
        const scrollY = window.scrollY;

        if (scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Active section highlighting
        let current = '';
        sections.forEach(function (section) {
            var top = section.offsetTop - 220;
            if (scrollY >= top) {
                current = section.getAttribute('data-nav-section');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================
    // 2. BACK TO TOP
    // ==========================================
    function updateBTT() {
        if (window.scrollY > 600) {
            btt.classList.add('visible');
        } else {
            btt.classList.remove('visible');
        }
    }

    btt.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Combined scroll handler
    window.addEventListener('scroll', function () {
        updateNav();
        updateBTT();
    }, { passive: true });

    // ==========================================
    // 3. MOBILE MENU
    // ==========================================
    function openMobileMenu() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openMobileMenu);
    mobileClose.addEventListener('click', closeMobileMenu);

    // Close on link click
    var mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // ==========================================
    // 4. LIGHTBOX
    // ==========================================
    function openLightbox() {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    heroImage.addEventListener('click', openLightbox);
    heroImage.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox();
        }
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    // Escape key closes lightbox + mobile menu
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeLightbox();
            closeMobileMenu();
        }
    });

    // ==========================================
    // 5. SCROLL REVEAL (IntersectionObserver)
    // ==========================================
    var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });

    // ==========================================
    // 6. TYPEWRITER EFFECT
    // ==========================================
    var typewriterEl = document.getElementById('typewriter-text');
    var phrases = [
        'Software Developer · C++ · Web Technologies · AI Workflows',
        'Turning Complex Problems Into Elegant Solutions.',
        'CS Undergrad @ Benha University — Ready to Ship.'
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;

    function typewrite() {
        var current = phrases[phraseIndex];

        if (isDeleting) {
            typewriterEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        var delay = isDeleting ? 28 : 52;

        if (!isDeleting && charIndex === current.length) {
            delay = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400;
        }

        setTimeout(typewrite, delay);
    }

    setTimeout(typewrite, 800);

    // ==========================================
    // 7. ANIMATED COUNTERS
    // ==========================================
    var counterEls = document.querySelectorAll('.counter-value');
    var countersDone = false;

    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !countersDone) {
                countersDone = true;
                counterEls.forEach(function (el) {
                    var target = parseInt(el.getAttribute('data-target'), 10);
                    var suffix = el.getAttribute('data-suffix') || '';
                    var duration = 2000;
                    var start = performance.now();

                    function tick(now) {
                        var elapsed = now - start;
                        var progress = Math.min(elapsed / duration, 1);
                        // Ease-out quadratic
                        var ease = 1 - (1 - progress) * (1 - progress);
                        var value = Math.floor(ease * target);
                        el.textContent = value + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(tick);
                        } else {
                            el.textContent = target + suffix;
                        }
                    }

                    requestAnimationFrame(tick);
                });
            }
        });
    }, { threshold: 0.5 });

    counterEls.forEach(function (el) {
        counterObserver.observe(el);
    });

    // ==========================================
    // 8. PARALLAX BLOBS (mouse move)
    // ==========================================
    var blobs = document.querySelectorAll('.parallax-blob');

    document.addEventListener('mousemove', function (e) {
        var x = (e.clientX / window.innerWidth - 0.5) * 2;
        var y = (e.clientY / window.innerHeight - 0.5) * 2;

        blobs.forEach(function (blob) {
            var speed = parseFloat(blob.getAttribute('data-speed')) || 0.03;
            var moveX = x * speed * 120;
            var moveY = y * speed * 120;
            blob.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
        });
    });

    // ==========================================
    // 9. MAGNETIC BUTTONS
    // ==========================================
    var magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            var rect = btn.getBoundingClientRect();
            var bx = e.clientX - rect.left - rect.width / 2;
            var by = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = 'translate(' + (bx * 0.15) + 'px, ' + (by * 0.15) + 'px)';
        });

        btn.addEventListener('mouseleave', function () {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ==========================================
    // 10. PARTICLE CANVAS
    // ==========================================
    var particles = [];
    var PARTICLE_COUNT = 45;

    function resizeCanvas() {
        var hero = canvas.parentElement;
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function Particle() {
        this.reset();
    }

    Particle.prototype.reset = function () {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.speedY = (Math.random() - 0.5) * 0.35;
        this.opacity = Math.random() * 0.35 + 0.1;
        this.hue = Math.random() > 0.5 ? 36 : 30;
    };

    Particle.prototype.update = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    };

    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + this.hue + ', 100%, 55%, ' + this.opacity + ')';
        ctx.fill();
    };

    for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        // Connection lines
        for (var a = 0; a < particles.length; a++) {
            for (var b = a + 1; b < particles.length; b++) {
                var dx = particles[a].x - particles[b].x;
                var dy = particles[a].y - particles[b].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.strokeStyle = 'rgba(255, 159, 28, ' + (0.06 * (1 - dist / 110)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // ==========================================
    // INIT
    // ==========================================
    updateNav();
    updateBTT();

})();

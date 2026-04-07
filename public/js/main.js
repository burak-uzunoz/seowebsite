/* ========================================
   PIXEL SEO & WEB TASARIM - MAIN JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Loading Screen - SEO Success ----
    const loader = document.getElementById('loader');
    const loadingFill = document.getElementById('loadingFill');
    const progressText = document.getElementById('progressText');
    const loadingStatus = document.getElementById('loadingStatus');
    const metricTraffic = document.getElementById('metricTraffic');
    const metricRank = document.getElementById('metricRank');
    const metricPerf = document.getElementById('metricPerf');
    const chartPath = document.getElementById('chartPath');
    const chartFill = document.getElementById('chartFill');

    const stages = [
        'Anahtar Kelimeler Analiz Ediliyor...',
        'Rakip Stratejileri İnceleniyor...',
        'On-Page SEO Optimizasyonu...',
        'İçerik Kalitesi Değerlendiriliyor...',
        'Backlink Profili Güçlendiriliyor...',
        'Teknik SEO Taraması Yapılıyor...',
        'Sayga Hızı Optimize Ediliyor...',
        'Mobil Uyumluluk Kontrol Ediliyor...',
        'Sıralama Pozisyonu Yükseliyor...',
        'SEO Başarıyla Tamamlandı!'
    ];

    // Animate SVG chart line
    const totalPoints = 10;
    const chartHeights = [15, 25, 20, 40, 35, 55, 50, 70, 80, 95];

    function updateChart(progress) {
        const visibleCount = Math.floor(progress / 10) + 1;
        let pathD = 'M 0 ' + (140 - chartHeights[0] * 1.3);
        let fillD = pathD;
        for (let i = 1; i < Math.min(visibleCount, totalPoints); i++) {
            const x = (i / (totalPoints - 1)) * 300;
            const y = 140 - chartHeights[i] * 1.3;
            pathD += ` L ${x} ${y}`;
        }
        const lastX = ((Math.min(visibleCount, totalPoints) - 1) / (totalPoints - 1)) * 300;
        chartPath.setAttribute('d', pathD);
        fillD = pathD + ` L ${lastX} 140 L 0 140 Z`;
        chartFill.setAttribute('d', fillD);
    }

    let loadProgress = 0;
    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 10 + 4;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadInterval);
            loadingStatus.textContent = stages[9];
            setTimeout(() => loader.classList.add('hidden'), 600);
        }

        loadingFill.style.width = loadProgress + '%';
        progressText.textContent = Math.floor(loadProgress) + '%';

        const stageIdx = Math.min(Math.floor(loadProgress / 10), 9);
        loadingStatus.textContent = stages[stageIdx];

        // Update metrics
        const trafficVal = Math.floor(loadProgress * 4.5);
        metricTraffic.textContent = '+' + trafficVal + '%';
        const rankStages = [50, 40, 30, 25, 20, 15, 10, 7, 3, 1];
        metricRank.textContent = '#' + rankStages[stageIdx];
        metricPerf.textContent = Math.floor(loadProgress) + '/100';

        updateChart(loadProgress);
    }, 180);

    // ---- Cursor Trail ----
    const cursorTrail = document.getElementById('cursorTrail');
    let lastTrailTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTrailTime < 50) return;
        lastTrailTime = now;
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
        cursorTrail.appendChild(dot);
        setTimeout(() => dot.remove(), 800);
    });

    // ---- Navbar ----
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const navLinkElements = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        // Back to top
        const btn = document.getElementById('backToTop');
        btn.classList.toggle('visible', window.scrollY > 500);
        // Active nav
        updateActiveNav();
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinkElements.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 120;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinkElements.forEach(l => l.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[data-section="${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    // ---- Back to Top ----
    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- Hero Stats Counter ----
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsCounted = false;

    function countStats() {
        if (statsCounted) return;
        statsCounted = true;
        statNumbers.forEach(el => {
            const target = parseInt(el.dataset.target);
            let current = 0;
            const increment = target / 60;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = Math.floor(current);
            }, 30);
        });
    }

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) countStats();
        });
    }, { threshold: 0.5 });
    const heroSection = document.getElementById('home');
    if (heroSection) heroObserver.observe(heroSection);

    // ---- Hero Particles ----
    const heroParticles = document.getElementById('heroParticles');
    function createParticle() {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const colors = ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e', '#00b894'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.cssText = `
            position: absolute;
            width: ${size}px; height: ${size}px;
            background: ${color};
            left: ${x}%;
            bottom: -10px;
            opacity: 0.6;
            image-rendering: pixelated;
        `;
        heroParticles.appendChild(particle);
        const duration = Math.random() * 4000 + 3000;
        particle.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 0.6 },
            { transform: `translateY(-${window.innerHeight + 100}px) rotate(360deg)`, opacity: 0 }
        ], { duration, easing: 'linear' });
        setTimeout(() => particle.remove(), duration);
    }
    setInterval(createParticle, 300);

    // ---- Scroll Animation ----
    const animElements = document.querySelectorAll('.service-card, .portfolio-item, .pricing-card, .process-step, .info-card, .contact-card, .tech-item, .about-feature');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    animElements.forEach((el, i) => {
        el.style.animationDelay = `${i * 0.1}s`;
        scrollObserver.observe(el);
    });

    // ---- Portfolio Filter ----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeInUp 0.5s forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ---- Portfolio Pixel Art Generation ----
    function generatePixelArt(containerId, hue) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const colors = [
            `hsl(${hue}, 60%, 20%)`,
            `hsl(${hue}, 50%, 30%)`,
            `hsl(${hue}, 40%, 40%)`,
            `hsl(${hue}, 70%, 50%)`,
            `hsl(${hue}, 80%, 60%)`,
            `hsl(${hue}, 60%, 15%)`,
            `transparent`
        ];
        for (let i = 0; i < 200; i++) {
            const pixel = document.createElement('div');
            const colorIndex = Math.random() > 0.4
                ? Math.floor(Math.random() * colors.length)
                : colors.length - 1;
            pixel.style.background = colors[colorIndex];
            pixel.style.imageRendering = 'pixelated';
            container.appendChild(pixel);
        }
    }
    generatePixelArt('portfolioArt1', 180);
    generatePixelArt('portfolioArt2', 120);
    generatePixelArt('portfolioArt3', 280);
    generatePixelArt('portfolioArt4', 30);
    generatePixelArt('portfolioArt5', 200);
    generatePixelArt('portfolioArt6', 340);

    // ---- Pricing Toggle ----
    const pricingToggle = document.getElementById('pricingToggle');
    const toggleLabels = document.querySelectorAll('.toggle-label');
    const priceElements = document.querySelectorAll('.price');

    pricingToggle.addEventListener('change', () => {
        const isYearly = pricingToggle.checked;
        toggleLabels.forEach(l => l.classList.toggle('active', (l.dataset.period === 'yearly') === isYearly));
        priceElements.forEach(el => {
            const value = isYearly ? el.dataset.yearly : el.dataset.monthly;
            el.textContent = parseInt(value).toLocaleString('tr-TR');
        });
    });

    // ---- Testimonials Slider ----
    const track = document.getElementById('testimonialTrack');
    const testPrev = document.getElementById('testPrev');
    const testNext = document.getElementById('testNext');
    const testDots = document.getElementById('testDots');
    const cards = track ? track.querySelectorAll('.testimonial-card') : [];
    let currentSlide = 0;

    function initDots() {
        testDots.innerHTML = '';
        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = `test-dot${i === 0 ? ' active' : ''}`;
            dot.addEventListener('click', () => goToSlide(i));
            testDots.appendChild(dot);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        document.querySelectorAll('.test-dot').forEach((d, i) =>
            d.classList.toggle('active', i === index));
    }

    testNext.addEventListener('click', () => goToSlide((currentSlide + 1) % cards.length));
    testPrev.addEventListener('click', () => goToSlide((currentSlide - 1 + cards.length) % cards.length));
    initDots();

    // Auto-slide
    setInterval(() => goToSlide((currentSlide + 1) % cards.length), 5000);

    // ---- Toast Notification ----
    function showToast(message, duration = 4000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), duration);
    }

    // ---- Form Helpers ----
    function serializeForm(form) {
        const data = {};
        new FormData(form).forEach((value, key) => { data[key] = value; });
        return data;
    }

    async function submitForm(url, form, successEl) {
        const data = serializeForm(form);
        const btn = form.querySelector('button[type="submit"]');
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');

        try {
            if (btnText && btnLoading) {
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline-flex';
            }
            btn.disabled = true;

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (result.success) {
                form.style.display = 'none';
                if (successEl) successEl.style.display = 'block';
                showToast(result.message);
            } else {
                showToast('Hata: ' + result.error);
            }
        } catch (err) {
            showToast('Bağlantı hatası! Lütfen tekrar deneyin.');
        } finally {
            btn.disabled = false;
            if (btnText && btnLoading) {
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        }
    }

    // ---- Quote Form ----
    const quoteForm = document.getElementById('quoteForm');
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitForm('/api/quote', quoteForm, document.getElementById('quoteSuccess'));
    });

    // ---- Contact Form ----
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitForm('/api/contact', contactForm, document.getElementById('contactSuccess'));
    });

    // ---- Newsletter Form ----
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletterEmail').value;
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const result = await res.json();
            showToast(result.message || result.error);
            if (result.success) newsletterForm.reset();
        } catch {
            showToast('Bağlantı hatası!');
        }
    });

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ---- Keyboard Navigation ----
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        }
    });
});

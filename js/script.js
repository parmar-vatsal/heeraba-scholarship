document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileDropdown = document.querySelector('.mobile-dropdown');
    const mobileIcon = mobileBtn ? mobileBtn.querySelector('i') : null;

    if (mobileBtn && mobileDropdown) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Toggle logic using CSS classes or inline style
            const isHidden = window.getComputedStyle(mobileDropdown).display === 'none';

            if (isHidden) {
                mobileDropdown.style.display = 'flex';
                if (mobileIcon) {
                    mobileIcon.classList.remove('fa-bars');
                    mobileIcon.classList.add('fa-times');
                }
            } else {
                mobileDropdown.style.display = 'none';
                if (mobileIcon) {
                    mobileIcon.classList.remove('fa-times');
                    mobileIcon.classList.add('fa-bars');
                }
            }
        });

        // Close on link click
        mobileDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileDropdown.style.display = 'none';
                if (mobileIcon) {
                    mobileIcon.classList.remove('fa-times');
                    mobileIcon.classList.add('fa-bars');
                }
            });
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!mobileBtn.contains(e.target) && !mobileDropdown.contains(e.target)) {
                mobileDropdown.style.display = 'none';
                if (mobileIcon) {
                    mobileIcon.classList.remove('fa-times');
                    mobileIcon.classList.add('fa-bars');
                }
            }
        });
    }

    // --- Smart Navbar (Scroll Effect) ---
    const navContainer = document.querySelector('.nav-container');
    const onScroll = () => {
        if (window.scrollY > 50) {
            navContainer.classList.add('scrolled');
        } else {
            navContainer.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll);

    // --- Animated Counters (Intersection Observer) ---
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // ms
                const increment = target / (duration / 16); // 60fps

                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        // Keep suffix logic (e.g., '5000+' -> '123+')
                        const text = counter.innerText;
                        const suffix = text.replace(/[0-9]/g, '');
                        counter.innerText = Math.ceil(current) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        const text = counter.innerText;
                        const suffix = text.replace(/[0-9]/g, '');
                        counter.innerText = target + suffix;
                    }
                };
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 120;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Gallery Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lb');

    // Delegate click for masonry items
    const grid = document.getElementById('masonry-grid');
    if (grid) {
        grid.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                lightboxImg.src = e.target.src;
                lightbox.style.display = 'flex';
                // Trigger reflow for fade in
                lightbox.style.opacity = '0';
                setTimeout(() => {
                    lightbox.style.transition = 'opacity 0.3s';
                    lightbox.style.opacity = '1';
                }, 10);
            }
        });
    }

    const closeLightbox = () => {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // --- Load More Gallery Logic ---
    const loadMoreBtn = document.getElementById('load-more-btn');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const hiddenItems = document.querySelectorAll('.hidden-gallery-item');

            if (hiddenItems.length === 0) {
                loadMoreBtn.style.display = 'none';
                return;
            }

            const originalText = loadMoreBtn.innerHTML;
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

            // Simulate loading delay for effect
            setTimeout(() => {
                const batchSize = 12; // Show 12 at a time
                const itemsToShow = Array.from(hiddenItems).slice(0, batchSize);

                itemsToShow.forEach(item => {
                    item.classList.remove('hidden-gallery-item');
                    item.style.opacity = '0';
                    item.style.display = 'block'; // Ensure it takes space

                    // Trigger reflow
                    void item.offsetWidth;

                    item.style.transition = 'opacity 0.6s ease';
                    item.style.opacity = '1';
                });

                loadMoreBtn.innerHTML = originalText;

                // Hide button if no more items left
                if (document.querySelectorAll('.hidden-gallery-item').length === 0) {
                    loadMoreBtn.style.display = 'none';
                }
            }, 600);
        });
    }

});
 class HeaderController {
            constructor() {
                this.mobileToggle = document.getElementById('mobileToggle');
                this.mobileOverlay = document.getElementById('mobileOverlay');
                this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
                this.mainHeader = document.getElementById('mainHeader');
                this.scrollProgress = document.getElementById('scrollProgress');
                this.logoIcon = document.querySelector('.logo-icon');
                
                this.isScrolling = false;
                this.ticking = false;
                this.lastScrollY = 0;
                
                this.init();
            }

            init() {
                this.bindEvents();
                this.setupIntersectionObserver();
            }

            bindEvents() {
                // Mobile menu toggle
                this.mobileToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleMobileMenu();
                });

                // Close mobile menu when clicking on links
                this.mobileNavLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        this.closeMobileMenu();
                    });
                });

                // Optimized scroll handler with throttling
                window.addEventListener('scroll', () => {
                    if (!this.ticking) {
                        requestAnimationFrame(() => {
                            this.handleScroll();
                            this.ticking = false;
                        });
                        this.ticking = true;
                    }
                }, { passive: true });

                // Smooth scrolling for navigation links
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', (e) => {
                        this.handleSmoothScroll(e, anchor);
                    });
                });

                // Close mobile menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!this.mobileToggle.contains(e.target) && !this.mobileOverlay.contains(e.target)) {
                        this.closeMobileMenu();
                    }
                });

                // Handle resize events
                window.addEventListener('resize', this.debounce(() => {
                    this.handleResize();
                }, 250));
            }

            toggleMobileMenu() {
                const isActive = this.mobileToggle.classList.toggle('active');
                this.mobileOverlay.classList.toggle('active', isActive);
                document.body.style.overflow = isActive ? 'hidden' : 'auto';
            }

            closeMobileMenu() {
                this.mobileToggle.classList.remove('active');
                this.mobileOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            handleScroll() {
                const scrolled = window.pageYOffset;
                const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                
                // Header background change with threshold
                if (scrolled > 50) {
                    this.mainHeader.classList.add('scrolled');
                } else {
                    this.mainHeader.classList.remove('scrolled');
                }

                // Scroll progress indicator
                const scrolledPercent = Math.min((scrolled / documentHeight) * 100, 100);
                this.scrollProgress.style.width = scrolledPercent + '%';

                // Optimized parallax effect on logo
                if (this.logoIcon) {
                    const rate = scrolled * -0.1;
                    const scale = Math.max(0.8, 1 + rate * 0.001);
                    const rotation = rate * 0.05;
                    this.logoIcon.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
                }

                this.lastScrollY = scrolled;
            }

            handleSmoothScroll(e, anchor) {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const headerHeight = this.mainHeader.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }

            handleResize() {
                // Close mobile menu on resize to larger screens
                if (window.innerWidth > 768) {
                    this.closeMobileMenu();
                }
            }

            setupIntersectionObserver() {
                // Optimize animations based on visibility
                const observerOptions = {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('in-view');
                        }
                    });
                }, observerOptions);

                document.querySelectorAll('.demo-section').forEach(section => {
                    observer.observe(section);
                });
            }

            debounce(func, wait) {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            }
        }

        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            new HeaderController();
        });

        // Preload critical resources
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                // Preload font icons
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-solid-900.woff2';
                document.head.appendChild(link);
            });
        }
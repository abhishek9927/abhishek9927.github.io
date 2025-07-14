// Portfolio Website JavaScript
// Handles theme switching, navigation, animations, and interactions

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollAnimations();
        this.setupFormHandling();
        this.setupNavbarScroll();
        this.setupTypewriterEffect();
        this.setupParallaxEffects();
    }

    // Theme Toggle Functionality
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;
        
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            html.classList.toggle('dark', savedTheme === 'dark');
        } else if (systemPrefersDark) {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }

        // Theme toggle event listener
        themeToggle.addEventListener('click', () => {
            const isDark = html.classList.contains('dark');
            html.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
            
            // Add transition effect
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 300);
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                html.classList.toggle('dark', e.matches);
            }
        });
    }

    // Mobile Menu Functionality
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = mobileMenuBtn.querySelector('i');

        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            
            mobileMenu.classList.toggle('hidden');
            
            // Animate menu icon
            if (isHidden) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking on nav links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    }

    // Smooth Scrolling for Navigation Links
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navHeight = document.querySelector('nav').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Scroll Animations using Intersection Observer
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Add fade-in class to elements that should animate
        const animateElements = document.querySelectorAll('.skill-card, .project-card, .stat-card');
        animateElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });

        // Staggered animation for skill cards
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Active Navigation Highlighting
    setupNavbarScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const sectionId = entry.target.getAttribute('id');
                const navLink = document.querySelector(`a[href="#${sectionId}"]`);
                
                if (entry.isIntersecting && navLink) {
                    // Remove active class from all nav links
                    navLinks.forEach(link => {
                        link.classList.remove('text-primary-600', 'dark:text-primary-400');
                        link.classList.add('text-gray-600', 'dark:text-gray-300');
                    });
                    
                    // Add active class to current nav link
                    const currentNavLinks = document.querySelectorAll(`a[href="#${sectionId}"]`);
                    currentNavLinks.forEach(link => {
                        link.classList.remove('text-gray-600', 'dark:text-gray-300');
                        link.classList.add('text-primary-600', 'dark:text-primary-400');
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('nav');
            if (window.scrollY > 50) {
                navbar.classList.add('bg-white/95', 'dark:bg-gray-900/95');
                navbar.classList.remove('bg-white/80', 'dark:bg-gray-900/80');
            } else {
                navbar.classList.remove('bg-white/95', 'dark:bg-gray-900/95');
                navbar.classList.add('bg-white/80', 'dark:bg-gray-900/80');
            }
        });
    }

    // Enhanced Contact Form Handling
    setupFormHandling() {
        const contactForm = document.querySelector('#contact-form');
        
        if (contactForm) {
            // Form submission handler
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateForm(contactForm)) {
                    this.handleFormSubmission(contactForm);
                }
            });

            // Real-time validation
            this.setupRealTimeValidation(contactForm);
            
            // Character counter for message field
            this.setupCharacterCounter();
            
            // Enhanced input animations
            this.setupInputAnimations();
        }
    }

    setupRealTimeValidation(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                // Clear error on input
                const errorElement = document.getElementById(`${input.id}-error`);
                if (errorElement) {
                    errorElement.classList.add('hidden');
                    errorElement.classList.remove('show');
                }
                
                // Remove error styling
                input.classList.remove('border-red-500', 'dark:border-red-400');
            });
        });
    }

    setupCharacterCounter() {
        const messageField = document.getElementById('message');
        const charCount = document.getElementById('char-count');
        
        if (messageField && charCount) {
            messageField.addEventListener('input', () => {
                const count = messageField.value.length;
                charCount.textContent = count;
                
                // Color coding
                if (count > 450) {
                    charCount.parentElement.classList.add('text-red-500');
                    charCount.parentElement.classList.remove('text-yellow-500', 'text-gray-500');
                } else if (count > 400) {
                    charCount.parentElement.classList.add('text-yellow-500');
                    charCount.parentElement.classList.remove('text-red-500', 'text-gray-500');
                } else {
                    charCount.parentElement.classList.add('text-gray-500');
                    charCount.parentElement.classList.remove('text-red-500', 'text-yellow-500');
                }
            });
        }
    }

    setupInputAnimations() {
        const inputs = document.querySelectorAll('.form-input-enhanced');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('form-group-focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('form-group-focused');
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const formData = new FormData(form);
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'project-type', 'timeline', 'message'];
        
        requiredFields.forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${field.id}-error`);
        
        let isValid = true;
        let errorMessage = '';
        
        // Check if field is required and empty
        if (field.required && !value) {
            isValid = false;
            errorMessage = `Please ${fieldName === 'project-type' ? 'select a project type' : 
                                    fieldName === 'timeline' ? 'select a timeline' : 
                                    'fill in this field'}`;
        }
        
        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Message minimum length
        if (fieldName === 'message' && value && value.length < 20) {
            isValid = false;
            errorMessage = 'Please provide more details (minimum 20 characters)';
        }
        
        // Message maximum length
        if (fieldName === 'message' && value && value.length > 500) {
            isValid = false;
            errorMessage = 'Message is too long (maximum 500 characters)';
        }
        
        // Show/hide error
        if (errorElement) {
            if (!isValid) {
                errorElement.querySelector('span').textContent = errorMessage;
                errorElement.classList.remove('hidden');
                errorElement.classList.add('show');
                field.classList.add('border-red-500', 'dark:border-red-400');
            } else {
                errorElement.classList.add('hidden');
                errorElement.classList.remove('show');
                field.classList.remove('border-red-500', 'dark:border-red-400');
            }
        }
        
        return isValid;
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const spinner = '<span class="relative z-10 flex items-center justify-center"><i class="fas fa-spinner fa-spin mr-2"></i>Sending Message...</span>';
        
        submitBtn.innerHTML = spinner;
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-75');

        // Simulate form submission with enhanced feedback
        setTimeout(() => {
            // Hide form and show success message
            form.style.transform = 'translateY(-20px)';
            form.style.opacity = '0';
            
            setTimeout(() => {
                form.style.display = 'none';
                
                // Show success message
                const successElement = document.getElementById('form-success');
                successElement.classList.remove('hidden');
                successElement.style.transform = 'translateY(20px)';
                successElement.style.opacity = '0';
                
                setTimeout(() => {
                    successElement.style.transform = 'translateY(0)';
                    successElement.style.opacity = '1';
                }, 100);
                
                // Also show notification
                this.showNotification('Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
                
                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'block';
                    form.style.transform = 'translateY(0)';
                    form.style.opacity = '1';
                    successElement.classList.add('hidden');
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('opacity-75');
                    
                    // Reset character count
                    const charCount = document.getElementById('char-count');
                    if (charCount) {
                        charCount.textContent = '0';
                        charCount.parentElement.classList.add('text-gray-500');
                        charCount.parentElement.classList.remove('text-red-500', 'text-yellow-500');
                    }
                }, 5000);
            }, 300);
        }, 2000);
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>
                <span>${message}</span>
                <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // Typewriter Effect for Hero Section
    setupTypewriterEffect() {
        const phrases = [
            "Hi, I'm Abhishek Kumar",
            "Data Analyst",
            "Python & SQL Expert", 
            "Power BI Dashboard Creator",
            "Data Insights Specialist"
        ];
        
        const typewriterElement = document.querySelector('.text-4xl');
        if (!typewriterElement) return;
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typewriter = () => {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }
            
            const displayText = currentPhrase.substring(0, charIndex);
            typewriterElement.innerHTML = displayText + '<span class="animate-pulse">|</span>';
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }
            
            setTimeout(typewriter, typeSpeed);
        };
        
        // Start typewriter effect after page load
        setTimeout(typewriter, 1000);
    }

    // Parallax Effects
    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Utility Methods
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

    // Initialize tooltips
    initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg -top-8 left-1/2 transform -translate-x-1/2';
                tooltip.textContent = e.target.dataset.tooltip;
                
                e.target.style.position = 'relative';
                e.target.appendChild(tooltip);
            });
            
            element.addEventListener('mouseleave', (e) => {
                const tooltip = e.target.querySelector('.absolute');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }

    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
            });
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Page became visible
        console.log('Page is now visible');
    } else {
        // Page became hidden
        console.log('Page is now hidden');
    }
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Could send error to analytics service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

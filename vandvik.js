  // Dark mode toggle functionality
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        
        // Check for saved theme preference or respect OS preference
        if (localStorage.getItem('theme') === 'dark' || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
            body.classList.replace('light-mode', 'dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('light-mode')) {
                body.classList.replace('light-mode', 'dark-mode');
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                body.classList.replace('dark-mode', 'light-mode');
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });

        // Form submission handling
        var form = document.getElementById("my-form");
        
        async function handleSubmit(event) {
            event.preventDefault();
            var status = document.getElementById("my-form-status");
            var data = new FormData(event.target);
            fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = "✅ Thanks! तुमचा संदेश पोचला.";
                    form.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            status.innerHTML = "⚠️ Oops! काहीतरी समस्या आली.";
                        }
                    })
                }
            }).catch(error => {
                status.innerHTML = "⚠️ नेटवर्क समस्या आली.";
            });
        }
        form.addEventListener("submit", handleSubmit);

        // Modal functionality
        const modal = document.getElementById("bookletModal");
        const openBtn = document.getElementById("openBookletBtn");
        const closeBtn = document.querySelector(".close-modal");

        openBtn.addEventListener('click', () => {
            modal.style.display = "block";
            document.body.style.overflow = "hidden"; // Prevent scrolling
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto"; // Enable scrolling
        });

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
                document.body.style.overflow = "auto"; // Enable scrolling
            }
        });

        // PDF generation function
        function generatePDF() {
            // Show loading indicator
            document.getElementById('loading').style.display = 'block';
            document.getElementById('success').style.display = 'none';
            
            // Get the element to convert to PDF
            const element = document.getElementById('booklet');
            
            // Configuration for html2pdf
            const opt = {
                margin: 10,
                filename: 'career_guidance_booklet.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };
            
            // Generate and download PDF
            html2pdf().set(opt).from(element).save().then(() => {
                // Hide loading indicator
                document.getElementById('loading').style.display = 'none';
                
                // Show success message
                document.getElementById('success').style.display = 'block';
                
                // Hide success message after 3 seconds
                setTimeout(() => {
                    document.getElementById('success').style.display = 'none';
                }, 3000);
            }).catch(error => {
                console.error('PDF generation failed:', error);
                document.getElementById('loading').style.display = 'none';
                alert('PDF download failed. Please try again.');
            });
        }
        
        // Setup print styles for the booklet
        function setupPrintStyles() {
            const style = document.createElement('style');
            style.innerHTML = `
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #booklet, #booklet * {
                        visibility: visible;
                    }
                    #booklet {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .action-buttons, .loading, .success-message {
                        display: none !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Initialize print styles
        document.addEventListener('DOMContentLoaded', setupPrintStyles);

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Simple animation for elements when they come into view
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__fadeInUp');
                }
            });
        }, observerOptions);

        // Observe all service cards and section titles
        document.querySelectorAll('.service-card, .section-title').forEach(el => {
            el.classList.add('animate__animated');
            observer.observe(el);
        });
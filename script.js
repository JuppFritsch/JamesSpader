// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#ffffff';
            header.style.backdropFilter = 'none';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    }

    // Form validation and submission
    function handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.ingamePhone || !data.discord || !data.service || !data.message) {
            showNotification('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
            return;
        }

        // Ingame phone validation (basic)
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(data.ingamePhone)) {
            showNotification('Bitte geben Sie eine gültige Ingame-Telefonnummer ein.', 'error');
            return;
        }

        // Discord username validation
        if (!isValidDiscordUsername(data.discord)) {
            showNotification('Bitte geben Sie einen gültigen Discord Username ein (z.B. MeinName#1234).', 'error');
            return;
        }

        // Send Discord webhook message
        sendDiscordMessage(data);

        // Update UI
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Nachricht wird gesendet...';
        submitButton.disabled = true;

        // Show beautiful popup confirmation
        showSuccessPopup();
        
        // Reset form
        setTimeout(() => {
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1000);
    }

    // Discord username validation
    function isValidDiscordUsername(username) {
        // Accepts formats: username#1234 or just username
        const discordRegex = /^.{2,32}(#\d{4})?$/;
        return discordRegex.test(username);
    }

    // Send message to Discord webhook
    function sendDiscordMessage(data) {
        // Discord Webhook URL - Konfiguriert für Ihren Server
        const WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1436348338244157650/RgX_m_TjZQwAwKgHkpFyq95L-99ySK2zxK7IPiLYx-zK2U21Pafa5qWkZx5y5RrpWqNF';
        
        const message = {
            embeds: [{
                title: "📋 Neue Rechtsberatungsanfrage - Kanzlei James Spader",
                description: "Ein neuer Mandant benötigt rechtliche Unterstützung in Los Santos.",
                color: 0x6B9071, // Grüne Farbe passend zur Website
                fields: [
                    {
                        name: "👤 Mandant",
                        value: data.name,
                        inline: true
                    },
                    {
                        name: "📱 Ingame Telefon",
                        value: data.ingamePhone,
                        inline: true
                    },
                    {
                        name: "💬 Discord",
                        value: data.discord,
                        inline: true
                    },
                    {
                        name: "⚖️ Rechtsgebiet",
                        value: getServiceName(data.service),
                        inline: true
                    },
                    {
                        name: "� Eingegangen",
                        value: new Date().toLocaleString('de-DE'),
                        inline: true
                    },
                    {
                        name: "🏢 Server",
                        value: "Los Santos Legal",
                        inline: true
                    },
                    {
                        name: "�📝 Anliegen",
                        value: data.message.length > 1024 ? data.message.substring(0, 1021) + "..." : data.message,
                        inline: false
                    }
                ],
                thumbnail: {
                    url: "https://cdn.discordapp.com/emojis/⚖️.png" // Optional: Waage-Icon
                },
                footer: {
                    text: "Kanzlei James Spader | Los Santos Legal Server",
                    icon_url: "https://cdn.discordapp.com/emojis/🏛️.png"
                },
                timestamp: new Date().toISOString()
            }]
        };

        // Versuche Nachricht zu senden
        if (WEBHOOK_URL && WEBHOOK_URL !== 'HIER_WEBHOOK_URL_EINFÜGEN') {
            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            })
            .then(response => {
                if (response.ok) {
                    console.log('✅ Discord-Nachricht erfolgreich gesendet!');
                } else {
                    console.error('❌ Fehler beim Senden der Discord-Nachricht:', response.status);
                }
            })
            .catch(error => {
                console.error('❌ Webhook-Fehler:', error);
            });
        } else {
            console.log("Discord Webhook Nachricht (Vorschau):", message);
            console.warn("⚠️ Webhook-URL noch nicht konfiguriert. Bitte fügen Sie Ihre Webhook-URL in script.js ein.");
        }
    }

    // Service name helper
    function getServiceName(service) {
        const services = {
            'strafrecht': '⚔️ Strafrecht',
            'zivilrecht': '🤝 Zivilrecht', 
            'wirtschaftsrecht': '🏢 Wirtschaftsrecht',
            'vertraege': '📄 Verträge aufsetzen',
            'notfall': '🚨 Notfall'
        };
        return services[service] || service;
    }

    // Add Discord integration info to console
    console.log(`
%c💬 Discord Integration bereit!
%cServer: https://discord.gg/kEapwydeBM
%c
📋 WEBHOOK SETUP ANLEITUNG:
%c1. Gehen Sie zu Ihrem Discord-Server
%c2. Klicken Sie auf Server-Einstellungen (⚙️)
%c3. Wählen Sie "Integrationen" > "Webhooks"
%c4. Erstellen Sie einen neuen Webhook
%c5. Kopieren Sie die Webhook-URL
%c6. Ersetzen Sie 'HIER_WEBHOOK_URL_EINFÜGEN' in script.js
%c
⚖️ Danach werden alle Formulare direkt an Ihren Server gesendet!
    `, 
    'color: #5865f2; font-size: 16px; font-weight: bold;',
    'color: #8b6f47; font-size: 14px; font-weight: bold;',
    'color: #5d4037; font-size: 12px;',
    'color: #3c2b21; font-size: 11px;',
    'color: #3c2b21; font-size: 11px;',
    'color: #3c2b21; font-size: 11px;',
    'color: #3c2b21; font-size: 11px;',
    'color: #3c2b21; font-size: 11px;',
    'color: #3c2b21; font-size: 11px;',
    'color: #8b6f47; font-size: 12px; font-weight: bold;'
    );

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1001;
            max-width: 400px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            closeNotification(notification);
        });

        // Auto close after 5 seconds
        setTimeout(() => {
            closeNotification(notification);
        }, 5000);
    }

    function closeNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-triangle';
            case 'warning': return 'fa-exclamation-circle';
            default: return 'fa-info-circle';
        }
    }

    function getNotificationColor(type) {
        switch (type) {
            case 'success': return '#4caf50';
            case 'error': return '#f44336';
            case 'warning': return '#ff9800';
            default: return '#2196f3';
        }
    }

    // Scroll animations
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .stat, .contact-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    }

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load

    // Add luxury animation CSS classes
    const animationStyles = `
        .service-card, .stat, .contact-item {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .service-card.animate, .stat.animate, .contact-item.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .service-card.animate:nth-child(1) {
            transition-delay: 0.1s;
        }
        
        .service-card.animate:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .service-card.animate:nth-child(3) {
            transition-delay: 0.3s;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
            padding: 0 5px;
        }
        
        .notification-close:hover {
            opacity: 0.7;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);

    // Emergency call functionality
    const emergencyBtn = document.querySelector('.emergency-btn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function(e) {
            // In a real RP environment, this could trigger an in-game phone call
            // For now, we'll show a notification
            e.preventDefault();
            showNotification('Notruf wird eingeleitet... James Spader wird Sie umgehend kontaktieren.', 'warning');
        });
    }

    // Service card interactions
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Loading animation for page
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Add luxury loading effect
        const loadingStyles = `
            body:not(.loaded) {
                opacity: 0;
                transform: scale(0.98);
            }
            
            body.loaded {
                opacity: 1;
                transform: scale(1);
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }
        `;
        
        const loadingStyleSheet = document.createElement('style');
        loadingStyleSheet.textContent = loadingStyles;
        document.head.appendChild(loadingStyleSheet);
        
        // Create luxury cursor trail effect
        createCursorTrail();
    });

    // Luxury cursor trail
    function createCursorTrail() {
        let mouseX = 0, mouseY = 0;
        let trail = [];

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        for (let i = 0; i < 5; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: linear-gradient(45deg, #8b6f47, #d4af37);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(dot);
            trail.push(dot);
        }

        let mouseActive = false;

        document.addEventListener('mouseenter', () => mouseActive = true);
        document.addEventListener('mouseleave', () => mouseActive = false);

        function animateTrail() {
            trail.forEach((dot, index) => {
                setTimeout(() => {
                    dot.style.left = mouseX + 'px';
                    dot.style.top = mouseY + 'px';
                    dot.style.opacity = mouseActive ? (1 - index * 0.2) : 0;
                }, index * 50);
            });
            requestAnimationFrame(animateTrail);
        }

        animateTrail();
    }
});

    // Console easter egg for RP players
    console.log(`
%c🏛️ Kanzlei James Spader 🏛️
%cIhr vertrauensvoller Anwalt in Los Santos

%c📞 Notfall-Hotline: 555-SPADER
%c💬 Discord: JamesSpader#1337
%c⚖️ "Gerechtigkeit ist nicht verhandelbar"

%cWebsite entwickelt für GTA RP
`, 
'color: #3c2b21; font-size: 20px; font-weight: bold;',
'color: #8b6f47; font-size: 14px;',
'color: #5d4037; font-size: 12px; font-weight: bold;',
'color: #5865f2; font-size: 12px; font-weight: bold;',
'color: #3c2b21; font-size: 12px; font-style: italic;',
'color: #5d4037; font-size: 10px;'
);// Global function for Discord button
function openDiscord() {
    showNotification('Discord-Kontakt: Senden Sie eine DM an JamesSpader#1337 oder besuchen Sie den "Los Santos Legal" Server!', 'info');
    
    // Optional: Copy Discord username to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText('JamesSpader#1337').then(() => {
            setTimeout(() => {
                showNotification('Discord Username wurde in die Zwischenablage kopiert!', 'success');
            }, 1000);
        });
    }
}

// Success Modal Functions
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('show');
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    console.log('Modal geöffnet'); // Debug
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    
    // Re-enable body scrolling
    document.body.style.overflow = 'auto';
    
    console.log('Modal geschlossen'); // Debug
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('successModal');
        if (modal.classList.contains('show')) {
            closeModal();
        }
    }
});

// Success Popup Function
function showSuccessPopup() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'success-popup-overlay';
    
    // Create popup
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.innerHTML = `
        <div class="success-icon">✓</div>
        <h3 class="success-title">Vielen Dank für Ihr Vertrauen!</h3>
        <p class="success-message">
            Ihre Anfrage wurde erfolgreich an die Kanzlei James Spader übermittelt.<br>
            Wir setzen uns in Kürze mit Ihnen in Verbindung.
        </p>
        <button class="success-btn" onclick="closeSuccessPopup()">Verstanden</button>
    `;
    
    // Add to document
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
    // Show with animation
    setTimeout(() => {
        overlay.classList.add('show');
        popup.classList.add('show');
    }, 50);
    
    // Auto close after 8 seconds
    setTimeout(() => {
        closeSuccessPopup();
    }, 8000);
}

function closeSuccessPopup() {
    const overlay = document.querySelector('.success-popup-overlay');
    const popup = document.querySelector('.success-popup');
    
    if (overlay && popup) {
        overlay.classList.remove('show');
        popup.classList.remove('show');
        
        setTimeout(() => {
            if (overlay.parentNode) overlay.remove();
            if (popup.parentNode) popup.remove();
        }, 400);
    }
}

// Online Status System
let currentStatus = 'online';
const ADMIN_PASSWORD = 'JamesSpader2025'; // Ändern Sie dieses Passwort!

function showAdminPanel() {
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('adminPassword').focus();
}

function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminControls').style.display = 'none';
    document.getElementById('adminPassword').value = '';
}

function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminControls').style.display = 'block';
        console.log('✅ Admin erfolgreich eingeloggt');
    } else {
        alert('❌ Falsches Passwort!');
        document.getElementById('adminPassword').value = '';
    }
}

function setStatus(status) {
    currentStatus = status;
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');
    
    switch(status) {
        case 'online':
            statusIcon.className = 'fas fa-circle online-status-icon online';
            statusText.textContent = 'Online - Verfügbar für Beratungen';
            break;
        case 'busy':
            statusIcon.className = 'fas fa-circle online-status-icon busy';
            statusText.textContent = 'Beschäftigt - Begrenzte Verfügbarkeit';
            break;
        case 'offline':
            statusIcon.className = 'fas fa-circle online-status-icon offline';
            statusText.textContent = 'Offline - Nicht verfügbar';
            break;
    }
    
    // Save status to localStorage
    localStorage.setItem('lawyerStatus', currentStatus);
    
    console.log(`✅ Status geändert zu: ${currentStatus}`);
    closeAdminPanel();
}

// Load saved status on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedStatus = localStorage.getItem('lawyerStatus');
    if (savedStatus) {
        currentStatus = savedStatus;
        const statusIcon = document.getElementById('statusIcon');
        const statusText = document.getElementById('statusText');
        
        switch(currentStatus) {
            case 'online':
                statusIcon.className = 'fas fa-circle online-status-icon online';
                statusText.textContent = 'Online - Verfügbar für Beratungen';
                break;
            case 'busy':
                statusIcon.className = 'fas fa-circle online-status-icon busy';
                statusText.textContent = 'Beschäftigt - Begrenzte Verfügbarkeit';
                break;
            case 'offline':
                statusIcon.className = 'fas fa-circle online-status-icon offline';
                statusText.textContent = 'Offline - Nicht verfügbar';
                break;
        }
    } else {
        // Default to online
        document.getElementById('statusIcon').className = 'fas fa-circle online-status-icon online';
    }
    
    // Enter key support for admin password
    document.getElementById('adminPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            adminLogin();
        }
    });
});

// Discount Code System
const validDiscountCodes = {
    'SPADER30': 30,
    'LEGAL2025': 30,
    'ERSTBERATUNG': 30,
    'NEUKUNDE': 30,
    'FREUNDE': 30
};

let appliedDiscount = 0;
let originalPrices = {
    'strafrecht': 250,
    'zivilrecht': 200,
    'wirtschaftsrecht': 320,
    'vertraege': 150
};

function toggleDiscountCode() {
    const discountInput = document.getElementById('discountInput');
    const isVisible = discountInput.style.display !== 'none';
    
    if (isVisible) {
        discountInput.style.display = 'none';
    } else {
        discountInput.style.display = 'block';
        document.getElementById('discount-code').focus();
    }
}

function applyDiscount() {
    const codeInput = document.getElementById('discount-code');
    const resultDiv = document.getElementById('discountResult');
    const code = codeInput.value.toUpperCase().trim();
    
    if (validDiscountCodes[code]) {
        appliedDiscount = validDiscountCodes[code];
        resultDiv.className = 'discount-result discount-success';
        resultDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <strong>Rabatt-Code angewandt!</strong><br>
            Sie erhalten ${appliedDiscount}% Rabatt auf alle Services
        `;
        
        // Update price displays
        updatePriceDisplays();
        
        console.log(`✅ Rabatt-Code ${code} angewandt: ${appliedDiscount}% Rabatt`);
    } else {
        appliedDiscount = 0;
        resultDiv.className = 'discount-result discount-error';
        resultDiv.innerHTML = `
            <i class="fas fa-times-circle"></i>
            <strong>Ungültiger Code</strong><br>
            Bitte überprüfen Sie Ihren Rabatt-Code
        `;
        
        console.log(`❌ Ungültiger Rabatt-Code: ${code}`);
    }
    
    // Clear input after attempt
    setTimeout(() => {
        codeInput.value = '';
    }, 2000);
}

function updatePriceDisplays() {
    const servicePrices = document.querySelectorAll('.price-tag');
    const selectOptions = document.querySelectorAll('#service option');
    
    if (appliedDiscount > 0) {
        // Update service cards
        servicePrices.forEach((priceTag, index) => {
            const services = ['strafrecht', 'zivilrecht', 'wirtschaftsrecht', 'vertraege'];
            const service = services[index];
            if (service && originalPrices[service]) {
                const originalPrice = originalPrices[service];
                const discountedPrice = Math.round(originalPrice * (1 - appliedDiscount / 100));
                const unit = service === 'vertraege' ? '/Dokument' : '/Stunde';
                
                priceTag.innerHTML = `
                    <span class="price-original">$${originalPrice}${unit}</span><br>
                    <span class="price-discounted">$${discountedPrice}${unit}</span>
                `;
            }
        });
        
        // Update select options
        selectOptions.forEach(option => {
            const value = option.value;
            if (value && originalPrices[value]) {
                const originalPrice = originalPrices[value];
                const discountedPrice = Math.round(originalPrice * (1 - appliedDiscount / 100));
                const unit = value === 'vertraege' ? '/Dok.' : '/Std.';
                
                const serviceName = option.textContent.split('(')[0].trim();
                option.textContent = `${serviceName} ($${discountedPrice}${unit} - ${appliedDiscount}% Rabatt!)`;
            }
        });
    } else {
        // Reset to original prices
        servicePrices.forEach((priceTag, index) => {
            const services = ['strafrecht', 'zivilrecht', 'wirtschaftsrecht', 'vertraege'];
            const service = services[index];
            if (service && originalPrices[service]) {
                const originalPrice = originalPrices[service];
                const unit = service === 'vertraege' ? '/Dokument' : '/Stunde';
                priceTag.textContent = `$${originalPrice}${unit}`;
            }
        });
        
        // Reset select options
        const optionTexts = {
            'strafrecht': 'Strafrecht ($250/Std.)',
            'zivilrecht': 'Zivilrecht ($200/Std.)', 
            'wirtschaftsrecht': 'Wirtschaftsrecht ($320/Std.)',
            'vertraege': 'Verträge aufsetzen ($150/Dokument)'
        };
        
        selectOptions.forEach(option => {
            if (option.value && optionTexts[option.value]) {
                option.textContent = optionTexts[option.value];
            }
        });
    }
}

// Add Enter key support for discount code
document.addEventListener('DOMContentLoaded', function() {
    const discountInput = document.getElementById('discount-code');
    if (discountInput) {
        discountInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyDiscount();
            }
        });
    }
});
// Mobile-specific enhancements and PWA features
class MobileEnhancements {
    constructor() {
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.isAndroid = /Android/.test(navigator.userAgent);
        this.deferredPrompt = null;
        
        this.initializeFeatures();
        this.setupEventListeners();
    }

    initializeFeatures() {
        this.setupPWAInstallPrompt();
        this.setupOfflineDetection();
        this.setupHapticFeedback();
        this.setupTouchGestures();
        this.setupPushNotifications();
        this.setupScreenOrientation();
        this.setupStatusBar();
    }

    setupEventListeners() {
        // PWA install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });

        // App installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.hideInstallPrompt();
        });

        // Online/offline detection
        window.addEventListener('online', () => {
            this.hideOfflineIndicator();
        });

        window.addEventListener('offline', () => {
            this.showOfflineIndicator();
        });

        // Orientation change
        window.addEventListener('orientationchange', () => {
            this.handleOrientationChange();
        });

        // Prevent bounce scrolling on iOS
        if (this.isIOS) {
            document.addEventListener('touchmove', (e) => {
                if (e.scale !== 1) {
                    e.preventDefault();
                }
            }, { passive: false });
        }
    }

    setupPWAInstallPrompt() {
        const promptHtml = `
            <div id="pwa-install-prompt" class="pwa-install-prompt">
                <h3>📱 Install RoadSide+</h3>
                <p>Install our app for quick access to emergency assistance</p>
                <div class="pwa-install-actions">
                    <button class="btn-install" onclick="mobileEnhancements.installPWA()">Install</button>
                    <button class="btn-dismiss" onclick="mobileEnhancements.hideInstallPrompt()">Not Now</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', promptHtml);
    }

    setupOfflineDetection() {
        const offlineHtml = `
            <div id="offline-indicator" class="offline-indicator">
                <span>📡 You're offline. Some features may not work.</span>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', offlineHtml);
    }

    setupHapticFeedback() {
        // Add haptic feedback to buttons and interactions
        const buttons = document.querySelectorAll('.btn, .service-card, .nav-item');
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                this.hapticFeedback('light');
            });
        });

        // Emergency button gets stronger haptic feedback
        const emergencyButton = document.querySelector('.emergency-sos');
        if (emergencyButton) {
            emergencyButton.addEventListener('touchstart', () => {
                this.hapticFeedback('medium');
            });
        }
    }

    setupTouchGestures() {
        // Swipe to close modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            let startY = 0;
            let currentY = 0;
            let isDragging = false;

            modal.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY;
                isDragging = true;
            });

            modal.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentY = e.touches[0].clientY;
                const deltaY = currentY - startY;
                
                if (deltaY > 0) {
                    modal.style.transform = `translateY(${deltaY}px)`;
                }
            });

            modal.addEventListener('touchend', () => {
                if (!isDragging) return;
                isDragging = false;
                
                const deltaY = currentY - startY;
                if (deltaY > 100) {
                    modal.style.display = 'none';
                }
                modal.style.transform = '';
            });
        });

        // Pull to refresh
        this.setupPullToRefresh();
    }

    setupPullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let isPulling = false;

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (!isPulling) return;
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            if (deltaY > 50 && window.scrollY === 0) {
                // Show refresh indicator
                this.showRefreshIndicator();
            }
        });

        document.addEventListener('touchend', () => {
            if (!isPulling) return;
            isPulling = false;
            
            const deltaY = currentY - startY;
            if (deltaY > 100 && window.scrollY === 0) {
                this.refreshData();
            }
            this.hideRefreshIndicator();
        });
    }

    setupPushNotifications() {
        if ('Notification' in window && 'serviceWorker' in navigator) {
            // Request permission for notifications
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                    this.subscribeToPushNotifications();
                }
            });
        }
    }

    setupScreenOrientation() {
        // Lock to portrait on mobile for better UX
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('portrait').catch(err => {
                console.log('Screen orientation lock not supported');
            });
        }
    }

    setupStatusBar() {
        // iOS status bar styling
        if (this.isIOS && this.isStandalone) {
            const statusBarMeta = document.createElement('meta');
            statusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
            statusBarMeta.content = 'black-translucent';
            document.head.appendChild(statusBarMeta);
        }
    }

    // PWA Methods
    showInstallPrompt() {
        const prompt = document.getElementById('pwa-install-prompt');
        if (prompt && !this.isStandalone) {
            prompt.style.display = 'block';
        }
    }

    hideInstallPrompt() {
        const prompt = document.getElementById('pwa-install-prompt');
        if (prompt) {
            prompt.style.display = 'none';
        }
    }

    async installPWA() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            
            this.deferredPrompt = null;
            this.hideInstallPrompt();
        }
    }

    // Offline/Online Methods
    showOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.classList.add('show');
        }
    }

    hideOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.classList.remove('show');
        }
    }

    // Haptic Feedback
    hapticFeedback(intensity = 'light') {
        if (navigator.vibrate) {
            const patterns = {
                light: [10],
                medium: [50],
                heavy: [100]
            };
            navigator.vibrate(patterns[intensity] || patterns.light);
        }
    }

    // Touch Gestures
    showRefreshIndicator() {
        // Add visual feedback for pull to refresh
        const indicator = document.createElement('div');
        indicator.id = 'refresh-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: calc(60px + var(--safe-area-inset-top));
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            z-index: 1001;
            font-size: 0.9rem;
        `;
        indicator.textContent = '🔄 Release to refresh';
        document.body.appendChild(indicator);
    }

    hideRefreshIndicator() {
        const indicator = document.getElementById('refresh-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    refreshData() {
        // Simulate data refresh
        console.log('Refreshing data...');
        this.hapticFeedback('medium');
        
        // Show loading state
        const refreshIndicator = document.getElementById('refresh-indicator');
        if (refreshIndicator) {
            refreshIndicator.textContent = '⏳ Refreshing...';
        }
        
        // Simulate API call
        setTimeout(() => {
            console.log('Data refreshed');
            this.hideRefreshIndicator();
            this.showNotification('Data refreshed successfully');
        }, 1000);
    }

    // Push Notifications
    async subscribeToPushNotifications() {
        // Skip push notification subscription if no valid VAPID key is configured
        const vapidKey = 'your-vapid-public-key';
        if (vapidKey === 'your-vapid-public-key') {
            console.log('Push notifications not configured - VAPID key needed');
            return;
        }
        
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array(vapidKey)
                });
                
                console.log('Push subscription created:', subscription);
                // Send subscription to server
            } catch (error) {
                console.error('Failed to subscribe to push notifications:', error);
            }
        }
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Orientation handling
    handleOrientationChange() {
        // Force layout recalculation
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('RoadSide+ Update', {
                body: message,
                icon: '/manifest.json',
                badge: '/manifest.json',
                vibrate: [100, 50, 100]
            });
        }
        
        // Also show in-app notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: calc(80px + var(--safe-area-inset-top));
            left: 1rem;
            right: 1rem;
            background: var(--primary-color);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 1002;
            animation: slideDown 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Device-specific optimizations
    optimizeForDevice() {
        // iOS Safari optimizations
        if (this.isIOS) {
            document.body.classList.add('ios-device');
            
            // Fix viewport issues
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
            }
        }
        
        // Android optimizations
        if (this.isAndroid) {
            document.body.classList.add('android-device');
            
            // Enable hardware acceleration
            document.body.style.transform = 'translateZ(0)';
        }
    }

    // Performance optimizations
    optimizePerformance() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
        
        // Optimize scrolling
        let ticking = false;
        const optimizeScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Scroll optimizations
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', optimizeScroll, { passive: true });
    }
}

// Initialize mobile enhancements
const mobileEnhancements = new MobileEnhancements();
mobileEnhancements.optimizeForDevice();
mobileEnhancements.optimizePerformance();

// Make available globally
window.mobileEnhancements = mobileEnhancements;
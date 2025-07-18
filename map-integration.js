// Live Map Integration for RoadSide+ Application
class MapIntegration {
    constructor() {
        this.maps = {};
        this.markers = {};
        this.directionsService = null;
        this.directionsRenderer = null;
        this.placesService = null;
        this.geocoder = null;
        this.currentLocation = null;
        this.technicianMarkers = [];
        this.isMapReady = false;
        
        // Initialize when Google Maps API is loaded
        window.initMaps = () => this.initialize();
    }

    initialize() {
        if (typeof google === 'undefined') {
            console.error('Google Maps API not loaded');
            return;
        }

        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: false,
            polylineOptions: {
                strokeColor: '#dc2625',
                strokeWeight: 5,
                strokeOpacity: 0.8
            }
        });
        this.geocoder = new google.maps.Geocoder();
        this.isMapReady = true;

        console.log('Google Maps initialized successfully');
        
        // Initialize maps that might already be visible
        this.initializeVisibleMaps();
    }

    initializeVisibleMaps() {
        // Check for visible map containers and initialize them
        const mapContainers = document.querySelectorAll('.map-placeholder, .tracking-display, .technician-map');
        mapContainers.forEach(container => {
            if (container.offsetParent !== null) { // Check if visible
                this.initializeSpecificMap(container);
            }
        });
    }

    initializeSpecificMap(container) {
        if (!this.isMapReady) return;

        const mapId = container.id || 'map-' + Date.now();
        container.id = mapId;

        // Default map configuration
        const mapOptions = {
            zoom: 13,
            center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                }
            ]
        };

        // Create map
        const map = new google.maps.Map(container, mapOptions);
        this.maps[mapId] = map;

        // Get user's current location
        this.getCurrentLocation(map);

        return map;
    }

    // Location Services
    getCurrentLocation(map = null) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    if (map) {
                        map.setCenter(this.currentLocation);
                        this.addMarker(map, this.currentLocation, {
                            title: 'Your Location',
                            icon: {
                                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="8" fill="#4285f4" stroke="white" stroke-width="2"/>
                                        <circle cx="12" cy="12" r="3" fill="white"/>
                                    </svg>
                                `),
                                scaledSize: new google.maps.Size(24, 24),
                                anchor: new google.maps.Point(12, 12)
                            }
                        });
                    }

                    console.log('Current location acquired:', this.currentLocation);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    this.showLocationError();
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
            );
        } else {
            console.error('Geolocation not supported');
            this.showLocationError();
        }
    }

    // Booking Location Map
    initializeBookingLocationMap() {
        const mapContainer = document.getElementById('location-map');
        if (!mapContainer || !this.isMapReady) return;

        const map = this.initializeSpecificMap(mapContainer);
        
        // Add click listener for location selection
        google.maps.event.addListener(map, 'click', (event) => {
            this.selectLocation(map, event.latLng);
        });

        // Add places autocomplete
        const addressInput = document.getElementById('service-address');
        if (addressInput) {
            const autocomplete = new google.maps.places.Autocomplete(addressInput);
            autocomplete.bindTo('bounds', map);
            
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.geometry) {
                    map.setCenter(place.geometry.location);
                    map.setZoom(15);
                    this.selectLocation(map, place.geometry.location);
                }
            });
        }

        return map;
    }

    selectLocation(map, location) {
        // Clear existing markers
        if (this.markers[map]) {
            this.markers[map].forEach(marker => marker.setMap(null));
        }
        this.markers[map] = [];

        // Add new marker
        const marker = this.addMarker(map, location, {
            title: 'Service Location',
            draggable: true,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#dc2625"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 32)
            }
        });

        this.markers[map] = [marker];

        // Update address display
        this.reverseGeocode(location);

        // Add drag listener
        google.maps.event.addListener(marker, 'dragend', (event) => {
            this.reverseGeocode(event.latLng);
        });
    }

    // Technician Tracking Map
    initializeTechnicianTrackingMap() {
        const mapContainer = document.querySelector('.tracking-display .route-map');
        if (!mapContainer || !this.isMapReady) return;

        // Clear placeholder content
        mapContainer.innerHTML = '';
        mapContainer.classList.add('live-map');

        const map = this.initializeSpecificMap(mapContainer);
        
        // Start real-time tracking simulation
        this.startTechnicianTracking(map);

        return map;
    }

    startTechnicianTracking(map) {
        // Simulate technician location
        const technicianLocation = {
            lat: this.currentLocation ? this.currentLocation.lat + 0.01 : 40.7228,
            lng: this.currentLocation ? this.currentLocation.lng + 0.01 : -74.0160
        };

        const customerLocation = this.currentLocation || { lat: 40.7128, lng: -74.0060 };

        // Add technician marker
        const technicianMarker = this.addMarker(map, technicianLocation, {
            title: 'Technician - Mike Rodriguez',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 7h-3V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1H5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zM10 6h4v1h-4V6zm8 13H6V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z" fill="#dc2625"/>
                        <circle cx="12" cy="16" r="2" fill="white"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 32)
            }
        });

        // Add customer marker
        const customerMarker = this.addMarker(map, customerLocation, {
            title: 'Your Location',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="8" fill="#10b981" stroke="white" stroke-width="2"/>
                        <circle cx="12" cy="12" r="3" fill="white"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(28, 28),
                anchor: new google.maps.Point(14, 14)
            }
        });

        // Show route
        this.showRoute(technicianLocation, customerLocation, map);

        // Simulate movement
        this.simulateTechnicianMovement(technicianMarker, customerLocation, map);
    }

    showRoute(origin, destination, map) {
        const request = {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidHighways: false,
            avoidTolls: false
        };

        this.directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                this.directionsRenderer.setMap(map);
                this.directionsRenderer.setDirections(result);

                // Update ETA
                const route = result.routes[0];
                const leg = route.legs[0];
                const eta = leg.duration.text;
                
                const etaElement = document.getElementById('eta-time');
                if (etaElement) {
                    etaElement.textContent = eta;
                }

                // Show route details
                this.updateRouteInfo(leg);
            } else {
                console.error('Directions request failed:', status);
            }
        });
    }

    simulateTechnicianMovement(marker, destination, map) {
        let step = 0;
        const totalSteps = 20;
        const startPosition = marker.getPosition();

        const moveInterval = setInterval(() => {
            step++;
            const progress = step / totalSteps;
            
            // Interpolate position
            const lat = startPosition.lat() + (destination.lat - startPosition.lat()) * progress;
            const lng = startPosition.lng() + (destination.lng - startPosition.lng()) * progress;
            
            const newPosition = new google.maps.LatLng(lat, lng);
            marker.setPosition(newPosition);

            // Update ETA
            const remainingTime = Math.max(1, Math.round(15 * (1 - progress)));
            const etaElement = document.getElementById('eta-time');
            if (etaElement) {
                etaElement.textContent = `${remainingTime} minutes`;
            }

            if (step >= totalSteps) {
                clearInterval(moveInterval);
                // Technician arrived
                if (etaElement) {
                    etaElement.textContent = 'Arriving now';
                    etaElement.parentElement.classList.add('arriving-now');
                }
            }
        }, 2000); // Move every 2 seconds
    }

    // Admin Dashboard Map
    initializeAdminTechnicianMap() {
        const mapContainer = document.querySelector('.technician-map .live-map');
        if (!mapContainer || !this.isMapReady) return;

        const map = this.initializeSpecificMap(mapContainer);
        
        // Add multiple technician markers
        this.addTechnicianMarkers(map);

        return map;
    }

    addTechnicianMarkers(map) {
        const technicians = [
            { id: 'tech1', name: 'Mike Rodriguez', lat: 40.7328, lng: -73.9960, status: 'available' },
            { id: 'tech2', name: 'Sarah Lee', lat: 40.7228, lng: -74.0160, status: 'busy' },
            { id: 'tech3', name: 'Carlos Martinez', lat: 40.7428, lng: -73.9860, status: 'available' },
            { id: 'tech4', name: 'David Kim', lat: 40.7128, lng: -74.0260, status: 'busy' },
            { id: 'tech5', name: 'Emma Wilson', lat: 40.7528, lng: -73.9760, status: 'offline' }
        ];

        technicians.forEach(tech => {
            const statusColors = {
                available: '#10b981',
                busy: '#dc2625',
                offline: '#6b7280'
            };

            const marker = this.addMarker(map, { lat: tech.lat, lng: tech.lng }, {
                title: `${tech.name} - ${tech.status}`,
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" fill="${statusColors[tech.status]}" stroke="white" stroke-width="2"/>
                            <path d="M8 12h8M12 8v8" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    `),
                    scaledSize: new google.maps.Size(24, 24),
                    anchor: new google.maps.Point(12, 12)
                }
            });

            // Add click listener for technician details
            google.maps.event.addListener(marker, 'click', () => {
                this.showTechnicianInfo(tech);
            });

            this.technicianMarkers.push(marker);
        });
    }

    // Utility Methods
    addMarker(map, position, options = {}) {
        const marker = new google.maps.Marker({
            position: position,
            map: map,
            ...options
        });

        return marker;
    }

    reverseGeocode(location) {
        this.geocoder.geocode({ location: location }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const address = results[0].formatted_address;
                const addressDisplay = document.getElementById('detected-address');
                const addressInput = document.getElementById('service-address');
                
                if (addressDisplay) {
                    addressDisplay.textContent = address;
                }
                if (addressInput) {
                    addressInput.value = address;
                }
            }
        });
    }

    updateRouteInfo(leg) {
        const routeInfo = document.querySelector('.tracking-info');
        if (routeInfo) {
            routeInfo.innerHTML = `
                <p>🛣️ Distance: ${leg.distance.text}</p>
                <p>⏱️ Duration: ${leg.duration.text}</p>
                <p>🚦 ${leg.duration_in_traffic ? 'Current traffic conditions' : 'Normal traffic'}</p>
            `;
        }
    }

    showTechnicianInfo(technician) {
        alert(`Technician: ${technician.name}\nStatus: ${technician.status}\nLocation: ${technician.lat}, ${technician.lng}`);
    }

    showLocationError() {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'location-error';
        errorMessage.innerHTML = `
            <p>⚠️ Location access required for optimal service</p>
            <button onclick="mapIntegration.getCurrentLocation()">Retry</button>
        `;
        
        const mapContainer = document.getElementById('location-map');
        if (mapContainer) {
            mapContainer.appendChild(errorMessage);
        }
    }

    // Public methods for integration with existing code
    centerMap(mapId = null) {
        const map = mapId ? this.maps[mapId] : Object.values(this.maps)[0];
        if (map && this.currentLocation) {
            map.setCenter(this.currentLocation);
            map.setZoom(15);
        }
    }

    adjustLocation() {
        // Allow user to manually adjust location
        alert('Click on the map to select your exact location');
    }

    refreshTracking() {
        // Refresh technician tracking
        const trackingMap = Object.values(this.maps).find(map => 
            map.getDiv().closest('.tracking-display')
        );
        if (trackingMap) {
            this.startTechnicianTracking(trackingMap);
        }
    }
}

// Initialize map integration
const mapIntegration = new MapIntegration();

// Expose to global scope for existing code
window.mapIntegration = mapIntegration;

// Integration with existing booking workflow
const originalCreateBookingInterface = window.bookingWorkflow?.createBookingInterface;
if (originalCreateBookingInterface) {
    window.bookingWorkflow.createBookingInterface = function(...args) {
        const result = originalCreateBookingInterface.apply(this, args);
        
        // Initialize maps after a short delay to ensure DOM is ready
        setTimeout(() => {
            mapIntegration.initializeBookingLocationMap();
        }, 500);
        
        return result;
    };
}

// Integration with tracking modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        
        if (modalId === 'tracking-modal') {
            setTimeout(() => {
                mapIntegration.initializeTechnicianTrackingMap();
            }, 300);
        }
    }
}

// Make showModal available globally
window.showModal = showModal;
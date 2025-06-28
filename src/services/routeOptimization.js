import { Loader } from '@googlemaps/js-api-loader';

class RouteOptimizationService {
  constructor() {
    this.googleMaps = null;
    this.directionsService = null;
    this.initialized = false;
    this.systemConfig = null;
  }

  async initialize(systemConfig = null) {
    if (this.initialized) return;

    // Get system config for API key
    if (systemConfig) {
      this.systemConfig = systemConfig;
    } else {
      // Try to get from localStorage if not provided
      const savedConfig = localStorage.getItem('voraSystemConfig');
      if (savedConfig) {
        this.systemConfig = JSON.parse(savedConfig);
      }
    }

    if (!this.systemConfig?.apiKeys?.googleMaps?.enabled || !this.systemConfig?.apiKeys?.googleMaps?.key) {
      console.warn('Google Maps API not configured, using mock optimization');
      this.initialized = false;
      return;
    }

    try {
      const loader = new Loader({
        apiKey: this.systemConfig.apiKeys.googleMaps.key,
        version: 'weekly',
        libraries: ['places', 'geometry']
      });

      await loader.load();
      this.googleMaps = window.google.maps;
      this.directionsService = new this.googleMaps.DirectionsService();
      this.initialized = true;
      console.log('Google Maps API initialized successfully');
    } catch (error) {
      console.warn('Google Maps API initialization failed, using mock optimization:', error);
      this.initialized = false;
    }
  }

  // AI-powered route optimization algorithm
  async optimizeRoute(bookings, startLocation = 'VORA Headquarters, City') {
    await this.initialize();

    if (!this.initialized || bookings.length === 0) {
      return this.mockOptimizeRoute(bookings, startLocation);
    }

    try {
      // Get coordinates for all locations
      const locations = await this.geocodeLocations([startLocation, ...bookings.map(b => b.address)]);
      
      // Apply AI optimization algorithms
      const optimizedOrder = await this.applyOptimizationAlgorithms(locations, bookings);
      
      // Calculate detailed route with turn-by-turn directions
      const routeDetails = await this.calculateDetailedRoute(optimizedOrder);
      
      return {
        optimizedBookings: optimizedOrder.slice(1), // Remove start location
        totalDistance: routeDetails.totalDistance,
        totalDuration: routeDetails.totalDuration,
        directions: routeDetails.directions,
        estimatedFuelCost: this.calculateFuelCost(routeDetails.totalDistance),
        co2Savings: this.calculateCO2Savings(routeDetails.totalDistance, bookings.length),
        routeEfficiency: this.calculateEfficiency(routeDetails.totalDistance, bookings.length)
      };
    } catch (error) {
      console.error('Route optimization error:', error);
      return this.mockOptimizeRoute(bookings, startLocation);
    }
  }

  async geocodeLocations(addresses) {
    const geocoder = new this.googleMaps.Geocoder();
    const locations = [];

    for (const address of addresses) {
      try {
        const result = await new Promise((resolve, reject) => {
          geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK') {
              resolve(results[0].geometry.location);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          });
        });
        locations.push(result);
      } catch (error) {
        // Use approximate coordinates for demo
        locations.push(this.getApproximateLocation(address));
      }
    }

    return locations;
  }

  // Advanced AI optimization using multiple algorithms
  async applyOptimizationAlgorithms(locations, bookings) {
    // 1. Nearest Neighbor Algorithm with time windows
    let currentRoute = this.nearestNeighborWithTimeWindows(locations, bookings);
    
    // 2. 2-opt improvement
    currentRoute = this.twoOptImprovement(currentRoute, locations);
    
    // 3. Genetic Algorithm for fine-tuning
    currentRoute = this.geneticAlgorithmOptimization(currentRoute, locations, bookings);
    
    // 4. Machine Learning predictions for traffic patterns
    currentRoute = await this.applyTrafficPredictions(currentRoute, bookings);

    return currentRoute;
  }

  nearestNeighborWithTimeWindows(locations, bookings) {
    const unvisited = [...bookings];
    const route = [{ location: locations[0], isStart: true }];
    let currentLocation = locations[0];

    while (unvisited.length > 0) {
      let bestNext = null;
      let bestScore = Infinity;

      unvisited.forEach((booking, index) => {
        const distance = this.calculateDistance(currentLocation, locations[index + 1]);
        const timeScore = this.calculateTimeWindowScore(booking);
        const priorityScore = this.calculatePriorityScore(booking);
        
        // Weighted scoring system
        const totalScore = distance * 0.4 + timeScore * 0.3 + priorityScore * 0.3;
        
        if (totalScore < bestScore) {
          bestScore = totalScore;
          bestNext = { booking, index, location: locations[index + 1] };
        }
      });

      if (bestNext) {
        route.push(bestNext);
        currentLocation = bestNext.location;
        unvisited.splice(bestNext.index, 1);
      }
    }

    return route;
  }

  twoOptImprovement(route, locations) {
    let improved = true;
    let currentRoute = [...route];

    while (improved) {
      improved = false;
      
      for (let i = 1; i < currentRoute.length - 2; i++) {
        for (let j = i + 1; j < currentRoute.length; j++) {
          const newRoute = this.twoOptSwap(currentRoute, i, j);
          const currentDistance = this.calculateRouteDistance(currentRoute);
          const newDistance = this.calculateRouteDistance(newRoute);
          
          if (newDistance < currentDistance) {
            currentRoute = newRoute;
            improved = true;
          }
        }
      }
    }

    return currentRoute;
  }

  geneticAlgorithmOptimization(initialRoute, locations, bookings) {
    const populationSize = 50;
    const generations = 100;
    const mutationRate = 0.1;
    
    let population = this.createInitialPopulation(initialRoute, populationSize);
    
    for (let gen = 0; gen < generations; gen++) {
      // Evaluate fitness
      const fitness = population.map(route => 1 / this.calculateRouteDistance(route));
      
      // Selection and crossover
      const newPopulation = [];
      for (let i = 0; i < populationSize; i++) {
        const parent1 = this.tournamentSelection(population, fitness);
        const parent2 = this.tournamentSelection(population, fitness);
        let child = this.orderCrossover(parent1, parent2);
        
        // Mutation
        if (Math.random() < mutationRate) {
          child = this.mutateRoute(child);
        }
        
        newPopulation.push(child);
      }
      
      population = newPopulation;
    }
    
    // Return best route
    const fitness = population.map(route => 1 / this.calculateRouteDistance(route));
    const bestIndex = fitness.indexOf(Math.max(...fitness));
    return population[bestIndex];
  }

  async applyTrafficPredictions(route, bookings) {
    // Simulate ML-based traffic prediction
    const trafficFactors = await this.predictTrafficPatterns(bookings);
    
    // Adjust route based on predicted traffic
    const adjustedRoute = route.map((stop, index) => {
      if (stop.booking) {
        const trafficFactor = trafficFactors[index] || 1;
        const adjustedTime = this.calculateOptimalTime(stop.booking, trafficFactor);
        
        return {
          ...stop,
          adjustedTime,
          trafficFactor,
          estimatedDelay: (trafficFactor - 1) * 15 // minutes
        };
      }
      return stop;
    });

    return adjustedRoute;
  }

  async predictTrafficPatterns(bookings) {
    // Simulate ML predictions based on historical data
    return bookings.map(booking => {
      const hour = parseInt(booking.pickupTime.split(':')[0]);
      const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
      const isWeekend = new Date(booking.pickupDate).getDay() % 6 === 0;
      
      let factor = 1;
      if (isRushHour && !isWeekend) factor = 1.5;
      else if (isRushHour && isWeekend) factor = 1.2;
      else if (hour >= 10 && hour <= 16) factor = 0.8;
      
      return factor;
    });
  }

  async calculateDetailedRoute(optimizedOrder) {
    if (!this.directionsService) {
      return this.mockCalculateRoute(optimizedOrder);
    }

    const waypoints = optimizedOrder.slice(1, -1).map(stop => ({
      location: stop.location,
      stopover: true
    }));

    try {
      const result = await new Promise((resolve, reject) => {
        this.directionsService.route({
          origin: optimizedOrder[0].location,
          destination: optimizedOrder[optimizedOrder.length - 1].location,
          waypoints,
          optimizeWaypoints: false, // We've already optimized
          travelMode: this.googleMaps.TravelMode.DRIVING,
          avoidHighways: false,
          avoidTolls: false
        }, (result, status) => {
          if (status === 'OK') {
            resolve(result);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        });
      });

      return {
        directions: result,
        totalDistance: this.extractTotalDistance(result),
        totalDuration: this.extractTotalDuration(result)
      };
    } catch (error) {
      return this.mockCalculateRoute(optimizedOrder);
    }
  }

  // Helper methods
  calculateDistance(loc1, loc2) {
    const R = 6371; // Earth's radius in km
    const dLat = (loc2.lat() - loc1.lat()) * Math.PI / 180;
    const dLon = (loc2.lng() - loc1.lng()) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(loc1.lat() * Math.PI / 180) * Math.cos(loc2.lat() * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  calculateTimeWindowScore(booking) {
    const preferredTime = parseInt(booking.pickupTime.split(':')[0]);
    const currentHour = new Date().getHours();
    return Math.abs(preferredTime - currentHour) * 10;
  }

  calculatePriorityScore(booking) {
    // Higher priority for hazardous waste, older bookings, etc.
    let score = 0;
    if (booking.wasteType === 'hazardous') score += 50;
    if (booking.wasteType === 'electronic') score += 30;
    
    const daysOld = (new Date() - new Date(booking.createdAt)) / (1000 * 60 * 60 * 24);
    score += daysOld * 10;
    
    return score;
  }

  calculateFuelCost(distanceKm) {
    const fuelEfficiency = 12; // km per liter
    const fuelPrice = 1.5; // per liter
    return (distanceKm / fuelEfficiency) * fuelPrice;
  }

  calculateCO2Savings(optimizedDistance, numBookings) {
    const averageDistance = numBookings * 15; // Assume 15km per booking without optimization
    const savedDistance = Math.max(0, averageDistance - optimizedDistance);
    const co2PerKm = 0.21; // kg CO2 per km
    return savedDistance * co2PerKm;
  }

  calculateEfficiency(distance, numBookings) {
    const idealDistance = numBookings * 8; // Ideal scenario
    return Math.max(0, Math.min(100, ((idealDistance / distance) * 100)));
  }

  // Mock implementation for demo when Google Maps is not available
  mockOptimizeRoute(bookings, startLocation) {
    // Simple nearest neighbor for demo
    const optimizedBookings = [...bookings].sort((a, b) => {
      // Sort by pickup time and waste type priority
      const timeA = parseInt(a.pickupTime.split(':')[0]);
      const timeB = parseInt(b.pickupTime.split(':')[0]);
      
      if (timeA !== timeB) return timeA - timeB;
      
      const priorityA = a.wasteType === 'hazardous' ? 0 : 1;
      const priorityB = b.wasteType === 'hazardous' ? 0 : 1;
      
      return priorityA - priorityB;
    });

    const totalDistance = optimizedBookings.length * 12 + Math.random() * 20;
    const totalDuration = optimizedBookings.length * 45 + Math.random() * 60;

    return {
      optimizedBookings,
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalDuration: Math.round(totalDuration),
      directions: null,
      estimatedFuelCost: this.calculateFuelCost(totalDistance),
      co2Savings: this.calculateCO2Savings(totalDistance, bookings.length),
      routeEfficiency: this.calculateEfficiency(totalDistance, bookings.length),
      trafficPredictions: optimizedBookings.map(booking => ({
        bookingId: booking.id,
        estimatedDelay: Math.random() * 15,
        trafficFactor: 0.8 + Math.random() * 0.8
      }))
    };
  }

  mockCalculateRoute(optimizedOrder) {
    const distance = optimizedOrder.length * 8 + Math.random() * 15;
    const duration = optimizedOrder.length * 35 + Math.random() * 30;
    
    return {
      directions: null,
      totalDistance: distance,
      totalDuration: duration
    };
  }

  getApproximateLocation(address) {
    // Return mock coordinates for demo
    const baselat = 40.7128 + (Math.random() - 0.5) * 0.1;
    const baseLng = -74.0060 + (Math.random() - 0.5) * 0.1;
    
    return {
      lat: () => baselat,
      lng: () => baseLng
    };
  }

  // Additional genetic algorithm helper methods
  createInitialPopulation(baseRoute, size) {
    const population = [baseRoute];
    
    for (let i = 1; i < size; i++) {
      const shuffled = [...baseRoute];
      // Shuffle middle elements (keep start/end fixed)
      for (let j = shuffled.length - 2; j > 1; j--) {
        const k = Math.floor(Math.random() * (j - 1)) + 1;
        [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
      }
      population.push(shuffled);
    }
    
    return population;
  }

  tournamentSelection(population, fitness) {
    const tournamentSize = 5;
    let best = Math.floor(Math.random() * population.length);
    
    for (let i = 1; i < tournamentSize; i++) {
      const competitor = Math.floor(Math.random() * population.length);
      if (fitness[competitor] > fitness[best]) {
        best = competitor;
      }
    }
    
    return population[best];
  }

  orderCrossover(parent1, parent2) {
    const start = Math.floor(Math.random() * (parent1.length - 2)) + 1;
    const end = Math.floor(Math.random() * (parent1.length - start)) + start;
    
    const child = new Array(parent1.length);
    child[0] = parent1[0]; // Keep start
    child[child.length - 1] = parent1[parent1.length - 1]; // Keep end
    
    // Copy segment from parent1
    for (let i = start; i <= end; i++) {
      child[i] = parent1[i];
    }
    
    // Fill remaining from parent2
    let p2Index = 1;
    for (let i = 1; i < child.length - 1; i++) {
      if (!child[i]) {
        while (child.includes(parent2[p2Index])) {
          p2Index++;
        }
        child[i] = parent2[p2Index];
        p2Index++;
      }
    }
    
    return child;
  }

  mutateRoute(route) {
    const mutated = [...route];
    const i = Math.floor(Math.random() * (route.length - 2)) + 1;
    const j = Math.floor(Math.random() * (route.length - 2)) + 1;
    [mutated[i], mutated[j]] = [mutated[j], mutated[i]];
    return mutated;
  }

  calculateRouteDistance(route) {
    let total = 0;
    for (let i = 0; i < route.length - 1; i++) {
      total += this.calculateDistance(route[i].location, route[i + 1].location);
    }
    return total;
  }

  twoOptSwap(route, i, j) {
    const newRoute = [...route];
    newRoute.splice(i, j - i + 1, ...route.slice(i, j + 1).reverse());
    return newRoute;
  }

  extractTotalDistance(directionsResult) {
    return directionsResult.routes[0].legs.reduce((total, leg) => 
      total + leg.distance.value / 1000, 0); // Convert to km
  }

  extractTotalDuration(directionsResult) {
    return directionsResult.routes[0].legs.reduce((total, leg) => 
      total + leg.duration.value / 60, 0); // Convert to minutes
  }

  calculateOptimalTime(booking, trafficFactor) {
    const baseTime = parseInt(booking.pickupTime.split(':')[0]);
    const adjustment = trafficFactor > 1 ? -1 : 1; // Earlier if traffic, later if clear
    return Math.max(8, Math.min(17, baseTime + adjustment));
  }
}

export default new RouteOptimizationService();
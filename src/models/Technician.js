import supabase from '../config/database.js';

export class Technician {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.employeeId = data.employee_id;
    this.specializations = data.specializations;
    this.certificationLevel = data.certification_level;
    this.hourlyRate = data.hourly_rate;
    this.serviceRadiusKm = data.service_radius_km;
    this.isAvailable = data.is_available;
    this.isOnDuty = data.is_on_duty;
    this.currentLatitude = data.current_latitude;
    this.currentLongitude = data.current_longitude;
    this.lastLocationUpdate = data.last_location_update;
    this.rating = data.rating;
    this.totalJobs = data.total_jobs;
    this.completedJobs = data.completed_jobs;
    this.phone = data.phone;
    this.vehicleInfo = data.vehicle_info;
    this.emergencyCertified = data.emergency_certified;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  /**
   * Create a new technician profile
   */
  static async create(technicianData, userId) {
    const {
      employeeId,
      specializations = [],
      certificationLevel = 'basic',
      hourlyRate,
      serviceRadiusKm = 25,
      phone,
      vehicleInfo = {},
      emergencyCertified = false
    } = technicianData;

    const { data, error } = await supabase
      .from('technicians')
      .insert([
        {
          user_id: userId,
          employee_id: employeeId,
          specializations,
          certification_level: certificationLevel,
          hourly_rate: hourlyRate,
          service_radius_km: serviceRadiusKm,
          phone,
          vehicle_info: vehicleInfo,
          emergency_certified: emergencyCertified,
          is_available: false,
          is_on_duty: false
        }
      ])
      .select(`
        *,
        user:users(*)
      `)
      .single();

    if (error) throw error;
    return new Technician(data);
  }

  /**
   * Find technician by user ID
   */
  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('technicians')
      .select(`
        *,
        user:users(*),
        service_areas:service_areas(*)
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return new Technician(data);
  }

  /**
   * Find technician by ID
   */
  static async findById(id) {
    const { data, error } = await supabase
      .from('technicians')
      .select(`
        *,
        user:users(*),
        service_areas:service_areas(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return new Technician(data);
  }

  /**
   * Get all technicians with filters
   */
  static async findWithFilters(options = {}) {
    const {
      page = 1,
      limit = 10,
      isAvailable,
      isOnDuty,
      certificationLevel,
      specialization,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options;

    let query = supabase
      .from('technicians')
      .select(`
        *,
        user:users(*),
        current_bookings:bookings!technician_id(count)
      `, { count: 'exact' });

    // Apply filters
    if (isAvailable !== undefined) query = query.eq('is_available', isAvailable);
    if (isOnDuty !== undefined) query = query.eq('is_on_duty', isOnDuty);
    if (certificationLevel) query = query.eq('certification_level', certificationLevel);
    if (specialization) query = query.contains('specializations', [specialization]);

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      technicians: data.map(tech => new Technician(tech)),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Find nearby available technicians
   */
  static async findNearby(latitude, longitude, maxDistanceKm = 50, serviceTypeId = null) {
    // This would use a PostGIS function in a real implementation
    const { data, error } = await supabase
      .rpc('get_nearby_technicians', {
        service_lat: latitude,
        service_lng: longitude,
        max_distance_km: maxDistanceKm
      });

    if (error) throw error;
    return data.map(tech => new Technician(tech));
  }

  /**
   * Update technician location
   */
  async updateLocation(latitude, longitude, accuracy = null, heading = null, speed = null) {
    // Update current location in technicians table
    const { data, error } = await supabase
      .from('technicians')
      .update({
        current_latitude: latitude,
        current_longitude: longitude,
        last_location_update: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;

    // Insert location history record
    await supabase
      .from('technician_locations')
      .insert({
        technician_id: this.id,
        latitude,
        longitude,
        accuracy,
        heading,
        speed
      });

    Object.assign(this, new Technician(data));
    return this;
  }

  /**
   * Update availability status
   */
  async updateAvailability(isAvailable, isOnDuty = null) {
    const updateData = {
      is_available: isAvailable,
      updated_at: new Date().toISOString()
    };

    if (isOnDuty !== null) {
      updateData.is_on_duty = isOnDuty;
    }

    const { data, error } = await supabase
      .from('technicians')
      .update(updateData)
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;

    Object.assign(this, new Technician(data));
    return this;
  }

  /**
   * Get technician's current bookings
   */
  async getCurrentBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        service_type:service_types(*),
        customer:users(*)
      `)
      .eq('technician_id', this.id)
      .in('status', ['technician_assigned', 'technician_en_route', 'in_progress'])
      .order('scheduled_start', { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Get technician performance stats
   */
  async getPerformanceStats(dateFrom, dateTo) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        status,
        created_at,
        actual_start,
        actual_completion,
        customer_rating,
        final_price
      `)
      .eq('technician_id', this.id)
      .gte('created_at', dateFrom)
      .lte('created_at', dateTo);

    if (error) throw error;

    const stats = {
      totalJobs: data.length,
      completedJobs: data.filter(b => b.status === 'completed').length,
      totalRevenue: data.reduce((sum, booking) => sum + (parseFloat(booking.final_price) || 0), 0),
      averageRating: 0,
      averageResponseTime: 0,
      averageCompletionTime: 0
    };

    // Calculate averages
    const ratedJobs = data.filter(b => b.customer_rating);
    if (ratedJobs.length > 0) {
      stats.averageRating = ratedJobs.reduce((sum, b) => sum + b.customer_rating, 0) / ratedJobs.length;
    }

    const jobsWithTiming = data.filter(b => b.actual_start && b.created_at);
    if (jobsWithTiming.length > 0) {
      const totalResponseTime = jobsWithTiming.reduce((sum, booking) => {
        const start = new Date(booking.created_at);
        const response = new Date(booking.actual_start);
        return sum + (response - start);
      }, 0);
      stats.averageResponseTime = Math.round(totalResponseTime / jobsWithTiming.length / (1000 * 60)); // minutes
    }

    const completedJobs = data.filter(b => b.actual_completion && b.actual_start);
    if (completedJobs.length > 0) {
      const totalCompletionTime = completedJobs.reduce((sum, booking) => {
        const start = new Date(booking.actual_start);
        const end = new Date(booking.actual_completion);
        return sum + (end - start);
      }, 0);
      stats.averageCompletionTime = Math.round(totalCompletionTime / completedJobs.length / (1000 * 60)); // minutes
    }

    return stats;
  }

  /**
   * Accept booking assignment
   */
  async acceptBooking(bookingId, estimatedArrival) {
    // Update assignment
    const { error: assignmentError } = await supabase
      .from('technician_assignments')
      .update({
        response: 'accepted',
        responded_at: new Date().toISOString(),
        estimated_arrival: estimatedArrival
      })
      .eq('booking_id', bookingId)
      .eq('technician_id', this.id);

    if (assignmentError) throw assignmentError;

    // Update booking status
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({
        status: 'technician_assigned',
        technician_id: this.id
      })
      .eq('id', bookingId);

    if (bookingError) throw bookingError;

    return true;
  }

  /**
   * Decline booking assignment
   */
  async declineBooking(bookingId, reason) {
    const { error } = await supabase
      .from('technician_assignments')
      .update({
        response: 'declined',
        responded_at: new Date().toISOString(),
        decline_reason: reason
      })
      .eq('booking_id', bookingId)
      .eq('technician_id', this.id);

    if (error) throw error;
    return true;
  }

  /**
   * Update technician profile
   */
  async update(updateData) {
    const { data, error } = await supabase
      .from('technicians')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;

    Object.assign(this, new Technician(data));
    return this;
  }

  /**
   * Get JSON representation
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      employeeId: this.employeeId,
      specializations: this.specializations,
      certificationLevel: this.certificationLevel,
      hourlyRate: this.hourlyRate,
      serviceRadiusKm: this.serviceRadiusKm,
      isAvailable: this.isAvailable,
      isOnDuty: this.isOnDuty,
      currentLatitude: this.currentLatitude,
      currentLongitude: this.currentLongitude,
      lastLocationUpdate: this.lastLocationUpdate,
      rating: this.rating,
      totalJobs: this.totalJobs,
      completedJobs: this.completedJobs,
      phone: this.phone,
      vehicleInfo: this.vehicleInfo,
      emergencyCertified: this.emergencyCertified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
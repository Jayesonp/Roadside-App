import supabase from '../config/database.js';

export class Booking {
  constructor(data) {
    this.id = data.id;
    this.customerId = data.customer_id;
    this.serviceTypeId = data.service_type_id;
    this.technicianId = data.technician_id;
    this.customerName = data.customer_name;
    this.customerPhone = data.customer_phone;
    this.customerEmail = data.customer_email;
    this.serviceAddress = data.service_address;
    this.serviceLatitude = data.service_latitude;
    this.serviceLongitude = data.service_longitude;
    this.preferredDate = data.preferred_date;
    this.description = data.description;
    this.specialRequirements = data.special_requirements;
    this.quotedPrice = data.quoted_price;
    this.finalPrice = data.final_price;
    this.partsCost = data.parts_cost;
    this.status = data.status;
    this.priority = data.priority;
    this.scheduledStart = data.scheduled_start;
    this.actualStart = data.actual_start;
    this.estimatedCompletion = data.estimated_completion;
    this.actualCompletion = data.actual_completion;
    this.photos = data.photos;
    this.internalNotes = data.internal_notes;
    this.customerRating = data.customer_rating;
    this.customerFeedback = data.customer_feedback;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  /**
   * Create a new booking
   */
  static async create(bookingData, customerId) {
    const {
      serviceTypeId,
      customerName,
      customerPhone,
      customerEmail,
      serviceAddress,
      serviceLatitude,
      serviceLongitude,
      preferredDate,
      description,
      specialRequirements,
      priority = 'normal'
    } = bookingData;

    // Get service type for pricing
    const { data: serviceType, error: serviceError } = await supabase
      .from('service_types')
      .select('base_price')
      .eq('id', serviceTypeId)
      .single();

    if (serviceError) throw serviceError;

    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          customer_id: customerId,
          service_type_id: serviceTypeId,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          service_address: serviceAddress,
          service_latitude: serviceLatitude,
          service_longitude: serviceLongitude,
          preferred_date: preferredDate,
          description,
          special_requirements: specialRequirements,
          quoted_price: serviceType.base_price,
          priority,
          status: 'pending'
        }
      ])
      .select(`
        *,
        service_type:service_types(*),
        customer:users(*),
        technician:technicians(*)
      `)
      .single();

    if (error) throw error;
    return new Booking(data);
  }

  /**
   * Find booking by ID
   */
  static async findById(id, userId = null) {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        service_type:service_types(*),
        customer:users(*),
        technician:technicians(*),
        status_history:booking_status_history(*),
        assignments:technician_assignments(*)
      `)
      .eq('id', id);

    if (userId) {
      query = query.or(`customer_id.eq.${userId},technician_id.in.(select id from technicians where user_id=${userId})`);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return new Booking(data);
  }

  /**
   * Find bookings with filters and pagination
   */
  static async findWithFilters(options = {}) {
    const {
      userId,
      userRole = 'user',
      page = 1,
      limit = 10,
      status,
      priority,
      dateFrom,
      dateTo,
      technicianId,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options;

    let query = supabase
      .from('bookings')
      .select(`
        *,
        service_type:service_types(*),
        customer:users(*),
        technician:technicians(*)
      `, { count: 'exact' });

    // Apply user-based filters
    if (userRole === 'user') {
      query = query.eq('customer_id', userId);
    } else if (userRole === 'technician') {
      query = query.in('technician_id', supabase
        .from('technicians')
        .select('id')
        .eq('user_id', userId)
      );
    }
    // Admin can see all bookings

    // Apply filters
    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (technicianId) query = query.eq('technician_id', technicianId);
    if (dateFrom) query = query.gte('preferred_date', dateFrom);
    if (dateTo) query = query.lte('preferred_date', dateTo);

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      bookings: data.map(booking => new Booking(booking)),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Update booking status
   */
  async updateStatus(newStatus, userId = null) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;

    // Update instance
    Object.assign(this, new Booking(data));
    return this;
  }

  /**
   * Assign technician to booking
   */
  async assignTechnician(technicianId, estimatedArrival = null) {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        technician_id: technicianId,
        status: 'technician_assigned',
        updated_at: new Date().toISOString()
      })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;

    // Create assignment record
    await supabase
      .from('technician_assignments')
      .insert({
        booking_id: this.id,
        technician_id: technicianId,
        response: 'accepted',
        estimated_arrival: estimatedArrival
      });

    Object.assign(this, new Booking(data));
    return this;
  }

  /**
   * Get available technicians for booking
   */
  static async getAvailableTechnicians(serviceLatitude, serviceLongitude, serviceTypeId) {
    // Calculate distance using SQL
    const { data, error } = await supabase
      .rpc('get_nearby_technicians', {
        service_lat: serviceLatitude,
        service_lng: serviceLongitude,
        max_distance_km: 50
      });

    if (error) throw error;
    return data;
  }

  /**
   * Get booking analytics
   */
  static async getAnalytics(dateFrom, dateTo) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        status,
        priority,
        final_price,
        created_at,
        actual_completion,
        service_type:service_types(name)
      `)
      .gte('created_at', dateFrom)
      .lte('created_at', dateTo);

    if (error) throw error;

    // Process analytics
    const analytics = {
      totalBookings: data.length,
      totalRevenue: data.reduce((sum, booking) => sum + (parseFloat(booking.final_price) || 0), 0),
      statusBreakdown: {},
      priorityBreakdown: {},
      serviceBreakdown: {},
      averageCompletionTime: 0
    };

    // Calculate breakdowns
    data.forEach(booking => {
      analytics.statusBreakdown[booking.status] = (analytics.statusBreakdown[booking.status] || 0) + 1;
      analytics.priorityBreakdown[booking.priority] = (analytics.priorityBreakdown[booking.priority] || 0) + 1;
      if (booking.service_type) {
        analytics.serviceBreakdown[booking.service_type.name] = (analytics.serviceBreakdown[booking.service_type.name] || 0) + 1;
      }
    });

    // Calculate average completion time
    const completedBookings = data.filter(b => b.actual_completion && b.created_at);
    if (completedBookings.length > 0) {
      const totalTime = completedBookings.reduce((sum, booking) => {
        const start = new Date(booking.created_at);
        const end = new Date(booking.actual_completion);
        return sum + (end - start);
      }, 0);
      analytics.averageCompletionTime = Math.round(totalTime / completedBookings.length / (1000 * 60)); // minutes
    }

    return analytics;
  }

  /**
   * Update booking with timing information
   */
  async updateTiming(timingData) {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        ...timingData,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;

    Object.assign(this, new Booking(data));
    return this;
  }

  /**
   * Get JSON representation
   */
  toJSON() {
    return {
      id: this.id,
      customerId: this.customerId,
      serviceTypeId: this.serviceTypeId,
      technicianId: this.technicianId,
      customerName: this.customerName,
      customerPhone: this.customerPhone,
      customerEmail: this.customerEmail,
      serviceAddress: this.serviceAddress,
      serviceLatitude: this.serviceLatitude,
      serviceLongitude: this.serviceLongitude,
      preferredDate: this.preferredDate,
      description: this.description,
      specialRequirements: this.specialRequirements,
      quotedPrice: this.quotedPrice,
      finalPrice: this.finalPrice,
      partsCost: this.partsCost,
      status: this.status,
      priority: this.priority,
      scheduledStart: this.scheduledStart,
      actualStart: this.actualStart,
      estimatedCompletion: this.estimatedCompletion,
      actualCompletion: this.actualCompletion,
      photos: this.photos,
      internalNotes: this.internalNotes,
      customerRating: this.customerRating,
      customerFeedback: this.customerFeedback,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
import supabase from '../config/database.js';
import bcrypt from 'bcryptjs';

export class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.role = data.role;
    this.isActive = data.is_active;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.lastLogin = data.last_login;
    this.phoneNumber = data.phone_number;
    this.emergencyContact = data.emergency_contact;
    this.preferences = data.preferences || {};
  }

  /**
   * Standardized user data structure
   */
  static getStandardUserFields() {
    return {
      core: ['id', 'email', 'first_name', 'last_name', 'role', 'is_active'],
      profile: ['phone_number', 'emergency_contact', 'preferences'],
      metadata: ['created_at', 'updated_at', 'last_login'],
      sensitive: ['password_hash']
    };
  }

  /**
   * User role definitions and permissions
   */
  static getUserRoleDefinitions() {
    return {
      admin: {
        name: 'Administrator',
        permissions: ['full_system_access', 'user_management', 'system_configuration', 'analytics_access'],
        level: 5,
        description: 'Full system access with all administrative privileges'
      },
      manager: {
        name: 'Manager',
        permissions: ['user_management', 'analytics_access', 'service_management'],
        level: 4,
        description: 'Management access with user and service oversight'
      },
      technician: {
        name: 'Technician',
        permissions: ['service_delivery', 'customer_interaction', 'job_management'],
        level: 3,
        description: 'Field technician with service delivery capabilities'
      },
      support: {
        name: 'Support Agent',
        permissions: ['customer_support', 'view_user_data', 'ticket_management'],
        level: 2,
        description: 'Customer support with limited user data access'
      },
      user: {
        name: 'Customer',
        permissions: ['service_booking', 'profile_management', 'payment_processing'],
        level: 1,
        description: 'Standard customer with service booking capabilities'
      }
    };
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission) {
    const roleDefinitions = User.getUserRoleDefinitions();
    const userRole = roleDefinitions[this.role];
    return userRole && userRole.permissions.includes(permission);
  }

  /**
   * Check if user role level meets minimum requirement
   */
  hasMinimumRoleLevel(minimumLevel) {
    const roleDefinitions = User.getUserRoleDefinitions();
    const userRole = roleDefinitions[this.role];
    return userRole && userRole.level >= minimumLevel;
  }
  /**
   * Create a new user
   */
  static async create(userData) {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      role = 'user',
      phoneNumber,
      emergencyContact,
      preferences = {}
    } = userData;
    
    // Validate role
    const validRoles = Object.keys(User.getUserRoleDefinitions());
    if (!validRoles.includes(role)) {
      throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash: hashedPassword,
          first_name: firstName,
          last_name: lastName,
          role,
          is_active: true,
          phone_number: phoneNumber,
          emergency_contact: emergencyContact,
          preferences: JSON.stringify(preferences),
          last_login: null
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return new User(data);
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw error;
    }

    return new User(data);
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return new User(data);
  }

  /**
   * Find users with filtering and pagination
   */
  static async findWithFilters(filters = {}) {
    const {
      role,
      isActive,
      search,
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = filters;

    let query = supabase
      .from('users')
      .select('*', { count: 'exact' });

    // Apply filters
    if (role) {
      query = query.eq('role', role);
    }
    
    if (isActive !== undefined) {
      query = query.eq('is_active', isActive);
    }

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      users: data.map(user => new User(user)),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }
  /**
   * Verify password
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update user
   */
  async update(updateData) {
    // Filter out undefined values and convert camelCase to snake_case
    const dbUpdateData = {};
    
    if (updateData.firstName !== undefined) dbUpdateData.first_name = updateData.firstName;
    if (updateData.lastName !== undefined) dbUpdateData.last_name = updateData.lastName;
    if (updateData.role !== undefined) {
      // Validate role
      const validRoles = Object.keys(User.getUserRoleDefinitions());
      if (!validRoles.includes(updateData.role)) {
        throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
      }
      dbUpdateData.role = updateData.role;
    }
    if (updateData.isActive !== undefined) dbUpdateData.is_active = updateData.isActive;
    if (updateData.phoneNumber !== undefined) dbUpdateData.phone_number = updateData.phoneNumber;
    if (updateData.emergencyContact !== undefined) dbUpdateData.emergency_contact = updateData.emergencyContact;
    if (updateData.preferences !== undefined) dbUpdateData.preferences = JSON.stringify(updateData.preferences);
    if (updateData.lastLogin !== undefined) dbUpdateData.last_login = updateData.lastLogin;
    
    // Always update the updated_at timestamp
    dbUpdateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('users')
      .update(dbUpdateData)
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;
    
    // Update instance properties
    Object.assign(this, new User(data));
    return this;
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin() {
    return await this.update({ lastLogin: new Date().toISOString() });
  }
  /**
   * Deactivate user
   */
  async deactivate() {
    return await this.update({ is_active: false });
  }

  /**
   * Activate user
   */
  async activate() {
    return await this.update({ is_active: true });
  }

  /**
   * Change user role
   */
  async changeRole(newRole) {
    return await this.update({ role: newRole });
  }
  /**
   * Get user profile (without sensitive data)
   */
  getProfile() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      roleDefinition: User.getUserRoleDefinitions()[this.role],
      isActive: this.isActive,
      phoneNumber: this.phoneNumber,
      emergencyContact: this.emergencyContact,
      preferences: this.preferences,
      lastLogin: this.lastLogin,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Get user profile for admin view (includes more details)
   */
  getAdminProfile() {
    const profile = this.getProfile();
    profile.permissions = this.getUserPermissions();
    profile.roleLevel = User.getUserRoleDefinitions()[this.role]?.level || 0;
    return profile;
  }

  /**
   * Get user permissions based on role
   */
  getUserPermissions() {
    const roleDefinitions = User.getUserRoleDefinitions();
    const userRole = roleDefinitions[this.role];
    return userRole ? userRole.permissions : [];
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .eq('is_active', true);

    if (error) throw error;
    return data.map(user => new User(user));
  }

  /**
   * Get user statistics
   */
  static async getUserStats() {
    const { data, error } = await supabase
      .from('users')
      .select('role, is_active, created_at');

    if (error) throw error;

    const stats = {
      total: data.length,
      active: data.filter(u => u.is_active).length,
      inactive: data.filter(u => !u.is_active).length,
      byRole: {},
      recentRegistrations: data.filter(u => {
        const createdDate = new Date(u.created_at);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return createdDate > weekAgo;
      }).length
    };

    // Count by role
    const roleDefinitions = User.getUserRoleDefinitions();
    Object.keys(roleDefinitions).forEach(role => {
      stats.byRole[role] = data.filter(u => u.role === role).length;
    });

    return stats;
  }
}
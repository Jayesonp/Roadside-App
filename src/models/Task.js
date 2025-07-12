import supabase from '../config/database.js';

export class Task {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.status = data.status;
    this.priority = data.priority;
    this.dueDate = data.due_date;
    this.tags = data.tags;
    this.userId = data.user_id;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  /**
   * Create a new task
   */
  static async create(taskData, userId) {
    const { title, description, priority = 'medium', dueDate, tags = [] } = taskData;
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title,
          description,
          priority,
          due_date: dueDate,
          tags,
          user_id: userId,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return new Task(data);
  }

  /**
   * Find task by ID and user
   */
  static async findByIdAndUser(id, userId) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return new Task(data);
  }

  /**
   * Find all tasks for a user with pagination and filtering
   */
  static async findByUser(userId, options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options;

    let query = supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    
    if (priority) {
      query = query.eq('priority', priority);
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
      tasks: data.map(task => new Task(task)),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Update task
   */
  async update(updateData) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;
    
    // Update instance properties
    Object.assign(this, new Task(data));
    return this;
  }

  /**
   * Delete task
   */
  async delete() {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', this.id);

    if (error) throw error;
    return true;
  }

  /**
   * Get task statistics for a user
   */
  static async getStats(userId) {
    const { data, error } = await supabase
      .from('tasks')
      .select('status, priority')
      .eq('user_id', userId);

    if (error) throw error;

    const stats = {
      total: data.length,
      byStatus: {
        pending: 0,
        in_progress: 0,
        completed: 0
      },
      byPriority: {
        low: 0,
        medium: 0,
        high: 0
      }
    };

    data.forEach(task => {
      stats.byStatus[task.status]++;
      stats.byPriority[task.priority]++;
    });

    return stats;
  }

  /**
   * Get task data for response
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      dueDate: this.dueDate,
      tags: this.tags,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
import { supabaseAdmin } from '../config/database.js';
import logger from './logger.js';

/**
 * Admin utilities for full database access
 * Uses service role key to bypass RLS
 */

export class SupabaseAdmin {
  /**
   * Get all users with admin privileges
   */
  static async getAllUsers() {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching all users:', error);
      throw error;
    }
  }

  /**
   * Create user with admin privileges
   */
  static async createUser(userData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user with admin privileges
   */
  static async updateUser(userId, updateData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user with admin privileges
   */
  static async deleteUser(userId) {
    try {
      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Get all tasks across all users
   */
  static async getAllTasks() {
    try {
      const { data, error } = await supabaseAdmin
        .from('tasks')
        .select(`
          *,
          users (
            id,
            email,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching all tasks:', error);
      throw error;
    }
  }

  /**
   * Execute raw SQL with admin privileges
   */
  static async executeRawSQL(query, params = []) {
    try {
      const { data, error } = await supabaseAdmin.rpc('execute_sql', {
        query_text: query,
        query_params: params
      });

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error executing raw SQL:', error);
      throw error;
    }
  }

  /**
   * Temporarily disable RLS for a table (admin only)
   */
  static async disableRLS(tableName) {
    try {
      const { error } = await supabaseAdmin.rpc('disable_rls', {
        table_name: tableName
      });

      if (error) throw error;
      logger.warn(`RLS disabled for table: ${tableName}`);
      return true;
    } catch (error) {
      logger.error(`Error disabling RLS for ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Re-enable RLS for a table
   */
  static async enableRLS(tableName) {
    try {
      const { error } = await supabaseAdmin.rpc('enable_rls', {
        table_name: tableName
      });

      if (error) throw error;
      logger.info(`RLS enabled for table: ${tableName}`);
      return true;
    } catch (error) {
      logger.error(`Error enabling RLS for ${tableName}:`, error);
      throw error;
    }
  }
}
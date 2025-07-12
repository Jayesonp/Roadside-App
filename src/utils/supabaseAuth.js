import supabaseClient from '../config/supabaseClient.js';

export class SupabaseAuth {
  
  /**
   * Register new user with Supabase Auth
   */
  static async signUp(email, password, userData = {}) {
    if (!supabaseClient) {
      throw new Error('Supabase client not configured');
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role || 'user'
        }
      }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign in user with Supabase Auth
   */
  static async signIn(email, password) {
    if (!supabaseClient) {
      throw new Error('Supabase client not configured');
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign out current user
   */
  static async signOut() {
    if (!supabaseClient) {
      throw new Error('Supabase client not configured');
    }

    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    return true;
  }

  /**
   * Get current session
   */
  static async getSession() {
    if (!supabaseClient) {
      return null;
    }

    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    if (!supabaseClient) {
      return null;
    }

    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates) {
    if (!supabaseClient) {
      throw new Error('Supabase client not configured');
    }

    const { data, error } = await supabaseClient.auth.updateUser({
      data: updates
    });

    if (error) throw error;
    return data;
  }

  /**
   * Reset password
   */
  static async resetPassword(email) {
    if (!supabaseClient) {
      throw new Error('Supabase client not configured');
    }

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return true;
  }
}
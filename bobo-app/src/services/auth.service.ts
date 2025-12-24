/**
 * Authentication Service
 * Adapted from NJOOBA for PocketBase
 */

import { pb } from '../lib/pocketbase'
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhoneNumber,
  generateSKU,
} from '../utils/validation'
import type { Profile, SignupFormData, LoginFormData } from '../types/models'

export class AuthService {
  /**
   * Sign up new user
   */
  async signUp(data: SignupFormData): Promise<{
    success: boolean
    user?: any
    profile?: Profile
    error?: string
  }> {
    try {
      // Validate inputs
      const emailValidation = validateEmail(data.email)
      if (!emailValidation.valid) {
        return { success: false, error: emailValidation.error }
      }

      const passwordValidation = validatePassword(data.password)
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.error }
      }

      const usernameValidation = validateUsername(data.username)
      if (!usernameValidation.valid) {
        return { success: false, error: usernameValidation.error }
      }

      if (data.password !== data.passwordConfirm) {
        return { success: false, error: 'Les mots de passe ne correspondent pas' }
      }

      // Create user account
      const user = await pb.collection('users').create({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        emailVisibility: false,
      })

      // Auto-login after signup
      await pb.collection('users').authWithPassword(
        data.email.trim().toLowerCase(),
        data.password
      )

      // Create profile
      const profile = await pb.collection('profiles').create({
        user_id: user.id,
        username: data.username.trim(),
        is_merchant: data.isMerchant,
        level: 1,
        xp: 0,
        streak_days: 0,
        total_posts: 0,
        total_sales: 0,
      })

      return {
        success: true,
        user,
        profile: profile as unknown as Profile,
      }
    } catch (error: any) {
      console.error('Signup error:', error)

      // Handle specific PocketBase errors
      if (error.data?.data?.email) {
        return { success: false, error: 'Cet email est déjà utilisé' }
      }
      if (error.data?.data?.username) {
        return { success: false, error: 'Ce nom d\'utilisateur est déjà pris' }
      }

      return {
        success: false,
        error: 'Erreur lors de l\'inscription. Veuillez réessayer.',
      }
    }
  }

  /**
   * Sign in existing user
   */
  async signIn(data: LoginFormData): Promise<{
    success: boolean
    user?: any
    profile?: Profile
    error?: string
  }> {
    try {
      // Validate inputs
      const emailValidation = validateEmail(data.email)
      if (!emailValidation.valid) {
        return { success: false, error: emailValidation.error }
      }

      if (!data.password) {
        return { success: false, error: 'Le mot de passe est requis' }
      }

      // Authenticate
      const authData = await pb.collection('users').authWithPassword(
        data.email.trim().toLowerCase(),
        data.password
      )

      // Get profile
      const profile = await pb
        .collection('profiles')
        .getFirstListItem(`user_id="${authData.record.id}"`)

      // Update last activity
      await pb.collection('profiles').update(profile.id, {
        last_activity_date: new Date().toISOString(),
      })

      return {
        success: true,
        user: authData.record,
        profile: profile as unknown as Profile,
      }
    } catch (error: any) {
      console.error('Sign in error:', error)

      if (error.status === 400) {
        return {
          success: false,
          error: 'Email ou mot de passe incorrect',
        }
      }

      return {
        success: false,
        error: 'Erreur lors de la connexion. Veuillez réessayer.',
      }
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<{ success: boolean }> {
    try {
      pb.authStore.clear()
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false }
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return pb.authStore.model
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return pb.authStore.isValid
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId?: string): Promise<Profile | null> {
    try {
      const targetUserId = userId || this.getCurrentUser()?.id

      if (!targetUserId) {
        return null
      }

      const profile = await pb
        .collection('profiles')
        .getFirstListItem(`user_id="${targetUserId}"`)

      return profile as unknown as Profile
    } catch (error) {
      console.error('Get profile error:', error)
      return null
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    profileId: string,
    updates: Partial<Profile>
  ): Promise<{
    success: boolean
    profile?: Profile
    error?: string
  }> {
    try {
      // Validate username if being updated
      if (updates.username) {
        const usernameValidation = validateUsername(updates.username)
        if (!usernameValidation.valid) {
          return { success: false, error: usernameValidation.error }
        }
      }

      // Validate phone if being updated
      if (updates.phone_number) {
        const phoneValidation = validatePhoneNumber(updates.phone_number)
        if (!phoneValidation.valid) {
          return { success: false, error: phoneValidation.error }
        }
      }

      const profile = await pb.collection('profiles').update(profileId, updates)

      return {
        success: true,
        profile: profile as unknown as Profile,
      }
    } catch (error: any) {
      console.error('Update profile error:', error)

      if (error.data?.data?.username) {
        return { success: false, error: 'Ce nom d\'utilisateur est déjà pris' }
      }

      return {
        success: false,
        error: 'Erreur lors de la mise à jour du profil',
      }
    }
  }

  /**
   * Update profile avatar
   */
  async updateAvatar(
    profileId: string,
    imageUri: string
  ): Promise<{
    success: boolean
    profile?: Profile
    error?: string
  }> {
    try {
      const formData = new FormData()
      formData.append('avatar_url', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `avatar_${Date.now()}.jpg`,
      } as any)

      const profile = await pb.collection('profiles').update(profileId, formData)

      return {
        success: true,
        profile: profile as unknown as Profile,
      }
    } catch (error) {
      console.error('Update avatar error:', error)
      return {
        success: false,
        error: 'Erreur lors de la mise à jour de la photo',
      }
    }
  }

  /**
   * Reset password (send reset email)
   */
  async requestPasswordReset(email: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const emailValidation = validateEmail(email)
      if (!emailValidation.valid) {
        return { success: false, error: emailValidation.error }
      }

      await pb.collection('users').requestPasswordReset(email.trim().toLowerCase())

      return { success: true }
    } catch (error) {
      console.error('Password reset request error:', error)
      return {
        success: false,
        error: 'Erreur lors de la demande de réinitialisation',
      }
    }
  }
}

// Export singleton instance
export const authService = new AuthService()

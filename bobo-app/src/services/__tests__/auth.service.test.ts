/**
 * Authentication Service Tests
 * Testing signup, signin, validation, and profile management
 */

import { AuthService } from '../auth.service'
import { pb } from '../../lib/pocketbase'
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhoneNumber,
} from '../../utils/validation'

// Mock PocketBase
jest.mock('../../lib/pocketbase', () => ({
  pb: {
    collection: jest.fn(),
    authStore: {
      clear: jest.fn(),
      isValid: false,
      model: null,
    },
  },
}))

// Mock validation utilities
jest.mock('../../utils/validation', () => ({
  validateEmail: jest.fn(() => ({ valid: true })),
  validatePassword: jest.fn(() => ({ valid: true })),
  validateUsername: jest.fn(() => ({ valid: true })),
  validatePhoneNumber: jest.fn(() => ({ valid: true })),
  generateSKU: jest.fn(() => 'BOBO-TEST-ABC1'),
}))

describe('AuthService', () => {
  let service: AuthService
  let mockCollection: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    service = new AuthService()
    mockCollection = pb.collection as jest.Mock
  })

  describe('signUp', () => {
    it('should create new user account successfully', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        created: '2025-01-01',
      }

      const mockProfile = {
        id: 'profile123',
        user_id: 'user123',
        username: 'testuser',
        is_merchant: false,
        level: 1,
        xp: 0,
      }

      mockCollection.mockImplementation((collection) => {
        if (collection === 'users') {
          return {
            create: jest.fn().mockResolvedValue(mockUser),
            authWithPassword: jest.fn().mockResolvedValue({ record: mockUser }),
          }
        }
        if (collection === 'profiles') {
          return {
            create: jest.fn().mockResolvedValue(mockProfile),
          }
        }
      })

      const result = await service.signUp({
        email: 'test@example.com',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        username: 'testuser',
        isMerchant: false,
      })

      expect(result.success).toBe(true)
      expect(result.user?.email).toBe('test@example.com')
      expect(result.profile?.username).toBe('testuser')
    })

    it('should validate email format', async () => {
      const mockValidateEmail = validateEmail as jest.Mock
      mockValidateEmail.mockReturnValue({
        valid: false,
        error: 'Invalid email',
      })

      const result = await service.signUp({
        email: 'invalid-email',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        username: 'testuser',
        isMerchant: false,
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('email')
    })

    it('should validate password strength (12+ chars)', async () => {
      const mockValidatePassword = validatePassword as jest.Mock
      mockValidatePassword.mockReturnValue({
        valid: false,
        error: 'Password must contain at least 12 characters',
      })

      const result = await service.signUp({
        email: 'test@example.com',
        password: 'short',
        passwordConfirm: 'short',
        username: 'testuser',
        isMerchant: false,
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('mot de passe')
    })

    it('should validate password complexity', async () => {
      const mockValidatePassword = validatePassword as jest.Mock
      mockValidatePassword.mockReturnValue({
        valid: false,
        error:
          'Password must contain uppercase, lowercase, number, and special char',
      })

      const result = await service.signUp({
        email: 'test@example.com',
        password: 'SimplePassword123',
        passwordConfirm: 'SimplePassword123',
        username: 'testuser',
        isMerchant: false,
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should check password confirmation matches', async () => {
      const result = await service.signUp({
        email: 'test@example.com',
        password: 'TestPassword123!',
        passwordConfirm: 'DifferentPassword123!',
        username: 'testuser',
        isMerchant: false,
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('mots de passe')
    })

    it('should validate username format', async () => {
      const mockValidateUsername = validateUsername as jest.Mock
      mockValidateUsername.mockReturnValue({
        valid: false,
        error: 'Username must be 3-20 characters',
      })

      const result = await service.signUp({
        email: 'test@example.com',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        username: 'ab',
        isMerchant: false,
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('nom')
    })

    it('should auto-login after signup', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' }
      const mockProfile = { id: 'profile123', username: 'testuser' }

      mockCollection.mockImplementation((collection) => {
        if (collection === 'users') {
          return {
            create: jest.fn().mockResolvedValue(mockUser),
            authWithPassword: jest.fn().mockResolvedValue({ record: mockUser }),
          }
        }
        if (collection === 'profiles') {
          return {
            create: jest.fn().mockResolvedValue(mockProfile),
          }
        }
      })

      await service.signUp({
        email: 'test@example.com',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        username: 'testuser',
        isMerchant: false,
      })

      expect(mockCollection('users').authWithPassword).toHaveBeenCalledWith(
        'test@example.com',
        'TestPassword123!'
      )
    })

    it('should create profile with merchant flag', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' }

      mockCollection.mockImplementation((collection) => {
        if (collection === 'users') {
          return {
            create: jest.fn().mockResolvedValue(mockUser),
            authWithPassword: jest.fn().mockResolvedValue({ record: mockUser }),
          }
        }
        if (collection === 'profiles') {
          return {
            create: jest.fn().mockResolvedValue({}),
          }
        }
      })

      await service.signUp({
        email: 'test@example.com',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        username: 'merchantuser',
        isMerchant: true,
      })

      const createCall = mockCollection('profiles').create.mock.calls[0][0]
      expect(createCall.is_merchant).toBe(true)
    })

    it('should handle duplicate email error', async () => {
      mockCollection.mockImplementation((collection) => {
        if (collection === 'users') {
          return {
            create: jest.fn().mockRejectedValue({
              data: { data: { email: 'Email already taken' } },
            }),
          }
        }
      })

      const result = await service.signUp({
        email: 'existing@example.com',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        username: 'newuser',
        isMerchant: false,
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('email')
    })

    it('should lowercase email for consistency', async () => {
      const mockUser = { id: 'user123' }

      mockCollection.mockImplementation((collection) => {
        if (collection === 'users') {
          return {
            create: jest.fn().mockResolvedValue(mockUser),
            authWithPassword: jest.fn().mockResolvedValue({ record: mockUser }),
          }
        }
        if (collection === 'profiles') {
          return {
            create: jest.fn().mockResolvedValue({}),
          }
        }
      })

      await service.signUp({
        email: 'Test@EXAMPLE.COM',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        username: 'testuser',
        isMerchant: false,
      })

      const createCall = mockCollection('users').create.mock.calls[0][0]
      expect(createCall.email).toBe('test@example.com')
    })
  })

  describe('signIn', () => {
    it('should authenticate user successfully', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' }
      const mockProfile = { id: 'profile123', username: 'testuser' }

      mockCollection.mockImplementation((collection) => {
        if (collection === 'users') {
          return {
            authWithPassword: jest
              .fn()
              .mockResolvedValue({ record: mockUser }),
          }
        }
        if (collection === 'profiles') {
          return {
            getFirstListItem: jest.fn().mockResolvedValue(mockProfile),
            update: jest.fn().mockResolvedValue(mockProfile),
          }
        }
      })

      const result = await service.signIn({
        email: 'test@example.com',
        password: 'TestPassword123!',
      })

      expect(result.success).toBe(true)
      expect(result.user?.email).toBe('test@example.com')
    })

    it('should validate email before signin', async () => {
      const mockValidateEmail = validateEmail as jest.Mock
      mockValidateEmail.mockReturnValue({
        valid: false,
        error: 'Invalid email',
      })

      const result = await service.signIn({
        email: 'invalid-email',
        password: 'TestPassword123!',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('email')
    })

    it('should require password', async () => {
      const result = await service.signIn({
        email: 'test@example.com',
        password: '',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('mot de passe')
    })

    it('should handle invalid credentials', async () => {
      mockCollection.mockImplementation((collection) => {
        if (collection === 'users') {
          return {
            authWithPassword: jest.fn().mockRejectedValue({ status: 400 }),
          }
        }
      })

      const result = await service.signIn({
        email: 'test@example.com',
        password: 'wrongpassword',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Email ou mot de passe incorrect')
    })

    it('should update last activity on signin', async () => {
      const mockUser = { id: 'user123' }
      const mockProfile = { id: 'profile123' }

      mockCollection.mockImplementation((collection) => {
        if (collection === 'users') {
          return {
            authWithPassword: jest
              .fn()
              .mockResolvedValue({ record: mockUser }),
          }
        }
        if (collection === 'profiles') {
          return {
            getFirstListItem: jest.fn().mockResolvedValue(mockProfile),
            update: jest.fn().mockResolvedValue(mockProfile),
          }
        }
      })

      await service.signIn({
        email: 'test@example.com',
        password: 'TestPassword123!',
      })

      const updateCall = mockCollection('profiles').update.mock.calls[0]
      expect(updateCall[1]).toHaveProperty('last_activity_date')
    })

    it('should lowercase email for login', async () => {
      const mockUser = { id: 'user123' }

      mockCollection.mockImplementation((collection) => {
        if (collection === 'users') {
          return {
            authWithPassword: jest
              .fn()
              .mockResolvedValue({ record: mockUser }),
          }
        }
        if (collection === 'profiles') {
          return {
            getFirstListItem: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
          }
        }
      })

      await service.signIn({
        email: 'Test@EXAMPLE.COM',
        password: 'TestPassword123!',
      })

      const authCall = mockCollection('users').authWithPassword.mock.calls[0]
      expect(authCall[0]).toBe('test@example.com')
    })
  })

  describe('signOut', () => {
    it('should clear authentication', async () => {
      const result = await service.signOut()

      expect(result.success).toBe(true)
      expect(pb.authStore.clear).toHaveBeenCalled()
    })

    it('should handle signout errors', async () => {
      ;(pb.authStore.clear as jest.Mock).mockImplementation(() => {
        throw new Error('Signout failed')
      })

      const result = await service.signOut()

      expect(result.success).toBe(false)
    })
  })

  describe('getCurrentUser', () => {
    it('should return current authenticated user', () => {
      const mockUser = { id: 'user123', email: 'test@example.com' }
      ;(pb.authStore as any).model = mockUser

      const user = service.getCurrentUser()

      expect(user).toEqual(mockUser)
    })

    it('should return null if not authenticated', () => {
      ;(pb.authStore as any).model = null

      const user = service.getCurrentUser()

      expect(user).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true if user is authenticated', () => {
      ;(pb.authStore as any).isValid = true

      const isAuth = service.isAuthenticated()

      expect(isAuth).toBe(true)
    })

    it('should return false if user is not authenticated', () => {
      ;(pb.authStore as any).isValid = false

      const isAuth = service.isAuthenticated()

      expect(isAuth).toBe(false)
    })
  })

  describe('getUserProfile', () => {
    it('should retrieve user profile', async () => {
      const mockProfile = { id: 'profile123', username: 'testuser' }

      mockCollection.mockReturnValue({
        getFirstListItem: jest.fn().mockResolvedValue(mockProfile),
      })

      const profile = await service.getUserProfile('user123')

      expect(profile).toEqual(mockProfile)
    })

    it('should use current user if userId not provided', async () => {
      const mockProfile = { id: 'profile123', username: 'testuser' }
      ;(pb.authStore as any).model = { id: 'user123' }

      mockCollection.mockReturnValue({
        getFirstListItem: jest.fn().mockResolvedValue(mockProfile),
      })

      const profile = await service.getUserProfile()

      expect(profile).toEqual(mockProfile)
    })

    it('should return null if not authenticated and no userId', async () => {
      ;(pb.authStore as any).model = null

      const profile = await service.getUserProfile()

      expect(profile).toBeNull()
    })

    it('should return null on error', async () => {
      mockCollection.mockReturnValue({
        getFirstListItem: jest
          .fn()
          .mockRejectedValue(new Error('Not found')),
      })

      const profile = await service.getUserProfile('user123')

      expect(profile).toBeNull()
    })
  })

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const mockProfile = {
        id: 'profile123',
        username: 'newusername',
        bio: 'Updated bio',
      }

      mockCollection.mockReturnValue({
        update: jest.fn().mockResolvedValue(mockProfile),
      })

      const result = await service.updateProfile('profile123', {
        username: 'newusername',
        bio: 'Updated bio',
      })

      expect(result.success).toBe(true)
      expect(result.profile?.username).toBe('newusername')
    })

    it('should validate username if updating', async () => {
      const mockValidateUsername = validateUsername as jest.Mock
      mockValidateUsername.mockReturnValue({
        valid: false,
        error: 'Invalid username',
      })

      const result = await service.updateProfile('profile123', {
        username: 'a',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('nom')
    })

    it('should validate phone number if updating', async () => {
      const mockValidatePhoneNumber = validatePhoneNumber as jest.Mock
      mockValidatePhoneNumber.mockReturnValue({
        valid: false,
        error: 'Invalid phone format',
      })

      const result = await service.updateProfile('profile123', {
        phone_number: 'invalid',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('téléphone')
    })

    it('should accept valid Senegal phone numbers', async () => {
      const mockValidatePhoneNumber = validatePhoneNumber as jest.Mock
      mockValidatePhoneNumber.mockReturnValue({ valid: true })

      mockCollection.mockReturnValue({
        update: jest.fn().mockResolvedValue({}),
      })

      const result = await service.updateProfile('profile123', {
        phone_number: '+221701234567',
      })

      expect(result.success).toBe(true)
    })

    it('should handle duplicate username error', async () => {
      mockCollection.mockReturnValue({
        update: jest
          .fn()
          .mockRejectedValue({
            data: { data: { username: 'Username taken' } },
          }),
      })

      const result = await service.updateProfile('profile123', {
        username: 'takenusername',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('nom d\'utilisateur')
    })
  })

  describe('updateAvatar', () => {
    it('should update user avatar', async () => {
      const mockProfile = {
        id: 'profile123',
        avatar_url: 'file:///avatar.jpg',
      }

      mockCollection.mockReturnValue({
        update: jest.fn().mockResolvedValue(mockProfile),
      })

      const result = await service.updateAvatar('profile123', 'file:///image.jpg')

      expect(result.success).toBe(true)
      expect(result.profile?.avatar_url).toBe('file:///avatar.jpg')
    })

    it('should handle avatar update errors', async () => {
      mockCollection.mockReturnValue({
        update: jest.fn().mockRejectedValue(new Error('Upload failed')),
      })

      const result = await service.updateAvatar('profile123', 'file:///image.jpg')

      expect(result.success).toBe(false)
      expect(result.error).toContain('photo')
    })
  })

  describe('requestPasswordReset', () => {
    it('should request password reset with valid email', async () => {
      mockCollection.mockReturnValue({
        requestPasswordReset: jest.fn().mockResolvedValue({}),
      })

      const result = await service.requestPasswordReset('test@example.com')

      expect(result.success).toBe(true)
      expect(mockCollection('users').requestPasswordReset).toHaveBeenCalledWith(
        'test@example.com'
      )
    })

    it('should validate email before requesting reset', async () => {
      const mockValidateEmail = validateEmail as jest.Mock
      mockValidateEmail.mockReturnValue({
        valid: false,
        error: 'Invalid email',
      })

      const result = await service.requestPasswordReset('invalid-email')

      expect(result.success).toBe(false)
      expect(result.error).toContain('email')
    })

    it('should handle password reset errors', async () => {
      mockCollection.mockReturnValue({
        requestPasswordReset: jest
          .fn()
          .mockRejectedValue(new Error('User not found')),
      })

      const result = await service.requestPasswordReset('notfound@example.com')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should lowercase email for reset request', async () => {
      mockCollection.mockReturnValue({
        requestPasswordReset: jest.fn().mockResolvedValue({}),
      })

      await service.requestPasswordReset('Test@EXAMPLE.COM')

      expect(mockCollection('users').requestPasswordReset).toHaveBeenCalledWith(
        'test@example.com'
      )
    })
  })
})

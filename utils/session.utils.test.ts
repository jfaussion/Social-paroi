import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  isConnected,
  isNotConnected,
  isSuperAdmin
} from '@/utils/session.utils'
import { UserRoleEnum } from '@/domain/UserRole.enum'
import type { Session } from 'next-auth'
import type { AdapterUserCustom } from '@/lib/users/AdapterUserCustom'

describe('session.utils', () => {
  const createSession = (user: Partial<AdapterUserCustom>): Session => ({
    user: user as AdapterUserCustom,
    expires: '2024-12-31'
  } as Session)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('isConnected', () => {
    it('returns true when session has user with id', () => {
      const session = createSession({ id: 'user-123', role: 'user' })
      expect(isConnected(session)).toBe(true)
    })

    it('returns false when session is null', () => {
      expect(isConnected(null)).toBe(false)
    })

    it('returns false when session has no user', () => {
      const session = { user: {}, expires: '2024-12-31' } as Session
      expect(isConnected(session)).toBe(false)
    })

    it('returns false when user has no id', () => {
      const session = createSession({ id: '' })
      expect(isConnected(session)).toBe(false)
    })
  })

  describe('isNotConnected', () => {
    it('returns false when session has user with id', () => {
      const session = createSession({ id: 'user-123' })
      expect(isNotConnected(session)).toBe(false)
    })

    it('returns true when session is null', () => {
      expect(isNotConnected(null)).toBe(true)
    })

    it('returns true when session has no user', () => {
      const session = { user: {}, expires: '2024-12-31' } as Session
      expect(isNotConnected(session)).toBe(true)
    })

    it('returns true when user has no id', () => {
      const session = createSession({ id: '' })
      expect(isNotConnected(session)).toBe(true)
    })
  })

  describe('isSuperAdmin', () => {
    it('returns true for super_admin role', () => {
      const session = createSession({ id: 'user-123', role: UserRoleEnum.Enum.super_admin })
      expect(isSuperAdmin(session)).toBe(true)
    })

    it('returns false for admin role', () => {
      const session = createSession({ id: 'user-123', role: UserRoleEnum.Enum.admin })
      expect(isSuperAdmin(session)).toBe(false)
    })

    it('returns false for opener role', () => {
      const session = createSession({ id: 'user-123', role: UserRoleEnum.Enum.opener })
      expect(isSuperAdmin(session)).toBe(false)
    })

    it('returns false for regular user role', () => {
      const session = createSession({ id: 'user-123', role: UserRoleEnum.Enum.user })
      expect(isSuperAdmin(session)).toBe(false)
    })

    it('returns false when session is null', () => {
      expect(isSuperAdmin(null)).toBe(false)
    })
  })
})

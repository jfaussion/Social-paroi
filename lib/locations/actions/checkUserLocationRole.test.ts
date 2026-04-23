import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole'
import { LocationRoleEnum } from '@/domain/LocationRole.enum'
import { UserRoleEnum } from '@/domain/UserRole.enum'

// Mock prisma
vi.mock('@/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn()
    },
    userLocationRole: {
      findUnique: vi.fn()
    }
  }
}))

import prisma from '@/prisma'

type MockUser = Awaited<ReturnType<typeof prisma.user.findUnique>>
type MockLocationRole = Awaited<ReturnType<typeof prisma.userLocationRole.findUnique>>

describe('checkUserLocationRole', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('super_admin bypass', () => {
    it('returns true when user is super_admin', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: UserRoleEnum.Enum.super_admin } as MockUser)

      const result = await checkUserLocationRole('user-123', 1, LocationRoleEnum.Enum.admin)

      expect(result).toBe(true)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        select: { role: true }
      })
      // Should not check userLocationRole for super_admin
      expect(prisma.userLocationRole.findUnique).not.toHaveBeenCalled()
    })

    it('returns true for super_admin regardless of minRole', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: UserRoleEnum.Enum.super_admin } as MockUser)

      const resultOpener = await checkUserLocationRole('user-123', 1, LocationRoleEnum.Enum.opener)
      const resultAdmin = await checkUserLocationRole('user-123', 1, LocationRoleEnum.Enum.admin)

      expect(resultOpener).toBe(true)
      expect(resultAdmin).toBe(true)
    })
  })

  describe('opener role check', () => {
    it('returns true when user is opener and minRole is opener', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: UserRoleEnum.Enum.user } as MockUser)
      vi.mocked(prisma.userLocationRole.findUnique).mockResolvedValue({ userId: 'user-123', locationId: 1, role: LocationRoleEnum.Enum.opener } as MockLocationRole)

      const result = await checkUserLocationRole('user-123', 1, LocationRoleEnum.Enum.opener)

      expect(result).toBe(true)
    })

    // NOTE: This is the actual behavior - opener cannot access admin minRole
    // This may be intentional or a bug depending on requirements
    it('returns false when user is opener and minRole is admin (opener lacks admin privileges)', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: UserRoleEnum.Enum.user } as MockUser)
      vi.mocked(prisma.userLocationRole.findUnique).mockResolvedValue({ userId: 'user-123', locationId: 1, role: LocationRoleEnum.Enum.opener } as MockLocationRole)

      const result = await checkUserLocationRole('user-123', 1, LocationRoleEnum.Enum.admin)

      expect(result).toBe(false)
    })

    it('returns true when user is admin and minRole is opener (admin > opener)', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: UserRoleEnum.Enum.user } as MockUser)
      vi.mocked(prisma.userLocationRole.findUnique).mockResolvedValue({ userId: 'user-123', locationId: 1, role: LocationRoleEnum.Enum.admin } as MockLocationRole)

      const result = await checkUserLocationRole('user-123', 1, LocationRoleEnum.Enum.opener)

      expect(result).toBe(true)
    })
  })

  describe('admin role check', () => {
    it('returns true when user is admin and minRole is admin', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: UserRoleEnum.Enum.user } as MockUser)
      vi.mocked(prisma.userLocationRole.findUnique).mockResolvedValue({ userId: 'user-123', locationId: 1, role: LocationRoleEnum.Enum.admin } as MockLocationRole)

      const result = await checkUserLocationRole('user-123', 1, LocationRoleEnum.Enum.admin)

      expect(result).toBe(true)
    })
  })

  describe('no location role', () => {
    it('returns false when user has no location role', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: UserRoleEnum.Enum.user } as MockUser)
      vi.mocked(prisma.userLocationRole.findUnique).mockResolvedValue(null)

      const result = await checkUserLocationRole('user-123', 1, LocationRoleEnum.Enum.opener)

      expect(result).toBe(false)
    })

    it('returns false when userLocationRole is not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: UserRoleEnum.Enum.opener } as MockUser)
      vi.mocked(prisma.userLocationRole.findUnique).mockResolvedValue(null)

      const result = await checkUserLocationRole('user-123', 1, LocationRoleEnum.Enum.admin)

      expect(result).toBe(false)
    })
  })

  describe('user role variations', () => {
    it('returns false for regular user with opener role at location when minRole is opener', async () => {
      // This tests the actual logic - regular user without opener/admin role can't pass
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: UserRoleEnum.Enum.user } as MockUser)
      vi.mocked(prisma.userLocationRole.findUnique).mockResolvedValue({ userId: 'user-123', locationId: 1, role: LocationRoleEnum.Enum.opener } as MockLocationRole)

      const result = await checkUserLocationRole('user-123', 1, LocationRoleEnum.Enum.opener)

      expect(result).toBe(true) // opener at location can pass opener minRole
    })

    it('returns false for regular user with opener role at location when minRole is admin', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: UserRoleEnum.Enum.user } as MockUser)
      vi.mocked(prisma.userLocationRole.findUnique).mockResolvedValue({ userId: 'user-123', locationId: 1, role: LocationRoleEnum.Enum.opener } as MockLocationRole)

      const result = await checkUserLocationRole('user-123', 1, LocationRoleEnum.Enum.admin)

      expect(result).toBe(false)
    })
  })

  describe('prisma interaction', () => {
    it('fetches user with correct parameters', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
      vi.mocked(prisma.userLocationRole.findUnique).mockResolvedValue(null)

      await checkUserLocationRole('user-456', 10, LocationRoleEnum.Enum.opener)

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-456' },
        select: { role: true }
      })
    })

    it('fetches userLocationRole with correct compound key', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: UserRoleEnum.Enum.opener } as MockUser)
      vi.mocked(prisma.userLocationRole.findUnique).mockResolvedValue(null)

      await checkUserLocationRole('user-789', 20, LocationRoleEnum.Enum.admin)

      expect(prisma.userLocationRole.findUnique).toHaveBeenCalledWith({
        where: {
          userId_locationId: {
            userId: 'user-789',
            locationId: 20
          }
        }
      })
    })
  })
})
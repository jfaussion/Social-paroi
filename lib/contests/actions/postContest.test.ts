import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { postContest } from '@/lib/contests/actions/postContest'
import type { Session } from 'next-auth'

const { mockAuth, mockCheckUserLocationRole, mockPrismaContestUpsert } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockCheckUserLocationRole: vi.fn(),
  mockPrismaContestUpsert: vi.fn()
}))

vi.mock('@/prisma', () => ({
  default: {
    contest: {
      upsert: mockPrismaContestUpsert
    }
  }
}))

vi.mock('@/auth', () => ({
  auth: mockAuth
}))

vi.mock('@/lib/shared/checkRoleOrThrow', () => ({
  checkRoleOrThrow: mockCheckUserLocationRole
}))

vi.mock('@/utils/logger', () => ({
  createActionLogger: () => ({
    start: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn()
  })
}))

describe('postContest', () => {
  const mockUser: Session = {
    user: { id: 'opener-123', name: 'Opener User', email: 'opener@example.com' },
    expires: '2024-12-31'
  } as Session

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('authentication and authorization', () => {
    it('throws error when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null)
      mockCheckUserLocationRole.mockRejectedValue(new Error('Authentication required'))

      const formData = new FormData()
      formData.append('name', 'Test Contest')
      formData.append('date', '2024-12-31')

      await expect(postContest(-1, formData, 1)).rejects.toThrow('Authentication required')
    })

    it('throws error when user is not an opener', async () => {
      mockAuth.mockResolvedValue(mockUser)
      mockCheckUserLocationRole.mockRejectedValue(new Error('You must be Admin or Opener'))

      const formData = new FormData()
      formData.append('name', 'Test Contest')
      formData.append('date', '2024-12-31')

      await expect(postContest(-1, formData, 1)).rejects.toThrow('You must be Admin or Opener')
    })
  })

  describe('create contest', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue(mockUser)
      mockCheckUserLocationRole.mockResolvedValue(true)
    })

    it('creates a new contest with valid data', async () => {
      const newContest = { id: 1, name: 'Test Contest', date: new Date('2024-12-31'), locationId: 1 }
      mockPrismaContestUpsert.mockResolvedValue(newContest)

      const formData = new FormData()
      formData.append('name', 'Test Contest')
      formData.append('date', '2024-12-31')

      const result = await postContest(-1, formData, 1)

      expect(result).toEqual(newContest)
      expect(mockPrismaContestUpsert).toHaveBeenCalledWith({
        where: { id: -1 },
        update: expect.any(Object),
        create: expect.objectContaining({
          name: 'Test Contest',
          locationId: 1
        })
      })
    })

    it('creates contest with cover image', async () => {
      const newContest = { id: 1, name: 'Test Contest', date: new Date('2024-12-31'), coverImage: 'https://example.com/image.jpg', locationId: 1 }
      mockPrismaContestUpsert.mockResolvedValue(newContest)

      const formData = new FormData()
      formData.append('name', 'Test Contest')
      formData.append('date', '2024-12-31')
      formData.append('coverImageUrl', 'https://example.com/image.jpg')

      const result = await postContest(-1, formData, 1)

      expect(result).toHaveProperty('coverImage', 'https://example.com/image.jpg')
    })
  })

  describe('update contest', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue(mockUser)
      mockCheckUserLocationRole.mockResolvedValue(true)
    })

    it('updates existing contest', async () => {
      const existingContest = { id: 5, name: 'Updated Contest', date: new Date('2024-12-31'), locationId: 1 }
      mockPrismaContestUpsert.mockResolvedValue(existingContest)

      const formData = new FormData()
      formData.append('name', 'Updated Contest')
      formData.append('date', '2024-12-31')

      const result = await postContest(5, formData, 1)

      expect(result).toEqual(existingContest)
      expect(mockPrismaContestUpsert).toHaveBeenCalledWith({
        where: { id: 5 },
        update: expect.objectContaining({
          name: 'Updated Contest'
        }),
        create: expect.any(Object)
      })
    })
  })

  describe('error handling', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue(mockUser)
      mockCheckUserLocationRole.mockResolvedValue(true)
    })

    it('returns null on database error', async () => {
      mockPrismaContestUpsert.mockRejectedValue(new Error('Database error'))

      const formData = new FormData()
      formData.append('name', 'Test Contest')
      formData.append('date', '2024-12-31')

      const result = await postContest(-1, formData, 1)

      expect(result).toBeNull()
    })
  })
})
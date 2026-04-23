import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { callDeleteContest } from '@/lib/contests/actions/deleteContest'
import type { Session } from 'next-auth'
import { Contest } from '@/domain/Contest.schema'

const { mockAuth, mockCheckUserLocationRole, mockPrismaContestDelete, mockDeleteImageFromCloudinary } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockCheckUserLocationRole: vi.fn(),
  mockPrismaContestDelete: vi.fn(),
  mockDeleteImageFromCloudinary: vi.fn()
}))

vi.mock('@/prisma', () => ({
  default: {
    contest: {
      delete: mockPrismaContestDelete
    }
  }
}))

vi.mock('@/auth', () => ({
  auth: mockAuth
}))

vi.mock('@/lib/shared/checkRoleOrThrow', () => ({
  checkRoleOrThrow: mockCheckUserLocationRole
}))

vi.mock('@/lib/cloudinary/deleteFromCloudinary', () => ({
  deleteImageFromCloudinary: mockDeleteImageFromCloudinary
}))

vi.mock('@/utils/logger', () => ({
  createActionLogger: () => ({
    start: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn()
  })
}))

describe('callDeleteContest', () => {
  const mockUser: Session = {
    user: { id: 'opener-123', name: 'Opener User', email: 'opener@example.com' },
    expires: '2024-12-31'
  } as Session

  const mockContest: Contest = {
    id: 5,
    name: 'Test Contest',
    date: new Date('2024-12-31'),
    locationId: 1,
    status: 'Created',
    activities: [],
    users: [],
    tracks: []
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockPrismaContestDelete.mockResolvedValue(mockContest)
    mockDeleteImageFromCloudinary.mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('authentication and authorization', () => {
    it('throws error when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null)
      mockCheckUserLocationRole.mockRejectedValue(new Error('Authentication required'))

      await expect(callDeleteContest(mockContest, 1)).rejects.toThrow('Authentication required')
    })

    it('throws error when user is not an opener', async () => {
      mockAuth.mockResolvedValue(mockUser)
      mockCheckUserLocationRole.mockRejectedValue(new Error('You must be Admin or Opener'))

      await expect(callDeleteContest(mockContest, 1)).rejects.toThrow('You must be Admin or Opener')
    })

    it('calls checkRoleOrThrow with correct parameters', async () => {
      mockAuth.mockResolvedValue(mockUser)
      mockCheckUserLocationRole.mockResolvedValue('opener-123')

      await callDeleteContest(mockContest, 1)

      expect(mockCheckUserLocationRole).toHaveBeenCalled()
    })
  })

  describe('successful deletion', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue(mockUser)
      mockCheckUserLocationRole.mockResolvedValue(true)
    })

    it('deletes contest without cover image', async () => {
      const contestWithoutImage = { ...mockContest, coverImage: undefined }

      await callDeleteContest(contestWithoutImage, 1)

      expect(mockPrismaContestDelete).toHaveBeenCalledWith({
        where: { id: 5 }
      })
      expect(mockDeleteImageFromCloudinary).not.toHaveBeenCalled()
    })

    it('deletes contest with cover image and removes image from cloudinary', async () => {
      const contestWithImage = { ...mockContest, coverImage: 'https://cloudinary.com/image.jpg' }

      await callDeleteContest(contestWithImage, 1)

      expect(mockDeleteImageFromCloudinary).toHaveBeenCalledWith('https://cloudinary.com/image.jpg')
      expect(mockPrismaContestDelete).toHaveBeenCalledWith({
        where: { id: 5 }
      })
    })
  })

  describe('error handling', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue(mockUser)
      mockCheckUserLocationRole.mockResolvedValue(true)
    })

    it('logs error when database deletion fails', async () => {
      const error = new Error('Database error')
      mockPrismaContestDelete.mockRejectedValue(error)

      await callDeleteContest(mockContest, 1)

      expect(mockPrismaContestDelete).toHaveBeenCalled()
    })
  })
})
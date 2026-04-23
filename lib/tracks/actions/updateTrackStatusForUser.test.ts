import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { updateTrackStatusForUser } from '@/lib/tracks/actions/updateTrackStatusForUser'
import { TrackStatus } from '@/domain/TrackStatus.enum'
import { ContestStatusEnum } from '@/domain/ContestStatus.enum'
import type { Session } from 'next-auth'

const { mockAuth, mockCheckUserLocationRole, mockPrismaTransaction, mockPrismaTrackFindUnique,
  mockPrismaUserLocationFindFirst, mockUserTrackProgressUpsert,
  mockContestTrackFindMany, mockContestUserTrackUpsert } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockCheckUserLocationRole: vi.fn(),
  mockPrismaTransaction: vi.fn(),
  mockPrismaTrackFindUnique: vi.fn(),
  mockPrismaUserLocationFindFirst: vi.fn(),
  mockUserTrackProgressUpsert: vi.fn(),
  mockContestTrackFindMany: vi.fn(),
  mockContestUserTrackUpsert: vi.fn()
}))

vi.mock('@/prisma', () => ({
  default: {
    $transaction: mockPrismaTransaction,
    track: {
      findUnique: mockPrismaTrackFindUnique
    },
    userLocation: {
      findFirst: mockPrismaUserLocationFindFirst
    }
  }
}))

vi.mock('@/auth', () => ({
  auth: mockAuth
}))

vi.mock('@/lib/locations/actions/checkUserLocationRole', () => ({
  checkUserLocationRole: mockCheckUserLocationRole
}))

vi.mock('@/utils/logger', () => ({
  createActionLogger: () => ({
    start: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn()
  })
}))

describe('updateTrackStatusForUser', () => {
  const mockUser: Session = {
    user: { id: 'user-123', name: 'Test User', email: 'test@example.com' },
    expires: '2024-12-31'
  } as Session

  beforeEach(() => {
    vi.clearAllMocks()
    mockPrismaTransaction.mockImplementation(async (callback: Function) => {
      const tx = {
        userTrackProgress: { upsert: mockUserTrackProgressUpsert },
        contestTrack: { findMany: mockContestTrackFindMany },
        contestUserTrack: { upsert: mockContestUserTrackUpsert }
      }
      return callback(tx)
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('authentication checks', () => {
    it('returns false when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await updateTrackStatusForUser(1, 'user-123', TrackStatus.DONE)

      expect(result).toBe(false)
    })

    it('returns false when session has no user id', async () => {
      mockAuth.mockResolvedValue({ user: {} } as Session)

      const result = await updateTrackStatusForUser(1, 'user-123', TrackStatus.DONE)

      expect(result).toBe(false)
    })
  })

  describe('opener bypass', () => {
    it('allows opener to update any track without location membership check', async () => {
      mockAuth.mockResolvedValue(mockUser)
      mockPrismaTrackFindUnique.mockResolvedValue({ id: 1, locationId: 1 })
      mockCheckUserLocationRole.mockResolvedValue(true)
      mockUserTrackProgressUpsert.mockResolvedValue({
        trackId: 1,
        userId: 'user-123',
        status: TrackStatus.DONE,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      mockContestTrackFindMany.mockResolvedValue([])

      const result = await updateTrackStatusForUser(1, 'user-123', TrackStatus.DONE)

      expect(result).toBe(true)
      expect(mockPrismaUserLocationFindFirst).not.toHaveBeenCalled()
    })
  })

  describe('non-opener location membership check', () => {
    it('returns false when user is not a member of the track location', async () => {
      mockAuth.mockResolvedValue(mockUser)
      mockPrismaTrackFindUnique.mockResolvedValue({ id: 1, locationId: 1 })
      mockCheckUserLocationRole.mockResolvedValue(false)
      mockPrismaUserLocationFindFirst.mockResolvedValue(null)

      const result = await updateTrackStatusForUser(1, 'user-123', TrackStatus.DONE)

      expect(result).toBe(false)
    })

    it('allows user with location membership to update track', async () => {
      mockAuth.mockResolvedValue(mockUser)
      mockPrismaTrackFindUnique.mockResolvedValue({ id: 1, locationId: 1 })
      mockCheckUserLocationRole.mockResolvedValue(false)
      mockPrismaUserLocationFindFirst.mockResolvedValue({ userId: 'user-123', locationId: 1 })
      mockUserTrackProgressUpsert.mockResolvedValue({
        trackId: 1,
        userId: 'user-123',
        status: TrackStatus.DONE,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      mockContestTrackFindMany.mockResolvedValue([])

      const result = await updateTrackStatusForUser(1, 'user-123', TrackStatus.DONE)

      expect(result).toBe(true)
    })

    it('returns false when track is not found', async () => {
      mockAuth.mockResolvedValue(mockUser)
      mockPrismaTrackFindUnique.mockResolvedValue(null)

      const result = await updateTrackStatusForUser(1, 'user-123', TrackStatus.DONE)

      expect(result).toBe(false)
    })
  })

  describe('regular track status update', () => {
    it('upserts regular track status with correct parameters', async () => {
      mockAuth.mockResolvedValue(mockUser)
      mockPrismaTrackFindUnique.mockResolvedValue({ id: 5, locationId: 1 })
      mockCheckUserLocationRole.mockResolvedValue(true)
      mockUserTrackProgressUpsert.mockResolvedValue({
        trackId: 5,
        userId: 'user-123',
        status: TrackStatus.IN_PROGRESS,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      mockContestTrackFindMany.mockResolvedValue([])

      const result = await updateTrackStatusForUser(5, 'user-123', TrackStatus.IN_PROGRESS)

      expect(result).toBe(true)
      expect(mockUserTrackProgressUpsert).toHaveBeenCalledWith({
        where: {
          user_track_unique_constraint: {
            trackId: 5,
            userId: 'user-123'
          }
        },
        update: { status: TrackStatus.IN_PROGRESS },
        create: {
          userId: 'user-123',
          trackId: 5,
          status: TrackStatus.IN_PROGRESS
        }
      })
    })
  })

  describe('contest track status update', () => {
    const createMockContestTrack = (overrides: {
      id?: number
      userId?: string
      contestStatus?: string
    }) => ({
      id: overrides.id ?? 1,
      contestId: 1,
      trackId: 1,
      contest: {
        status: overrides.contestStatus ?? ContestStatusEnum.Enum.InProgress,
        contestUsers: [{
          id: 10,
          userId: overrides.userId ?? 'user-123'
        }]
      }
    })

    beforeEach(() => {
      mockUserTrackProgressUpsert.mockResolvedValue({
        trackId: 1,
        userId: 'user-123',
        status: TrackStatus.DONE,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      mockContestUserTrackUpsert.mockResolvedValue({
        id: 1,
        contestUserId: 10,
        contestTrackId: 1,
        status: TrackStatus.DONE,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    })

    it('updates contest track status when user is self-contester and contest is in progress', async () => {
      mockAuth.mockResolvedValue(mockUser)
      mockPrismaTrackFindUnique.mockResolvedValue({ id: 1, locationId: 1 })
      mockCheckUserLocationRole.mockResolvedValue(false)
      mockPrismaUserLocationFindFirst.mockResolvedValue({ userId: 'user-123', locationId: 1 })
      mockContestTrackFindMany.mockResolvedValue([
        createMockContestTrack({
          id: 1,
          userId: 'user-123',
          contestStatus: ContestStatusEnum.Enum.InProgress
        })
      ])

      const result = await updateTrackStatusForUser(1, 'user-123', TrackStatus.DONE)

      expect(result).toBe(true)
      expect(mockContestUserTrackUpsert).toHaveBeenCalled()
    })

    it('does not update contest track when contest is not in progress', async () => {
      mockAuth.mockResolvedValue(mockUser)
      mockPrismaTrackFindUnique.mockResolvedValue({ id: 1, locationId: 1 })
      mockCheckUserLocationRole.mockResolvedValue(false)
      mockPrismaUserLocationFindFirst.mockResolvedValue({ userId: 'user-123', locationId: 1 })
      mockContestTrackFindMany.mockResolvedValue([
        createMockContestTrack({
          id: 1,
          userId: 'user-123',
          contestStatus: ContestStatusEnum.Enum.Created
        })
      ])

      const result = await updateTrackStatusForUser(1, 'user-123', TrackStatus.DONE)

      expect(result).toBe(true)
      expect(mockContestUserTrackUpsert).not.toHaveBeenCalled()
    })

    it('allows opener to update contest track regardless of contest status', async () => {
      mockAuth.mockResolvedValue(mockUser)
      mockPrismaTrackFindUnique.mockResolvedValue({ id: 1, locationId: 1 })
      mockCheckUserLocationRole.mockResolvedValue(true)
      mockContestTrackFindMany.mockResolvedValue([
        createMockContestTrack({
          id: 1,
          userId: 'other-user',
          contestStatus: ContestStatusEnum.Enum.Over
        })
      ])

      const result = await updateTrackStatusForUser(1, 'user-123', TrackStatus.DONE)

      expect(result).toBe(true)
      expect(mockContestUserTrackUpsert).toHaveBeenCalled()
    })

    it('skips update when there is no contestUser', async () => {
      mockAuth.mockResolvedValue(mockUser)
      mockPrismaTrackFindUnique.mockResolvedValue({ id: 1, locationId: 1 })
      mockCheckUserLocationRole.mockResolvedValue(true)
      mockContestTrackFindMany.mockResolvedValue([{
        id: 1,
        contestId: 1,
        trackId: 1,
        contest: {
          status: ContestStatusEnum.Enum.InProgress,
          contestUsers: []
        }
      }])

      const result = await updateTrackStatusForUser(1, 'user-123', TrackStatus.DONE)

      expect(result).toBe(true)
      expect(mockContestUserTrackUpsert).not.toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    it('returns false on database error', async () => {
      mockAuth.mockResolvedValue(mockUser)
      mockPrismaTrackFindUnique.mockResolvedValue({ id: 1, locationId: 1 })
      mockCheckUserLocationRole.mockResolvedValue(true)
      mockPrismaTransaction.mockRejectedValue(new Error('Database error'))

      const result = await updateTrackStatusForUser(1, 'user-123', TrackStatus.DONE)

      expect(result).toBe(false)
    })
  })
})

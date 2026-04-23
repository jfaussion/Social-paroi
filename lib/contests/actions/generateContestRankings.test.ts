import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { generateContestRankings } from '@/lib/contests/actions/generateContestRankings'
import { ContestRankingTypeEnum } from '@/domain/ContestRankingType.enum'
import { TrackStatus } from '@/domain/TrackStatus.enum'
import { ContestStatusEnum } from '@/domain/ContestStatus.enum'
import type { Session } from 'next-auth'

const { mockAuth, mockCheckUserLocationRole, mockPrismaTransaction,
  mockContestFindUnique,
  mockContestRankingDeleteMany, mockContestRankingCreate, mockContestUpdate,
  mockContestTrackFindMany, mockContestActivityFindMany,
  mockContestUserFindMany, mockContestUserTrackGroupBy } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockCheckUserLocationRole: vi.fn(),
  mockPrismaTransaction: vi.fn(),
  mockContestFindUnique: vi.fn(),
  mockContestRankingDeleteMany: vi.fn(),
  mockContestRankingCreate: vi.fn(),
  mockContestUpdate: vi.fn(),
  mockContestTrackFindMany: vi.fn(),
  mockContestActivityFindMany: vi.fn(),
  mockContestUserFindMany: vi.fn(),
  mockContestUserTrackGroupBy: vi.fn()
}))

vi.mock('@/prisma', () => ({
  default: {
    $transaction: mockPrismaTransaction,
    contest: {
      findUnique: mockContestFindUnique
    },
    contestTrack: {
      findMany: mockContestTrackFindMany
    },
    contestActivity: {
      findMany: mockContestActivityFindMany
    },
    contestUser: {
      findMany: mockContestUserFindMany
    },
    contestUserTrack: {
      groupBy: mockContestUserTrackGroupBy
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

describe('generateContestRankings', () => {
  const mockUser: Session = {
    user: { id: 'opener-123', name: 'Opener User', email: 'opener@example.com' },
    expires: '2024-12-31'
  } as Session

  beforeEach(() => {
    vi.clearAllMocks()
    mockPrismaTransaction.mockImplementation(async (callback: Function) => {
      const tx = {
        contestRanking: {
          deleteMany: mockContestRankingDeleteMany,
          create: mockContestRankingCreate
        },
        contest: {
          update: mockContestUpdate
        }
      }
      return callback(tx)
    })
    mockContestRankingDeleteMany.mockResolvedValue({ count: 0 })
    mockContestRankingCreate.mockResolvedValue({ id: 1 })
    mockContestUpdate.mockResolvedValue({ id: 1, status: ContestStatusEnum.Enum.Over })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('authentication checks', () => {
    it('throws error when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null)

      await expect(generateContestRankings(1)).rejects.toThrow('User not authenticated')
    })

    it('throws error when user is not an opener', async () => {
      mockAuth.mockResolvedValue(mockUser)
      mockContestFindUnique.mockResolvedValue({ locationId: 1 })
      mockCheckUserLocationRole.mockResolvedValue(false)

      await expect(generateContestRankings(1)).rejects.toThrow('Only openers can generate rankings')
    })

    it('throws error when contest is not found', async () => {
      mockAuth.mockResolvedValue(mockUser)
      mockContestFindUnique.mockResolvedValue(null)

      await expect(generateContestRankings(1)).rejects.toThrow('Contest not found')
    })
  })

  describe('successful ranking generation', () => {
    const mockTrackCompletions = [
      { contestTrackId: 1, _count: { contestTrackId: 2 } },
      { contestTrackId: 2, _count: { contestTrackId: 1 } }
    ]

    const mockContestTracks = [
      { id: 1, contestId: 1, trackId: 1, track: { id: 1, name: 'Track A' } },
      { id: 2, contestId: 1, trackId: 2, track: { id: 2, name: 'Track B' } }
    ]

    const mockContestActivities = [
      { id: 1, contestId: 1, name: 'Activity 1' },
      { id: 2, contestId: 1, name: 'Activity 2' }
    ]

    const mockContestUsers = [
      {
        id: 1,
        contestId: 1,
        user: { name: 'User 1' },
        name: 'User 1',
        gender: 'Man' as const,
        trackResults: [
          { contestTrackId: 1, status: TrackStatus.DONE, contestTrack: { track: { id: 1, name: 'Track A' } } }
        ],
        activityResults: [
          { contestActivityId: 1, score: 50, contestActivity: { name: 'Activity 1' } }
        ]
      },
      {
        id: 2,
        contestId: 1,
        user: { name: 'User 2' },
        name: 'User 2',
        gender: 'Woman' as const,
        trackResults: [
          { contestTrackId: 1, status: TrackStatus.DONE, contestTrack: { track: { id: 1, name: 'Track A' } } },
          { contestTrackId: 2, status: TrackStatus.DONE, contestTrack: { track: { id: 2, name: 'Track B' } } }
        ],
        activityResults: [
          { contestActivityId: 2, score: 30, contestActivity: { name: 'Activity 2' } }
        ]
      }
    ]

    beforeEach(() => {
      mockAuth.mockResolvedValue(mockUser)
      mockContestFindUnique.mockResolvedValue({ locationId: 1 })
      mockCheckUserLocationRole.mockResolvedValue(true)
      mockContestTrackFindMany.mockResolvedValue(mockContestTracks as any)
      mockContestActivityFindMany.mockResolvedValue(mockContestActivities as any)
      mockContestUserFindMany.mockResolvedValue(mockContestUsers as any)
      mockContestUserTrackGroupBy.mockResolvedValue(mockTrackCompletions as any)
    })

    it('generates rankings successfully', async () => {
      const result = await generateContestRankings(1)

      expect(result).toBe(true)
    })

    it('deletes existing rankings before creating new ones', async () => {
      await generateContestRankings(1)

      expect(mockContestRankingDeleteMany).toHaveBeenCalledWith({
        where: { contestId: 1 }
      })
    })

    it('creates ranking entries for each ranking type', async () => {
      await generateContestRankings(1)

      expect(mockContestRankingCreate).toHaveBeenCalledTimes(3)
    })

    it('updates contest status to Over after generating rankings', async () => {
      await generateContestRankings(1)

      expect(mockContestUpdate).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: ContestStatusEnum.Enum.Over }
      })
    })
  })

  describe('csv content generation', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue(mockUser)
      mockContestFindUnique.mockResolvedValue({ locationId: 1 })
      mockCheckUserLocationRole.mockResolvedValue(true)
    })

    it('generates csv content with correct headers', async () => {
      const mockContestTracks = [
        { id: 1, contestId: 1, trackId: 1, track: { id: 1, name: 'Block 1' } }
      ]
      const mockContestActivities = [
        { id: 1, contestId: 1, name: 'Presentation' }
      ]
      const mockContestUsers = [{
        id: 1,
        contestId: 1,
        user: null,
        name: 'Test User',
        gender: 'Man' as const,
        trackResults: [],
        activityResults: []
      }]

      mockContestTrackFindMany.mockResolvedValue(mockContestTracks as any)
      mockContestActivityFindMany.mockResolvedValue(mockContestActivities as any)
      mockContestUserFindMany.mockResolvedValue(mockContestUsers as any)
      mockContestUserTrackGroupBy.mockResolvedValue([])

      await generateContestRankings(1)

      const createCall = mockContestRankingCreate.mock.calls[0][0]
      expect(createCall.data.csvContent).toBeDefined()
      expect(createCall.data.csvContent).toContain('Rank')
      expect(createCall.data.csvContent).toContain('Name')
      expect(createCall.data.csvContent).toContain('Total Score')
    })
  })

  describe('error handling', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue(mockUser)
      mockContestFindUnique.mockResolvedValue({ locationId: 1 })
      mockCheckUserLocationRole.mockResolvedValue(true)
    })

    it('returns false on database error', async () => {
      mockPrismaTransaction.mockRejectedValue(new Error('Database error'))

      const result = await generateContestRankings(1)

      expect(result).toBe(false)
    })

    it('returns false when fetching contest users fails', async () => {
      mockContestUserFindMany.mockRejectedValue(new Error('Fetch error'))

      const result = await generateContestRankings(1)

      expect(result).toBe(false)
    })
  })

  describe('ranking type handling', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue(mockUser)
      mockContestFindUnique.mockResolvedValue({ locationId: 1 })
      mockCheckUserLocationRole.mockResolvedValue(true)

      mockContestTrackFindMany.mockResolvedValue([])
      mockContestActivityFindMany.mockResolvedValue([])
      mockContestUserFindMany.mockResolvedValue([])
      mockContestUserTrackGroupBy.mockResolvedValue([])
    })

    it('creates Overall ranking', async () => {
      await generateContestRankings(1)

      expect(mockContestRankingCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: ContestRankingTypeEnum.Enum.Overall
          })
        })
      )
    })

    it('creates Men ranking', async () => {
      await generateContestRankings(1)

      expect(mockContestRankingCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: ContestRankingTypeEnum.Enum.Men
          })
        })
      )
    })

    it('creates Women ranking', async () => {
      await generateContestRankings(1)

      expect(mockContestRankingCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: ContestRankingTypeEnum.Enum.Women
          })
        })
      )
    })
  })
})

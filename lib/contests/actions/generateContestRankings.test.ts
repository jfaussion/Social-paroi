import { describe, it, expect, vi } from 'vitest'

vi.mock('@/prisma', () => ({
  default: {}
}))

vi.mock('@/auth', () => ({
  auth: vi.fn()
}))

vi.mock('@/utils/logger', () => ({
  createActionLogger: () => ({
    start: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    success: vi.fn()
  })
}))

import { calculateTrackScores, calculateUserScores } from './generateContestRankings'
import { TrackStatus } from '@/domain/TrackStatus.enum'

type TestUser = Parameters<typeof calculateUserScores>[0][number]

describe('calculateTrackScores', () => {
  it('empty completions returns empty map', () => {
    const result = calculateTrackScores([])
    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(0)
  })

  it('single completion gives 1000 / 1 = 1000', () => {
    const result = calculateTrackScores([
      { contestTrackId: 1, _count: { contestTrackId: 1 } }
    ])
    expect(result.get(1)).toBe(1000)
  })

  it('multiple completions on different tracks each get 1000 / count', () => {
    const result = calculateTrackScores([
      { contestTrackId: 1, _count: { contestTrackId: 2 } },
      { contestTrackId: 2, _count: { contestTrackId: 5 } }
    ])
    expect(result.get(1)).toBe(500)
    expect(result.get(2)).toBe(200)
  })

  it('count of 4 gives 1000 / 4 = 250', () => {
    const result = calculateTrackScores([
      { contestTrackId: 7, _count: { contestTrackId: 4 } }
    ])
    expect(result.get(7)).toBe(250)
  })

  it('count of 0 is guarded and gives POINTS_PER_TRACK (1000)', () => {
    const result = calculateTrackScores([
      { contestTrackId: 5, _count: { contestTrackId: 0 } }
    ])
    expect(result.get(5)).toBe(1000)
  })
})

describe('calculateUserScores', () => {
  function makeUser(overrides: {
    id?: number
    name?: string | null
    trackResults?: Array<{ contestTrackId: number; status: string; contestTrack: { track: { id: number; name: string | null } } }>
    activityResults?: Array<{ contestActivityId: number; score: number; contestActivity: { name: string } }>
  }): TestUser {
    return {
      id: overrides.id ?? 1,
      name: overrides.name ?? null,
      user: null,
      trackResults: overrides.trackResults ?? [],
      activityResults: overrides.activityResults ?? []
    } as TestUser
  }

  it('user with no completed tracks has trackScore = 0', () => {
    const user = makeUser({
      trackResults: [
        {
          contestTrackId: 1,
          status: TrackStatus.TO_DO,
          contestTrack: { track: { id: 1, name: 'Track A' } }
        }
      ]
    })
    const trackPoints = new Map([[1, 500]])
    const [result] = calculateUserScores([user], trackPoints)
    expect(result.trackScore).toBe(0)
    expect(result.completedTracks).toBe(0)
  })

  it('user with one DONE track gets score from trackPoints map', () => {
    const user = makeUser({
      trackResults: [
        {
          contestTrackId: 3,
          status: TrackStatus.DONE,
          contestTrack: { track: { id: 3, name: 'Block 3' } }
        }
      ]
    })
    const trackPoints = new Map([[3, 250]])
    const [result] = calculateUserScores([user], trackPoints)
    expect(result.trackScore).toBe(250)
    expect(result.completedTracks).toBe(1)
  })

  it('user with multiple activity results has activityScore summed', () => {
    const user = makeUser({
      activityResults: [
        { contestActivityId: 10, score: 80, contestActivity: { name: 'Presentation' } },
        { contestActivityId: 11, score: 45, contestActivity: { name: 'Dynamo' } }
      ]
    })
    const trackPoints = new Map<number, number>()
    const [result] = calculateUserScores([user], trackPoints)
    expect(result.activityScore).toBe(125)
  })

  it('DONE track not in trackPoints map defaults to POINTS_PER_TRACK (1000)', () => {
    const user = makeUser({
      trackResults: [
        {
          contestTrackId: 99,
          status: TrackStatus.DONE,
          contestTrack: { track: { id: 99, name: 'Unknown Block' } }
        }
      ]
    })
    const trackPoints = new Map<number, number>()
    const [result] = calculateUserScores([user], trackPoints)
    expect(result.trackScore).toBe(1000)
  })
})

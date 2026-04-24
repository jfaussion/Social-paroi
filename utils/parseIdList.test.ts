import { describe, it, expect } from 'vitest'
import { parseIdListFromQueryParam } from '@/utils/parseIdList'

describe('parseIdListFromQueryParam', () => {
  describe('null and empty input', () => {
    it('returns empty array for null', () => {
      expect(parseIdListFromQueryParam(null)).toEqual([])
    })

    it('returns empty array for empty string', () => {
      expect(parseIdListFromQueryParam('')).toEqual([])
    })
  })

  describe('valid input', () => {
    it('parses valid array of positive integers', () => {
      const input = encodeURIComponent(JSON.stringify([1, 2, 3]))
      expect(parseIdListFromQueryParam(input)).toEqual([1, 2, 3])
    })

    it('handles single element array', () => {
      const input = encodeURIComponent(JSON.stringify([42]))
      expect(parseIdListFromQueryParam(input)).toEqual([42])
    })

    it('handles large positive integers', () => {
      const input = encodeURIComponent(JSON.stringify([999999, 1000000]))
      expect(parseIdListFromQueryParam(input)).toEqual([999999, 1000000])
    })
  })

  describe('invalid input - type validation', () => {
    it('rejects non-array JSON', () => {
      const input = encodeURIComponent(JSON.stringify({ id: 1 }))
      expect(parseIdListFromQueryParam(input)).toEqual([])
    })

    it('rejects array with string elements', () => {
      const input = encodeURIComponent(JSON.stringify(['a', 'b', 'c']))
      expect(parseIdListFromQueryParam(input)).toEqual([])
    })

    it('rejects array with mixed types', () => {
      const input = encodeURIComponent(JSON.stringify([1, 'two', 3]))
      expect(parseIdListFromQueryParam(input)).toEqual([])
    })

    it('rejects array with floating point numbers', () => {
      const input = encodeURIComponent(JSON.stringify([1.5, 2.5]))
      expect(parseIdListFromQueryParam(input)).toEqual([])
    })

    it('rejects array with zero', () => {
      const input = encodeURIComponent(JSON.stringify([0, 1, 2]))
      expect(parseIdListFromQueryParam(input)).toEqual([])
    })

    it('rejects array with negative numbers', () => {
      const input = encodeURIComponent(JSON.stringify([-1, 2, 3]))
      expect(parseIdListFromQueryParam(input)).toEqual([])
    })

    it('rejects array with boolean elements', () => {
      const input = encodeURIComponent(JSON.stringify([true, false]))
      expect(parseIdListFromQueryParam(input)).toEqual([])
    })

    it('rejects array with null elements', () => {
      const input = encodeURIComponent(JSON.stringify([1, null, 3]))
      expect(parseIdListFromQueryParam(input)).toEqual([])
    })

    it('rejects array with undefined elements', () => {
      const input = encodeURIComponent(JSON.stringify([1, undefined, 3]))
      expect(parseIdListFromQueryParam(input)).toEqual([])
    })

    it('rejects array with object elements', () => {
      const input = encodeURIComponent(JSON.stringify([{ id: 1 }]))
      expect(parseIdListFromQueryParam(input)).toEqual([])
    })
  })

  describe('malformed input', () => {
    it('returns empty array for invalid JSON', () => {
      expect(parseIdListFromQueryParam('not-valid-json')).toEqual([])
    })

    it('returns empty array for partial JSON', () => {
      expect(parseIdListFromQueryParam('[1, 2,')).toEqual([])
    })

    it('returns empty array for empty string wrapped', () => {
      expect(parseIdListFromQueryParam('')).toEqual([])
    })

    it('returns empty array for plain text', () => {
      expect(parseIdListFromQueryParam('hello world')).toEqual([])
    })
  })

  describe('encoding edge cases', () => {
    it('handles already encoded string (double encoding)', () => {
      const input = encodeURIComponent(encodeURIComponent(JSON.stringify([1, 2])))
      expect(parseIdListFromQueryParam(input)).toEqual([])
    })

    it('handles special characters in values', () => {
      const input = encodeURIComponent(JSON.stringify([100]))
      expect(parseIdListFromQueryParam(input)).toEqual([100])
    })
  })
})
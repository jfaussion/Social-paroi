import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock console methods to capture output
const mockConsoleInfo = vi.fn()
const mockConsoleError = vi.fn()

vi.stubGlobal('console', {
  ...console,
  info: mockConsoleInfo,
  error: mockConsoleError,
})

import { createActionLogger } from '@/utils/logger'

describe('createActionLogger', () => {
  const actionName = 'testAction'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('start', () => {
    it('logs start message with context', () => {
      const logger = createActionLogger(actionName)
      const context = { userId: '123', entityId: 456 }

      logger.start(context)

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        `[action:${actionName}] start`,
        context
      )
    })

    it('logs start message without context when undefined', () => {
      const logger = createActionLogger(actionName)

      logger.start()

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        `[action:${actionName}] start`,
        undefined
      )
    })

    it('logs start message without context when empty object', () => {
      const logger = createActionLogger(actionName)

      logger.start({})

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        `[action:${actionName}] start`,
        undefined
      )
    })
  })

  describe('info', () => {
    it('logs info message with context', () => {
      const logger = createActionLogger(actionName)
      const message = 'userCreated'
      const context = { userId: '123' }

      logger.info(message, context)

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        `[action:${actionName}] ${message}`,
        context
      )
    })

    it('logs info message without context', () => {
      const logger = createActionLogger(actionName)
      const message = 'userCreated'

      logger.info(message)

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        `[action:${actionName}] ${message}`,
        undefined
      )
    })

    it('logs info message with empty context', () => {
      const logger = createActionLogger(actionName)
      const message = 'userCreated'

      logger.info(message, {})

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        `[action:${actionName}] ${message}`,
        undefined
      )
    })
  })

  describe('success', () => {
    it('logs success message with context', () => {
      const logger = createActionLogger(actionName)
      const context = { entityId: 456, count: 10 }

      logger.success(context)

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        `[action:${actionName}] success`,
        context
      )
    })

    it('logs success message without context', () => {
      const logger = createActionLogger(actionName)

      logger.success()

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        `[action:${actionName}] success`,
        undefined
      )
    })

    it('logs success message with empty context', () => {
      const logger = createActionLogger(actionName)

      logger.success({})

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        `[action:${actionName}] success`,
        undefined
      )
    })
  })

  describe('error', () => {
    it('logs error message with error object and context', () => {
      const logger = createActionLogger(actionName)
      const error = new Error('Something went wrong')
      const context = { userId: '123' }

      logger.error(error, context)

      expect(mockConsoleError).toHaveBeenCalledWith(
        `[action:${actionName}] error`,
        { error, ...context }
      )
    })

    it('logs error message with error object without context', () => {
      const logger = createActionLogger(actionName)
      const error = new Error('Something went wrong')

      logger.error(error)

      expect(mockConsoleError).toHaveBeenCalledWith(
        `[action:${actionName}] error`,
        { error }
      )
    })

    it('logs error message with string error', () => {
      const logger = createActionLogger(actionName)
      const error = 'String error message'

      logger.error(error)

      expect(mockConsoleError).toHaveBeenCalledWith(
        `[action:${actionName}] error`,
        { error }
      )
    })

    it('logs error message with object error', () => {
      const logger = createActionLogger(actionName)
      const error = { code: 'AUTH_ERROR', message: 'Invalid token' }
      const context = { requestId: 'req-123' }

      logger.error(error, context)

      expect(mockConsoleError).toHaveBeenCalledWith(
        `[action:${actionName}] error`,
        { error, ...context }
      )
    })
  })

  it('creates different loggers for different action names', () => {
    const logger1 = createActionLogger('action1')
    const logger2 = createActionLogger('action2')

    logger1.start({ id: 1 })
    logger2.start({ id: 2 })

    expect(mockConsoleInfo).toHaveBeenNthCalledWith(
      1,
      '[action:action1] start',
      { id: 1 }
    )
    expect(mockConsoleInfo).toHaveBeenNthCalledWith(
      2,
      '[action:action2] start',
      { id: 2 }
    )
  })
})

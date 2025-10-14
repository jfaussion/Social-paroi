type ActionLogContext = Record<string, unknown>;

const normalizeContext = (context?: ActionLogContext) =>
  context && Object.keys(context).length > 0 ? context : undefined;

export function createActionLogger(actionName: string) {
  const prefix = `[action:${actionName}]`;

  return {
    start: (context?: ActionLogContext) => {
      console.info(`${prefix} start`, normalizeContext(context));
    },
    info: (message: string, context?: ActionLogContext) => {
      console.info(`${prefix} ${message}`, normalizeContext(context));
    },
    success: (context?: ActionLogContext) => {
      console.info(`${prefix} success`, normalizeContext(context));
    },
    error: (error: unknown, context?: ActionLogContext) => {
      const payload = { error, ...(context ?? {}) };
      console.error(`${prefix} error`, payload);
    },
  };
}

import { AOCPartResult } from "./returnType";

export function measurePerformance(fn: () => any): AOCPartResult {
  const timeStampStart = new Date(Date.now()).toISOString();
  const startTime = performance.now()
  const result = fn();
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  const timeStampEnd = new Date(Date.now()).toISOString();

  return {
    Result: result,
    ExecutionTime: Math.round(executionTime * 1000000), // Convert to nanoseconds
    Timestamp: {
      Start: timeStampStart,
      End: timeStampEnd,
    },
  }
}
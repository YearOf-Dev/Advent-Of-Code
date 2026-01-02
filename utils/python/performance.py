import time
from datetime import timedelta, datetime
from typing import Callable
from utils.python.types import AOCPartResult, AOCTimestamp
from utils.python.input import readInputAsArray

def measurePerformance(fn: Callable, input: any) -> AOCPartResult:
  # Start the timer
  start_time = time.monotonic()
  start_timestamp = datetime.now().isoformat()

  result = fn(input)

  # End the timer
  end_time = time.monotonic()
  end_timestamp = datetime.now().isoformat()
  duration = timedelta(seconds=end_time - start_time).total_seconds()*1000000000

  return AOCPartResult(
    Result=result,
    ExecutionTime=duration,
    Timestamp=AOCTimestamp(
      Start=start_timestamp,
      End=end_timestamp,
    ),
  )
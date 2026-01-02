from typing import TypedDict

class AOCTimestamp(TypedDict):
  Start: str
  End: str

class AOCPartResult(TypedDict):
  Result: any
  ExecutionTime: int
  Timestamp: AOCTimestamp

class AOCDayResults(TypedDict):
  Year: int
  Day: int
  Part1: AOCPartResult
  Part2: AOCPartResult
  Duration: int
  Timestamp: AOCTimestamp
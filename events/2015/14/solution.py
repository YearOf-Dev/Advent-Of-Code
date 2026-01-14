import sys
import json
import time
from datetime import timedelta, datetime
from pathlib import Path
from typing import TypedDict, Dict
import math

# Add workspace root to path for imports
workspace_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(workspace_root))

from utils.python.types import AOCDayResults, AOCTimestamp, AOCPartResult
from utils.python.input import readInputAsArray
from utils.python.performance import measurePerformance

class ReindeerStats(TypedDict):
  fly_speed: int
  fly_duration: int
  rest_duration: int
  points: int

def whoIsInTheLead(reindeers: Dict[str, ReindeerStats], duration: int) -> (list[str], int):
  max_distance = 0
  winning_reindeer: list[str] = []

  for reindeer in reindeers:
    stats = reindeers[reindeer]
    distance = 0

    distancePerBurst = stats["fly_speed"] * stats["fly_duration"]
    durationRemaining = duration
    fullPeriod = stats["fly_duration"] + stats["rest_duration"]

    if duration < stats["fly_duration"]:
      distance = stats["fly_speed"] * duration
    else:
      distance += distancePerBurst
      durationRemaining -= stats["fly_duration"]

      potentialBursts = math.floor(durationRemaining/fullPeriod)
      distance += distancePerBurst * potentialBursts

      timeAfterBursts = durationRemaining - (potentialBursts * fullPeriod)
      if timeAfterBursts > stats["rest_duration"]:
        extraTime = timeAfterBursts - stats["rest_duration"]
        distance += extraTime * stats["fly_speed"]
    if distance > max_distance:
      max_distance = distance
      winning_reindeer = [reindeer]
    elif distance == max_distance:
      winning_reindeer.append(reindeer)
  return (winning_reindeer, max_distance)

# ----------------------------------------------------------------------------------------------------
# | Part 1
# ----------------------------------------------------------------------------------------------------
def part1(input: list[str]) -> int:
  duration = 2503
  reindeers: Dict[str, ReindeerStats] = {}

  for item in input:
    if len(item) == 0:
      continue

    parts = item.split(" ")
    stats: ReindeerStats = {
      "fly_speed": int(parts[3]),
      "fly_duration": int(parts[6]),
      "rest_duration": int(parts[13]),
      "points": 0
    }
    reindeers[parts[0]] = stats

  winning_reindeer, max_distance = whoIsInTheLead(reindeers, duration)
  return max_distance

# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> int:
  duration = 2503
  reindeers: Dict[str, ReindeerStats] = {}

  for item in input:
    if len(item) == 0:
      continue

    parts = item.split(" ")
    stats: ReindeerStats = {
      "fly_speed": int(parts[3]),
      "fly_duration": int(parts[6]),
      "rest_duration": int(parts[13]),
      "points": 0
    }
    reindeers[parts[0]] = stats

  for s in range(1, duration+1):
    winners, distance = whoIsInTheLead(reindeers, s)

    for winner in winners:
      reindeers[winner]["points"] += 1

  maxPoints = 0
  for reindeer in reindeers:
    if reindeers[reindeer]["points"] > maxPoints:
      maxPoints = reindeers[reindeer]["points"]

  return maxPoints

# ----------------------------------------------------------------------------------------------------
# | Main Function
# ----------------------------------------------------------------------------------------------------
def main():
  # Get the arguments
  args = sys.argv[1:]
  fileName = args[0] if args else "input.txt"

  # Start the timer
  start_timestamp = datetime.now().isoformat()
  start_time = time.monotonic()

  # Read the input to an array of strings
  input = readInputAsArray(fileName)

  ## Run the parts
  p1Result = measurePerformance(part1, input)
  p2Result = measurePerformance(part2, input)

  # End the timer
  end_time = time.monotonic()
  end_timestamp = datetime.now().isoformat()
  duration = timedelta(seconds=end_time - start_time).total_seconds()*1000000000 # Convert to nanoseconds

  # Return the results
  return AOCDayResults(
    Year=2015,
    Day=14,
    Part1=p1Result,
    Part2=p2Result,
    Duration=duration,
    Timestamp=AOCTimestamp(
      Start=start_timestamp,
      End=end_timestamp,
    ),
  )



if __name__ == "__main__":
  results = main()
  print(json.dumps(results))
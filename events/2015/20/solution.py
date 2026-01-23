import sys
import json
import time
from datetime import timedelta, datetime
from pathlib import Path
import math

# Add workspace root to path for imports
workspace_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(workspace_root))

from utils.python.types import AOCDayResults, AOCTimestamp, AOCPartResult
from utils.python.input import readInputAsArray
from utils.python.performance import measurePerformance

def elvesWhoVisited(house: int) -> list[int]:
  elves: list[int] = [1, house]

  for i in range(2, math.floor(math.sqrt(house))):
    if house % i == 0:
      elves.append(i)
      if i != math.floor(house/i):
        elves.append(math.floor(house/i))

  return elves

def elvesWhoVisitedLimited(house: int, limit: int) -> list[int]:
  elves: list[int] = []
  
  if limit >= house:
    elves.append(1)
  
  for i in range(2, math.floor(math.sqrt(house)) + 1):
    if house % i == 0:
      if i * limit >= house:
        elves.append(i)

      paired = house // i
      if i != paired and paired * limit >= house:
        elves.append(paired)
  
  elves.append(house)
    
  return elves

# ----------------------------------------------------------------------------------------------------
# | Part 1
# ----------------------------------------------------------------------------------------------------
def part1(input: list[str]) -> int:
  target = int(input[0])
  lastHouse = 0

  while True:
    elves = elvesWhoVisited(lastHouse + 1)
    presents = sum(elves) * 10

    if presents >= target:
      return lastHouse + 1

    lastHouse += 1

# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> int:
  target = int(input[0])
  lastHouse = 0

  while True:
    elves = elvesWhoVisitedLimited(lastHouse + 1, 50)
    presents = sum(elves) * 11

    if presents >= target:
      return lastHouse + 1

    lastHouse += 1

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
    Day=20,
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
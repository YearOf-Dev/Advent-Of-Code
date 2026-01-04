import sys
import json
import time
from datetime import timedelta, datetime
from pathlib import Path
from collections import defaultdict


# Add workspace root to path for imports
workspace_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(workspace_root))

from utils.python.types import AOCDayResults, AOCTimestamp, AOCPartResult
from utils.python.input import readInputAsArray
from utils.python.performance import measurePerformance

class Coord(object):
  def __init__(self, x: int = 0, y: int = 0):
    self.x = x
    self.y = y
  def __eq__(self, other):
      return isinstance(other, Coord) and self.x == other.x and self.y == other.y
  
  def __hash__(self):
      return hash((self.x, self.y))

# ----------------------------------------------------------------------------------------------------
# | Part 1
# ----------------------------------------------------------------------------------------------------
def part1(input: list[str]) -> int:
  visited: [Coord] = []

  pos = Coord()
  visited.append(Coord(pos.x, pos.y))

  for direction in input[0]:
    if direction == "^":
      pos.y += 1
    elif direction == "v":
      pos.y -= 1
    elif direction == ">":
      pos.x += 1
    elif direction == "<":
      pos.x -= 1

    if pos not in visited:
      visited.append(Coord(pos.x, pos.y))

  return len(visited)


# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> int:
  visited: [Coord] = []

  santa_pos = Coord()
  robot_pos = Coord()
  visited.append(Coord(santa_pos.x, santa_pos.y))

  for i, direction in enumerate[str](input[0]):
    if i % 2 == 0:
      if direction == "^":
        santa_pos.y += 1
      elif direction == "v":
        santa_pos.y -= 1
      elif direction == ">":
        santa_pos.x += 1
      elif direction == "<":
        santa_pos.x -= 1

      if santa_pos not in visited:
        visited.append(Coord(santa_pos.x, santa_pos.y))
    else:
      if direction == "^":
        robot_pos.y += 1
      elif direction == "v":
        robot_pos.y -= 1
      elif direction == ">":
        robot_pos.x += 1
      elif direction == "<":
        robot_pos.x -= 1

      if robot_pos not in visited:
        visited.append(Coord(robot_pos.x, robot_pos.y))

  return len(visited)

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
    Day=3,
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
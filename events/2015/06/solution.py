import sys
import json
import time
from datetime import timedelta, datetime
from pathlib import Path

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
  max_x = 1000
  max_y = 1000

  state: dict[int, dict[int, bool]] = {}

  for x in range(0, max_x):
    state[x] = {}
    for y in range(0, max_y):
      state[x][y] = False

  for command_line in input:
    command_segments = command_line.split();

    command = ""
    start = Coord()
    end = Coord()
    if len(command_segments) == 5:
      command = command_segments[1]
      s_parts = command_segments[2].split(",")
      e_parts = command_segments[4].split(",")
      start = Coord(x = int(s_parts[0]), y = int(s_parts[1]))
      end = Coord(x = int(e_parts[0]), y = int(e_parts[1]))
    elif len(command_segments) == 4:
      command = "toggle"
      s_parts = command_segments[1].split(",")
      e_parts = command_segments[3].split(",")
      start = Coord(x = int(s_parts[0]), y = int(s_parts[1]))
      end = Coord(x = int(e_parts[0]), y = int(e_parts[1]))
    else:
      continue;

    for x in range(start.x, end.x + 1):
      for y in range(start.y, end.y + 1):
        if command == "on":
          state[x][y] = True
        elif command == "off":
          state[x][y] = False
        elif command == "toggle":
          state[x][y] = not state[x][y]
  
  count = 0
  for x in range(0, max_x):
    for y in range(0, max_y):
      if state[x][y] == True:
        count += 1

  return count

# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> int:
  max_x = 1000
  max_y = 1000

  state: dict[int, dict[int, int]] = {}

  for x in range(0, max_x):
    state[x] = {}
    for y in range(0, max_y):
      state[x][y] = 0

  for command_line in input:
    command_segments = command_line.split();

    command = ""
    start = Coord()
    end = Coord()
    if len(command_segments) == 5:
      command = command_segments[1]
      s_parts = command_segments[2].split(",")
      e_parts = command_segments[4].split(",")
      start = Coord(x = int(s_parts[0]), y = int(s_parts[1]))
      end = Coord(x = int(e_parts[0]), y = int(e_parts[1]))
    elif len(command_segments) == 4:
      command = "toggle"
      s_parts = command_segments[1].split(",")
      e_parts = command_segments[3].split(",")
      start = Coord(x = int(s_parts[0]), y = int(s_parts[1]))
      end = Coord(x = int(e_parts[0]), y = int(e_parts[1]))
    else:
      continue;

    for x in range(start.x, end.x + 1):
      for y in range(start.y, end.y + 1):
        if command == "on":
          state[x][y] += 1
        elif command == "off":
          if state[x][y] != 0:
            state[x][y] -= 1
        elif command == "toggle":
          state[x][y] += 2
  
  count = 0
  for x in range(0, max_x):
    for y in range(0, max_y):
      count += state[x][y]

  return count

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
    Day=6,
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
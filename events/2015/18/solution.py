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

def count_light(state: dict[int, dict[int, bool]], y: int, x: int, count: int) -> int:
  if state[y][x]:
    return count + 1
  return count


def count_neighbours(state: dict[int, dict[int, bool]]) -> dict[int, dict[int, int]]:
  count: dict[int, dict[int, int]] = {}
  grid_size = 0

  # Build an empty count from state
  for y in state:
    grid_size += 1
    count[y] = {}
    for x in state[y]:
      count[y][x] = 0

  # Work through every position
  for y in range(grid_size):
    for x in range(grid_size):
      count_for_light = 0

      # Check the row Above
      if y != 0:
        if x != 0:
          count_for_light = count_light(state, y - 1, x - 1, count_for_light)
        count_for_light = count_light(state, y - 1, x, count_for_light)
        if x != grid_size - 1:
          count_for_light = count_light(state, y - 1, x + 1, count_for_light)

      # Check the current Row
      if x != 0:
        count_for_light = count_light(state, y, x - 1, count_for_light)
      if x != grid_size - 1:
        count_for_light = count_light(state, y, x + 1, count_for_light)

      # Count the row below
      if y + 1 != grid_size:
        if x != 0:
          count_for_light = count_light(state, y + 1, x - 1, count_for_light)
        count_for_light = count_light(state, y + 1, x, count_for_light)
        if x != grid_size - 1:
          count_for_light = count_light(state, y + 1, x + 1, count_for_light)

      # Update the main count
      count[y][x] = count_for_light

  return count


def force_corners_on(state: dict[int, dict[int, bool]], grid_size: int) -> dict[int, dict[int, bool]]:
  last_index = grid_size - 1
  state[0][0] = True
  state[0][last_index] = True
  state[last_index][0] = True
  state[last_index][last_index] = True
  return state


# ----------------------------------------------------------------------------------------------------
# | Part 1
# ----------------------------------------------------------------------------------------------------
def part1(input: list[str]) -> int:
  state: dict[int, dict[int, bool]] = {}
  grid_size_y = 0
  grid_size_x = 0
  iterations = 100

  # Read through the input and build the state
  for line in input:
    if len(line) == 0:
      # This is a blank line, ignore it
      continue

    # Set the length of the line
    if grid_size_x == 0:
      grid_size_x = len(line)
    elif grid_size_x != len(line):
      print("Malformed input")
      return 0

    state[grid_size_y] = {}
    for li in range(len(line)):
      if line[li] == "#":
        state[grid_size_y][li] = True
      else:
        state[grid_size_y][li] = False

    # Increment GridSizeY after using it as index
    grid_size_y += 1

  # Run the iterations
  for it in range(iterations):
    # Get the count for the current state
    count = count_neighbours(state)

    for y in range(grid_size_y):
      for x in range(grid_size_x):
        count_for_light = count[y][x]

        if state[y][x]:
          if count_for_light == 2 or count_for_light == 3:
            state[y][x] = True
          else:
            state[y][x] = False
        else:
          if count_for_light == 3:
            state[y][x] = True
          else:
            state[y][x] = False

  # Count how many are on in the final state
  count_on = 0

  for y in range(grid_size_y):
    for x in range(grid_size_x):
      if state[y][x]:
        count_on += 1

  return count_on


# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> int:
  state: dict[int, dict[int, bool]] = {}
  grid_size_y = 0
  grid_size_x = 0
  iterations = 100

  # Read through the input and build the state
  for line in input:
    if len(line) == 0:
      # This is a blank line, ignore it
      continue

    # Set the length of the line
    if grid_size_x == 0:
      grid_size_x = len(line)
    elif grid_size_x != len(line):
      print("Malformed input")
      return 0

    state[grid_size_y] = {}
    for li in range(len(line)):
      if line[li] == "#":
        state[grid_size_y][li] = True
      else:
        state[grid_size_y][li] = False

    # Increment GridSizeY after using it as index
    grid_size_y += 1

  # Force the corners on
  state = force_corners_on(state, grid_size_y)

  # Run the iterations
  for it in range(iterations):
    # Get the count for the current state
    count = count_neighbours(state)

    for y in range(grid_size_y):
      for x in range(grid_size_x):
        count_for_light = count[y][x]

        if state[y][x]:
          if count_for_light == 2 or count_for_light == 3:
            state[y][x] = True
          else:
            state[y][x] = False
        else:
          if count_for_light == 3:
            state[y][x] = True
          else:
            state[y][x] = False

    # Force the corners on
    state = force_corners_on(state, grid_size_y)

  # Count how many are on in the final state
  count_on = 0

  for y in range(grid_size_y):
    for x in range(grid_size_x):
      if state[y][x]:
        count_on += 1

  return count_on

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
    Day=18,
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
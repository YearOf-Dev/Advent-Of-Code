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


def countAll(input_data, ignore_red):
  count = 0
  
  # Handle lists
  if isinstance(input_data, list):
    for item in input_data:
      if isinstance(item, list):
        count += countAll(item, ignore_red)
      elif isinstance(item, dict):
        includes_red = hasRed(item)
        if not includes_red or ignore_red == False:
          count += countAll(item, ignore_red)
      elif isinstance(item, (int, float)) and not isinstance(item, bool):
        count += item
  
  # Handle dictionaries
  elif isinstance(input_data, dict):
    for key in input_data:
      item = input_data[key]
      if isinstance(item, list):
        count += countAll(item, ignore_red)
      elif isinstance(item, dict):
        includes_red = hasRed(item)
        if not includes_red or ignore_red == False:
          count += countAll(item, ignore_red)
      elif isinstance(item, (int, float)) and not isinstance(item, bool):
        count += item
  
  return count

def hasRed(item) -> bool:
  return "red" in item.values()

# ----------------------------------------------------------------------------------------------------
# | Part 1
# ----------------------------------------------------------------------------------------------------
def part1(input: list[str]) -> int:
  rawInput = input[0]
  jsonData = json.loads(rawInput)

  count = countAll(jsonData, False)
  return count

# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> int:
  rawInput = input[0]
  jsonData = json.loads(rawInput)

  count = countAll(jsonData, True)
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
    Day=12,
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
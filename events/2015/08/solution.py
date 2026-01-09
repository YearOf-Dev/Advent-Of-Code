import sys
import json
import time
from datetime import timedelta, datetime
from pathlib import Path
import re

# Add workspace root to path for imports
workspace_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(workspace_root))

from utils.python.types import AOCDayResults, AOCTimestamp, AOCPartResult
from utils.python.input import readInputAsArray
from utils.python.performance import measurePerformance

# ----------------------------------------------------------------------------------------------------
# | Part 1
# ----------------------------------------------------------------------------------------------------
def part1(input: list[str]) -> int:
  count_code = 0
  count_memory = 0

  for list_val in input:
    list_val = list_val.strip()
    length = len(list_val)
    count_code += length

    list_val = list_val[1:length-1]

    list_val = re.sub(r'\\x[a-f0-9][a-f0-9]', 'z', list_val)
    list_val = re.sub(r'\\{2}', 'z', list_val)
    list_val = re.sub(r'\\"', 'z', list_val)

    count_memory += len(list_val)
  return count_code - count_memory

# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> int:
  count_original = 0
  count_new = 0

  for original in input:
    original = original.strip()
    if len(original) == 0:
      continue
    count_original += len(original)

    encoded = re.sub(r'\\', 'zz', original)
    encoded = re.sub(r'"', 'zz', encoded)
    encoded = '"' + encoded + '"'

    count_new += len(encoded)

  return count_new - count_original

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
    Day=8,
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
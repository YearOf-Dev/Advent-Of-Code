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

# ----------------------------------------------------------------------------------------------------
# | Part 1
# ----------------------------------------------------------------------------------------------------
def part1(input: list[str]) -> int:
  min_vowels = 3
  min_doubles = 1
  naughty_strings = ["ab", "cd", "pq", "xy"]

  nice_strings = 0

  for test_string in input:
    # Check naughty strings
    contains_naughty_strings = False
    for naughty_test in naughty_strings:
      if naughty_test in test_string:
        contains_naughty_strings = True
        break
    if contains_naughty_strings:
      continue;

    # Check for vowels
    vowel_count = 0
    for vowel in ["a", "e", "i", "o", "u"]:
      vowel_count += test_string.count(vowel)
    if vowel_count < min_vowels:
      continue;

    # Double Characters
    doubles = 0
    for i, x in enumerate[str](test_string):
      if x == test_string[i-1]:
        doubles += 1
    if doubles < min_doubles:
      continue

    nice_strings += 1


  return nice_strings

# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> int:
  min_spaced_doubles = 1

  nice_strings = 0

  for test_string in input:
    # Spaced Doubles
    spaced_doubles = 0
    for j in range(2, len(test_string)):
      if test_string[j] == test_string[j-2]:
        spaced_doubles += 1
    if spaced_doubles < min_spaced_doubles:
      continue;

    # Non overlapping repeating doubles
    repeating_doubles = False
    for j in range(1, len(test_string)):
      double_string = test_string[j-1:j+1]
      if len(double_string) == 2:
        instances = 0
        last_instance = 0

        for s in range(1, len(test_string)):
          if test_string[s-1] == double_string[0] and test_string[s] == double_string[1] and last_instance is not s-1:
            instances += 1
            last_instance = s
        if instances >= 2:
          repeating_doubles = True

    if repeating_doubles:
      nice_strings += 1

  return nice_strings

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
    Day=5,
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
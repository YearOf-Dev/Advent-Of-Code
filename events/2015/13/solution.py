import sys
import json
import time
from datetime import timedelta, datetime
from pathlib import Path
from typing import Dict, List

# Add workspace root to path for imports
workspace_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(workspace_root))

from utils.python.types import AOCDayResults, AOCTimestamp, AOCPartResult
from utils.python.input import readInputAsArray
from utils.python.performance import measurePerformance

def calculateHappiness(people: Dict[str, Dict[str, int]], arrangement: list[str]) -> int:
  total = 0

  arrLen = len(arrangement)

  for i in range(arrLen):
    person = arrangement[i]
    left = arrangement[(i-1 + arrLen) % arrLen]
    right = arrangement[(i+1) % arrLen]

    total += people[person][left] + people[person][right]

  return total

def generateAllPermutations(names: List[str]) -> List[List[str]]:
  if len(names) <= 1:
    return [names]

  output: List[List[str]] = []

  for i in range(len(names)):
    rest = names[:i] + names[i+1:]
    permutations = generateAllPermutations(rest)

    for perm in permutations:
      output.append([names[i], *perm])

  return output


# ----------------------------------------------------------------------------------------------------
# | Part 1
# ----------------------------------------------------------------------------------------------------
def part1(input: list[str]) -> int:
  people: Dict[str, Dict[str, int]] = {}
  names: List[str] = []

  for i in range(len(input)):
    if len(input[i]) <= 0:
      continue

    parts = input[i].split(" ")
    personA = parts[0]
    personB = parts[10].removesuffix(".\n")
    change = parts[3]
    posOrNeg = parts[2]

    if personA not in people:
      people[personA] = {}

    if posOrNeg == "gain":
      people[personA][personB] = int(change)
    elif posOrNeg == "lose":
      people[personA][personB] = -int(change)

    if personA not in names:
      names.append(personA)

  first = names[0]
  rest = names[1:]
  permutationsOfRest = generateAllPermutations(rest)
  allPermutations = [[first, *p] for p in permutationsOfRest]

  maxHapiness = 0
  for i, perm in enumerate(allPermutations):
    happiness = calculateHappiness(people, perm)
    if happiness > maxHapiness or i == 0:
      maxHapiness = happiness

  return maxHapiness

# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> int:
  people: Dict[str, Dict[str, int]] = {}
  names: List[str] = []

  for i in range(len(input)):
    if len(input[i]) <= 0:
      continue

    parts = input[i].split(" ")
    personA = parts[0]
    personB = parts[10].removesuffix(".\n")
    change = parts[3]
    posOrNeg = parts[2]

    if personA not in people:
      people[personA] = {}

    if posOrNeg == "gain":
      people[personA][personB] = int(change)
    elif posOrNeg == "lose":
      people[personA][personB] = -int(change)

    if personA not in names:
      names.append(personA)

  people["Me"] = {}
  for person in names:
    people["Me"][person] = 0
    people[person]["Me"] = 0
  names.append("Me")

  first = names[0]
  rest = names[1:]
  permutationsOfRest = generateAllPermutations(rest)
  allPermutations = [[first, *p] for p in permutationsOfRest]

  maxHapiness = 0
  for i, perm in enumerate(allPermutations):
    happiness = calculateHappiness(people, perm)
    if happiness > maxHapiness or i == 0:
      maxHapiness = happiness

  return maxHapiness

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
    Day=13,
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
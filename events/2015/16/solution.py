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
  theSues: dict[int, dict[str, int]] = {}

  for item in input:
    if len(item) == 0:
      continue

    firstSplitIndex = item.index(":")
    sueID = int(item[4:firstSplitIndex])
    properties = item[firstSplitIndex+2:].split(",")

    theSues[sueID] = {}
    theSues[sueID]["ID"] = sueID

    for id, item in enumerate(properties):
      indexFrom = 1
      if id == 0:
        indexFrom = 0
      parts = item.split(":")
      property = parts[0][indexFrom:]
      count = int(parts[1][1:])

      theSues[sueID][property] = count

  invalidSues: list[str] = []
  knownProperties: dict[str, int] = {
    "children": 3,
    "cats": 7,
    "samoyeds": 2,
    "pomeranians": 3,
    "akitas": 0,
    "vizslas": 0,
    "goldfish": 5,
    "trees": 3,
    "cars": 2,
    "perfumes": 1
  }

  for sueID in theSues:
    sueToCheck = theSues[sueID]
    
    for property in sueToCheck:
      if property == "ID":
        continue
      if sueToCheck[property] != knownProperties[property]:
        if sueToCheck["ID"] not in invalidSues:
          invalidSues.append(sueToCheck["ID"])

  for sueID in theSues:
    if theSues[sueID]["ID"] not in invalidSues:
      return theSues[sueID]["ID"]

  return -1

# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> int:
  theSues: dict[int, dict[str, int]] = {}

  for item in input:
    if len(item) == 0:
      continue

    firstSplitIndex = item.index(":")
    sueID = int(item[4:firstSplitIndex])
    properties = item[firstSplitIndex+2:].split(",")

    theSues[sueID] = {}
    theSues[sueID]["ID"] = sueID

    for id, item in enumerate(properties):
      indexFrom = 1
      if id == 0:
        indexFrom = 0
      parts = item.split(":")
      property = parts[0][indexFrom:]
      count = int(parts[1][1:])

      theSues[sueID][property] = count

  invalidSues: list[str] = []
  knownProperties: dict[str, int] = {
    "children": 3,
    "cats": 7,
    "samoyeds": 2,
    "pomeranians": 3,
    "akitas": 0,
    "vizslas": 0,
    "goldfish": 5,
    "trees": 3,
    "cars": 2,
    "perfumes": 1
  }

  for sueID in theSues:
    sueToCheck = theSues[sueID]
    
    for property in sueToCheck:
      if property == "ID":
        continue

      if property == "cats" or property == "trees":
        if sueToCheck[property] <= knownProperties[property]:
          if sueToCheck["ID"] not in invalidSues:
            invalidSues.append(sueToCheck["ID"])
      elif property == "pomeranians" or property == "goldfish":
        if sueToCheck[property] >= knownProperties[property]:
          if sueToCheck["ID"] not in invalidSues:
            invalidSues.append(sueToCheck["ID"])
      else:
        if sueToCheck[property] != knownProperties[property]:
          if sueToCheck["ID"] not in invalidSues:
            invalidSues.append(sueToCheck["ID"])

  for sueID in theSues:
    if theSues[sueID]["ID"] not in invalidSues:
      return theSues[sueID]["ID"]

  return -1

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
    Day=16,
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
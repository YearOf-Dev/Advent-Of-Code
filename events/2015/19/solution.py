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

def findSubstitutes(medicine: str, molecule: str, replacement: str) -> list[str]:
  medLen = len(medicine)
  molLen = len(molecule)

  if medLen < molLen:
    return []

  newMedicine = ""
  foundMedicines: list[str] = []

  for i in range(medLen-molLen):
    testPart = medicine[i:i+molLen]

    if testPart == molecule:
      foundMedicines.append(newMedicine + replacement + medicine[i+molLen:])
    
    newMedicine += medicine[i]

  return foundMedicines


# ----------------------------------------------------------------------------------------------------
# | Part 1
# ----------------------------------------------------------------------------------------------------
def part1(input: list[str]) -> int:
  replacements: dict[str, list[str]] = {}
  medicine: str = ""
  foundMedicines: list[str] = []

  for i in input:
    if len(i) == 1 or i == " ":
      continue

    if "=>" in i:
      parts = i.split(" => ")

      if parts[0] in replacements:
        replacements[parts[0]].append(parts[1].rstrip())
      else:
        replacements[parts[0]] = [parts[1].rstrip()]
    else:
      medicine = i

  for molecule in replacements:
    for substitute in replacements[molecule]:
      results = findSubstitutes(medicine, molecule, substitute)

      for res in results:
        if res not in foundMedicines:
          foundMedicines.append(res)

  return len(foundMedicines)

# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> int:
  replacements: dict[str, str] = {}
  medicine: str = ""

  for i in input:
    if len(i) == 1 or i == " ":
      continue

    if "=>" in i:
      parts = i.split(" => ")

      replacements[parts[1].rstrip().strip()[::-1]] = parts[0].rstrip().strip()[::-1]
    else:
      medicine = i[::-1].rstrip().strip()

  steps = 0

  while medicine != "e":
    bestIndex = float('inf')
    bestFrom = ""
    bestTo = ""

    for fromMolecule, toMolecule in replacements.items():
      index = medicine.find(fromMolecule)
      if index != -1 and index < bestIndex:
        bestIndex = index
        bestFrom = fromMolecule
        bestTo = toMolecule

    if bestIndex != float('inf'):
      medicine = medicine[:bestIndex] + bestTo + medicine[bestIndex + len(bestFrom):]
      steps += 1
    else:
      raise Exception(f'Stuck after {steps} steps {medicine} {len(medicine)}')

  return steps

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
    Day=19,
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
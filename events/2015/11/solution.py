from calendar import c
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

def incrementPassword(password: str) -> str:
  alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  newPassword = password[:-1]

  lastCharacter = password[-1:]
  lastCharacterIndex = alphabet.index(lastCharacter)

  if len(password) == 1:
    if lastCharacterIndex == 25:
      return "a"
    else:
      return alphabet[lastCharacterIndex]
  
  if lastCharacterIndex == 25:
    return incrementPassword(newPassword) + "a"
  else:
    return newPassword + alphabet[lastCharacterIndex+1]

def isPasswordValid(password: str) -> bool:
  alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

  if "i" in password or "o" in password or "l" in password:
    return False

  repeatingLetters = 0
  lastRepeatIndex = 0
  for i in range(1, len(password)):
    if password[i] == password[i-1]:
      if lastRepeatIndex == 0:
        repeatingLetters += 1
        lastRepeatIndex = i
      elif lastRepeatIndex == i - 1:
        continue
      else:
        repeatingLetters += 1
        lastRepeatIndex = i
  if repeatingLetters < 2:
    return False

  for i in range(2, len(password)):
    currentLetterIndex = alphabet.index(password[i])

    if currentLetterIndex < 2:
      continue

    if password[i-1] == alphabet[currentLetterIndex-1] and password[i-2] == alphabet[currentLetterIndex-2]:
      return True
  return False


# ----------------------------------------------------------------------------------------------------
# | Part 1
# ----------------------------------------------------------------------------------------------------
def part1(input: list[str]) -> str:
  currentPassword = input[0]
  nextPassword = currentPassword
  isValid = False

  while not isValid:
    nextPassword = incrementPassword(nextPassword)
    isValid = isPasswordValid(nextPassword)

  return nextPassword

# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> str:
  currentPassword = part1(input)
  nextPassword = currentPassword
  isValid = False

  while not isValid:
    nextPassword = incrementPassword(nextPassword)
    isValid = isPasswordValid(nextPassword)

  return nextPassword

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
    Day=11,
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
from math import perm
import sys
import json
import time
from datetime import timedelta, datetime
from pathlib import Path
from typing import TypedDict

# Add workspace root to path for imports
workspace_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(workspace_root))

from utils.python.types import AOCDayResults, AOCTimestamp, AOCPartResult
from utils.python.input import readInputAsArray
from utils.python.performance import measurePerformance

class Ingredient(TypedDict):
  capacity: int
  durability: int
  flavor: int
  texture: int
  calories: int

def getPermutations(ingredients: list[str], total: int, remaining: int, index: int, current: dict[str, int]) -> list[dict[str, int]]:
  if index == len(ingredients)-1:
    result = current.copy()
    result[ingredients[index]] = remaining
    return [result]

  results: list[dict[str, int]] = []

  for i in range(0, remaining+1):
    newCurrent: dict[str, int] = current.copy()
    newCurrent[ingredients[index]] = i
    permutations = getPermutations(
      ingredients,
      total,
      remaining - i,
      index + 1,
      newCurrent
    )
    results.extend(permutations)

  return results

def calculateScore(ingredients: dict[str, Ingredient], permutation: dict[str, int]) -> int:
  running_capacity = 0
  running_durability = 0
  running_flavor = 0
  running_texture = 0

  for item in permutation:
    ingredient = ingredients[item]
    amount = permutation[item]


    running_capacity += ingredient["capacity"] * amount
    running_durability += ingredient["durability"] * amount
    running_flavor += ingredient["flavor"] * amount
    running_texture += ingredient["texture"] * amount

  if running_capacity < 0 or running_durability < 0 or running_flavor < 0 or running_texture < 0:
    return 0

  return running_capacity * running_durability * running_flavor * running_texture

def calculateCalories(ingredients: dict[str, Ingredient], permutation: dict[str, int]) -> int:
  calories = 0

  for item in permutation:
    addCalories = ingredients[item]["calories"] * permutation[item]
    calories += addCalories

  return calories

# ----------------------------------------------------------------------------------------------------
# | Part 1
# ----------------------------------------------------------------------------------------------------
def part1(input: list[str]) -> int:
  ingredients: dict[str, Ingredient] = {}
  ingredient_names: list[str] = []

  for item in input:
    if len(item) == 0:
      continue

    parts_a = item.split(":")
    name = parts_a[0]
    parts_b = parts_a[1][1:].split(" ")

    ingredients[name] = {
      "capacity": int(parts_b[1][:-1]),
      "durability": int(parts_b[3][:-1]),
      "flavor": int(parts_b[5][:-1]),
      "texture": int(parts_b[7][:-1]),
      "calories": int(parts_b[9])
    }
    ingredient_names.append(name)

  permutations = getPermutations(ingredient_names, 100, 100, 0, {})

  maxScore = 0
  for permutation in permutations:
    score = calculateScore(ingredients, permutation)
    if score > maxScore:
      maxScore = score
  return maxScore

# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> int:
  ingredients: dict[str, Ingredient] = {}
  ingredient_names: list[str] = []

  for item in input:
    if len(item) == 0:
      continue

    parts_a = item.split(":")
    name = parts_a[0]
    parts_b = parts_a[1][1:].split(" ")

    ingredients[name] = {
      "capacity": int(parts_b[1][:-1]),
      "durability": int(parts_b[3][:-1]),
      "flavor": int(parts_b[5][:-1]),
      "texture": int(parts_b[7][:-1]),
      "calories": int(parts_b[9])
    }
    ingredient_names.append(name)

  permutations = getPermutations(ingredient_names, 100, 100, 0, {})

  maxScore = 0
  for permutation in permutations:
    score = calculateScore(ingredients, permutation)
    if score > maxScore:
      if calculateCalories(ingredients, permutation) == 500:
        maxScore = score
  return maxScore

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
    Day=15,
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
from audioop import add
import sys
import json
import time
from datetime import timedelta, datetime
from pathlib import Path
from typing import Dict

# Add workspace root to path for imports
workspace_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(workspace_root))

from utils.python.types import AOCDayResults, AOCTimestamp, AOCPartResult
from utils.python.input import readInputAsArray
from utils.python.performance import measurePerformance

# ----------------------------------------------------------------------------------------------------
# | Part 1
# ----------------------------------------------------------------------------------------------------
def bestNextHop(distances: Dict[str, int], visited: Dict[str, bool]) -> (str, int, Dict[str, bool]):
  nextHopName = ""
  nextHopDistance: int = 0

  for place in distances:
    if (distances[place] < nextHopDistance or nextHopDistance == 0) and not visited[place]:
      nextHopName = place
      nextHopDistance = distances[place]

  visited[nextHopName] = True

  return nextHopName, nextHopDistance, visited

def bestRouteFor(distances: Dict[str, Dict[str, int]], startAt: str) -> int:
  visited: Dict[str, bool] = {}
  places_to_visit = 0

  for place in distances:
    visited[place] = False
    places_to_visit += 1
  visited[startAt] = True

  currentlyAt = startAt
  totalDistance = 0

  for place in distances:
    addDistance = 0
    currentlyAt, addDistance, visited = bestNextHop(distances[currentlyAt], visited)
    totalDistance += addDistance

  return totalDistance

def part1(input: list[str]) -> int:
  distances: Dict[str, Dict[str, int]] = {}
  routes: Dict[str, int] = {}

  for item in input:
    split_input = item.split(" ")

    if len(split_input) < 5:
      continue

    origin = split_input[0]
    destination = split_input[2]
    distance_raw = split_input[4]
    distance = int(distance_raw)

    if origin not in distances:
      distances[origin] = {}
    if destination not in distances:
      distances[destination] = {}

    distances[origin][destination] = distance
    distances[destination][origin] = distance

  shortestRoute: int = 0
  for place in distances:
    routes[place] = bestRouteFor(distances, place)

    if routes[place] < shortestRoute or shortestRoute == 0:
      shortestRoute = routes[place]

  return shortestRoute

# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def worstNextHop(distances: Dict[str, int], visited: Dict[str, bool]) -> (str, int, Dict[str, bool]):
  nextHopName = ""
  nextHopDistance: int = 0

  for place in distances:
    if distances[place] > nextHopDistance and not visited[place]:
      nextHopName = place
      nextHopDistance = distances[place]

  visited[nextHopName] = True

  return nextHopName, nextHopDistance, visited

def worstRouteFor(distances: Dict[str, Dict[str, int]], startAt: str) -> int:
  visited: Dict[str, bool] = {}
  places_to_visit = 0

  for place in distances:
    visited[place] = False
    places_to_visit += 1
  visited[startAt] = True

  currentlyAt = startAt
  totalDistance = 0

  for place in distances:
    addDistance = 0
    currentlyAt, addDistance, visited = worstNextHop(distances[currentlyAt], visited)
    totalDistance += addDistance

  return totalDistance

def part2(input: list[str]) -> int:
  distances: Dict[str, Dict[str, int]] = {}
  routes: Dict[str, int] = {}

  for item in input:
    split_input = item.split(" ")

    if len(split_input) < 5:
      continue

    origin = split_input[0]
    destination = split_input[2]
    distance_raw = split_input[4]
    distance = int(distance_raw)

    if origin not in distances:
      distances[origin] = {}
    if destination not in distances:
      distances[destination] = {}

    distances[origin][destination] = distance
    distances[destination][origin] = distance

  longestRoute: int = 0
  for place in distances:
    routes[place] = worstRouteFor(distances, place)

    if routes[place] > longestRoute:
      longestRoute = routes[place]

  return longestRoute

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
    Day=9,
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
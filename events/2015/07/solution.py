from multiprocessing import connection
import sys
import json
import time
from datetime import timedelta, datetime
from pathlib import Path
from typing import Dict, Union

# Add workspace root to path for imports
workspace_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(workspace_root))

from utils.python.types import AOCDayResults, AOCTimestamp, AOCPartResult
from utils.python.input import readInputAsArray
from utils.python.performance import measurePerformance

def to16bit(value: int):
  return value & 0xFFFF

def update_connections(connections: Dict[str, Union[int, list[str]]]) -> Dict[str, Union[int, list[str]]]:
  for wire, command in connections.items():
    if type(command) is int:
      continue;

    if len(command) == 1:
      if command[0].isdigit():
        connections[wire] = int(command[0])
  
  return connections

def solve_connection(connections: Dict[str, Union[int, list[str]]], wire: str) -> tuple[int, Dict[str, Union[int, list[str]]]]:
  wc = connections[wire]
  connections = update_connections(connections)

  if type(wc) is int:
    return wc, connections

  if len(wc) == 1:
    if wc[0].isdigit():
      connections[wire] = ~int(wc[0])
      return to16bit(~int(wc[0])), connections
    else:
      return solve_connection(connections, wc[0])
  elif len(wc) == 2:
    nv = wc[1]

    if nv.isdigit():
      solved_nv = to16bit(~int(nv))
      connections[wire] = solved_nv
      return solved_nv, connections
    else:
      solved_nv, connections = solve_connection(connections, nv)
      ans = to16bit(~int(solved_nv))
      connections[wire] = ans
      return ans, connections
  elif len(wc) == 3:
    op = wc[1]

    a = wc[0]
    b = wc[2]

    if a.isdigit():
      a = int(a)
    else:
      a, connections = solve_connection(connections, a)

    if b.isdigit():
      b = int(b)
    else:
      b, connections = solve_connection(connections, b)

    if op == "AND":
      ans = to16bit(a&b)
      connections[wire] = ans
      return ans, connections
    elif op == "OR":
      ans = to16bit(a|b)
      connections[wire] = ans
      return ans, connections
    elif op == "LSHIFT":
      ans = to16bit(a<<b)
      connections[wire] = ans
      return ans, connections
    elif op == "RSHIFT":
      ans = to16bit(a>>b)
      connections[wire] = ans
      return ans, connections
  pass

# ----------------------------------------------------------------------------------------------------
# | Part 1
# ----------------------------------------------------------------------------------------------------
def part1(input: list[str]) -> int:
  connections: Dict[str, Union[int, list[str]]] = {}

  for command in input:
    destination = command.split("->")[1].strip()
    instruction = command.split("->")[0].strip().split(" ")

    connections[destination] = instruction

  ans, connections = solve_connection(connections, "a")

  return ans

# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> int:
  b = part1(input)

  connections: Dict[str, Union[int, list[str]]] = {}

  for command in input:
    destination = command.split("->")[1].strip()
    instruction = command.split("->")[0].strip().split(" ")

    connections[destination] = instruction
  connections["b"] = b

  ans, connections = solve_connection(connections, "a")
  return ans

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
    Day=7,
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
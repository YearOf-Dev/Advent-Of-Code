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

def count_permutations(container_sizes: list[int], target: int) -> int:
    # Create array to track the number of ways to make any value between zero and the target
    ways_to_make_sum = [0] * (target + 1)
    # There is only one way to make a value of 0, use no containers!
    ways_to_make_sum[0] = 1
    
    # Loop over each container
    for container in container_sizes:
        # Traverse backwards to avoid using same container twice
        for i in range(target, container - 1, -1):
            ways_to_make_sum[i] += ways_to_make_sum[i - container]
    
    return ways_to_make_sum[target]


def count_min_permutations(container_sizes: list[int], target: int) -> dict[str, int]:
    # First pass: find minimum containers needed
    min_containers_needed = [float('inf')] * (target + 1)
    min_containers_needed[0] = 0
    
    for container in container_sizes:
        for i in range(target, container - 1, -1):
            min_containers_needed[i] = min(
                min_containers_needed[i],
                min_containers_needed[i - container] + 1
            )
    
    min_containers = min_containers_needed[target]
    
    # Second pass: count permutations using exactly min_containers
    ways_to_make_sum_with_n_containers = [
        [0] * (min_containers + 1) for _ in range(target + 1)
    ]
    ways_to_make_sum_with_n_containers[0][0] = 1
    
    for container in container_sizes:
        for sum_val in range(target, container - 1, -1):
            for num_containers in range(min_containers, 0, -1):
                ways_to_make_sum_with_n_containers[sum_val][num_containers] += \
                    ways_to_make_sum_with_n_containers[sum_val - container][num_containers - 1]
    
    return {
        'min_containers': min_containers,
        'permutation_count': ways_to_make_sum_with_n_containers[target][min_containers]
    }

# ----------------------------------------------------------------------------------------------------
# | Part 1
# ----------------------------------------------------------------------------------------------------
def part1(input: list[str]) -> int:
  container_sizes: list[int] = []
  total = 150

  for item in input:
    if len(item) == 0:
      continue
    container_sizes.append(int(item))

  permutations = count_permutations(container_sizes, total)
  return permutations

# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> int:
  container_sizes: list[int] = []
  total = 150

  for item in input:
    if len(item) == 0:
      continue
    container_sizes.append(int(item))

  permutations = count_min_permutations(container_sizes, total)
  return permutations["permutation_count"]

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
    Day=17,
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
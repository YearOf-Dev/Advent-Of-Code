import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

function countPermutations(containerSizes: number[], target: number): number {
  // Create array to track the number of ways to make any value between zero and the target
  const waysToMakeSum: number[] = new Array(target + 1).fill(0);

  // There is onle one way to make a value of 0, use no containers!
  waysToMakeSum[0] = 1;
  
  // Loop over each container
  for (const container of containerSizes) {
    // Traverse backwards to avoid using same container twice
    for (let i = target; i >= container; i--) {
      waysToMakeSum[i] += waysToMakeSum[i - container];
    }
  }
  
  return waysToMakeSum[target];
}

function countMinPermutations(containerSizes: number[], target: number): {
  minContainers: number;
  permutationCount: number;
} {
  // First pass: find minimum containers needed
  const minContainersNeeded: number[] = new Array(target + 1).fill(Infinity);
  minContainersNeeded[0] = 0;
  
  for (const container of containerSizes) {
    for (let i = target; i >= container; i--) {
      minContainersNeeded[i] = Math.min(
        minContainersNeeded[i],
        minContainersNeeded[i - container] + 1
      );
    }
  }
  
  const minContainers = minContainersNeeded[target];
  
  // Second pass: count permutations using exactly minContainers
  const waysToMakeSumWithNContainers: number[][] = Array.from(
    { length: target + 1 },
    () => new Array(minContainers + 1).fill(0)
  );
  waysToMakeSumWithNContainers[0][0] = 1;
  
  for (const container of containerSizes) {
    for (let sum = target; sum >= container; sum--) {
      for (let numContainers = minContainers; numContainers >= 1; numContainers--) {
        waysToMakeSumWithNContainers[sum][numContainers] += 
          waysToMakeSumWithNContainers[sum - container][numContainers - 1];
      }
    }
  }
  
  return {
    minContainers,
    permutationCount: waysToMakeSumWithNContainers[target][minContainers]
  };
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let containerSizes: number[] = []
  let total = 150

  // Loop through our input and get the container sizes
  for (var i = 0; i < input.length; i++) {
    if (input.length == 0) {
      continue
    }

    let numToPush = parseInt(input[i])

    if (!isNaN(numToPush)) {
      containerSizes.push(numToPush)
    }
  }

  // Count the possible permutations
  let permutations: number = countPermutations(containerSizes, total);

  return permutations;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let containerSizes: number[] = []
  let total = 150

  // Loop through our input and get the container sizes
  for (var i = 0; i < input.length; i++) {
    if (input.length == 0) {
      continue
    }

    let numToPush = parseInt(input[i])

    if (!isNaN(numToPush)) {
      containerSizes.push(numToPush)
    }
  }

  let permsForMinContainers = countMinPermutations(containerSizes, 150);

  return permsForMinContainers.permutationCount;
}


// ----------------------------------------------------------------------------------------------------
// | Solve the puzzle
// ----------------------------------------------------------------------------------------------------
function solve() {
  // Get the arguments
  const args = process.argv.slice(2);
  const fileName = args[0] || "input.txt";

  // Start the timer
  const startTimeStamp = new Date(Date.now()).toISOString();
  const startTime = performance.now();

  // Read the input as an array of strings
  const input = readInputAsArray(fileName);

// Run the parts
const p1Result = measurePerformance(() => part1(input));
const p2Result = measurePerformance(() => part2(input));

// End the timer
const endTimeStamp = new Date(Date.now()).toISOString();
const endTime = performance.now();
const duration = endTime - startTime;

// Return the results
return {
  Year: 2015,
  Day: 17,
  Part1: p1Result,
  Part2: p2Result,
  Duration: Math.round(duration * 1000000), // Convert to nanoseconds
  Timestamp: {
    Start: new Date(startTimeStamp).toISOString(),
    End: new Date(endTimeStamp).toISOString(),
  },
} as AOCDayResults;
  
}
const results = solve();
console.log(JSON.stringify(results, null, 2));
import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

// ----------------------------------------------------------------------------------------------------
// | Part 1 > What floor does Santa end up on?
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  // Use finalFloor to track the floor Santa is on
  let finalFloor = 0;

  // Get the directions from the input
  const directions = input[0];

  // Work through the directions and update the floor as we go
  for (var i = 0; i < directions.length; i++) {
    const direction = directions[i];

    if (direction === '(') {
      finalFloor += 1;
    } else if (direction === ')') {
      finalFloor -= 1;
    }
  }

  // Return the final floor
  return finalFloor;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2 > When does Santa first enter the basement?
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  // Keep track of the floor we are currently on
  let currentFloor = 0;

  // Get the directions from the input
  const directions = input[0];

  // Work through the directions and update the floor as we go
  for (var i = 0; i < directions.length; i++) {
    const direction = directions[i];

    if (direction === '(') {
      currentFloor += 1;
    } else if (direction === ')') {
      currentFloor -= 1;
    }

    // If we are in the basement, return the current index
    if (currentFloor === -1) {
      return i + 1; // +1 as AoC is 1-indexed
    }
  }

  // If we never enter the basement, return undefined
  return undefined;
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
  Day: 1,
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
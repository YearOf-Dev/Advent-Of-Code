import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

function countAll(input: any, ignoreRed: boolean): number {
  let count = 0;

  for (const item in input) {
    if (Array.isArray(input[item])) {
      count += countAll(input[item], ignoreRed)
    } else if (typeof input[item] === "object"){
      let includesRed = hasRed(input[item]);
      if (!includesRed || ignoreRed == false) {
        count += countAll(input[item], ignoreRed)
      }
    } else if (typeof input[item] === "number") {
      count += input[item]
    } else if (typeof input[item] === "string") {
      continue
    }
  }
  return count
}

function hasRed(input: any): boolean {
  for (const item in input) {
    if (typeof input[item] === "string") {
      if (input[item] == "red") {
        return true
      }
    }
  }

  return false
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let rawInput = input[0]
  let json = JSON.parse(rawInput);
  
  let count = countAll(json, false)


  return count;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let rawInput = input[0]
  let json = JSON.parse(rawInput);
  
  let count = countAll(json, true)


  return count;
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
  Day: 12,
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
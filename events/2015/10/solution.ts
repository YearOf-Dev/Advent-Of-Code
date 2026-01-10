import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function countDigits(input: string): string {
  let output = ""

  let count = 0;
  let lastDigit = ""
  for (var i = 0; i < input.length; i++) {
    if (i == 0) {
      count = 1;
      lastDigit = input[0]
      continue;
    }

    let currentDigit = input[i];
    if (currentDigit == lastDigit) {
      count += 1
    } else {
      output += String(count) + lastDigit;
      count = 1;
      lastDigit = currentDigit;
    }
  }
  output += String(count) + lastDigit;

  return output;
}

function part1(input: string[]): number | undefined {
  let lastIteration = input[0];

  for (var i = 0; i < 40; i++) {
    lastIteration = countDigits(lastIteration)
  }

  return lastIteration.length
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let lastIteration = input[0];

  for (var i = 0; i < 50; i++) {
    lastIteration = countDigits(lastIteration)
  }

  return lastIteration.length
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
  Day: 10,
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
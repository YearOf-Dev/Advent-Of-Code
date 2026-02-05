import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let validTriangles = 0;
  let invalidTriangles = 0;

  for (var i = 0; i < input.length; i++) {
    // Skip empty lines
    if (input[i].length == 0) { continue }

    // Split into parts
    let sides = input[i].trim().split(/\s+/)

    let a = parseInt(sides[0])
    let b = parseInt(sides[1])
    let c = parseInt(sides[2])

    if (a + b <= c || a + c <= b || b + c <= a) {
      invalidTriangles += 1
      continue
    }
    validTriangles += 1
  }
  return validTriangles;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let validTriangles = 0;
  let invalidTriangles = 0;

  for (var i = 0; i < input.length-3; i += 3) {
    // Read three rows ar a time
    let sides_1 = input[i].trim().split(/\s+/)
    let sides_2 = input[i+1].trim().split(/\s+/)
    let sides_3 = input[i+2].trim().split(/\s+/)

    for (var j = 0; j < 3; j++) {
      let a = parseInt(sides_1[j])
      let b = parseInt(sides_2[j])
      let c = parseInt(sides_3[j])
      if (a + b <= c || a + c <= b || b + c <= a) {
        invalidTriangles += 1
        continue
      }
      validTriangles += 1
    }
  }
  return validTriangles;
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
  Year: 2016,
  Day: 3,
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
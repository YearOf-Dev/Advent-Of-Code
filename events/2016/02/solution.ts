import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let keypad = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"]
  ]
  let currentRow = 1;
  let currentColumn = 1;
  let accessCode = "";

  for (var i = 0; i < input.length; i++) {
    // Skip empty instructions
    if (input[i].length == 0) {
      continue
    }

    // Follow directions
    for (var j = 0; j < input[i].length; j++) {
      let direction = input[i][j]

      switch (direction) {
        case "U":
          currentRow = Math.max(currentRow - 1, 0)
          break
        case "D":
          currentRow = Math.min(currentRow + 1, 2)
          break
        case "L":
          currentColumn = Math.max(currentColumn - 1, 0)
          break
        case "R":
          currentColumn = Math.min(currentColumn + 1, 2)
          break
      }
    }

    // Add the new digit
    accessCode = accessCode + keypad[currentRow][currentColumn];
  }

  return parseInt(accessCode);
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): string | undefined {
  let keypad = [
    ["0", "0", "1", "0", "0"],
    ["0", "2", "3", "4", "0"],
    ["5", "6", "7", "8", "9"],
    ["0", "A", "B", "C", "0"],
    ["0", "0", "D", "0", "0"]
  ]
  let currentRow = 1;
  let currentColumn = 1;
  let accessCode = "";

  for (var i = 0; i < input.length; i++) {
    // Skip empty instructions
    if (input[i].length == 0) {
      continue
    }

    // Follow directions
    for (var j = 0; j < input[i].length; j++) {
      let direction = input[i][j]
      let newRow = currentRow
      let newColumn = currentColumn

      switch (direction) {
        case "U":
          newRow = Math.max(currentRow - 1, 0)
          break
        case "D":
          newRow = Math.min(currentRow + 1, 4)
          break
        case "L":
          newColumn = Math.max(currentColumn - 1, 0)
          break
        case "R":
          newColumn = Math.min(currentColumn + 1, 4)
          break
      }

      if (keypad[newRow][newColumn] !== "0") {
        currentRow = newRow
        currentColumn = newColumn
      }
    }

    // Add the new digit
    accessCode = accessCode + keypad[currentRow][currentColumn];
  }

  return accessCode;
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
  Day: 2,
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
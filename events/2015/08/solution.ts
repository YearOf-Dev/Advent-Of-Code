import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";
import { count } from "node:console";

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let count_code = 0;
  let count_memory = 0;

  // Loop over the input and count
  for (var i = 0; i < input.length; i++) {
    let list_val = input[i].trim();
    const length = list_val.length;
    count_code += length;

    // Remove special characters
    // first and last character
    list_val = list_val.substring(1, length-1)

    // Hex
    list_val = list_val.replace(/(\\x[a-f,0-9][a-f,0-9])/gm, "z")

    // Double Slash
    list_val = list_val.replace(/(\\{2})/gm, "z")

    // Escaped Quote
    list_val = list_val.replace(/(\\")/gm, "z")

    count_memory += list_val.length
  }

  return count_code - count_memory;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let count_original = 0;
  let count_new = 0;

  // Loop over the input and count
  for (var i = 0; i < input.length; i++) {
    const original = input[i].trim();
    if (original.length == 0) { continue; }
    count_original += original.length;

    // Encode: escape backslashes and quotes, then wrap in quotes
    let encoded = original.replace(/\\/g, '\\\\');  // Escape backslashes
    encoded = encoded.replace(/"/g, '\\"');          // Escape quotes
    encoded = '"' + encoded + '"';                   // Wrap in quotes

    count_new += encoded.length;
  }

  return count_new - count_original
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
  Day: 8,
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
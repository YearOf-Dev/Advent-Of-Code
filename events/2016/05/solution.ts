import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";
import * as CryptoJS from "crypto-js";

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): string | undefined {
  let doorID = input[0]
  let salt = 0;
  let password: string = "";

  while (password.length <= 7) {
    let hashIn = doorID + salt
    
    let hash = CryptoJS.MD5(hashIn).toString();
    if (hash.slice(0, 5) === "00000") {
      password += hash[5]
    }
    salt += 1
  }

  return password;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): string | undefined {
  let doorID = input[0]
  let salt = 0
  let password = ""
  let password_parts: Record<number, string> = {}

  for (var i = 0; i < 8; i++){
    password_parts[i] = ""
  }

  while (password.length <= 7) {
    let hashIn = doorID + salt
    
    let hash = CryptoJS.MD5(hashIn).toString();
    if (hash.slice(0, 5) === "00000") {
      let location = parseInt(hash[5])
      if (password_parts[location] == "") {
        password_parts[location] = hash[6]
      }
    }
    salt += 1

    password = ""
    for (var i = 0; i < 8; i++){
      password += password_parts[i]
    }
  }
  return password;
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
  Day: 5,
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
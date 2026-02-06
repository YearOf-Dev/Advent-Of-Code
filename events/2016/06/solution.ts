import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): string | undefined {
  let characterTracker: Record<number, Record<string, number>> = {}

  // Count all the characters
  for (var i = 0; i < input.length; i++) {
    if (input[i].length == 0) {
      continue
    }

    for (var j = 0; j < input[i].length; j++) {
      if (characterTracker[j] == undefined) {
        characterTracker[j] = {}
      }

      if (characterTracker[j][input[i][j]] == undefined) {
        characterTracker[j][input[i][j]] = 1
      } else {
        characterTracker[j][input[i][j]] += 1
      }
    }
  }

  // Compile the message
  let message = ""
  for (const place in characterTracker) {
    let winningCharacter = ""
    let winningCharacterCount = 0

    for (const character in characterTracker[place]) {
      if (characterTracker[place][character] > winningCharacterCount) {
        winningCharacter = character
        winningCharacterCount = characterTracker[place][character]
      }
    }

    message += winningCharacter
  }

  return message;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): string | undefined {
  let characterTracker: Record<number, Record<string, number>> = {}

  // Count all the characters
  for (var i = 0; i < input.length; i++) {
    if (input[i].length == 0) {
      continue
    }

    for (var j = 0; j < input[i].length; j++) {
      if (characterTracker[j] == undefined) {
        characterTracker[j] = {}
      }

      if (characterTracker[j][input[i][j]] == undefined) {
        characterTracker[j][input[i][j]] = 1
      } else {
        characterTracker[j][input[i][j]] += 1
      }
    }
  }

  // Compile the message
  let message = ""
  for (const place in characterTracker) {
    let winningCharacter = ""
    let winningCharacterCount = Infinity

    for (const character in characterTracker[place]) {
      if (characterTracker[place][character] < winningCharacterCount) {
        winningCharacter = character
        winningCharacterCount = characterTracker[place][character]
      }
    }

    message += winningCharacter
  }

  return message;
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
  Day: 6,
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
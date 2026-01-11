import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

function incrementPassword(password: string): string {
  let alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  let newPassword = password.substring(0, password.length-1)

  let lastCharacter = password[password.length-1]
  let lastCharacterIndex = alphabet.indexOf(lastCharacter)

  // Special case for single character password
  if (password.length == 1) {
    if (lastCharacterIndex == 25) {
      newPassword = "a"
    } else {
      newPassword = alphabet[lastCharacterIndex+1]
    }
    return newPassword
  }

  if (lastCharacterIndex == 25) {
    // Rollover
    newPassword = incrementPassword(newPassword) + "a"
  } else {
    // No rollover
    newPassword = newPassword + alphabet[lastCharacterIndex+1]
  }

  return newPassword
}

function isPasswordValid(password: string): boolean {
  let alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

  if (password.includes("i") || password.includes("o") || password.includes("l")) {
    return false
  }

  let repeatingLetters = 0
  let lastRepeatIndex = 0
  for (var i = 1; i < password.length; i++) {
    if (password[i] == password[i-1]) {
      // Repeating Letter!
      if (lastRepeatIndex == 0) {
        repeatingLetters += 1
        lastRepeatIndex = i
      } else if (lastRepeatIndex == i -1) {
        // Doesn't count as it overlaps
        continue
      } else {
        // It's a valid repeat
        repeatingLetters += 1
        lastRepeatIndex = i
      }
    }
  }
  if (repeatingLetters < 2) {
    return false
  }

  for (var i = 2; i < password.length; i++) {
    let current_letter_index = alphabet.indexOf(password[i])

    if (current_letter_index < 2) {
      // Can't contain the sequence we need
      continue
    }

    if (password[i-1] == alphabet[current_letter_index-1] && password[i-2] == alphabet[current_letter_index-2]) {
      return true
    }
  }
  return false
}
// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): string | undefined {
  let currentPassword = input[0];
  let nextPassword = currentPassword
  let isValid = false

  while (!isValid) {
    nextPassword = incrementPassword(nextPassword)
    isValid = isPasswordValid(nextPassword)
  }
  return nextPassword;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): string | undefined {
  let currentPassword = part1(input);

  if (currentPassword == undefined) {
    return undefined
  }

  let nextPassword = currentPassword
  let isValid = false

  while (!isValid) {
    nextPassword = incrementPassword(nextPassword)
    isValid = isPasswordValid(nextPassword)
  }
  return nextPassword;
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
  Day: 11,
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
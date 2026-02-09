import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";
import letterDefinitions from "./letters.json"

function initState(pixelsWide = 50, pixelsTall = 6): Record<number, Record<number, boolean>> {
  let state: Record<number, Record<number, boolean>> = {}

  for (var y = 0; y < pixelsTall; y++) {
    state[y] = {}
    for (var x = 0; x < pixelsWide; x++) {
      state[y][x] = false;
    }
  }

  return state
}

function countPixelsLit(state: Record<number, Record<number, boolean>>): number {
  let count = 0;

  for (const y in state) {
    for (const x in state[y]) {
      if (state[y][x]) {
        count += 1
      }
    }
  }

  return count
}

function rect(state: Record<number, Record<number, boolean>>, a: number, b: number) {
  for (var y = 0; y < b; y++) {
    for (var x = 0; x < a; x++) {
      state[y][x] = true;
    }
  }
  return state
}

function rotateColumn(state: Record<number, Record<number, boolean>>, column: number, offset: number): Record<number, Record<number, boolean>> {
  for (var j = 0; j < offset; j++){
    let newFirstPos = state[5][column]

    for (var i = 5; i > 0; i--) {
      state[i][column] = state[i-1][column]
    }

    state[0][column] = newFirstPos
  }

  return state
}

function rotateRow(state: Record<number, Record<number, boolean>>, row: number, offset: number): Record<number, Record<number, boolean>> {
  for (var j = 0; j < offset; j++){
    let newFirstPos = state[row][49]

    for (var i = 49; i > 0; i--) {
      state[row][i] = state[row][i-1]
    }

    state[row][0] = newFirstPos
  }

  return state
}

function renderScreen(state: Record<number, Record<number, boolean>>, spaceLetters: boolean = false) {
  let onChar = "█"
  let offChar = "░"
  let spaceCharacter = "  "

  for (const row in state) {
    let line = ""

    let pixelsWide = 0
    for (const column in state[row]) {
      if (state[row][column]) {
        line += onChar
      } else {
        line += offChar
      }

      if (pixelsWide == 4 && spaceLetters) {
        line += spaceCharacter
        pixelsWide = 0
      } else {
        pixelsWide += 1
      }
    }

    console.log(line)
  }
}

function separateStateIntoLetters(state: Record<number, Record<number, boolean>>): Record<number, Record<number, Record<number, boolean>>> {
  let newState: Record<number, Record<number, Record<number, boolean>>> = {}

  for (var i = 0; i < 10; i++) {
    newState[i] = initState(5, 6)
  }


  for (var y = 0; y < 6; y++) {
    for (var x = 0; x < 50; x++) {
      let letter = Math.floor(x / 5)

      newState[letter][y][x % 5] = state[y][x]
    }
  }

  return newState
}

function renderLetters(state: Record<number, Record<number, Record<number, boolean>>>) {
  let onChar = "█"
  let offChar = "░"

  for (const letter in state) {
    for (const row in state[letter]) {
      let line = ""

      for (const column in state[letter][row]) {
        if (state[letter][row][column]) {
          line += onChar
        } else {
          line += offChar
        }
      }

      console.log(line)
    }
    console.log("")
  }
}

function compareLetters(a: Record<number, Record<number, boolean>>, b: Record<number, Record<number, boolean>>): boolean {
  return (
    JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort())
  )
}

function detectCharacters(state: Record<number, Record<number, Record<number, boolean>>>) {
  let message: Record<number, string> = {}
  
  for (const letter in state) {
    let letterValues = state[letter]

    for (const possibleLetter in letterDefinitions) {
      if (compareLetters(letterValues, letterDefinitions[possibleLetter])) {
        message[letter] = possibleLetter
      }
    }
  }

  let messageString = ""
  for (const letter in message) {
    messageString += message[letter]
  }
  return messageString
}


// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  // Create an empty state
  let state = initState();

  // Loop over the input
  for (var i = 0; i < input.length; i++) {
    if (input[i].length == 0) { continue }

    if (input[i].includes("rect")) {
      let dimensions = input[i].split(" ")[1].split("x")
      let a = parseInt(dimensions[0])
      let b = parseInt(dimensions[1])
      state = rect(state, a, b)
    } else if (input[i].includes("rotate row")) {
      let parts = input[i].split(" ")
      let offset = parseInt(parts[4])
      let row = parseInt(parts[2].split("=")[1])
      state = rotateRow(state, row, offset)
    } else if (input[i].includes("rotate column")) {
      let parts = input[i].split(" ")
      let offset = parseInt(parts[4])
      let column = parseInt(parts[2].split("=")[1])
      state = rotateColumn(state, column, offset)
    }
  }

  return countPixelsLit(state);
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): string | undefined {
  // Create an empty state
  let state = initState();

  // Loop over the input
  for (var i = 0; i < input.length; i++) {
    if (input[i].length == 0) { continue }

    if (input[i].includes("rect")) {
      let dimensions = input[i].split(" ")[1].split("x")
      let a = parseInt(dimensions[0])
      let b = parseInt(dimensions[1])
      state = rect(state, a, b)
    } else if (input[i].includes("rotate row")) {
      let parts = input[i].split(" ")
      let offset = parseInt(parts[4])
      let row = parseInt(parts[2].split("=")[1])
      state = rotateRow(state, row, offset)
    } else if (input[i].includes("rotate column")) {
      let parts = input[i].split(" ")
      let offset = parseInt(parts[4])
      let column = parseInt(parts[2].split("=")[1])
      state = rotateColumn(state, column, offset)
    }
  }

  let letters = separateStateIntoLetters(state)
  detectCharacters(letters)

  return detectCharacters(letters);
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
import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

function countLight(state: Record<number, Record<number, boolean>>, y: number, x: number, count: number): number {
  if (state[y][x]) {
    return count + 1
  }
  return count
}

function countNeighbours(state: Record<number, Record<number, boolean>>): Record<number, Record<number, number>> {
  let count: Record<number, Record<number, number>> = {}
  let gridSize = 0

  // Build an empty count from state
  for (const y in state) {
    gridSize += 1
    count [y] = {}
    for (const x in state) {
      count[y][x] = 0
    }
  }

  // Work through every position
  for (var y = 0; y < gridSize; y++) {
    for (var x = 0; x < gridSize; x++) {
      let countForLight = 0

      // Check the row Above
      if (y != 0) {
        if (x != 0) {
          countForLight = countLight(state, y-1, x-1, countForLight)
        }
        countForLight = countLight(state, y-1, x, countForLight)
        if (x != gridSize) {
          countForLight = countLight(state, y-1, x+1, countForLight)
        }
      }

      // Check the current Row
      if (x != 0) {
        countForLight = countLight(state, y, x-1, countForLight)
      }
      if (x != gridSize) {
        countForLight = countLight(state, y, x+1, countForLight)
      }

      // Count the row below
      if (y+1 != gridSize) {
        if (x != 0) {
          countForLight = countLight(state, y+1, x-1, countForLight)
        }
        countForLight = countLight(state, y+1, x, countForLight)
        if (x != gridSize) {
          countForLight = countLight(state, y+1, x+1, countForLight)
        }
      }

      // Update the main count
      count[y][x] = countForLight
    }
  }

  return count
}

function forceCornersOn(state: Record<number, Record<number, boolean>>, gridSize: number): Record<number, Record<number, boolean>> {
  gridSize -= 1
  state[0][0] = true;
  state[0][gridSize] = true;
  state[gridSize][0] = true;
  state[gridSize][gridSize] = true;
  return state
}


// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let state: Record<number, Record<number, boolean>> = {}
  let gridSizeY = 0;
  let gridSizeX = 0;
  let iterations = 100;

  // Read through the input and build the state
  for (const i in input) {
    let line = input[i]
    
    if (line.length == 0) {
      // This is a blank line, ignore it
      continue
    }

    // Increment GridSizeY
    gridSizeY += 1;

    // Set the length of the line
    if (gridSizeX == 0) {
      gridSizeX = line.length
    } else if (gridSizeX != line.length) {
      console.log("Malformed input")
      return undefined
    }

    state[i]= {}
    for (var li = 0; li < line.length; li++) {
      if (line[li] == "#") {
        state[i][li] = true
      } else {
        state[i][li] = false
      }
    }
  }

  // Run the iterations
  for (var it = 0; it < iterations; it++) {
    // Get the count for the current state
    let count = countNeighbours(state)

    for (var y = 0; y < gridSizeY; y++) {
      for (var x = 0; x < gridSizeX; x++) {
        let countForLight = count[y][x];

        if (state[y][x]) {
          if (countForLight == 2 || countForLight == 3) {
            state[y][x] = true
          } else {
            state[y][x] = false
          }
        } else {
          if (countForLight == 3) {
            state[y][x] = true
          } else {
            state[y][x] = false
          }
        }
      }
    }
  }

  // Count how many are on in the final state
  let countOn = 0;

  for (var y = 0; y < gridSizeY; y++) {
    for (var x = 0; x < gridSizeX; x++) {
      if (state[y][x]) {
        countOn += 1
      }
    }
  }
  
  return countOn
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let state: Record<number, Record<number, boolean>> = {}
  let gridSizeY = 0;
  let gridSizeX = 0;
  let iterations = 100;

  // Read through the input and build the state
  for (const i in input) {
    let line = input[i]
    
    if (line.length == 0) {
      // This is a blank line, ignore it
      continue
    }

    // Increment GridSizeY
    gridSizeY += 1;

    // Set the length of the line
    if (gridSizeX == 0) {
      gridSizeX = line.length
    } else if (gridSizeX != line.length) {
      console.log("Malformed input")
      return undefined
    }

    state[i]= {}
    for (var li = 0; li < line.length; li++) {
      if (line[li] == "#") {
        state[i][li] = true
      } else {
        state[i][li] = false
      }
    }
  }

  // Force the corners on
  state = forceCornersOn(state, gridSizeX)

  // Run the iterations
  for (var it = 0; it < iterations; it++) {
    // Get the count for the current state
    let count = countNeighbours(state)

    for (var y = 0; y < gridSizeY; y++) {
      for (var x = 0; x < gridSizeX; x++) {
        let countForLight = count[y][x];

        if (state[y][x]) {
          if (countForLight == 2 || countForLight == 3) {
            state[y][x] = true
          } else {
            state[y][x] = false
          }
        } else {
          if (countForLight == 3) {
            state[y][x] = true
          } else {
            state[y][x] = false
          }
        }
      }
    }

    // Force the corners on
    state = forceCornersOn(state, gridSizeX)
  }

  // Count how many are on in the final state
  let countOn = 0;

  for (var y = 0; y < gridSizeY; y++) {
    for (var x = 0; x < gridSizeX; x++) {
      if (state[y][x]) {
        countOn += 1
      }
    }
  }
  
  return countOn
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
  Day: 18,
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
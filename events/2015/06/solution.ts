import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

type Coord = {
  x: number,
  y: number
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  // Useful things
  const max_x = 999;
  const max_y = 999;

  // State Tracker
  let state: Record<number, Record<number, boolean>> = {}

  for (var x = 0; x <= max_x; x++) {
    let row: Record<number, boolean> = {}
    for (var y = 0; y <= max_y; y++){
      row[y] = false;
    }
    state[x] = row;
  }

  // Loop over the input
  for (var i = 0; i < input.length; i++) {
    // Split the command into segments
    let command_segments = input[i].split(" ");

    // Extract Information
    let command = "";
    let start: Coord
    let end: Coord
    if (command_segments.length == 5) {
      command = command_segments[1];
      const [sx, sy] = command_segments[2].split(',').map(Number);
      const [ex, ey] = command_segments[4].split(',').map(Number);
      start = {x: sx, y: sy}
      end = {x: ex, y: ey}
    } else if (command_segments.length == 4) {
      command = "toggle"
      const [sx, sy] = command_segments[1].split(',').map(Number);
      const [ex, ey] = command_segments[3].split(',').map(Number);
      start = {x: sx, y: sy}
      end = {x: ex, y: ey}
    } else { 
      // Unknown command structure
      continue ;
    }

    for (var x = start.x; x <= end.x; x++) {
      for (var y = start.y; y <= end.y; y++) {
        if (command == "on") {
          state[x][y] = true;
        } else if (command == "off") {
          state[x][y] = false;
        } else if (command == "toggle") {
          state[x][y] = !state[x][y];
        }
      }
    }
    
  }

  let count = 0;
  for (var x = 0; x <= max_x; x++) {
    for (var y = 0; y <= max_y; y++) {
      if (state[x][y] == true) {
        count += 1;
      }
    }
  }

  return count
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  // Useful things
  const max_x = 999;
  const max_y = 999;

  // State Tracker
  let state: Record<number, Record<number, number>> = {}

  for (var x = 0; x <= max_x; x++) {
    let row: Record<number, number> = {}
    for (var y = 0; y <= max_y; y++){
      row[y] = 0;
    }
    state[x] = row;
  }

  // Loop over the input
  for (var i = 0; i < input.length; i++) {
    // Split the command into segments
    let command_segments = input[i].split(" ");

    // Extract Information
    let command = "";
    let start: Coord
    let end: Coord
    if (command_segments.length == 5) {
      command = command_segments[1];
      const [sx, sy] = command_segments[2].split(',').map(Number);
      const [ex, ey] = command_segments[4].split(',').map(Number);
      start = {x: sx, y: sy}
      end = {x: ex, y: ey}
    } else if (command_segments.length == 4) {
      command = "toggle"
      const [sx, sy] = command_segments[1].split(',').map(Number);
      const [ex, ey] = command_segments[3].split(',').map(Number);
      start = {x: sx, y: sy}
      end = {x: ex, y: ey}
    } else { 
      // Unknown command structure
      continue ;
    }

    for (var x = start.x; x <= end.x; x++) {
      for (var y = start.y; y <= end.y; y++) {
        if (command == "on") {
          state[x][y] += 1;
        } else if (command == "off") {
          if (state[x][y] == 0) { continue; } // Don't go below zero
          state[x][y] -= 1;
        } else if (command == "toggle") {
          state[x][y] += 2
        }
      }
    }
    
  }

  let count = 0;
  for (var x = 0; x <= max_x; x++) {
    for (var y = 0; y <= max_y; y++) {
      count += state[x][y];
    }
  }

  return count
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
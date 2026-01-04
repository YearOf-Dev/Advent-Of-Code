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
  // Set up a variable to track visits to the same properties
  let visited: Coord[] = []

  // Set up a variable to track where we currently are
  let pos: Coord = {
    x: 0,
    y: 0
  }
  visited.push({...pos});

  // Loop through the directions
  for (var i = 0; i < input[0].length; i++) {
    let direction = input[0][i];

    if (direction == "^") {
      pos.y += 1;
    } else if (direction == "v") {
      pos.y -= 1;
    } else if (direction == ">") {
      pos.x += 1;
    } else if (direction == "<") {
      pos.x -= 1;
    }

    if (!visited.some(v => v.x === pos.x && v.y === pos.y)) {
      visited.push({...pos});
    }
  }

  return visited.length;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  // Set up trackers for Santa and RoboSanta
  let visited: Coord[] = []

  let santa_pos: Coord = {x: 0, y: 0}
  let robo_pos: Coord = {x: 0, y: 0}
  visited.push({...santa_pos});

  // Track the houses
  let totalHouses = 1

  // Loop over the directions
  for (var i = 0; i < input[0].length; i++) {
    let direction = input[0][i];

    // Whos moving?
    if (i % 2 == 0) {
      if (direction == "^") {
        santa_pos.y += 1;
      } else if (direction == "v") {
        santa_pos.y -= 1;
      } else if (direction == ">") {
        santa_pos.x += 1;
      } else if (direction == "<") {
        santa_pos.x -= 1;
      }
  
      if (!visited.some(v => v.x === santa_pos.x && v.y === santa_pos.y)) {
        visited.push({...santa_pos});
        totalHouses += 1;
      }
    } else {
      if (direction == "^") {
        robo_pos.y += 1;
      } else if (direction == "v") {
        robo_pos.y -= 1;
      } else if (direction == ">") {
        robo_pos.x += 1;
      } else if (direction == "<") {
        robo_pos.x -= 1;
      }
  
      if (!visited.some(v => v.x === robo_pos.x && v.y === robo_pos.y)) {
        visited.push({...robo_pos});
        totalHouses += 1;
      }
    }
  }

  return totalHouses;
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
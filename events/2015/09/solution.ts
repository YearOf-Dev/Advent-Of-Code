import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";
import { stringify } from "node:querystring";
import { start } from "node:repl";

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function bestNextHop(distances: Record<string, number>, visited: Record<string, boolean>): [string, number, Record<string, boolean>] {
  let nextHopName = ""
  let nextHopDistance = Infinity

  for (const place in distances) {
    if (distances[place] < nextHopDistance && !visited[place]) {
      nextHopName = place;
      nextHopDistance = distances[place];
    }
  }

  visited[nextHopName] = true;

  return [nextHopName, nextHopDistance, visited]

}

function bestRouteFor(distances: Record<string, Record<string, number>>, startAt: string): number {
  // Setup a blank visited tracker
  let visited: Record<string, boolean> = {}
  let places_to_visit = 0;
  for (const place in distances) {
    visited[place] = false;
    places_to_visit += 1;
  }
  visited[startAt] = true;

  let currentlyAt = startAt;
  let totalDistance = 0;

  for (var i = 0; i < places_to_visit-1; i++) {
    let addDistance = 0;
    [currentlyAt, addDistance, visited] = bestNextHop(distances[currentlyAt], visited)
    totalDistance += addDistance;
  }

  return totalDistance
}

function part1(input: string[]): number | undefined {
  let distances: Record<string, Record<string, number>> = {}
  let routes : Record<string, number> = {}

  // Build the distance tracker
  for (var i = 0; i < input.length; i++) {
    // Split the input into a string array
    let split_input = input[i].split(" ");

    if (split_input.length < 5) { continue }

    // Get the important information from the input
    let from = split_input[0];
    let destination = split_input[2];
    let distance_raw = split_input[4];
    let distance: number;

    // Convert Distance to a number
    if (!isNaN(parseInt(distance_raw))) {
      distance = parseInt(distance_raw);
    } else { continue }

    if (distances[from] == undefined) {
      distances[from] = {}
    }
    distances[from][destination] = distance;

    if (distances[destination] == undefined) {
      distances[destination] = {}
    }
    distances[destination][from] = distance;
  }

  // Find the best possible route
  let shortestRoute = Infinity;
  for (const place in distances) {
    routes[place] = bestRouteFor(distances, place);

    if (routes[place] < shortestRoute) {
      shortestRoute = routes[place];
    }
  }
  return shortestRoute;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function worstNextHop(distances: Record<string, number>, visited: Record<string, boolean>): [string, number, Record<string, boolean>] {
  let nextHopName = ""
  let nextHopDistance = 0

  for (const place in distances) {
    if (distances[place] > nextHopDistance && !visited[place]) {
      nextHopName = place;
      nextHopDistance = distances[place];
    }
  }

  visited[nextHopName] = true;

  return [nextHopName, nextHopDistance, visited]

}

function worstRouteFor(distances: Record<string, Record<string, number>>, startAt: string): number {
  // Setup a blank visited tracker
  let visited: Record<string, boolean> = {}
  let places_to_visit = 0;
  for (const place in distances) {
    visited[place] = false;
    places_to_visit += 1;
  }
  visited[startAt] = true;

  let currentlyAt = startAt;
  let totalDistance = 0;

  for (var i = 0; i < places_to_visit-1; i++) {
    let addDistance = 0;
    [currentlyAt, addDistance, visited] = worstNextHop(distances[currentlyAt], visited)
    totalDistance += addDistance;
  }

  return totalDistance
}

function part2(input: string[]): number | undefined {
  let distances: Record<string, Record<string, number>> = {}
  let routes : Record<string, number> = {}

  // Build the distances tracker
  for (var i = 0; i < input.length; i++) {
    // Split the input into a string array
    let split_input = input[i].split(" ");

    if (split_input.length < 5) { continue }

    // Get the important information from the input
    let from = split_input[0];
    let destination = split_input[2];
    let distance_raw = split_input[4];
    let distance: number;

    // Convert Distance to a number
    if (!isNaN(parseInt(distance_raw))) {
      distance = parseInt(distance_raw);
    } else { continue }

    if (distances[from] == undefined) {
      distances[from] = {}
    }
    distances[from][destination] = distance;

    if (distances[destination] == undefined) {
      distances[destination] = {}
    }
    distances[destination][from] = distance;
  }

  // Find the Worst possible route
  let longestRoute = 0;
  for (const place in distances) {
    routes[place] = worstRouteFor(distances, place);

    if (routes[place] > longestRoute) {
      longestRoute = routes[place];
    }
  }

  return longestRoute;
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
  Day: 9,
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
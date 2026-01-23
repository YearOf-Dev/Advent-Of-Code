import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

function elvesWhoVisited(house: number): number[] {
  let elves: number[] = [1, house]

  for (var i = 2; i < Math.floor(Math.sqrt(house)); i++) {
    if (house % i == 0) {
      elves.push(i)

      if (i != Math.floor(house/i)) {
        elves.push(Math.floor(house/i))
      }
    }
  }

  return elves
}

function elvesWhoVisitedLimited(house: number, limit: number): number[] {
  let elves: number[] = []

  if (limit >= house) {
    elves.push(1)
  }

  for (var i = 2; i <= Math.floor(Math.sqrt(house)); i++) {
    if (house % i == 0) {
      if ( i * limit >= house) {
        elves.push(i)
      }

      let paired = Math.floor(house / i)
      if (i != paired && paired * limit >= house) {
        elves.push(paired)
      }
    }
  }
  elves.push(house)  

  return elves
}
// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let target = parseInt(input[0])
  let targetFound = false;
  let lastHouse = 0
  
  while (!targetFound) {
    let elves = elvesWhoVisited(lastHouse + 1)
    let sum = elves.reduce((acc, cv) => acc + (cv * 10), 0)
    if (sum >= target) {
      return lastHouse + 1
    }
    lastHouse += 1
  }
  
  return 0
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let target = parseInt(input[0])
  let targetFound = false;
  let lastHouse = 0

  // console.log(elvesWhoVisitedLimited(50, 50))
  
  while (!targetFound) {
    let elves = elvesWhoVisitedLimited(lastHouse + 1, 50)
    let sum = elves.reduce((acc, cv) => acc + (cv * 11), 0)
    if (sum >= target) {
      return lastHouse + 1
    }
    lastHouse += 1
  }
  
  return 0
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
  Day: 20,
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
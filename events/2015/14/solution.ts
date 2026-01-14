import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

type ReindeerStats = {
  fly_speed: number,
  fly_duration: number,
  rest_duration: number
  points?: number
}

function whosInTheLead(reindeers: Record<string, ReindeerStats>, duration: number): [string[], number] {
  let maxDistance = 0;
  let winningReindeer: string[] = []
  for (const reindeer in reindeers) {    
    let distance = 0;
    let distancePerBurst = reindeers[reindeer].fly_speed * reindeers[reindeer].fly_duration;
    let durationRemaining = duration
    let fullPeriod = reindeers[reindeer].fly_duration + reindeers[reindeer].rest_duration;

    // Can we do a full burst or not?
    if (duration < reindeers[reindeer].fly_duration) {
      distance = reindeers[reindeer].fly_speed * duration
    } else {
      // Handle the initial burst
      distance += distancePerBurst
      durationRemaining -= reindeers[reindeer].fly_duration

      // How many more bursts can we do
      let potentialBursts = Math.floor(durationRemaining / fullPeriod)
      distance += distancePerBurst * potentialBursts

      // Partial Bursts?
      let timeAfterBursts = (durationRemaining - (potentialBursts * fullPeriod))
      if (timeAfterBursts > reindeers[reindeer].rest_duration) {
        let extraTime = timeAfterBursts - reindeers[reindeer].rest_duration
        distance += extraTime * reindeers[reindeer].fly_speed
      }
    }
    
    if (distance > maxDistance) {
      maxDistance = distance
      winningReindeer = [reindeer]
    } else if (distance == maxDistance) {
      winningReindeer.push(reindeer)
    }
  }

  return [winningReindeer, maxDistance]
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let duration = 2503
  let reindeers: Record<string, ReindeerStats> = {}

  // Work everything out for each reindeer
  for (var i = 0; i < input.length; i++) {
    if (input[i].length == 0 ) { continue }
    let parts = input[i].split(" ")
    let stats: ReindeerStats = {
      fly_speed: parseInt(parts[3]),
      fly_duration: parseInt(parts[6]),
      rest_duration: parseInt(parts[13])
    }
    reindeers[parts[0]] = stats
  }

  // Work out overall speed
  let [winningDeer, maxDistance] = whosInTheLead(reindeers, duration)

  return maxDistance
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let duration = 2503
  let reindeers: Record<string, ReindeerStats> = {}

  // Work everything out for each reindeer
  for (var i = 0; i < input.length; i++) {
    if (input[i].length == 0 ) { continue }
    let parts = input[i].split(" ")
    let stats: ReindeerStats = {
      fly_speed: parseInt(parts[3]),
      fly_duration: parseInt(parts[6]),
      rest_duration: parseInt(parts[13]),
      points: 0
    }
    reindeers[parts[0]] = stats
  }

  // Work out the points each second
  for (var s = 1; s < duration+1; s++) {
    // Loop over the reindeer and work it out
    let [winners, maxDistance] = whosInTheLead(reindeers, s)

    for (const index in winners) {
      let winningReindeer = winners[index]
      if (!reindeers[winningReindeer]) {
        continue
      }
      if (reindeers[winningReindeer].points !== undefined) {
        reindeers[winningReindeer].points += 1
      } else {
        reindeers[winningReindeer].points = 1;
      }
    }
  }

  // Who wins?
  let maxPoints = 0
  for (const reindeer in reindeers) {
    if (!reindeers[reindeer].points) { continue }

    if (reindeers[reindeer].points > maxPoints) {
      maxPoints = reindeers[reindeer].points
    }
  }

  return maxPoints
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
  Day: 14,
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
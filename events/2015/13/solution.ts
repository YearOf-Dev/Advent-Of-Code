import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";
import { stringify } from "node:querystring";

function calculateHappiness(people: Record<string, Record<string, number>>, arrangement: string[]): number {
  let total = 0

  let len = arrangement.length;

  // Loop through the arrangement calculating the happiness for each each pair
  for (var i = 0; i < len; i++) {
    // Get the names of people, wrap around the array at the ends
    let person = arrangement[i];
    let left = arrangement[(i-1 + len) % len];
    let right = arrangement[(i+1) % len];

    total += people[person][left] + people[person][right];
  }

  return total
}

function generateAllPermutations(names: string[]): string[][] {
  // If the array only contains 1 item, return it
  if (names.length <= 1) { return [names]}

  // Start an output array
  let output: string[][] = [];

  // Pick each item of the array and recursivly run
  for (var i = 0; i < names.length; i++) {
    // Remove current item
    let rest = [...names.slice(0, i), ...names.slice(i + 1)]
    let permutations = generateAllPermutations(rest);

    for (const result of permutations) {
      output.push([names[i], ...result]);
    }
  }

  return output
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let people: Record<string, Record<string, number>> = {}
  let names: string[] = [];

  for (var i = 0; i < input.length; i++) {
    if (input[i].length == 0) { continue }
    let parts = input[i].split(" ");
    let personA = parts[0];
    let personB = parts[10];
    personB = personB.substring(0, personB.length - 1)
    let change = parts[3];
    let posOrNeg = parts[2];

    if (people[personA] == undefined) {
      people[personA] = {}
    }

    if (posOrNeg == "gain") {
      people[personA][personB] = parseInt(change);
    } else if (posOrNeg == "lose") {
      people[personA][personB] = -parseInt(change);
    }

    if (!names.includes(personA)) {
      names.push(personA);
    }
  }

  // Pick the first person
  let first = names[0];
  let rest = [...names.slice(1)];
  let permutationsOfRest =  generateAllPermutations(rest);
  let allPermutations = permutationsOfRest.map((p) => [first, ...p]);

  let maxHappiness = -Infinity;
  for (const perm of allPermutations) {
    let hapiness = calculateHappiness(people, perm);
    if (hapiness > maxHappiness) {
      maxHappiness = hapiness
    }
  }

  return maxHappiness;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let people: Record<string, Record<string, number>> = {}
  let names: string[] = [];

  for (var i = 0; i < input.length; i++) {
    if (input[i].length == 0) { continue }
    let parts = input[i].split(" ");
    let personA = parts[0];
    let personB = parts[10];
    personB = personB.substring(0, personB.length - 1)
    let change = parts[3];
    let posOrNeg = parts[2];

    if (people[personA] == undefined) {
      people[personA] = {}
    }

    if (posOrNeg == "gain") {
      people[personA][personB] = parseInt(change);
    } else if (posOrNeg == "lose") {
      people[personA][personB] = -parseInt(change);
    }

    if (!names.includes(personA)) {
      names.push(personA);
    }
  }

  // Add myself to the list
  people["Me"] = {}
  for (const person in people) {
    people[person]["Me"] = 0;
    people["Me"][person] = 0;
  }
  names.push("Me");

  // Pick the first person
  let first = names[0];
  let rest = [...names.slice(1)];
  let permutationsOfRest =  generateAllPermutations(rest);
  let allPermutations = permutationsOfRest.map((p) => [first, ...p]);

  let maxHappiness = -Infinity;
  for (const perm of allPermutations) {
    let hapiness = calculateHappiness(people, perm);
    if (hapiness > maxHappiness) {
      maxHappiness = hapiness
    }
  }

  return maxHappiness;
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
  Day: 13,
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
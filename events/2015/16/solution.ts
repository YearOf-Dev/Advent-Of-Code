import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let theSues: Record<number, Record<string, number>> = {}

  for (var i = 0; i < input.length; i++) {
    let item = input[i];

    if (item.length == 0) { continue }

    // Split into the ID of the Sue, and the properties
    let firstSplitIndex = item.indexOf(":")
    let sueID = parseInt(item.substring(0, firstSplitIndex).split(" ")[1])
    let properties = item.substring(firstSplitIndex+2).split(",")

    // Create a new sue
    theSues[sueID] = {}
    theSues[sueID]["ID"] = sueID

    // Add each thing we know about this particular sue to our records
    for (const item in properties) {
      let parts = properties[item].split(":")
      let property = parts[0].substring(parseInt(item) == 0 ? 0 : 1)
      let count = parseInt(parts[1].substring(1))

      theSues[sueID][property] = count
    }    
  }

  // Check each known property against the Sue's, eliminate any that dont match
  let invalidSues: string[] = []

  const knownProperties: Record<string, number> = {
    "children": 3,
    "cats": 7,
    "samoyeds": 2,
    "pomeranians": 3,
    "akitas": 0,
    "vizslas": 0,
    "goldfish": 5,
    "trees": 3,
    "cars": 2,
    "perfumes": 1
  }

  for (const sueID in theSues) {
    const sueToCheck = theSues[sueID]
    
    for (const property in knownProperties) {
      if (sueToCheck.hasOwnProperty(property) && sueToCheck[property] != knownProperties[property]) {
        if (!invalidSues.includes(sueID)) {
          invalidSues.push(sueID)
        }
      }
    }
  }

  // Find the Sue that sent the present
  for (const sueID in theSues) {
    if (!invalidSues.includes(String(theSues[sueID]["ID"]))) {
      return theSues[sueID]["ID"]
    }
  }
  return undefined;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let theSues: Record<number, Record<string, number>> = {}

  for (var i = 0; i < input.length; i++) {
    let item = input[i];

    if (item.length == 0) { continue }

    // Split into the ID of the Sue, and the properties
    let firstSplitIndex = item.indexOf(":")
    let sueID = parseInt(item.substring(0, firstSplitIndex).split(" ")[1])
    let properties = item.substring(firstSplitIndex+2).split(",")

    // Create a new sue
    theSues[sueID] = {}
    theSues[sueID]["ID"] = sueID

    // Add each thing we know about this particular sue to our records
    for (const item in properties) {
      let parts = properties[item].split(":")
      let property = parts[0].substring(parseInt(item) == 0 ? 0 : 1)
      let count = parseInt(parts[1].substring(1))

      theSues[sueID][property] = count
    } 
  }

  // Check each known property against the Sue's, eliminate any that dont match
  let invalidSues: string[] = []

  const knownProperties: Record<string, number> = {
    "children": 3,
    "cats": 7,
    "samoyeds": 2,
    "pomeranians": 3,
    "akitas": 0,
    "vizslas": 0,
    "goldfish": 5,
    "trees": 3,
    "cars": 2,
    "perfumes": 1
  }
  
  for (const sueID in theSues) {
    const sueToCheck = theSues[sueID]
    
    for (const property in knownProperties) {
      if (property == "cats" || property == "trees") {
        if (sueToCheck.hasOwnProperty(property) && sueToCheck[property] <= knownProperties[property]) {
          if (!invalidSues.includes(sueID)) {
            invalidSues.push(sueID)
          }
        }
      } else if (property == "pomeranians" || property == "goldfish") {
        if (sueToCheck.hasOwnProperty(property) && sueToCheck[property] >= knownProperties[property]) {
          if (!invalidSues.includes(sueID)) {
            invalidSues.push(sueID)
          }
        }
      } else {
        if (sueToCheck.hasOwnProperty(property) && sueToCheck[property] != knownProperties[property]) {
          if (!invalidSues.includes(sueID)) {
            invalidSues.push(sueID)
          }
        }
      }
    }
  }

  // Find the Sue that sent the present
  let possibleSues: number[] = []
  for (const sueID in theSues) {
    if (!invalidSues.includes(String(theSues[sueID]["ID"]))) {
      return theSues[sueID]["ID"]
    }
  }
  return undefined;
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
  Day: 16,
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
import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

function hasABBA(ipString: string) {
  for (var i = 0; i < ipString.length-3; i++) {
    let a = ipString[i]
    let b = ipString[i+1]
    let x = ipString[i+2]
    let y = ipString[i+3]

    if (a == b || x == y) {
      continue
    }

    if (a == y && b == x) {
      return true
    }
  }
  return false
}

function extractHypernetSequences(ipString: string) {
  let regex = /\[[a-z]+\]/g
  let match = ipString.match(regex)

  return match
}

function extractSupernetSequences(ipString: string) {
  let regex = /\[[a-z]+\]/
  let supernets = ipString.split(regex)

  return supernets
}

function extractABASequences(ipString: string) {
  let supernets = extractSupernetSequences(ipString)
  let foundABAs: string[] = []

  for (var i = 0; i < supernets.length; i++) {
    for (var j = 0; j < supernets[i].length-2; j++) {
      let a = supernets[i][j]
      let b = supernets[i][j+1]
      let c = supernets[i][j+2]

      if (a == c && b != a) {
        let aba = a+b+c
        foundABAs.push(aba)
      }
    }
  }

  return foundABAs
}

function extractBABSequences(ipString: string) {
  let hypernetSequences = extractHypernetSequences(ipString)

  if (hypernetSequences == undefined) {
    return []
  }

  let foundBABs: string[] = []

  for (var i = 0; i < hypernetSequences.length; i++) {
    let trimmedHypernet = hypernetSequences[i].substring(1, hypernetSequences[i].length-1)
    for (var j = 0; j < trimmedHypernet.length-2; j++) {
      let a = trimmedHypernet[j]
      let b = trimmedHypernet[j+1]
      let c = trimmedHypernet[j+2]

      if (a == c && b != a) {
        let bab = a+b+c
        foundBABs.push(bab)
      }
    }
  }

  return foundBABs
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let TLSEnabledIPs = 0;

  for (var i = 0; i < input.length; i++) {
    if (hasABBA(input[i])) {
      let hypernetSequences = extractHypernetSequences(input[i])

      if (hypernetSequences == undefined) {
        // Must be true as it has no hypernet sequences
        TLSEnabledIPs += 1
        continue
      }
      let valid = true

      for (var j = 0; j < hypernetSequences.length; j++) {
        let sequence = hypernetSequences[j].substring(1, hypernetSequences[j].length-1)
        if (hasABBA(sequence)) {
          valid = false
        }
      }

      if (valid) {
        TLSEnabledIPs += 1
      }
    }
  }


  return TLSEnabledIPs;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let SSLEnabledIPs = 0

  for (var i = 0; i < input.length; i++) {
    let ABAs = extractABASequences(input[i])
    let BABs = extractBABSequences(input[i])

    if (ABAs.length == 0 || BABs.length == 0) {
      continue
    }

    let isValid = false
    for (var j = 0; j < ABAs.length; j++) {
      let inverted = ABAs[j][1]+ABAs[j][0]+ABAs[j][1]
      if (BABs.includes(inverted)) {
        isValid = true
        break
      }
    }

    if (isValid) {
      SSLEnabledIPs += 1
    }
  }

  return SSLEnabledIPs;
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
  Day: 7,
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
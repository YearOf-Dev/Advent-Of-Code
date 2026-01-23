import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

function findSubstitutes(medicine: string, molecule: string, replacement: string): string[] {
  let medLen = medicine.length
  let molLen = molecule.length

  if (medicine.length < molecule.length) {
    return []
  }

  let newMedicine = ""
  let foundMedicines: string[] = []


  for (var i = 0; i < medLen; i++) {
    let testPart = medicine.substring(i, i+molLen)
    
    if (testPart == molecule) {
      foundMedicines.push(newMedicine + replacement + medicine.substring(i+molLen))
    }
    newMedicine += medicine[i]
  }
  
  return foundMedicines
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let replacements: Record<string, string[]> = {}
  let medicine: string = ""
  let foundMedicines: string[] = [];

  // Loop over the input
  for (var i = 0; i < input.length; i ++) {
    let line = input[i];

    // If the line contains no content, ignore it
    if (line.length == 0) {
      continue;
    }

    // Does the line contain "=>"?
    if (line.includes("=>")) {
      // This line is a replacement definition
      let parts = line.split(" ")

      if (replacements[parts[0]] == undefined) {
        replacements[parts[0]] = [parts[2]]
      } else {
        replacements[parts[0]].push(parts[2])
      }
    } else {
      // This is the medicine line
      medicine = line
    }
  }

  // Loop over the replacements
  for (const molecule in replacements) {
    for (const index in replacements[molecule]) {
      let substitute = replacements[molecule][index]
      
      let results = findSubstitutes(medicine, molecule, substitute);
      
      for (var i = 0; i < results.length; i++) {
        if (!foundMedicines.includes(results[i])) {
          foundMedicines.push(results[i])
        }
      }
    }
  }

  return foundMedicines.length;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let replacements: [string, string][] = []
  let medicine: string = ""

  // Parse the input
  for (var i = 0; i < input.length; i++) {
    let line = input[i];

    if (line.length == 0) { continue }

    if (line.includes("=>")) {
      const parts = line.split(" ")

      let newReplacement: [string, string] = [parts[2].split('').reverse().join(''), parts[0].split('').reverse().join('')]
      replacements.push(newReplacement)
    } else {
      medicine = line.split('').reverse().join('')
    }
  }
  
  let steps = 0;

  // Keep reducing until we get to a single element
  while (medicine.length > 1) {
    // Find the leftmost occurrence among all possible replacements
    let bestIndex = Infinity;
    let bestReplacement: [string, string] | null = null;

    for (const replacement of replacements) {
      const [from, to] = replacement;
      const index = medicine.indexOf(from);
      if (index !== -1 && index < bestIndex) {
        bestIndex = index;
        bestReplacement = replacement;
      }
    }

    // If we found a replacement, apply it
    if (bestReplacement !== null) {
      const [from, to] = bestReplacement;
      medicine = 
        medicine.substring(0, bestIndex) +
        to +
        medicine.substring(bestIndex + from.length);
      steps++;
    } else {
      throw new Error(`Stuck after ${steps} steps`);
    }
  }

  return steps;
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
  Day: 19,
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
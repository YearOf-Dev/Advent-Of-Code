import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  // Some useful things to keep track of
  let min_vowels = 3;
  let min_doubles = 1;
  const naughty_strings = ["ab", "cd", "pq", "xy"];

  // Keep track of the number of nice
  let nice_strings = 0;

  // Loop over the strings
  for (var i = 0; i < input.length; i++) {
    let test_string = input[i];
    
    // Does the string contains any naughty strings?
    let contains_naughty_string = false;
    for (var j = 0; j < naughty_strings.length; j++) {
      if (test_string.includes(naughty_strings[j])) {
        contains_naughty_string = true;
        break;
      }
    }
    if (contains_naughty_string) { continue; }

    // Check for vowels
    let vowel_count = (test_string.match(/[a,e,i,i,o,u]/g) || []).length
    if (vowel_count < min_vowels) { continue; }

    // Check for double characters
    let doubles = 0;
    for (var j = 1; j < test_string.length; j++) {
      if (test_string[j] == test_string[j-1]) {
        doubles += 1
      }
    }
    if (doubles < min_doubles) { continue; }

    // It must be nice
    nice_strings += 1;
  }

  return nice_strings;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  // Useful things
  let min_spaced_doubles = 1;

  // Keep track of the number of nice strings
  let nice_strings = 0;

  // Loop over the strings
  for (var i = 0; i < input.length; i++) {
    let test_string = input[i];

    // Check for spaced doubles (eg, aba)
    let spaced_doubles = 0;
    for (var j = 2; j < test_string.length; j++) {
      if (test_string[j] == test_string[j-2]) {
        spaced_doubles += 1;
      }
    }
    if (spaced_doubles < min_spaced_doubles) { continue; }

    // Check for non-overlapping repeating doubles
    let repeating_doubles = false;
    for (var j = 1; j < test_string.length; j ++) {
      let double_string = test_string.substring(j-1, j+1);
      let instances = 0;
      let lastInstance: number | undefined = undefined;
      for (var s = 1; s < test_string.length; s++) {
        if (test_string[s-1] == double_string[0] && test_string[s] == double_string[1] && lastInstance != s-1) {
          instances += 1
          lastInstance = s;
        }
      }
      if (instances >= 2) { repeating_doubles = true}
    }

    if (repeating_doubles) {
      nice_strings += 1
    }
  }

  return nice_strings
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
  Day: 5,
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
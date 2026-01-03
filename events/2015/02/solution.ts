import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let totalArea = 0;

  // Work through every present
  for (const present of input) {
    // Get the dimensions of the present
    const [length, width, height] = present.split('x').map(Number);

    // Calculate the area for the present
    let area = (2 * length * width) + (2 * width * height) + (2 * height * length);

    // Find the smallest side
    let smallestSide = Math.min((length * width), (width * height), (height * length));
    area += smallestSide;

    // Add the area to the total area
    totalArea += area;
  }

  // Return the total area
  return totalArea;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let totalRibbon = 0;

  // Work through every present
  for (const present of input) {
    // Get the dimensions of the present
    const [length, width, height] = present.split('x').map(Number);

    const perimeter = 2 * Math.min(length + width, width + height, height + length);

    // Calculate the volume
    const volume = length * width * height;

    // Add the length to the total ribbon
    totalRibbon += perimeter + volume;
  }

  // Return the total area
  return totalRibbon;
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
  Day: 2,
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
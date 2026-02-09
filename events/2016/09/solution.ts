import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

function expandString(repetitions: number, data: string): string {
  let output = ""

  for (var i = 0; i < repetitions; i++) {
    output += data
  }

  return output
}

function checkForMarkerAtIndex(data: string, index: number): [number, number, number] | false {
  if (data[index] != "(") {
    return false
  }

  // Scan for the end of the marker
  let allowedChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "x", "(", ")"]
  let endIndex = index
  for (var i = index; i < data.length; i++) {
    if (!allowedChars.includes(data[i])) {
      // It can't be a marker as it includes invalid characters
      return false
    }

    if (data[i] == ")") {
      endIndex = i
      break
    }
  }

  // Extract the values we need
  let markerDefinition = data.substring(index+1, endIndex).split("x")
  let dataLength = parseInt(markerDefinition[0])
  let dataRepetition = parseInt(markerDefinition[1])
  let dataStartIndex = endIndex + 1

  return [dataLength, dataRepetition, dataStartIndex]
}

function selectData(data: string, startIndex: number, length: number) {
  return data.substring(startIndex, startIndex + length)
}

function decompressString(input: string): string {
  let decompressed = ""
  let encoded = input

  for (var i = 0; i < encoded.length; i++) {
    let currentCharacter = encoded[i]
    if (currentCharacter == "(") {
      let marker = checkForMarkerAtIndex(encoded, i)

      if (marker === false) {
        decompressed += currentCharacter
      } else {
        let selectedData = selectData(encoded, marker[2], marker[0])
        let decodedData = expandString(marker[1], selectedData)
        decompressed += decodedData
        i = marker[2] + marker[0] -1
      }
    } else {
      decompressed += currentCharacter
    }
  }

  return decompressed
}

function calculateThoreticalDecompressedLength(input: string) {
  let decompressed = 0
  let encoded = input

  for (var i = 0; i < encoded.length; i++) {
    let currentCharacter = encoded[i]
    if (currentCharacter == "(") {
      let marker = checkForMarkerAtIndex(encoded, i)

      if (marker === false) {
        decompressed += 1
      } else {
        let selectedData = selectData(encoded, marker[2], marker[0])
        let decodedDataLength = calculateThoreticalDecompressedLength(expandString(marker[1], selectedData))
        decompressed += decodedDataLength
        i = marker[2] + marker[0] -1
      }
    } else {
      decompressed += 1
    }
  }

  return decompressed
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  return decompressString(input[0]).length
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  return calculateThoreticalDecompressedLength(input[0])
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
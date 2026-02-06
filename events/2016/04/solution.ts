import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

function getSectorID(roomEntry: string): number | undefined {
  let regex = new RegExp("[0-9]+")
  let match = regex.exec(roomEntry)

  if (match == undefined) {
    return undefined
  }

  return parseInt(match[0])
}

function getChecksum(roomEntry: string): string | undefined {
  let regex = new RegExp("\[[a-z]+\]")
  let match = regex.exec(roomEntry)
  if (match == null) {
    return undefined
  }
  return match[0].substring(1, match[0].length-1)
}

function getName(roomEntry: string) {
  let sectorID = getSectorID(roomEntry)
  if (sectorID == undefined) { return undefined }

  let endOfName = roomEntry.indexOf(sectorID.toString())-1
  return roomEntry.substring(0, endOfName)

}

function countCharacters(roomEntry: string): Record<string, number> {
  let name = getName(roomEntry)
  if (name == undefined) { return {} }

  let characters: Record<string, number> = {}

  for (var i = 0; i < name.length; i++) {
    let char = name[i]

    if (char == "-"){
      continue
    }

    if (characters[char]) {
      characters[char] += 1
    } else {
      characters[char] = 1
    }
  }

  return characters
}

function generateChecksum(roomEntry: string): string {
  let charCount = countCharacters(roomEntry)

  let countMap: Record<number, string[]> = {}
  let counts: number[] = []
  for (const char in charCount) {
    if (countMap[charCount[char]]) {
      countMap[charCount[char]].push(char)
    } else {
      countMap[charCount[char]] = [char]
    }

    if (!counts.includes(charCount[char])) {
      counts.push(charCount[char])
    }
  }

  // Sort the entrys
  for (const count in countMap) {
    countMap[count] = countMap[count].sort()
  }
  counts = counts.sort()

  // Build the checksum
  let checksum = ""

  while (checksum.length <= 4) {
    let countToAdd = counts[counts.length-1]

    checksum += countMap[countToAdd][0]

    if (countMap[countToAdd].length == 1) {
      counts.pop()
    } else {
      countMap[countToAdd].shift()
    }
  }

  return checksum
}

function validEntry(roomEntry): boolean {
  let givenChecksum =  getChecksum(roomEntry);
  let generatedChecksum = generateChecksum(roomEntry);

  if (givenChecksum != generatedChecksum) {
    return false
  }
  return true
}

function decodeName(roomEntry: string): string | undefined {
  let sectionID = getSectorID(roomEntry);
  let name = getName(roomEntry);

  if (name == undefined || sectionID == undefined) {
    return undefined
  }

  // Strip special characters
  let cleanedName = ""
  for (var i = 0; i < name.length; i++) {
    if (name[i] != "-") {
      cleanedName += name[i]
    }
  }

  let decodedName = shiftCipherDecode(cleanedName, sectionID)

  return decodedName
}

function shiftCipherDecode(input: string, offset: number): string {
  let alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

  let output = ""
  for (var i = 0; i < input.length; i++){
    let char = input[i]
    let currentIndex = alphabet.indexOf(char)
    let newIndex = (currentIndex + offset) % 26;
    output += alphabet[newIndex]
  }

  return output
}
// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let sumOfSectorID = 0
  for (var i = 0; i < input.length; i++) {
    if (input[i].length == 0) { continue }
    
    if (validEntry(input[i])) {
      let sectorID = getSectorID(input[i])
      if (sectorID != undefined) {
        sumOfSectorID += sectorID
      }
    }
  }
  return sumOfSectorID;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  for (var i = 0; i < input.length; i++) {
    if (input[i].length == 0) { continue }
    
    if (validEntry(input[i])) {
      let name = decodeName(input[i])
      if (name == undefined) {
        continue
      }
      if (name == "northpoleobjectstorage") {
        let sectorID = getSectorID(input[i])
        if (sectorID == undefined) { continue }
        return sectorID
      }
    }
  }
  return undefined
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
  Day: 4,
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
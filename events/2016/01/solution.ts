import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

function finalCoordFromDirections(directions: string[]): [number, number] {
  let currentX = 0;
  let currentY = 0;
  let currentDirection = "North";

  for (var i = 0; i < directions.length; i++) {
    let direction = directions[i]
    
    // Get the rotation part of the instruction & Rotate
    let rotation = direction[0]
    currentDirection = rotate(currentDirection, rotation)

    // Move the correct amount
    let amount = parseInt(direction.substring(1))
    switch (currentDirection) {
      case "North":
        currentY += amount
        break
      case "South":
        currentY -= amount
        break
      case "East":
        currentX += amount
        break
      case "West":
        currentX -= amount
        break
    }
  }

  return [currentX, currentY]
}

function rotate(currentDirection: string, rotateDirection: string) {
  let directions = ["North", "East", "South", "West"]
  let newDirectionIndex = 0;
  switch (rotateDirection){
    case "R":
      newDirectionIndex = (directions.indexOf(currentDirection)+1+directions.length) % directions.length
      break
    case "L":
      newDirectionIndex = (directions.indexOf(currentDirection)-1+directions.length) % directions.length
      break
  }

  return directions[newDirectionIndex];
}

type Coord = {
  X: number,
  Y: number
}

function CoordFirstVisitedTwice(directions: string[]): [number, number] | undefined {
  let currentX = 0;
  let currentY = 0;
  let currentDirection = "North";
  let visitedCoords: Coord[] = []

  for (var i = 0; i < directions.length; i++) {
    let direction = directions[i]
    
    // Get the rotation part of the instruction & Rotate
    let rotation = direction[0]
    currentDirection = rotate(currentDirection, rotation)

    // Move the correct amount
    let amount = parseInt(direction.substring(1))
    for (var j = 0; j < amount; j++) {
      switch (currentDirection) {
        case "North":
          currentY += 1
          break
        case "South":
          currentY -= 1
          break
        case "East":
          currentX += 1
          break
        case "West":
          currentX -= 1
          break
      }

      let coord: Coord = {X: currentX, Y: currentY }
      if (visitedCoord(visitedCoords, coord)) {
        return [currentX, currentY]
      } else {
        visitedCoords.push(coord)
      }
    }
  }

  return undefined
}

function visitedCoord(visited: Coord[], current: Coord): boolean {
  for (var i = 0; i < visited.length; i++) {
    let toCheck = visited[i]

    if (toCheck.X == current.X && toCheck.Y == current.Y) {
      return true
    }
  }
  return false
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let directions = input[0].split(", ")
  let finalCoord = finalCoordFromDirections(directions)

  return Math.abs(finalCoord[0]) + Math.abs(finalCoord[1]);
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let directions = input[0].split(", ")
  let finalCoord = CoordFirstVisitedTwice(directions)

  if (finalCoord == undefined) {
    return undefined
  }


  return Math.abs(finalCoord[0]) + Math.abs(finalCoord[1]);
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
  Day: 1,
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
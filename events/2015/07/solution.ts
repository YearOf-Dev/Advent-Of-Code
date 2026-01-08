import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

function to16bit(value: number): number {
  return value & 0xFFFF;
}

function update_connections(connections: Record<string, string[] | number>): Record<string, string[] | number>{
  for (const wire in connections) {
    let command = connections[wire];

    if (typeof command == "number") { continue; }

    if (command.length == 1) {
      if (!isNaN(parseInt(command[0]))) {
        connections[wire] = parseInt(command[0]);
      }
    } 
  }

  return connections
}

function solve_connection(connections: Record<string, string[] | number>, wire: string): [number, Record<string, string[] | number>] {
  let wc = connections[wire];
  connections = update_connections(connections)

  if (typeof wc == "number") {
    return [wc, connections]
  }

  // How long is the array?
  if (wc.length == 1) {
    // It's an assignment
    if (isNaN(parseInt(wc[0]))) {
      return solve_connection(connections, wc[0]);
    } else {
      let ans = parseInt(wc[0]);
      connections[wire] = ans;
      return [ans, connections];
    }
  } else if (wc.length == 2) {
    // It's a not command
    let nv = wc[1];

    if (isNaN(parseInt(nv))) {
      let solved_nv = 0;
      [solved_nv, connections] = solve_connection(connections, nv)
      let ans = to16bit(~solved_nv);
      connections[wire] = ans;
      return [ans, connections];
    } else {
      let ans = to16bit(~parseInt(nv));
      connections[wire] = ans;
      return [ans, connections];
    }
  } else if (wc.length == 3) {
    // It could be a few things...
    let op = wc[1];

    let as: string = wc[0];
    let bs: string = wc[2];
    let a: number = 0
    let b: number = 0

    if (isNaN(parseInt(as)) ) {
      [a, connections] = solve_connection(connections, as)
    } else {
      a = parseInt(as)
    }

    if (isNaN(parseInt(bs))) {
      [b, connections] = solve_connection(connections, bs)
    } else {
      b = parseInt(bs)
    }

    if (op == "AND") {
      let ans = to16bit(a&b);
      connections[wire] = ans;
      return [ans, connections];
    } else if (op == "OR") {
      let ans = to16bit(a|b);
      connections[wire] = ans;
      return [ans, connections];
    } else if (op == "LSHIFT") {
      let ans = to16bit(a<<b);
      connections[wire] = ans;
      return [ans, connections];
    } else if (op == "RSHIFT") {
      let ans = to16bit(a>>b);
      connections[wire] = ans;
      return [ans, connections];
    }
  }



  return [0, connections]
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  // Tracker
  let connections: Record<string, string[] | number> = {}

  // Load all connections
  for (var i = 0; i < input.length; i++) {
    let command = input[i];
    let destination = command.split("->")[1].trim();
    let instruction = command.split("->")[0].trim().split(" ");

    connections[destination] = instruction
  }

  let ans = 0;
  [ans, connections] = solve_connection(connections, "a")

  return ans
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[], p1_ans: number): number | undefined {
  // Previous Results
  let b: number | undefined = part1(input);
  if (b == undefined) {return -1}
  
  // Tracker
  let connections: Record<string, string[] | number> = {}

  // Load all connections
  for (var i = 0; i < input.length; i++) {
    let command = input[i];
    let destination = command.split("->")[1].trim();
    let instruction = command.split("->")[0].trim().split(" ");

    connections[destination] = instruction
  }
  connections["b"] = b;

  let ans = 0;
  [ans, connections] = solve_connection(connections, "a")

  return ans
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
const p2Result = measurePerformance(() => part2(input, p1Result.Result));

// End the timer
const endTimeStamp = new Date(Date.now()).toISOString();
const endTime = performance.now();
const duration = endTime - startTime;

// Return the results
return {
  Year: 2015,
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
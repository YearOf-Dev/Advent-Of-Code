import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';


export function addCommand_init(program: Command) {
  program
    .command('init')
    .description('Initialize a new Advent of Code Day')
    .argument('<year>', 'The year of the Advent of Code event')
    .argument('<day>', 'The day of the Advent of Code event')
    .option('-l, --location <location>', 'The location of the Advent of Code events', 'events')
    .action((year: string, day: string, options: { location: string }) => {
      console.log('✨ Initializing a new Advent of Code Day...');

      // Ensure the day is two digits long
      let dayNumber = parseInt(day)
      if (day.length < 2) {
        day = '0' + day;
      }

      // Ensure the year is four digits long
      if (year.length < 4) {
        year = '20' + year;
      }

      // Check the location exists
      if (!fs.existsSync(options.location)) {
        console.error(`    🚨 Location ${options.location} ${chalk.red('does not')} exist...`);
        fs.mkdirSync(options.location, { recursive: true });
        console.log(`    🎉 Location ${options.location} ${chalk.green('created')}...`);
      }

      // Check the year exists
      if (!fs.existsSync(path.join(options.location, year))) {
        console.error(`    🚨 Year ${year} ${chalk.red('does not')} exist...`);
        fs.mkdirSync(path.join(options.location, year), { recursive: true });
        console.log(`    🎉 Year ${year} ${chalk.green('created')}...`);
      }


      // Check the day exists
      if (fs.existsSync(path.join(options.location, year, day))) {
        console.error(`    🚨 Day ${day} ${chalk.red('already')} exists. ${chalk.red('Aborting...')}`);
        process.exit(1);
      }

      // Create the day directory
      fs.mkdirSync(path.join(options.location, year, day), { recursive: true });
      console.log(`    🎉 Day ${day} ${chalk.green('created')}...`);

      // Create the solution file
      console.log(`    🏗️ Creating solution files...`);

      // ----- Rust -----
      // Cargo.toml
      fs.writeFileSync(path.join(options.location, year, day, 'Cargo.toml'), `[package]
name = "aoc_${year}_${day}"
version = "0.1.0"
authors = ["YearOfDev"]
edition = "2024"

[[bin]]
name = "solution"
path = "solution.rs"

[dependencies]
aoc_utils = { path = "../../../utils/rust/aoc_utils" }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
chrono = "0.4"
`);
      console.log(`    [Cargo.toml] ${chalk.green('created')}...`);

      // solution.rs
      fs.writeFileSync(path.join(options.location, year, day, 'solution.rs'), `use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};
use std::convert::TryInto;

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> i32 {
  -1
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> i32 {
  -1
}

// ----------------------------------------------------------------------------------------------------
// | Main Function
// ----------------------------------------------------------------------------------------------------
fn main() {
  // Read the arguments
  let args = std::env::args().collect::<Vec<String>>();
  let default_file_name = String::from("input.txt");
  let file_name = args.get(1).unwrap_or(&default_file_name);

  // Start the timer
  let start_timestamp = std::time::SystemTime::now();
  let start_time = std::time::Instant::now();
  
  // Read the input
  let input = read_input_as_array(file_name).unwrap();

  // Run the Parts
  let p1_result = measure_performance(part1, &input);
  let p2_result = measure_performance(part2, &input);

  // Stop the timer
  let end_time = std::time::Instant::now();
  let end_timestamp = std::time::SystemTime::now();
  let duration = end_time.duration_since(start_time).as_nanos();

  let results = AOCDayResults {
    year: ${year},
    day: ${day},
    part1: p1_result,
    part2: p2_result,
    duration: duration,
    timestamp: AOCTimestamp {
      start: DateTime::<Utc>::from(start_timestamp).to_rfc3339(),
      end: DateTime::<Utc>::from(end_timestamp).to_rfc3339(),
    },
  };

  let json_results = serde_json::to_string(&results).unwrap();
  println!("{}", json_results);
}`);
      console.log(`    [solution.rs] ${chalk.green('created')}...`);

      // ----- Typescript -----
      // package.json
      fs.writeFileSync(path.join(options.location, year, day, 'package.json'), `{
"name": "aoc_${year}_${day}",
"version": "0.1.0",
"private": true,
"devDependencies": {
  "@types/node": "^25.0.3"
},
"dependencies": {
  "@repo/utils-ts": "workspace:*"
}
}`);
      console.log(`    [package.json] ${chalk.green('created')}...`);

      // solution.ts
      fs.writeFileSync(path.join(options.location, year, day, 'solution.ts'), `import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  return undefined;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
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
  Year: ${year},
  Day: ${dayNumber},
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
console.log(JSON.stringify(results, null, 2));`);
      console.log(`    [solution.ts] ${chalk.green('created')}...`);
      

      // ----- Python -----
      // solution.py
      fs.writeFileSync(path.join(options.location, year, day, 'solution.py'), `import sys
import json
import time
from datetime import timedelta, datetime
from pathlib import Path

# Add workspace root to path for imports
workspace_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(workspace_root))

from utils.python.types import AOCDayResults, AOCTimestamp, AOCPartResult
from utils.python.input import readInputAsArray
from utils.python.performance import measurePerformance

# ----------------------------------------------------------------------------------------------------
# | Part 1
# ----------------------------------------------------------------------------------------------------
def part1(input: list[str]) -> int:
  return -1

# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> int:
  return -1

# ----------------------------------------------------------------------------------------------------
# | Main Function
# ----------------------------------------------------------------------------------------------------
def main():
  # Get the arguments
  args = sys.argv[1:]
  fileName = args[0] if args else "input.txt"

  # Start the timer
  start_timestamp = datetime.now().isoformat()
  start_time = time.monotonic()

  # Read the input to an array of strings
  input = readInputAsArray(fileName)

  ## Run the parts
  p1Result = measurePerformance(part1, input)
  p2Result = measurePerformance(part2, input)

  # End the timer
  end_time = time.monotonic()
  end_timestamp = datetime.now().isoformat()
  duration = timedelta(seconds=end_time - start_time).total_seconds()*1000000000 # Convert to nanoseconds

  # Return the results
  return AOCDayResults(
    Year=${year},
    Day=${day},
    Part1=p1Result,
    Part2=p2Result,
    Duration=duration,
    Timestamp=AOCTimestamp(
      Start=start_timestamp,
      End=end_timestamp,
    ),
  )



if __name__ == "__main__":
  results = main()
  print(json.dumps(results))`);
      console.log(`    [solution.py] ${chalk.green('created')}...`);

      // ----- Go -----
      // solution.go
      fs.writeFileSync(path.join(options.location, year, day, 'solution.go'), `package main

import (
  "encoding/json"
  "fmt"
  "os"
  "time"
  "yod_aoc/utils/go/aoc_utils"
)

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
  return -1
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
  return -1
}

// ----------------------------------------------------------------------------------------------------
// | Main Function
// ----------------------------------------------------------------------------------------------------
func main() {
  // Read the arguments
  args := os.Args[1:]
  var fileName string
  if len(args) > 0 {
    fileName = args[0]
  } else {
    fileName = "input.txt"
  }
  // Start the timer!
  startTime := time.Now()

  // Read the input to an array of strings
  path := aoc_utils.GetFilePath(${year}, ${day}, fileName)
  content, err := aoc_utils.ReadInputAsArray(path)
  if err != nil {
    fmt.Println("Error reading input:", err)
    return
  }

  // Run the Parts
  p1Result := aoc_utils.MeasurePerformance(func() interface{} {
    return part1(content)
  })

  p2Result := aoc_utils.MeasurePerformance(func() interface{} {
    return part2(content)
  })

  // End the Timer!
  endTime := time.Now()
  duration := endTime.Sub(startTime)

  resultsForDay := aoc_utils.AOCDayResults{
    Year:     ${year},
    Day:      ${day},
    Part1:    p1Result,
    Part2:    p2Result,
    Duration: duration.Nanoseconds(),
    Timestamp: aoc_utils.AOCTimestamp{
      Start: startTime.Format(time.RFC3339),
      End:   endTime.Format(time.RFC3339),
    },
  }
  jsonResults, _ := json.Marshal(resultsForDay)
  fmt.Println(string(jsonResults))
}
`);
      console.log(`    [solution.go] ${chalk.green('created')}...`);

      // Sample.txt
      fs.writeFileSync(path.join(options.location, year, day, 'sample.txt'), ``);
      console.log(`    [Sample.txt] ${chalk.green('created')}...`);

      // ----- Completed -----
      console.log(`    🎉 Solution files ${chalk.green('created')}...`);
      console.log("");
      console.log(`    🚧 ${chalk.yellow('Remember to install the dependencies:')} cd ${options.location}/${year}/${day} && pnpm install`);
      process.exit(0);
    });
}
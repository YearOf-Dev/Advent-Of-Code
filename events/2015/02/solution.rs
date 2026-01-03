use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};
use std::convert::TryInto;

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> i32 {
  let mut total_area: i32 = 0;

  for present in input {
    let [length, width, height]: [i32; 3] = present
        .split('x')
        .map(|s| s.parse().unwrap())
        .collect::<Vec<i32>>()
        .try_into()
        .unwrap();

    let mut area: i32 = (2 * length * width) + (2 * width * height) + (2 * height * length);

    let smallest_side: i32 = std::cmp::min(std::cmp::min(length * width, width * height), height * length);
    area += smallest_side;

    total_area += area;
  }

  total_area
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> i32 {
  let mut total_ribbon: i32 = 0;

  for present in input {
    let [length, width, height]: [i32; 3] = present
        .split('x')
        .map(|s| s.parse().unwrap())
        .collect::<Vec<i32>>()
        .try_into()
        .unwrap();

    let perimeter = 2 * std::cmp::min(std::cmp::min(length + width, width + height), height + length);
    let volume = length * width * height;

    total_ribbon += perimeter + volume;
  }

  total_ribbon
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
    year: 2015,
    day: 2,
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
}
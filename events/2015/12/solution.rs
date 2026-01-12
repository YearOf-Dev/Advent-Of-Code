use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};

fn count_all(input: serde_json::Value, ignore_red: bool) -> i64 {
  let mut count = 0;

  if let Some(obj) = input.as_object() {
    if has_red(input.clone()) && ignore_red {
      return count;
    }
    for (_key, value) in obj {
      count += count_all(value.clone(), ignore_red);
    }
  } else if let Some(arr) = input.as_array() {
    for value in arr {
      count += count_all(value.clone(), ignore_red);
    }
  } else if let Some(num) = input.as_i64() {
    count = num;
  }

  count
}

fn has_red(input: serde_json::Value) -> bool {
  if let Some(obj) = input.as_object() {
    for (_key, value) in obj {
      if value == "red" {
        return true
      }
    }
  }
  return false
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> i64 {
  let raw_input = input[0].clone();
  let json: serde_json::Value = serde_json::from_str(&raw_input).unwrap();

  let count = count_all(json, false);
  
  count
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> i64 {
  let raw_input = input[0].clone();
  let json: serde_json::Value = serde_json::from_str(&raw_input).unwrap();

  let count = count_all(json, true);
  
  count
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
    day: 12,
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
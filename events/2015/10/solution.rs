use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};
use std::convert::TryInto;

fn count_digits(input: String) -> String {
  let mut output: String = "".to_string();

  let mut count: i32 = 0;
  let mut last_digit: String = "".to_string();
  for digit in input.chars() {
    if count == 0 {
      count = 1;
      last_digit = digit.to_string();
      continue;
    }

    if digit.to_string() == last_digit {
      count += 1;
    } else {
      output += &(count.to_string() + &last_digit);
      count = 1;
      last_digit = digit.to_string();
    }
  }
  output += &(count.to_string() + &last_digit);

  output
}
// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> i32 {
  let mut last_iteration = input[0].to_string();

  for _ in 0..40 {
    last_iteration = count_digits(last_iteration.clone());
  } 

  last_iteration.chars().count().try_into().unwrap()
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> i32 {
  let mut last_iteration = input[0].to_string();

  for _ in 0..50 {
    last_iteration = count_digits(last_iteration.clone());
  } 

  last_iteration.chars().count().try_into().unwrap()
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
    day: 10,
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
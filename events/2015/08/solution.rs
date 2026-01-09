use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};
use regex::Regex;

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> i32 {
  let mut count_code: i32 = 0;
  let mut count_memory: i32 = 0;

  for item in input {
    let mut list_val = item.to_string().trim().to_string();
    let length = list_val.chars().count() as i32;
    count_code = count_code + length;

    list_val = list_val.chars()
      .skip(1)
      .take(list_val.chars().count() - 2)
      .collect();
    
    let hex = Regex::new(r"\\x[a-f,0-9][a-f,0-9]").unwrap();
    list_val = hex.replace_all(&list_val, "z").to_string();

    let d_slash = Regex::new(r"\\{2}").unwrap();
    list_val = d_slash.replace_all(&list_val, "z").to_string();

    let e_quote = Regex::new("\\\\\"").unwrap();
    list_val = e_quote.replace_all(&list_val, "z").to_string();

    count_memory += list_val.chars().count() as i32;
  }
  count_code - count_memory
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> i32 {
  let mut count_original: i32 = 0;
  let mut count_new: i32 = 0;

  for item in input {
    let original = item.to_string().trim().to_string();
    let length = original.chars().count() as i32;

    if length == 0 { continue; }
    count_original += length;

    let slashes = Regex::new(r"\\").unwrap();
    let mut encoded = slashes.replace_all(&original, "\\\\").to_string();

    let quotes = Regex::new("\"").unwrap();
    encoded = quotes.replace_all(&encoded, "\\\"").to_string();

    encoded = format!("{}{}{}",'"', encoded, '"');

    count_new += encoded.chars().count() as i32;
  }
  count_new - count_original
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
    day: 08,
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
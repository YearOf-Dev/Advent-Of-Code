use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> i32 {
  let min_vowels = 3;
  let min_doubles = 1;
  let naughty_strings = ["ab", "cd", "pq", "xy"];

  let mut nice_strings = 0;

  for test_string in input {
    // Contain naughty strings?
    let mut contains_naughty_string = false;
    for naughty in naughty_strings {
      if test_string.contains(naughty) {
        contains_naughty_string = true;
      };
    };
    if contains_naughty_string { continue; }

    // Check for vowels
    let vowels = ['a', 'e', 'i', 'o', 'u'];
    let vowel_count = test_string.chars().filter(|c| vowels.contains(c)).count();
    if vowel_count < min_vowels { continue; };

    // Check for double characters
    let mut doubles = 0;
    for index in 1..test_string.len() {
      if test_string.chars().nth(index) == test_string.chars().nth(index-1) {
        doubles += 1;
      };
    };
    if doubles < min_doubles { continue; };

    nice_strings += 1;
  };
  
  nice_strings
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> i32 {
  let min_spaced_doubles = 1;

  let mut nice_strings = 0;

  for test_string in input {
    // Spaced Doubles
    let mut spaced_doubles = 0;
    for j in 2..test_string.len() {
      if test_string.chars().nth(j) == test_string.chars().nth(j-2) {
        spaced_doubles += 1;
      };
    };
    if spaced_doubles < min_spaced_doubles { continue; }

    // Non overlapping repeating doubles
    let mut repeating_doubles = false;
    for j in 1..test_string.len() {
      let double_string = &test_string[j-1..j+1];
      let mut instances = 0;
      let mut last_instance = 0;

      for s in 1..test_string.len() {
        if test_string.chars().nth(s-1) == double_string.chars().nth(0) && test_string.chars().nth(s) == double_string.chars().nth(1) && (last_instance != s-1 || last_instance == 0){
          instances += 1;
          last_instance = s;
        };
      };
      if instances >= 2 { repeating_doubles = true; };
    };

    if repeating_doubles {
      nice_strings += 1;
    };
  };

  nice_strings
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
    day: 05,
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
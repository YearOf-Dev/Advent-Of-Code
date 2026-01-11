use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};

fn increment_password(input: String) -> String {
  let alphabet: [&str; 26] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  let mut new_password = input.clone();
  new_password.pop();

  let last_character = input.chars().last().unwrap();
  let last_character_index = alphabet.iter().position(|&r| r == last_character.to_string()).unwrap();

  if input.chars().count() == 1 {
    if last_character_index == 25 {
      return "a".to_string()
    } else {
      let ret = alphabet[last_character_index+1];
      return ret.to_string();
    }
  }

  if last_character_index == 25 {
    return increment_password(new_password) + "a"
  } else {
    return new_password + alphabet[last_character_index+1]
  }
}

fn is_password_valid(password: String) -> bool {
  let alphabet: [&str; 26] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  let pass: Vec<char> = password.chars().collect();
  let password_length = password.chars().count();

  if password.contains("i") || password.contains("o") || password.contains("l") {
    return false
  }

  let mut repeating_letters = 0;
  let mut last_repeat_index = 0;
  for i in 1..password_length {
    if pass[i] == pass[i-1] {
      if last_repeat_index == 0 {
        repeating_letters += 1;
        last_repeat_index = i;
      } else if last_repeat_index == i - 1{
        continue;
      } else {
        last_repeat_index = i;
        repeating_letters += 1;
      }
    }
  }
  if repeating_letters < 2 {
    return false
  }

  for i in 2..password_length {
    let current_letter_index = alphabet.iter().position(|&r| r == pass[i].to_string()).unwrap();

    if current_letter_index < 2 {
      continue;
    }

    if pass[i-1].to_string() == alphabet[current_letter_index-1] && pass[i-2].to_string() == alphabet[current_letter_index-2] {
      return true
    }
  }
  return false
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> String {
  let current_password = &input[0];
  let mut next_password = current_password.clone();
  let mut is_valid = false;

  while !is_valid {
    next_password = increment_password(next_password);
    is_valid = is_password_valid(next_password.clone());
  }

  next_password
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> String {
  let current_password = part1(input);
  let mut next_password = current_password.clone();
  let mut is_valid = false;

  while !is_valid {
    next_password = increment_password(next_password);
    is_valid = is_password_valid(next_password.clone());
  }

  next_password
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
    day: 11,
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
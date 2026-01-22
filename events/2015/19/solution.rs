use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};

use std::collections::{HashMap, HashSet};

fn find_substitutes(medicine: String, molecule: String, replacement: String) -> Vec<String> {
  let med_len = medicine.chars().count();
  let mol_len = molecule.chars().count();

  if med_len < mol_len {
    return Vec::new();
  }

  let mut new_medicine: String = "".to_string();
  let mut found_medicines: Vec<String> = Vec::new();

  for i in 0..med_len-mol_len+1 {
    let test_part = &medicine[i..i+mol_len];

    if test_part == molecule {
      let new = new_medicine.clone() + &replacement + &medicine[i+mol_len..];
      found_medicines.push(new);
    }
    new_medicine += &medicine[i..i+1];
  }
  found_medicines
}
// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> i32 {
  let mut replacements: HashMap<String, Vec<String>> = HashMap::new();
  let mut medicine: String = "".to_string();
  let mut found_medicines: HashSet<String> = HashSet::new();

  for (_i, line) in input.iter().enumerate() {
    if line.is_empty() {
      continue;
    }

    if line.contains("=>") {
      let parts: Vec<&str> = line.split(" => ").collect::<Vec<&str>>();

      replacements.entry(parts[0].to_string()).or_insert_with(Vec::new).push(parts[1].to_string());
    } else {
      medicine = line.to_string();
    }
  }

  for (molecule, value) in &replacements {
    for substitute in value {
      let results = find_substitutes(medicine.clone(), molecule.to_string(), substitute.to_string());

      for res in results {
        found_medicines.insert(res);
      }
    }
  }

  found_medicines.len().try_into().unwrap()
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> i32 {
  let mut replacements: Vec<(String, String)> = Vec::new();
  let mut medicine: String = "".to_string();

  for line in input {
    if line.is_empty() {
      continue
    }

    if line.contains("=>") {
      let parts: Vec<&str> = line.split(" => ").collect::<Vec<&str>>();

      let from = parts[1].chars().rev().collect();
      let to = parts[0].chars().rev().collect();

      replacements.push((from, to));
    } else {
      medicine = line.chars().rev().collect();
    }
  }

  let mut steps = 0;

  while medicine.len() > 1 {
    let mut best_index = usize::MAX;
    let mut best_replacement: Option<&(String, String)> = None;

    for replacement in &replacements {
      let (from, _to) = replacement;
      if let Some(index) = medicine.find(from) {
        if index < best_index {
          best_index = index;
          best_replacement = Some(replacement);
        }
      }
    }

    if let Some((from, to)) = best_replacement {
      medicine = format!("{}{}{}", &medicine[..best_index], to, &medicine[best_index + from.len()..]);
      steps += 1;
    } else {
      panic!("Stuck after {} steps", steps);
    }
  }
  
  Some(steps).unwrap()
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
    day: 19,
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
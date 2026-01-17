use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};
use std::collections::{HashMap, HashSet};

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> i32 {
  let mut the_sues: HashMap<i32, HashMap<String, i32>> = HashMap::new();

  for item in input {
    if item.len() == 0 { continue }

    let first_split_index = item.find(":").unwrap();
    let sue_id: i32 = item[..first_split_index].split(" ").collect::<Vec<&str>>()[1].to_string().parse::<i32>().unwrap();
    let properties = item[first_split_index+2..].split(",").collect::<Vec<&str>>();
    
    the_sues.insert(sue_id, HashMap::new());
    let current_sue = the_sues.get_mut(&sue_id).unwrap();
    current_sue.insert("ID".to_string(), sue_id.clone());

    for item in properties {
      let mut strip_from = 0;
      if item.chars().collect::<Vec<char>>()[0] == ' ' {
        strip_from = 1;
      }
      let parts: Vec<&str> = item.split(":").collect();
      let property: String = parts[0][strip_from..].to_string().clone();
      let count: i32 = parts[1][1..].parse::<i32>().unwrap().clone();
      
      current_sue.insert(property, count);
    }
  }

  let mut invalid_sues: HashSet<i32> = HashSet::new();
  let mut known_properties: HashMap<&str, i32> = HashMap::new();
  known_properties.insert("children", 3);
  known_properties.insert("cats", 7);
  known_properties.insert("samoyeds", 2);
  known_properties.insert("pomeranians", 3);
  known_properties.insert("akitas", 0);
  known_properties.insert("vizslas", 0);
  known_properties.insert("goldfish", 5);
  known_properties.insert("trees", 3);
  known_properties.insert("cars", 2);
  known_properties.insert("perfumes", 1);

  for sue in &the_sues {
    for property in sue.1 {
      if property.0 == "ID" {
        continue
      }

      // Get the value from known properties
      let known_value = known_properties.get(property.0.as_str()).unwrap();
      
      if property.1 != known_value{
        invalid_sues.insert(*sue.0);
      }
      
    }
  }
  
  for sue in &the_sues {
    if !invalid_sues.contains(sue.0) {
      return *sue.0
    }
  }
  -1
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> i32 {
  let mut the_sues: HashMap<i32, HashMap<String, i32>> = HashMap::new();

  for item in input {
    if item.len() == 0 { continue }

    let first_split_index = item.find(":").unwrap();
    let sue_id: i32 = item[..first_split_index].split(" ").collect::<Vec<&str>>()[1].to_string().parse::<i32>().unwrap();
    let properties = item[first_split_index+2..].split(",").collect::<Vec<&str>>();
    
    the_sues.insert(sue_id, HashMap::new());
    let current_sue = the_sues.get_mut(&sue_id).unwrap();
    current_sue.insert("ID".to_string(), sue_id.clone());

    for item in properties {
      let mut strip_from = 0;
      if item.chars().collect::<Vec<char>>()[0] == ' ' {
        strip_from = 1;
      }
      let parts: Vec<&str> = item.split(":").collect();
      let property: String = parts[0][strip_from..].to_string().clone();
      let count: i32 = parts[1][1..].parse::<i32>().unwrap().clone();
      
      current_sue.insert(property, count);
    }
  }

  let mut invalid_sues: HashSet<i32> = HashSet::new();
  let mut known_properties: HashMap<&str, i32> = HashMap::new();
  known_properties.insert("children", 3);
  known_properties.insert("cats", 7);
  known_properties.insert("samoyeds", 2);
  known_properties.insert("pomeranians", 3);
  known_properties.insert("akitas", 0);
  known_properties.insert("vizslas", 0);
  known_properties.insert("goldfish", 5);
  known_properties.insert("trees", 3);
  known_properties.insert("cars", 2);
  known_properties.insert("perfumes", 1);

  for sue in &the_sues {
    for property in sue.1 {
      if property.0 == "ID" {
        continue
      }

      // Get the value from known properties
      let known_value = known_properties.get(property.0.as_str()).unwrap();
      
      if property.0 == "cats" || property.0 == "trees" {
        if property.1 <= known_value {
          invalid_sues.insert(*sue.0);
        }
      } else if property.0 == "pomeranians" || property.0 == "goldfish" {
        if property.1 >= known_value {
          invalid_sues.insert(*sue.0);
        }
      } else {
        if property.1 != known_value{
          invalid_sues.insert(*sue.0);
        }
      }
    }
  }
  
  for sue in &the_sues {
    if !invalid_sues.contains(sue.0) {
      return *sue.0
    }
  }
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
    year: 2015,
    day: 16,
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
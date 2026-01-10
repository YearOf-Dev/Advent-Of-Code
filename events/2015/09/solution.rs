use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};
use std::collections::HashMap;

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn best_next_hop(distances: HashMap<String, i32>, mut visited: HashMap<String, bool>) -> (String, i32, HashMap<String, bool>) {
  let mut next_hop_name = String::new();
  let mut next_hop_distance: i32 = i32::MAX;

  for (place, distance) in &distances {
    if *distance < next_hop_distance && !visited[place] {
      next_hop_name = place.clone();
      next_hop_distance = *distance;
    }
  }

  visited.insert(next_hop_name.to_string(), true);

  (next_hop_name.to_string(), next_hop_distance, visited)
}

fn best_route_for(distances: &HashMap<String, HashMap<String, i32>>, start_at: String) -> i32 {
  let mut visited: HashMap<String, bool> = HashMap::new();
  let mut places_to_visit = 0;

  for (place, _) in distances {
    visited.insert(place.clone(), false);
    places_to_visit += 1;
  }
  visited.insert(start_at.clone(), true);

  let mut currently_at = start_at;
  let mut total_distance = 0;

  for _i in 1..places_to_visit {
    let add_distance: i32;
    (currently_at, add_distance, visited) = best_next_hop(distances[&currently_at].clone(), visited);
    total_distance += add_distance;
  }
  total_distance
}

fn part1(input: &Vec<String>) -> i32 {
  let mut distances: HashMap<String, HashMap<String, i32>> = HashMap::new();
  let mut routes: HashMap<String, i32> = HashMap::new();

  for item in input {
    let split_input: Vec<&str> = item.split(" ").collect();

    if split_input.len() < 5 {
      continue
    }

    let from: String = split_input[0].to_string();
    let destination: String = split_input[2].to_string();
    let distance_raw: String = split_input[4].to_string();
    let distance = distance_raw.parse::<i32>().unwrap();

    distances.entry(from.to_string()).or_insert_with(HashMap::new).insert(destination.to_string(), distance);
    distances.entry(destination.to_string()).or_insert_with(HashMap::new).insert(from.to_string(), distance);
  }

  let mut shortest_route = i32::MAX;
  for (place, _) in &distances {
    routes.insert(place.clone(), best_route_for(&distances.clone(), place.clone()));

    if routes[place] < shortest_route {
      shortest_route = routes[place];
    }
  }

  shortest_route
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn worst_next_hop(distances: HashMap<String, i32>, mut visited: HashMap<String, bool>) -> (String, i32, HashMap<String, bool>) {
  let mut next_hop_name = String::new();
  let mut next_hop_distance: i32 = 0;

  for (place, distance) in &distances {
    if *distance > next_hop_distance && !visited[place] {
      next_hop_name = place.clone();
      next_hop_distance = *distance;
    }
  }

  visited.insert(next_hop_name.to_string(), true);

  (next_hop_name.to_string(), next_hop_distance, visited)
}

fn worst_route_for(distances: &HashMap<String, HashMap<String, i32>>, start_at: String) -> i32 {
  let mut visited: HashMap<String, bool> = HashMap::new();
  let mut places_to_visit = 0;

  for (place, _) in distances {
    visited.insert(place.clone(), false);
    places_to_visit += 1;
  }
  visited.insert(start_at.clone(), true);

  let mut currently_at = start_at;
  let mut total_distance = 0;

  for _i in 1..places_to_visit {
    let add_distance: i32;
    (currently_at, add_distance, visited) = worst_next_hop(distances[&currently_at].clone(), visited);
    total_distance += add_distance;
  }
  total_distance
}

fn part2(input: &Vec<String>) -> i32 {
  let mut distances: HashMap<String, HashMap<String, i32>> = HashMap::new();
  let mut routes: HashMap<String, i32> = HashMap::new();

  for item in input {
    let split_input: Vec<&str> = item.split(" ").collect();

    if split_input.len() < 5 {
      continue
    }

    let from: String = split_input[0].to_string();
    let destination: String = split_input[2].to_string();
    let distance_raw: String = split_input[4].to_string();
    let distance = distance_raw.parse::<i32>().unwrap();

    distances.entry(from.to_string()).or_insert_with(HashMap::new).insert(destination.to_string(), distance);
    distances.entry(destination.to_string()).or_insert_with(HashMap::new).insert(from.to_string(), distance);
  }

  let mut longest_route = 0;
  for (place, _) in &distances {
    routes.insert(place.clone(), worst_route_for(&distances.clone(), place.clone()));

    if routes[place] > longest_route {
      longest_route = routes[place];
    }
  }

  longest_route
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
    day: 09,
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
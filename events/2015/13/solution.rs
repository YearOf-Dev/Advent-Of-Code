use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};
use std::collections::{HashMap, HashSet};

fn calculate_happiness(people: &HashMap<String, HashMap<String, i32>>, arrangement: &[String]) -> i32 {
  let mut total = 0;
  let n = arrangement.len();

  for i in 0..n {
    let left = &arrangement[(i + n - 1) % n];
    let right = &arrangement[(i + 1) % n];
    let person = &arrangement[i];

    if let Some(prefs) = people.get(person) {
      total += prefs.get(left).unwrap_or(&0);
      total += prefs.get(right).unwrap_or(&0);
    }
  }

  total
}

fn generate_all_permutations(names: &[String]) -> Vec<Vec<String>> {
  // If the array only contains 1 item, return it
  if names.len() <= 1 {
    return vec![names.to_vec()];
  }

  // Start an output array
  let mut output: Vec<Vec<String>> = Vec::new();

  for i in 0..names.len() {
    let mut rest = Vec::new();
    rest.extend_from_slice(&names[0..i]);
    rest.extend_from_slice(&names[i + 1..]);

    let permutations = generate_all_permutations(&rest);

    for result in permutations {
      let mut perm = vec![names[i].clone()];
      perm.extend(result);
      output.push(perm);
    }
  }

  output
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> i32 {
  let mut people: HashMap<String, HashMap<String, i32>> = HashMap::new();
  let mut names_set: HashSet<String> = HashSet::new();

  for line in input {
    if line.is_empty() {
      continue;
    }

    let parts: Vec<&str> = line.split_whitespace().collect();
    let person_a = parts[0].to_string();
    let person_b = parts[10].trim_end_matches('.').to_string();
    let change: i32 = parts[3].parse().unwrap();
    let pos_or_neg = parts[2];

    people.entry(person_a.clone()).or_insert_with(HashMap::new);

    if pos_or_neg == "gain" {
      people.get_mut(&person_a).unwrap().insert(person_b, change);
    } else if pos_or_neg == "lose" {
      people.get_mut(&person_a).unwrap().insert(person_b, -change);
    }

    names_set.insert(person_a);
  }

  let names: Vec<String> = names_set.into_iter().collect();

  let first = names[0].clone();
  let rest: Vec<String> = names[1..].to_vec();
  let permutations_of_rest = generate_all_permutations(&rest);

  let all_permutations: Vec<Vec<String>> = permutations_of_rest
    .into_iter()
    .map(|mut p| {
      let mut result = vec![first.clone()];
      result.append(&mut p);
      result
    })
    .collect();

  let mut max_hapiness = i32::MIN;
  for perm in all_permutations {
    let happiness = calculate_happiness(&people, &perm);
    if happiness > max_hapiness {
      max_hapiness = happiness;
    }
  }

  max_hapiness
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> i32 {
  let mut people: HashMap<String, HashMap<String, i32>> = HashMap::new();
  let mut names_set: HashSet<String> = HashSet::new();

  for line in input {
    if line.is_empty() {
      continue;
    }

    let parts: Vec<&str> = line.split_whitespace().collect();
    let person_a = parts[0].to_string();
    let person_b = parts[10].trim_end_matches('.').to_string();
    let change: i32 = parts[3].parse().unwrap();
    let pos_or_neg = parts[2];

    people.entry(person_a.clone()).or_insert_with(HashMap::new);

    if pos_or_neg == "gain" {
      people.get_mut(&person_a).unwrap().insert(person_b, change);
    } else if pos_or_neg == "lose" {
      people.get_mut(&person_a).unwrap().insert(person_b, -change);
    }

    names_set.insert(person_a);
  }

  let existing_names: Vec<String> = people.keys().cloned().collect();
  people.entry("Me".to_string()).or_insert_with(HashMap::new);

  for person in &existing_names {
    people.get_mut(person).unwrap().insert("Me".to_string(), 0);
    people.get_mut("Me").unwrap().insert(person.clone(), 0);
  }
  names_set.insert("Me".to_string());

  let names: Vec<String> = names_set.into_iter().collect();

  let first = names[0].clone();
  let rest: Vec<String> = names[1..].to_vec();
  let permutations_of_rest = generate_all_permutations(&rest);

  let all_permutations: Vec<Vec<String>> = permutations_of_rest
    .into_iter()
    .map(|mut p| {
      let mut result = vec![first.clone()];
      result.append(&mut p);
      result
    })
    .collect();

  let mut max_hapiness = i32::MIN;
  for perm in all_permutations {
    let happiness = calculate_happiness(&people, &perm);
    if happiness > max_hapiness {
      max_hapiness = happiness;
    }
  }

  max_hapiness
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
    day: 13,
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
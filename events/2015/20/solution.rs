use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};

fn elves_who_visited(house: i32) -> Vec<i32> {
  let mut elves: Vec<i32> = Vec::new();
  elves.push(1);
  elves.push(house);

  let house_sqrt = ((house as f64).sqrt().floor()) as i32;

  for i in 2..=house_sqrt {
    if house % i == 0 {
      elves.push(i);

      if i != house/i {
        elves.push(house/i);
      }
    }
  }
  elves
}

fn elves_who_visited_limited(house: i32, limit: i32) -> Vec<i32> {
  let mut elves: Vec<i32> = Vec::new();
  
  if limit >= house {
    elves.push(1);
  }

  let house_sqrt = ((house as f64).sqrt().floor()) as i32;

  for i in 2..=house_sqrt{
    if house % i == 0 {
      if i * limit >= house {
        elves.push(i);
      }

      let paired = house/i;
      if i != paired && paired * limit >= house {
        elves.push(paired);
      }
    }
  }

  elves.push(house);
  
  elves
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> i32 {
  let target = input[0].parse::<i32>().unwrap_or(0);
  let mut last_house: i32 = 0;

  loop {
    let elves = elves_who_visited(last_house + 1);
    let sum = elves.into_iter().reduce(|acc, e| acc + e).unwrap_or(0) * 10;
    if sum >= target {
      return last_house + 1;
    }
    last_house += 1;
  }
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> i32 {
  let target = input[0].parse::<i32>().unwrap_or(0);
  let mut last_house: i32 = 0;

  loop {
    let elves = elves_who_visited_limited(last_house + 1, 50);
    let sum = elves.into_iter().reduce(|acc, e| acc + e).unwrap_or(0) * 11;
    if sum >= target {
      return last_house + 1;
    }
    last_house += 1;
  }
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
    day: 20,
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
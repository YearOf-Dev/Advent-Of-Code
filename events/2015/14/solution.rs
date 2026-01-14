use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};
use std::collections::{HashSet, HashMap};

#[derive(Clone)]
struct ReindeerStats {
  fly_speed: i32,
  fly_duration: i32,
  rest_duration: i32,
  points: i32
}

fn whos_in_the_lead(reindeers: HashMap<String, ReindeerStats>, duration: i32) -> (HashSet<String>, i32) {
  let mut max_distance: i32 = 0;
  let mut winning_reindeer: HashSet<String> = HashSet::new();

  for (reindeer, stats) in reindeers {
    let mut distance: i32 = 0;
    // let stats = reindeers[reindeer];
    let distance_per_burst = stats.fly_speed * stats.fly_duration;
    let mut duration_remaining = duration;
    let full_period = stats.fly_duration + stats.rest_duration;

    if duration < stats.fly_duration {
      distance = stats.fly_speed * duration;
    } else {
      distance += distance_per_burst;
      duration_remaining -= stats.fly_duration;

      let potential_bursts = duration_remaining / full_period;
      distance += distance_per_burst * potential_bursts;

      let time_after_bursts = duration_remaining - (potential_bursts * full_period);
      if time_after_bursts > stats.rest_duration {
        let extra_time = time_after_bursts - stats.rest_duration;
        distance += extra_time * stats.fly_speed;
      }
    }

    if distance > max_distance {
      max_distance = distance;
      winning_reindeer = HashSet::new();
      winning_reindeer.insert(reindeer);
    } else if distance == max_distance {
      winning_reindeer.insert(reindeer);
    }
  }

  return (winning_reindeer, max_distance)
}


// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> i32 {
  let duration: i32 = 2503;
  let mut reindeers: HashMap<String, ReindeerStats> = HashMap::new();

  for line in input {
    if line.len() == 0 { continue }
    
    let parts: Vec<&str> = line.split(" ").collect();
    let stats = ReindeerStats {
      fly_speed: parts[3].parse::<i32>().unwrap(),
      fly_duration: parts[6].parse::<i32>().unwrap(),
      rest_duration: parts[13].parse::<i32>().unwrap(),
      points: 0
    };
    reindeers.insert(parts[0].to_string(), stats);
  }

  let (_winner, max_distance) = whos_in_the_lead(reindeers, duration);

  max_distance
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> i32 {
  let duration: i32 = 2503;
  let mut reindeers: HashMap<String, ReindeerStats> = HashMap::new();

  for line in input {
    if line.len() == 0 { continue }
    
    let parts: Vec<&str> = line.split(" ").collect();
    let stats = ReindeerStats {
      fly_speed: parts[3].parse::<i32>().unwrap(),
      fly_duration: parts[6].parse::<i32>().unwrap(),
      rest_duration: parts[13].parse::<i32>().unwrap(),
      points: 0
    };
    reindeers.insert(parts[0].to_string(), stats);
  }

  for s in 1..duration+1{
    let (winners, _distance) = whos_in_the_lead(reindeers.clone(), s);

    for winner in winners {
      if let Some(stats) = reindeers.get_mut(&winner) {
        stats.points += 1;
      }
    }
  }

  let mut max_points = 0;
  for (_reindeer, stats) in reindeers {
    if stats.points > max_points {
      max_points = stats.points;
    }
  }
  
  max_points
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
    day: 14,
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
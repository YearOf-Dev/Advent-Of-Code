use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};
use std::convert::TryInto;
use std::collections::HashMap;

#[derive(Eq, Hash, PartialEq, Copy, Clone, Debug)]
struct Coord { x: i32, y: i32 }

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> i32 {
  let max_x = 999;
  let max_y = 999;

  let mut state: HashMap<i32, HashMap<i32, bool>> = HashMap::new();

  for x in 0..=max_x {
    for y in 0..=max_y {
      state.entry(x).or_insert_with(HashMap::new).insert(y, false);
    }
  }

  for command_line in input{
    let command_segments = command_line.split(' ').collect::<Vec<&str>>();

    let command;
    let mut start = Coord{
      x: 0,
      y: 0
    };
    let mut end = Coord{
      x: 0,
      y: 0
    };

    if command_segments.len() == 5 {
      command = &command_segments[1];
      let [sx, sy]: [i32; 2] = command_segments[2]
        .split(',')
        .map(|s| s.parse().unwrap())
        .collect::<Vec<i32>>()
        .try_into()
        .unwrap();
      let [ex, ey]: [i32; 2] = command_segments[4]
        .split(',')
        .map(|s| s.parse().unwrap())
        .collect::<Vec<i32>>()
        .try_into()
        .unwrap();
      start.x = sx;
      start.y = sy;
      end.x = ex;
      end.y = ey;
    } else if command_segments.len() == 4 {
      command = &"toggle";
      let [sx, sy]: [i32; 2] = command_segments[1]
        .split(',')
        .map(|s| s.parse().unwrap())
        .collect::<Vec<i32>>()
        .try_into()
        .unwrap();
      let [ex, ey]: [i32; 2] = command_segments[3]
        .split(',')
        .map(|s| s.parse().unwrap())
        .collect::<Vec<i32>>()
        .try_into()
        .unwrap();
      start.x = sx;
      start.y = sy;
      end.x = ex;
      end.y = ey;
    } else {
      continue;
    }

    for x in start.x..=end.x {
      for y in start.y..=end.y {
        if command == &"on" {
          state.entry(x).or_insert_with(HashMap::new).insert(y, true);
        } else if command == &"off" {
          state.entry(x).or_insert_with(HashMap::new).insert(y, false);
        } else if command == &"toggle" {
          let current = state[&x][&y];
          state.entry(x).or_insert_with(HashMap::new).insert(y, !current);
        }
      }
    }
  }

  let mut count = 0;
  for x in 0..=max_x {
    for y in 0..=max_y {
      let current = state[&x][&y];
      if current == true {
        count += 1;
      }
    }
  }

  count
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> i32 {
  let max_x = 999;
  let max_y = 999;

  let mut state: HashMap<i32, HashMap<i32, i32>> = HashMap::new();

  for x in 0..=max_x {
    for y in 0..=max_y {
      state.entry(x).or_insert_with(HashMap::new).insert(y, 0);
    }
  }

  for command_line in input{
    let command_segments = command_line.split(' ').collect::<Vec<&str>>();

    let command;
    let mut start = Coord{
      x: 0,
      y: 0
    };
    let mut end = Coord{
      x: 0,
      y: 0
    };

    if command_segments.len() == 5 {
      command = &command_segments[1];
      let [sx, sy]: [i32; 2] = command_segments[2]
        .split(',')
        .map(|s| s.parse().unwrap())
        .collect::<Vec<i32>>()
        .try_into()
        .unwrap();
      let [ex, ey]: [i32; 2] = command_segments[4]
        .split(',')
        .map(|s| s.parse().unwrap())
        .collect::<Vec<i32>>()
        .try_into()
        .unwrap();
      start.x = sx;
      start.y = sy;
      end.x = ex;
      end.y = ey;
    } else if command_segments.len() == 4 {
      command = &"toggle";
      let [sx, sy]: [i32; 2] = command_segments[1]
        .split(',')
        .map(|s| s.parse().unwrap())
        .collect::<Vec<i32>>()
        .try_into()
        .unwrap();
      let [ex, ey]: [i32; 2] = command_segments[3]
        .split(',')
        .map(|s| s.parse().unwrap())
        .collect::<Vec<i32>>()
        .try_into()
        .unwrap();
      start.x = sx;
      start.y = sy;
      end.x = ex;
      end.y = ey;
    } else {
      continue;
    }

    for x in start.x..=end.x {
      for y in start.y..=end.y {
        let current = state[&x][&y];
        if command == &"on" {
          state.entry(x).or_insert_with(HashMap::new).insert(y, current+1);
        } else if command == &"off" {
          if current != 0 {
            state.entry(x).or_insert_with(HashMap::new).insert(y, current-1);
          }
        } else if command == &"toggle" {
          state.entry(x).or_insert_with(HashMap::new).insert(y, current+2);
        }
      }
    }
  }

  let mut count = 0;
  for x in 0..=max_x {
    for y in 0..=max_y {
      let current = state[&x][&y];
      count += current
    }
  }

  count
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
    day: 06,
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
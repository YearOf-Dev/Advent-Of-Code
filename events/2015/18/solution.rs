use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};
use std::collections::HashMap;

fn count_light(state: &HashMap<i32, HashMap<i32, bool>>, y: i32, x: i32, count: i32) -> i32 {
  if *state.get(&y).and_then(|row| row.get(&x)).unwrap_or(&false) {
    return count + 1;
  }
  count
}

fn count_neighbours(state: &HashMap<i32, HashMap<i32, bool>>) -> HashMap<i32, HashMap<i32, i32>> {
  let mut count: HashMap<i32, HashMap<i32, i32>> = HashMap::new();
  let grid_size = state.len() as i32;

  // Build an empty count from state
  for y in 0..grid_size {
    count.insert(y, HashMap::new());
    for x in 0..grid_size {
      count.get_mut(&y).unwrap().insert(x, 0);
    }
  }

  // Work through every position
  for y in 0..grid_size {
    for x in 0..grid_size {
      let mut count_for_light = 0;

      // Check the row Above
      if y != 0 {
        if x != 0 {
          count_for_light = count_light(state, y - 1, x - 1, count_for_light);
        }
        count_for_light = count_light(state, y - 1, x, count_for_light);
        if x != grid_size - 1 {
          count_for_light = count_light(state, y - 1, x + 1, count_for_light);
        }
      }

      // Check the current Row
      if x != 0 {
        count_for_light = count_light(state, y, x - 1, count_for_light);
      }
      if x != grid_size - 1 {
        count_for_light = count_light(state, y, x + 1, count_for_light);
      }

      // Count the row below
      if y + 1 != grid_size {
        if x != 0 {
          count_for_light = count_light(state, y + 1, x - 1, count_for_light);
        }
        count_for_light = count_light(state, y + 1, x, count_for_light);
        if x != grid_size - 1 {
          count_for_light = count_light(state, y + 1, x + 1, count_for_light);
        }
      }

      // Update the main count
      count.get_mut(&y).unwrap().insert(x, count_for_light);
    }
  }

  count
}

fn force_corners_on(state: &mut HashMap<i32, HashMap<i32, bool>>, grid_size: i32) {
  let grid_size = grid_size - 1;
  state.get_mut(&0).unwrap().insert(0, true);
  state.get_mut(&0).unwrap().insert(grid_size, true);
  state.get_mut(&grid_size).unwrap().insert(0, true);
  state.get_mut(&grid_size).unwrap().insert(grid_size, true);
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> i32 {
  let mut state: HashMap<i32, HashMap<i32, bool>> = HashMap::new();
  let mut grid_size_y = 0;
  let mut grid_size_x = 0;
  let iterations = 100;

  // Read through the input and build the state
  for (i, line) in input.iter().enumerate() {
    if line.is_empty() {
      // This is a blank line, ignore it
      continue;
    }

    // Increment GridSizeY
    grid_size_y += 1;

    // Set the length of the line
    if grid_size_x == 0 {
        grid_size_x = line.len() as i32;
    } else if grid_size_x != line.len() as i32 {
      eprintln!("Malformed input");
      return 0;
    }

    let i = i as i32;
    state.insert(i, HashMap::new());
    for (li, ch) in line.chars().enumerate() {
      let value = ch == '#';
      state.get_mut(&i).unwrap().insert(li as i32, value);
    }
  }

  // Run the iterations
  for _it in 0..iterations {
    // Get the count for the current state
    let count = count_neighbours(&state);

    for y in 0..grid_size_y {
      for x in 0..grid_size_x {
        let count_for_light = *count.get(&y).and_then(|row| row.get(&x)).unwrap();

        let new_value = if *state.get(&y).and_then(|row| row.get(&x)).unwrap() {
          count_for_light == 2 || count_for_light == 3
        } else {
          count_for_light == 3
        };
        state.get_mut(&y).unwrap().insert(x, new_value);
      }
    }
  }

  // Count how many are on in the final state
  let mut count_on = 0;

  for y in 0..grid_size_y {
    for x in 0..grid_size_x {
      if *state.get(&y).and_then(|row| row.get(&x)).unwrap() {
        count_on += 1;
      }
    }
  }

  count_on
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> i32 {
  let mut state: HashMap<i32, HashMap<i32, bool>> = HashMap::new();
  let mut grid_size_y = 0;
  let mut grid_size_x = 0;
  let iterations = 100;

  // Read through the input and build the state
  for (i, line) in input.iter().enumerate() {
    if line.is_empty() {
      // This is a blank line, ignore it
      continue;
    }

    // Increment GridSizeY
    grid_size_y += 1;

    // Set the length of the line
    if grid_size_x == 0 {
      grid_size_x = line.len() as i32;
    } else if grid_size_x != line.len() as i32 {
      eprintln!("Malformed input");
      return 0;
    }

    let i = i as i32;
    state.insert(i, HashMap::new());
    for (li, ch) in line.chars().enumerate() {
      let value = ch == '#';
      state.get_mut(&i).unwrap().insert(li as i32, value);
    }
  }

  // Force the corners on
  force_corners_on(&mut state, grid_size_x);

  // Run the iterations
  for _it in 0..iterations {
    // Get the count for the current state
    let count = count_neighbours(&state);

    for y in 0..grid_size_y {
      for x in 0..grid_size_x {
        let count_for_light = *count.get(&y).and_then(|row| row.get(&x)).unwrap();

        let new_value = if *state.get(&y).and_then(|row| row.get(&x)).unwrap() {
          count_for_light == 2 || count_for_light == 3
        } else {
          count_for_light == 3
        };
        state.get_mut(&y).unwrap().insert(x, new_value);
      }
    }

    // Force the corners on
    force_corners_on(&mut state, grid_size_x);
  }

  // Count how many are on in the final state
  let mut count_on = 0;

  for y in 0..grid_size_y {
    for x in 0..grid_size_x {
      if *state.get(&y).and_then(|row| row.get(&x)).unwrap() {
        count_on += 1;
      }
    }
  }

  count_on
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
    day: 18,
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
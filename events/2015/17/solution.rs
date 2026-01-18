use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};


fn count_permutations(container_sizes: &Vec<i32>, target: i32) -> i32 {
  // Create array to track the number of ways to make any value between zero and the target
  let mut ways_to_make_sum = vec![0; (target + 1) as usize];

  // There is only one way to make a value of 0, use no containers!
  ways_to_make_sum[0] = 1;
  
  // Loop over each container
  for &container in container_sizes {
      // Traverse backwards to avoid using same container twice
      for i in (container..=target).rev() {
          ways_to_make_sum[i as usize] += ways_to_make_sum[(i - container) as usize];
      }
  }
  
  ways_to_make_sum[target as usize]
}

fn count_min_permutations(container_sizes: &Vec<i32>, target: i32) -> (i32, i32) {
  // First pass: find minimum containers needed
  let mut min_containers_needed = vec![i32::MAX; (target + 1) as usize];
  min_containers_needed[0] = 0;
  
  for &container in container_sizes {
      for i in (container..=target).rev() {
          if min_containers_needed[(i - container) as usize] != i32::MAX {
              min_containers_needed[i as usize] = min_containers_needed[i as usize]
                  .min(min_containers_needed[(i - container) as usize] + 1);
          }
      }
  }
  
  let min_containers = min_containers_needed[target as usize];
  
  // Second pass: count permutations using exactly min_containers
  let mut ways_to_make_sum_with_n_containers = vec![vec![0i32; (min_containers + 1) as usize]; (target + 1) as usize];
  ways_to_make_sum_with_n_containers[0][0] = 1;
  
  for &container in container_sizes {
      for sum in (container..=target).rev() {
          for num_containers in (1..=min_containers).rev() {
              ways_to_make_sum_with_n_containers[sum as usize][num_containers as usize] += 
                  ways_to_make_sum_with_n_containers[(sum - container) as usize][(num_containers - 1) as usize];
          }
      }
  }
  
  (min_containers, ways_to_make_sum_with_n_containers[target as usize][min_containers as usize])
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> i32 {
  let mut container_sizes: Vec<i32> = Vec::new();
  let total: i32 = 150;

  for item in input{
    if item.len() == 0 {
      continue
    }

    container_sizes.push(item.parse::<i32>().unwrap());
  }
  
  let permutations: i32 = count_permutations(&container_sizes, total);

  permutations
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> i32 {
  let mut container_sizes: Vec<i32> = Vec::new();
  let total: i32 = 150;

  for item in input{
    if item.len() == 0 {
      continue
    }

    container_sizes.push(item.parse::<i32>().unwrap());
  }
  
  let (_min_containers, permutations): (i32, i32) = count_min_permutations(&container_sizes, total);

  permutations
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
    day: 17,
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
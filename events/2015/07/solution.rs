use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};
use std::collections::HashMap;

#[derive(Debug, Clone)]
enum CommandValue {
    Int(u16),
    StringArray(Vec<String>),
}

type ConnectionRecord = HashMap<String, CommandValue>;

fn update_connections(mut collections: ConnectionRecord) -> ConnectionRecord {
  let keys_to_update: Vec<_> = collections
    .iter()
    .filter_map(|(wire, command)| {
      if matches!(command, CommandValue::Int(_)) {
        return None;
      }
      
      if let CommandValue::StringArray(arr) = command {
        if arr.len() == 1 {
          if let Ok(num) = arr[0].parse::<u16>() {
            return Some((wire.clone(), num));
          }
        }
      }
      None
    })
    .collect();

  for (wire, num) in keys_to_update {
    collections.insert(wire, CommandValue::Int(num));
  }

  collections
}

fn solve_connection(origin_connections: ConnectionRecord, to_solve: String) -> (u16, ConnectionRecord) {
  let mut connections = update_connections(origin_connections);
  let wc = connections.get(&to_solve);

  if let Some(CommandValue::Int(value)) = wc {
    return (*value, connections)
  }

  if let Some(CommandValue::StringArray(arr)) = connections.clone().get(&to_solve) {
    if arr.len() == 1 {
      let num: u16;
      let num_test = arr[0].parse::<u16>();
      match num_test {
        Ok(number) => num = number,
        Err(_) => return solve_connection(connections, arr[0].clone()),
      }
      connections.insert(to_solve, CommandValue::Int(num));
    } else if arr.len() == 2 {
      let nv = arr[1].clone();
      let mut ans: u16;

      let nv_test = nv.parse::<u16>();
      match nv_test {
        Ok(number) => ans = number,
        Err(_) => (ans, connections) = solve_connection(connections, nv),
      }

      ans = !ans;

      connections.insert(to_solve, CommandValue::Int(ans));
      return (ans, connections)
    } else if arr.len() == 3 {
      let op = arr[1].clone();

      let a: u16;
      let b: u16;

      let a_test = arr[0].parse::<u16>();
      match a_test {
        Ok(number) => a = number,
        Err(_) => (a, connections) = solve_connection(connections, arr[0].clone()),
      }

      let b_test = arr[2].parse::<u16>();
      match b_test {
        Ok(number) => b = number,
        Err(_) => (b, connections) = solve_connection(connections, arr[2].clone())
      }

      let ans: u16;
      let mut ans_set: bool = false;

      if op == "AND" {
        ans = a&b;
        ans_set = true;
      } else if op == "OR" {
        ans = a|b;
        ans_set = true;
      } else if op == "LSHIFT" {
        ans = a<<b;
        ans_set = true;
      } else if op == "RSHIFT" {
        ans = a>>b;
        ans_set = true;
      } else { ans = 0; }

      if ans_set {
        connections.insert(to_solve, CommandValue::Int(ans));
        return (ans, connections)
      }
    }
  }
  (0, connections)
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> u16 {
  let mut connections: ConnectionRecord = HashMap::new();

  for command in input {
    let [raw_cmd, mut destination] = command
        .split("->")
        .collect::<Vec<&str>>()
        .try_into()
        .unwrap();
    destination = destination.trim();
    
    let cmd = raw_cmd
        .trim()
        .split(" ")
        .map(|s| s.to_string())
        .collect::<Vec<String>>();

    connections.insert(destination.to_string(), CommandValue::StringArray(cmd));
  }
  
  let (ans, _new_connections) = solve_connection(connections, "a".to_string());
  
  ans
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> u16 {
  let b = part1(input);
  let mut connections: ConnectionRecord = HashMap::new();

  for command in input {
    let [raw_cmd, mut destination] = command
        .split("->")
        .collect::<Vec<&str>>()
        .try_into()
        .unwrap();
    destination = destination.trim();
    
    let cmd = raw_cmd
        .trim()
        .split(" ")
        .map(|s| s.to_string())
        .collect::<Vec<String>>();

    connections.insert(destination.to_string(), CommandValue::StringArray(cmd));
  }
  connections.insert("b".to_string(), CommandValue::Int(b));
  
  let (ans, _new_connections) = solve_connection(connections, "a".to_string());
  
  ans
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
    day: 07,
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
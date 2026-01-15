use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};
use std::collections::{HashMap, HashSet};

#[derive(Debug, Clone)]
struct Ingredient {
  capacity: i32,
  durability: i32,
  flavor: i32,
  texture: i32,
  calories: i32,
}

fn get_permutations(ingredients: Vec<String>, total: i32, remaining: i32, index: i32, current: HashMap<String, i32>) -> Vec<HashMap<String, i32>>{
  if index == ingredients.len() as i32 - 1 {
    let mut result = current.clone();
    result.insert(ingredients[index as usize].clone(), remaining);
    return vec![result];
  }

  let mut results: Vec<HashMap<String, i32>> = Vec::new();

  for i in 0..remaining {
    let mut next_current = current.clone();
    next_current.insert(ingredients[index as usize].clone(), i);

    let permutations = get_permutations(ingredients.clone(), total, remaining - i, index + 1, next_current);
    for permutation in permutations{
      results.push(permutation);
    }
  }

  return results
}

fn calculate_score(ingredients: HashMap<String, Ingredient>, permutation: HashMap<String, i32>) -> i32 {
  let mut running_capacity = 0;
  let mut running_durability = 0;
  let mut running_flavor = 0;
  let mut running_texture = 0;

  for (item, amount) in permutation {
    running_capacity += ingredients[&item].capacity * amount;
    running_durability += ingredients[&item].durability * amount;
    running_flavor += ingredients[&item].flavor * amount;
    running_texture += ingredients[&item].texture * amount;
  }

  if running_capacity < 0 || running_durability < 0 || running_flavor < 0 || running_texture < 0 {
    //println!("{} {} {} {}", running_capacity, running_durability, running_flavor, running_texture);
    return 0
  }

  return running_capacity * running_durability * running_flavor * running_texture
}

fn calculate_calories(ingredients: HashMap<String, Ingredient>, permutation: HashMap<String, i32>) -> i32 {
  let mut calories = 0;

  for (item, amount) in permutation {
    let add_calories = ingredients[&item].calories * amount;
    calories += add_calories;
  }

  return calories
}


fn string_to_num(input: &str, remove_last: bool) -> i32 {
  let mut in_s = input.to_string();

  if remove_last {
    in_s.pop();
  }

  return in_s.parse::<i32>().unwrap();
}



// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> i32 {
  let mut ingredients: HashMap<String, Ingredient> = HashMap::new();
  let mut ingredient_names: HashSet<String> = HashSet::new();

  for item in input {
    if item.len() == 0 { continue; }
    
    let parts_a: Vec<&str> = item.split(":").collect();
    let name: String = parts_a[0].to_string();
    let parts_b: Vec<&str> = parts_a[1].split(" ").collect();

    let new_ingredient: Ingredient = Ingredient{
      capacity: string_to_num(parts_b[2], true),
      durability: string_to_num(parts_b[4], true),
      flavor: string_to_num(parts_b[6], true),
      texture: string_to_num(parts_b[8], true),
      calories: string_to_num(parts_b[10], false),
    };

    ingredient_names.insert(name.clone());
    ingredients.insert(name, new_ingredient);
  }
  
  let ingredient_name_vec: Vec<String> = ingredient_names.into_iter().collect::<Vec<String>>();
  let permutations = get_permutations(ingredient_name_vec, 100, 100, 0, HashMap::new());

  let mut max_score = 0;
  for permutation in permutations {
    let score = calculate_score(ingredients.clone(), permutation);
    
    if score > max_score {
      max_score = score;
    }
  }

  max_score
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> i32 {
  let mut ingredients: HashMap<String, Ingredient> = HashMap::new();
  let mut ingredient_names: HashSet<String> = HashSet::new();

  for item in input {
    if item.len() == 0 { continue; }
    
    let parts_a: Vec<&str> = item.split(":").collect();
    let name: String = parts_a[0].to_string();
    let parts_b: Vec<&str> = parts_a[1].split(" ").collect();

    let new_ingredient: Ingredient = Ingredient{
      capacity: string_to_num(parts_b[2], true),
      durability: string_to_num(parts_b[4], true),
      flavor: string_to_num(parts_b[6], true),
      texture: string_to_num(parts_b[8], true),
      calories: string_to_num(parts_b[10], false),
    };

    ingredient_names.insert(name.clone());
    ingredients.insert(name, new_ingredient);
  }
  
  let ingredient_name_vec: Vec<String> = ingredient_names.into_iter().collect::<Vec<String>>();
  let permutations = get_permutations(ingredient_name_vec, 100, 100, 0, HashMap::new());

  let mut max_score = 0;
  for permutation in permutations {
    let score = calculate_score(ingredients.clone(), permutation.clone());
    
    if score > max_score {
      let calories = calculate_calories(ingredients.clone(), permutation);
      if calories == 500 {
        max_score = score;
      }
    }
  }

  max_score
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
    day: 15,
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
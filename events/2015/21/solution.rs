use aoc_utils::read_input_as_array;
use aoc_utils::measure_performance;
use aoc_utils::AOCDayResults;
use aoc_utils::AOCTimestamp;
use chrono::{DateTime, Utc};
use std::collections::HashMap;
use std::cmp::max;

#[derive(Debug, Clone)]
struct PlayerStats {
  health: i32,
  armor: i32,
  damage: i32,
  spent: i32
}

#[derive(Debug, PartialEq, Clone)]
enum ShopCategory {
  Weapon,
  Armor,
  Ring
}

#[derive(Debug, Clone)]
struct ShopItem {
  cost: i32,
  damage: i32,
  armor: i32,
  category: ShopCategory
}

fn get_shop_items() -> HashMap<String, ShopItem>{
  let mut items: HashMap<String, ShopItem> = HashMap::new();

  // Weapons
  items.insert("Dagger".to_string(), ShopItem {cost: 8, damage: 4, armor: 0, category: ShopCategory::Weapon});
  items.insert("Shortsword".to_string(), ShopItem {cost: 10, damage: 5, armor: 0, category: ShopCategory::Weapon});
  items.insert("Warhammer".to_string(), ShopItem {cost: 25, damage: 6, armor: 0, category: ShopCategory::Weapon});
  items.insert("Longsword".to_string(), ShopItem {cost: 40, damage: 7, armor: 0, category: ShopCategory::Weapon});
  items.insert("Greataxe".to_string(), ShopItem {cost: 74, damage: 8, armor: 0, category: ShopCategory::Weapon});

  // Armor
  items.insert("Leather".to_string(), ShopItem {cost: 13, damage: 0, armor: 1, category: ShopCategory::Armor});
  items.insert("Chainmail".to_string(), ShopItem {cost: 31, damage: 0, armor: 2, category: ShopCategory::Armor});
  items.insert("Splitmail".to_string(), ShopItem {cost: 53, damage: 0, armor: 3, category: ShopCategory::Armor});
  items.insert("Bandemail".to_string(), ShopItem {cost: 75, damage: 0, armor: 4, category: ShopCategory::Armor});
  items.insert("Platemail".to_string(), ShopItem {cost: 102, damage: 0, armor: 5, category: ShopCategory::Armor});

  // Rings
  items.insert("Damage +1".to_string(), ShopItem {cost: 25, damage: 1, armor: 0, category: ShopCategory::Ring});
  items.insert("Damage +2".to_string(), ShopItem {cost: 50, damage: 2, armor: 0, category: ShopCategory::Ring});
  items.insert("Damage +3".to_string(), ShopItem {cost: 100, damage: 3, armor: 0, category: ShopCategory::Ring});
  items.insert("Defense +1".to_string(), ShopItem {cost: 20, damage: 0, armor: 1, category: ShopCategory::Ring});
  items.insert("Defense +2".to_string(), ShopItem {cost: 40, damage: 0, armor: 2, category: ShopCategory::Ring});
  items.insert("Defense +3".to_string(), ShopItem {cost: 80, damage: 0, armor: 3, category: ShopCategory::Ring});

  return items;
}

fn run_battle(mut player: PlayerStats, mut enemy: PlayerStats) -> bool {
  let mut turn: i32 = 0;
  let mut player_dead: bool = false;
  let mut enemy_dead: bool = false;

  while !player_dead && !enemy_dead {
    turn += 1;

    if turn % 2 == 0 {
      let dealt_damage = max(enemy.damage - player.armor, 1);
      player.health -= dealt_damage;

      if player.health <= 0 {
        player_dead = true;
      }
    } else {
      let dealt_damage = max(player.damage - enemy.armor, 1);
      enemy.health -= dealt_damage;

      if enemy.health <= 0 {
        enemy_dead = true;
      }
    }
  }

  return player_dead
}

fn get_possible_loadouts(shop_items: &HashMap<String, ShopItem>, starting_health: i32) -> Vec<PlayerStats> {
  let mut possible_loadouts: Vec<PlayerStats> = Vec::new();

  let weapons: HashMap<String, ShopItem> = shop_items
    .iter()
    .filter(|(_, value)| value.category == ShopCategory::Weapon)
    .map(|(key, value)| (key.clone(), value.clone()))
    .collect();

  let armors: HashMap<String, ShopItem> = shop_items
    .iter()
    .filter(|(_, value)| value.category == ShopCategory::Armor)
    .map(|(key, value)| (key.clone(), value.clone()))
    .collect();

  let rings: HashMap<String, ShopItem> = shop_items
    .iter()
    .filter(|(_, value)| value.category == ShopCategory::Ring)
    .map(|(key, value)| (key.clone(), value.clone()))
    .collect();

  let mut weapon_loadouts: Vec<PlayerStats> = Vec::new();
  for (_, weapon) in &weapons {
    let loadout = PlayerStats {
      health: starting_health,
      damage: weapon.damage,
      armor: 0,
      spent: weapon.cost,
    };
    weapon_loadouts.push(loadout.clone());
    possible_loadouts.push(loadout);
  }

  let mut armor_loadouts = weapon_loadouts.clone();
  for (_, armor) in &armors {
    for wl in &weapon_loadouts {
      let loadout = PlayerStats {
        health: starting_health,
        damage: wl.damage,
        armor: armor.armor,
        spent: wl.spent + armor.cost,
      };
      armor_loadouts.push(loadout.clone());
      possible_loadouts.push(loadout);
    }
  }

  for (_, ring) in &rings {
    for ar in &armor_loadouts {
      possible_loadouts.push(PlayerStats {
        health: starting_health,
        damage: ar.damage + ring.damage,
        armor: ar.armor + ring.armor,
        spent: ar.spent + ring.cost,
      });
    }
  }

  for (item1, ring1) in &rings {
    for (item2, ring2) in &rings {
      if item1 == item2 {
        continue;
      }

      for ar in &armor_loadouts {
        possible_loadouts.push(PlayerStats {
          health: starting_health,
          damage: ar.damage + ring1.damage + ring2.damage,
          armor: ar.armor + ring1.armor + ring2.armor,
          spent: ar.spent + ring1.cost + ring2.cost,
        });
      }
    }
  }

  possible_loadouts
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
fn part1(input: &Vec<String>) -> i32 {
  let mut enemy: PlayerStats = PlayerStats {health: 0, armor: 0, damage: 0, spent: 0};

  for (_i, line) in input.iter().enumerate() {
    if line.is_empty() {
      continue
    }

    if line.contains("Hit Points") {
      if let Some(value) = line.split(": ").nth(1) {
        enemy.health = value.parse().unwrap_or(0);
      }
    } else if line.contains("Damage") {
      if let Some(value) = line.split(": ").nth(1) {
        enemy.damage = value.parse().unwrap_or(0);
      }
    } else if line.contains("Armor") {
      if let Some(value) = line.split(": ").nth(1) {
        enemy.armor = value.parse().unwrap_or(0);
      }
    }
  }

  let loadouts = get_possible_loadouts(&get_shop_items(), 100);

  let mut lowest_spend = i32::MAX;
  for loadout in &loadouts {
    let enemy_stats = enemy.clone();
    let battle_result = run_battle(loadout.clone(), enemy_stats);

    if !battle_result {
      if lowest_spend > loadout.spent {
        lowest_spend = loadout.spent;
      }
    }
  }
  
  lowest_spend
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
fn part2(input: &Vec<String>) -> i32 {
  let mut enemy: PlayerStats = PlayerStats {health: 0, armor: 0, damage: 0, spent: 0};

  for (_i, line) in input.iter().enumerate() {
    if line.is_empty() {
      continue
    }

    if line.contains("Hit Points") {
      if let Some(value) = line.split(": ").nth(1) {
        enemy.health = value.parse().unwrap_or(0);
      }
    } else if line.contains("Damage") {
      if let Some(value) = line.split(": ").nth(1) {
        enemy.damage = value.parse().unwrap_or(0);
      }
    } else if line.contains("Armor") {
      if let Some(value) = line.split(": ").nth(1) {
        enemy.armor = value.parse().unwrap_or(0);
      }
    }
  }

  let loadouts = get_possible_loadouts(&get_shop_items(), 100);

  let mut highest_spend: i32 = 0;
  for loadout in &loadouts {
    let enemy_stats = enemy.clone();
    let battle_result = run_battle(loadout.clone(), enemy_stats);

    if battle_result {
      if highest_spend < loadout.spent {
        highest_spend = loadout.spent;
      }
    }
  }
  
  highest_spend
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
    day: 21,
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
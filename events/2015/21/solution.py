import sys
import json
import time
from datetime import timedelta, datetime
from pathlib import Path

# Add workspace root to path for imports
workspace_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(workspace_root))

from utils.python.types import AOCDayResults, AOCTimestamp, AOCPartResult
from utils.python.input import readInputAsArray
from utils.python.performance import measurePerformance
from typing import TypedDict

class PlayerStats(TypedDict):
  Health: int
  Armor: int
  Damage: int
  Spent: int

class ShopItem(TypedDict):
  Cost: int
  Damage: int
  Armor: int
  Category: str

def get_shop_items() -> dict[str, ShopItem]:
  items: dict[str, ShopItem] = {}
  
  # Weapons
  items["Dagger"] = {"Cost": 8, "Damage": 4, "Armor": 0, "Category": "Weapon"}
  items["Shortsword"] = {"Cost": 10, "Damage": 5, "Armor": 0, "Category": "Weapon"}
  items["Warhammer"] = {"Cost": 25, "Damage": 6, "Armor": 0, "Category": "Weapon"}
  items["Longsword"] = {"Cost": 40, "Damage": 7, "Armor": 0, "Category": "Weapon"}
  items["Greataxe"] = {"Cost": 74, "Damage": 8, "Armor": 0, "Category": "Weapon"}
  
  # Armor
  items["Leather"] = {"Cost": 13, "Damage": 0, "Armor": 1, "Category": "Armor"}
  items["Chainmail"] = {"Cost": 31, "Damage": 0, "Armor": 2, "Category": "Armor"}
  items["Splitmail"] = {"Cost": 53, "Damage": 0, "Armor": 3, "Category": "Armor"}
  items["Bandemail"] = {"Cost": 75, "Damage": 0, "Armor": 4, "Category": "Armor"}
  items["Platemail"] = {"Cost": 102, "Damage": 0, "Armor": 5, "Category": "Armor"}
  
  # Rings
  items["Damage +1"] = {"Cost": 25, "Damage": 1, "Armor": 0, "Category": "Ring"}
  items["Damage +2"] = {"Cost": 50, "Damage": 2, "Armor": 0, "Category": "Ring"}
  items["Damage +3"] = {"Cost": 100, "Damage": 3, "Armor": 0, "Category": "Ring"}
  items["Defense +1"] = {"Cost": 20, "Damage": 0, "Armor": 1, "Category": "Ring"}
  items["Defense +2"] = {"Cost": 40, "Damage": 0, "Armor": 2, "Category": "Ring"}
  items["Defense +3"] = {"Cost": 80, "Damage": 0, "Armor": 3, "Category": "Ring"}
  
  return items

def run_battle(player: PlayerStats, enemy: PlayerStats) -> bool:
  turn = 0
  player_dead = False
  enemy_dead = False
  
  while not player_dead and not enemy_dead:
    turn += 1
    
    if turn % 2 == 0:
      dealt_damage = max(enemy["Damage"] - player["Armor"], 1)
      player["Health"] -= dealt_damage
      
      if player["Health"] <= 0:
        player_dead = True
    else:
      dealt_damage = max(player["Damage"] - enemy["Armor"], 1)
      enemy["Health"] -= dealt_damage
      
      if enemy["Health"] <= 0:
        enemy_dead = True
  
  return player_dead

def get_possible_loadouts(shop_items: dict[str, ShopItem], starting_health: int) -> list[PlayerStats]:
  possible_loadouts: list[PlayerStats] = []
  
  weapons = {k: v for k, v in shop_items.items() if v["Category"] == "Weapon"}
  armors = {k: v for k, v in shop_items.items() if v["Category"] == "Armor"}
  rings = {k: v for k, v in shop_items.items() if v["Category"] == "Ring"}
  
  # Deal with Weapons
  weapon_loadouts: list[PlayerStats] = []
  for item, weapon in weapons.items():
    loadout = {"Health": starting_health, "Damage": weapon["Damage"], "Armor": 0, "Spent": weapon["Cost"]}
    weapon_loadouts.append(loadout)
    possible_loadouts.append(loadout.copy())
  
  # Armor Loadouts
  armor_loadouts = [wl.copy() for wl in weapon_loadouts]
  for item, armor in armors.items():
    for wl in weapon_loadouts:
      loadout = {"Health": starting_health, "Damage": wl["Damage"], "Armor": armor["Armor"], "Spent": wl["Spent"] + armor["Cost"]}
      armor_loadouts.append(loadout)
      possible_loadouts.append(loadout.copy())
  
  # 1 Ring Loadouts
  for item, ring in rings.items():
    for ar in armor_loadouts:
      loadout = {"Health": starting_health, "Damage": ar["Damage"] + ring["Damage"], "Armor": ar["Armor"] + ring["Armor"], "Spent": ar["Spent"] + ring["Cost"]}
      possible_loadouts.append(loadout)
  
  # 2 Ring Loadouts
  for item1, ring1 in rings.items():
    for item2, ring2 in rings.items():
      if item1 == item2:
        continue
      
      for ar in armor_loadouts:
        loadout = {"Health": starting_health, "Damage": ar["Damage"] + ring1["Damage"] + ring2["Damage"], "Armor": ar["Armor"] + ring1["Armor"] + ring2["Armor"], "Spent": ar["Spent"] + ring1["Cost"] + ring2["Cost"]}
        possible_loadouts.append(loadout)
  
  return possible_loadouts

# ----------------------------------------------------------------------------------------------------
# | Part 1
# ----------------------------------------------------------------------------------------------------
def part1(input: list[str]) -> int:
  enemy: PlayerStats = {"Health": 0, "Armor": 0, "Damage": 0, "Spent": 0}
    
  for line in input:
    if len(line) == 0:
      continue
    if "Hit Points" in line:
      enemy["Health"] = int(line.split(": ")[1])
    elif "Damage" in line:
      enemy["Damage"] = int(line.split(": ")[1])
    elif "Armor" in line:
      enemy["Armor"] = int(line.split(": ")[1])
  
  # Find all combinations of gear we could possibly have
  loadouts = get_possible_loadouts(get_shop_items(), 100)
  
  # Run all the loadouts
  lowest_spend = float('inf')
  for loadout in loadouts:
    battle_result = run_battle(loadout.copy(), enemy.copy())
    
    # Did we win?
    if not battle_result:
      if lowest_spend > loadout["Spent"]:
        lowest_spend = loadout["Spent"]
  
  return lowest_spend

# ----------------------------------------------------------------------------------------------------
# | Part 2
# ----------------------------------------------------------------------------------------------------
def part2(input: list[str]) -> int:
  enemy: PlayerStats = {"Health": 0, "Armor": 0, "Damage": 0, "Spent": 0}
    
  for line in input:
    if len(line) == 0:
      continue
    if "Hit Points" in line:
      enemy["Health"] = int(line.split(": ")[1])
    elif "Damage" in line:
      enemy["Damage"] = int(line.split(": ")[1])
    elif "Armor" in line:
      enemy["Armor"] = int(line.split(": ")[1])
  
  # Find all combinations of gear we could possibly have
  loadouts = get_possible_loadouts(get_shop_items(), 100)
  
  # Run all the loadouts
  highest_spend = 0
  for loadout in loadouts:
    battle_result = run_battle(loadout.copy(), enemy.copy())
    
    # Did we win?
    if battle_result:
      if highest_spend < loadout["Spent"]:
        highest_spend = loadout["Spent"]
  
  return highest_spend

# ----------------------------------------------------------------------------------------------------
# | Main Function
# ----------------------------------------------------------------------------------------------------
def main():
  # Get the arguments
  args = sys.argv[1:]
  fileName = args[0] if args else "input.txt"

  # Start the timer
  start_timestamp = datetime.now().isoformat()
  start_time = time.monotonic()

  # Read the input to an array of strings
  input = readInputAsArray(fileName)

  ## Run the parts
  p1Result = measurePerformance(part1, input)
  p2Result = measurePerformance(part2, input)

  # End the timer
  end_time = time.monotonic()
  end_timestamp = datetime.now().isoformat()
  duration = timedelta(seconds=end_time - start_time).total_seconds()*1000000000 # Convert to nanoseconds

  # Return the results
  return AOCDayResults(
    Year=2015,
    Day=21,
    Part1=p1Result,
    Part2=p2Result,
    Duration=duration,
    Timestamp=AOCTimestamp(
      Start=start_timestamp,
      End=end_timestamp,
    ),
  )



if __name__ == "__main__":
  results = main()
  print(json.dumps(results))
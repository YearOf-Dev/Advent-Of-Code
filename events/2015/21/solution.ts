import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

type PlayerStats = {
  Health: number
  Armor: number
  Damage: number
  Spent: number
}

type ShopItem = {
  Cost: number
  Damage: number
  Armor: number
  Category: "Weapon" | "Armor" | "Ring"
}

function getShopItems(): Record<string, ShopItem> {
  let Items: Record<string, ShopItem> = {}

  // Weapons
  Items["Dagger"] = {Cost: 8, Damage: 4, Armor: 0, Category: "Weapon"}
  Items["Shortsword"] = {Cost: 10, Damage: 5, Armor: 0, Category: "Weapon"}
  Items["Warhammer"] = {Cost: 25, Damage: 6, Armor: 0, Category: "Weapon"}
  Items["Longsword"] = {Cost: 40, Damage: 7, Armor: 0, Category: "Weapon"}
  Items["Greataxe"] = {Cost: 74, Damage: 8, Armor: 0, Category: "Weapon"}

  // Armor
  Items["Leather"] = {Cost: 13, Damage: 0, Armor: 1, Category: "Armor"}
  Items["Chainmail"] = {Cost: 31, Damage: 0, Armor: 2, Category: "Armor"}
  Items["Splitmail"] = {Cost: 53, Damage: 0, Armor: 3, Category: "Armor"}
  Items["Bandemail"] = {Cost: 75, Damage: 0, Armor: 4, Category: "Armor"}
  Items["Platemail"] = {Cost: 102, Damage: 0, Armor: 5, Category: "Armor"}

  // Rings
  Items["Damage +1"] = {Cost: 25, Damage: 1, Armor: 0, Category: "Ring"}
  Items["Damage +2"] = {Cost: 50, Damage: 2, Armor: 0, Category: "Ring"}
  Items["Damage +3"] = {Cost: 100, Damage: 3, Armor: 0, Category: "Ring"}
  Items["Defense +1"] = {Cost: 20, Damage: 0, Armor: 1, Category: "Ring"}
  Items["Defense +2"] = {Cost: 40, Damage: 0, Armor: 2, Category: "Ring"}
  Items["Defense +3"] = {Cost: 80, Damage: 0, Armor: 3, Category: "Ring"}

  return Items
}

function runBattle(player: PlayerStats, enemy: PlayerStats): boolean {
  let turn = 0;
  let playerDead = false;
  let enemyDead = false;

  while (!playerDead && !enemyDead) {
    turn += 1;

    if (turn % 2 == 0) {
      // It's the enemies turn
      let dealtDamage = Math.max(enemy.Damage - player.Armor, 1)
      player.Health -= dealtDamage

      if (player.Health <= 0) {
        playerDead = true
      }
    } else {
      // It's the players turn
      let dealtDamage = Math.max(player.Damage - enemy.Armor, 1)
      enemy.Health -= dealtDamage

      if (enemy.Health <= 0) {
        enemyDead = true
      }
    }
  }

  return playerDead
}

function getPossibleLoadouts(shopItems: Record<string, ShopItem>, startingHealth: number): PlayerStats[] {
  let possibleLoadouts: PlayerStats[] = []
  let weapons = Object.fromEntries(
    Object.entries(shopItems).filter(([key, value]) => value.Category == "Weapon")
  ) as Record<string, ShopItem>

  let armors = Object.fromEntries(
    Object.entries(shopItems).filter(([key, value]) => value.Category == "Armor")
  ) as Record<string, ShopItem>

  let rings = Object.fromEntries(
    Object.entries(shopItems).filter(([key, value]) => value.Category == "Ring")
  ) as Record<string, ShopItem>

  
  // Deal with Weapons
  let weaponLoadouts: PlayerStats[] = [];
  for (const item in weapons) {
    let weapon = weapons[item]
    weaponLoadouts.push({Health: startingHealth, Damage: weapon.Damage, Armor: 0, Spent: weapon.Cost})
    possibleLoadouts.push({Health: startingHealth, Damage: weapon.Damage, Armor: 0, Spent: weapon.Cost})
  }

  // Armor Loadouts
  let armorLoadouts = [...weaponLoadouts]
  for (const item in armors) {
    let armor = armors[item]
    for (var i = 0; i < weaponLoadouts.length; i++) {
      let wl = weaponLoadouts[i]
      armorLoadouts.push({Health: startingHealth, Damage: wl.Damage, Armor: armor.Armor, Spent: wl.Spent + armor.Cost})
      possibleLoadouts.push({Health: startingHealth, Damage: wl.Damage, Armor: armor.Armor, Spent: wl.Spent + armor.Cost})
    }
  }

  // 1 Ring Loadouts
  for (const item in rings) {
    let ring = rings[item]
    for (var i = 0; i < armorLoadouts.length; i++) {
      let ar = armorLoadouts[i]
      possibleLoadouts.push({Health: startingHealth, Damage: ar.Damage + ring.Damage, Armor: ar.Armor + ring.Armor, Spent: ar.Spent + ring.Cost})
    }
  }

  // 2 Ring Loadouts
  for (const item1 in rings) {
    for (const item2 in rings) {
      if (item1 == item2) { continue }

      let ring1 = rings[item1]
      let ring2 = rings[item2]

      for (var i = 0; i < armorLoadouts.length; i++) {
        let ar = armorLoadouts[i]
      possibleLoadouts.push({Health: startingHealth, Damage: ar.Damage + ring1.Damage + ring2.Damage, Armor: ar.Armor + ring1.Armor + ring2.Armor, Spent: ar.Spent + ring1.Cost + ring2.Cost})
      }
    }
  }

  return possibleLoadouts  
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let Enemy: PlayerStats = {Health: 0, Armor: 0, Damage: 0, Spent: 0}

  for (var i = 0; i < input.length; i++) {
    if (input[i].length == 0) { continue }
    if (input[i].includes("Hit Points")) {
      Enemy.Health = parseInt(input[i].split(": ")[1])
    } else if (input[i].includes("Damage")) {
      Enemy.Damage = parseInt(input[i].split(": ")[1])
    } else if (input[i].includes("Armor")) {
      Enemy.Armor = parseInt(input[i].split(": ")[1])
    }
  }

  // Find all combinations of gear we could possibly have
  let loadouts = getPossibleLoadouts(getShopItems(), 100)

  // Run all the loadouts
  let lowestSpend = Infinity
  for (var i = 0; i < loadouts.length; i++) {
    let battleResult = runBattle(loadouts[i], {Health: Enemy.Health, Armor: Enemy.Armor, Damage: Enemy.Damage, Spent: 0})

    // Did we win?
    if (!battleResult) {
      if (lowestSpend > loadouts[i].Spent) {
        lowestSpend = loadouts[i].Spent
      }
    }
  }


  return lowestSpend;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let Enemy: PlayerStats = {Health: 0, Armor: 0, Damage: 0, Spent: 0}

  for (var i = 0; i < input.length; i++) {
    if (input[i].length == 0) { continue }
    if (input[i].includes("Hit Points")) {
      Enemy.Health = parseInt(input[i].split(": ")[1])
    } else if (input[i].includes("Damage")) {
      Enemy.Damage = parseInt(input[i].split(": ")[1])
    } else if (input[i].includes("Armor")) {
      Enemy.Armor = parseInt(input[i].split(": ")[1])
    }
  }

  // Find all combinations of gear we could possibly have
  let loadouts = getPossibleLoadouts(getShopItems(), 100)

  // Run all the loadouts
  let highestSpend = 0
  for (var i = 0; i < loadouts.length; i++) {
    let battleResult = runBattle(loadouts[i], {Health: Enemy.Health, Armor: Enemy.Armor, Damage: Enemy.Damage, Spent: 0})

    // Did we win?
    if (battleResult) {
      if (highestSpend < loadouts[i].Spent) {
        highestSpend = loadouts[i].Spent
      }
    }
  }


  return highestSpend;
}


// ----------------------------------------------------------------------------------------------------
// | Solve the puzzle
// ----------------------------------------------------------------------------------------------------
function solve() {
  // Get the arguments
  const args = process.argv.slice(2);
  const fileName = args[0] || "input.txt";

  // Start the timer
  const startTimeStamp = new Date(Date.now()).toISOString();
  const startTime = performance.now();

  // Read the input as an array of strings
  const input = readInputAsArray(fileName);

// Run the parts
const p1Result = measurePerformance(() => part1(input));
const p2Result = measurePerformance(() => part2(input));

// End the timer
const endTimeStamp = new Date(Date.now()).toISOString();
const endTime = performance.now();
const duration = endTime - startTime;

// Return the results
return {
  Year: 2015,
  Day: 21,
  Part1: p1Result,
  Part2: p2Result,
  Duration: Math.round(duration * 1000000), // Convert to nanoseconds
  Timestamp: {
    Start: new Date(startTimeStamp).toISOString(),
    End: new Date(endTimeStamp).toISOString(),
  },
} as AOCDayResults;
  
}
const results = solve();
console.log(JSON.stringify(results, null, 2));
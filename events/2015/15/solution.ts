import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

type ingredient = {
  capacity: number,
  durability: number,
  flavor: number,
  texture: number,
  calories: number
}

function getPermutations(ingredients: string[], total: number, remaining: number = total, index: number = 0, current: Record<string, number> = {}) {
  if (index === ingredients.length - 1) {
    return [{...current, [ingredients[index]]: remaining}]
  }

  let results: Record<string, number>[] = []

  for (let i = 0; i <= remaining; i++){
    const permutations = getPermutations(
      ingredients,
      total,
      remaining - i,
      index + 1,
      { ...current, [ingredients[index]]: i }
    )
    results.push(...permutations)
  }

  return results
}

function calculateScore(ingredients: Record<string, ingredient>, permutation: Record<string, number>): number {
  let running_capacity = 0;
  let running_durability = 0;
  let running_flavor = 0;
  let running_texture = 0;

  for (const item in permutation) {
    let ingredient = ingredients[item]
    let amount = permutation[item]

    running_capacity += ingredient.capacity*amount
    running_durability += ingredient.durability*amount
    running_flavor += ingredient.flavor*amount
    running_texture += ingredient.texture*amount
  }

  if (running_capacity < 0 || running_durability < 0 || running_flavor < 0 || running_texture < 0) {
    return 0
  }

  return running_capacity * running_durability * running_flavor * running_texture
}

function calculateCalories(ingredients: Record<string, ingredient>, permutation: Record<string, number>): number {
  let calories = 0

  for (const item in permutation) {
    let addCalories = ingredients[item].calories * permutation[item]
    calories += addCalories
  }

  return calories
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let ingredients : Record<string, ingredient> = {}
  let ingredient_names: string[] = []

  for (var i = 0; i < input.length; i++) {
    if (input[i].length == 0) { continue }
    let parts_a = input[i].split(":")
    let name = parts_a[0]
    let parts_b = parts_a[1].substring(1).split(" ")

    ingredients[name] = {
      capacity: parseInt(parts_b[1].substring(0, parts_b[1].length - 1)),
      durability: parseInt(parts_b[3].substring(0, parts_b[3].length - 1)),
      flavor: parseInt(parts_b[5].substring(0, parts_b[5].length - 1)),
      texture: parseInt(parts_b[7].substring(0, parts_b[7].length - 1)),
      calories: parseInt(parts_b[9].substring(0, parts_b[9].length))
    }
    ingredient_names.push(name)
  }
  
  // Permutations
  let permutations = getPermutations(ingredient_names, 100)

  let maxScore = 0
  for (var i = 0; i < permutations.length; i++) {
    let score = calculateScore(ingredients, permutations[i])
    if (score > maxScore) {
      maxScore = score
    }
  }

  return maxScore;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let ingredients : Record<string, ingredient> = {}
  let ingredient_names: string[] = []

  for (var i = 0; i < input.length; i++) {
    if (input[i].length == 0) { continue }
    let parts_a = input[i].split(":")
    let name = parts_a[0]
    let parts_b = parts_a[1].substring(1).split(" ")

    ingredients[name] = {
      capacity: parseInt(parts_b[1].substring(0, parts_b[1].length - 1)),
      durability: parseInt(parts_b[3].substring(0, parts_b[3].length - 1)),
      flavor: parseInt(parts_b[5].substring(0, parts_b[5].length - 1)),
      texture: parseInt(parts_b[7].substring(0, parts_b[7].length - 1)),
      calories: parseInt(parts_b[9].substring(0, parts_b[9].length))
    }
    ingredient_names.push(name)
  }
  
  // Permutations
  let permutations = getPermutations(ingredient_names, 100)

  let maxScore = 0
  for (var i = 0; i < permutations.length; i++) {
    let score = calculateScore(ingredients, permutations[i])
    if (score > maxScore) {
      if (calculateCalories(ingredients, permutations[i]) == 500) {
        maxScore = score
      }
    }
  }

  return maxScore;
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
  Day: 15,
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
package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
	"yod_aoc/utils/go/aoc_utils"
)

type ingredient struct {
	capacity   int
	durability int
	flavor     int
	texture    int
	calories   int
}

func getPermutations(ingredients []string, total int, remaining int, index int, current map[string]int) []map[string]int {
	if index == len(ingredients)-1 {
		newMap := make(map[string]int, len(current)+1)
		for k, v := range current {
			newMap[k] = v
		}
		newMap[ingredients[index]] = remaining
		return []map[string]int{newMap}
	}

	var results []map[string]int

	for i := 0; i <= remaining; i++ {
		newMap := make(map[string]int, len(current)+1)
		for k, v := range current {
			newMap[k] = v
		}
		newMap[ingredients[index]] = i
		permutations := getPermutations(ingredients, total, remaining-i, index+1, newMap)
		results = append(results, permutations...)
	}

	return results
}

func calculateScore(ingredients map[string]ingredient, permutation map[string]int) int {
	running_capacity := 0
	running_durability := 0
	running_flavor := 0
	running_texture := 0

	for name := range permutation {
		item := ingredients[name]
		amount := permutation[name]

		running_capacity += item.capacity * amount
		running_durability += item.durability * amount
		running_flavor += item.flavor * amount
		running_texture += item.texture * amount
	}

	if running_capacity < 0 {
		running_capacity = 0
	}
	if running_durability < 0 {
		running_durability = 0
	}
	if running_flavor < 0 {
		running_flavor = 0
	}
	if running_texture < 0 {
		running_texture = 0
	}

	return running_capacity * running_durability * running_flavor * running_texture
}

func calculateCalories(ingredients map[string]ingredient, permutation map[string]int) int {
	calories := 0

	for name := range permutation {
		addCalories := ingredients[name].calories * permutation[name]
		calories += addCalories
	}

	return calories
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	ingredients := make(map[string]ingredient)
	ingredient_names := []string{}

	for i := 0; i < len(input); i++ {
		if len(input[i]) == 0 {
			continue
		}

		parts_a := strings.Split(input[i], ":")
		name := parts_a[0]
		parts_b := strings.Split(parts_a[1][1:], " ")

		capacity, capErr := strconv.Atoi(parts_b[1][:len(parts_b[1])-1])
		durability, durErr := strconv.Atoi(parts_b[3][:len(parts_b[3])-1])
		flavor, flavErr := strconv.Atoi(parts_b[5][:len(parts_b[5])-1])
		texture, texErr := strconv.Atoi(parts_b[7][:len(parts_b[7])-1])
		calories, calErr := strconv.Atoi(parts_b[9])

		if capErr != nil || durErr != nil || flavErr != nil || texErr != nil || calErr != nil {
			panic("Something went wrong extracting data from input")
		}

		ingredients[name] = ingredient{
			capacity:   capacity,
			durability: durability,
			flavor:     flavor,
			texture:    texture,
			calories:   calories,
		}
		ingredient_names = append(ingredient_names, name)
	}

	permutations := getPermutations(ingredient_names, 100, 100, 0, make(map[string]int))

	maxScore := 0
	for i := 0; i < len(permutations); i++ {
		score := calculateScore(ingredients, permutations[i])
		if score > maxScore {
			maxScore = score
		}
	}

	return maxScore
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
	ingredients := make(map[string]ingredient)
	ingredient_names := []string{}

	for i := 0; i < len(input); i++ {
		if len(input[i]) == 0 {
			continue
		}

		parts_a := strings.Split(input[i], ":")
		name := parts_a[0]
		parts_b := strings.Split(parts_a[1][1:], " ")

		capacity, capErr := strconv.Atoi(parts_b[1][:len(parts_b[1])-1])
		durability, durErr := strconv.Atoi(parts_b[3][:len(parts_b[3])-1])
		flavor, flavErr := strconv.Atoi(parts_b[5][:len(parts_b[5])-1])
		texture, texErr := strconv.Atoi(parts_b[7][:len(parts_b[7])-1])
		calories, calErr := strconv.Atoi(parts_b[9])

		if capErr != nil || durErr != nil || flavErr != nil || texErr != nil || calErr != nil {
			panic("Something went wrong extracting data from input")
		}

		ingredients[name] = ingredient{
			capacity:   capacity,
			durability: durability,
			flavor:     flavor,
			texture:    texture,
			calories:   calories,
		}
		ingredient_names = append(ingredient_names, name)
	}

	permutations := getPermutations(ingredient_names, 100, 100, 0, make(map[string]int))

	maxScore := 0
	for i := 0; i < len(permutations); i++ {
		score := calculateScore(ingredients, permutations[i])
		if score > maxScore {
			if calculateCalories(ingredients, permutations[i]) == 500 {
				maxScore = score
			}
		}
	}

	return maxScore
}

// ----------------------------------------------------------------------------------------------------
// | Main Function
// ----------------------------------------------------------------------------------------------------
func main() {
	// Read the arguments
	args := os.Args[1:]
	var fileName string
	if len(args) > 0 {
		fileName = args[0]
	} else {
		fileName = "input.txt"
	}
	// Start the timer!
	startTime := time.Now()

	// Read the input to an array of strings
	path := aoc_utils.GetFilePath(2015, 15, fileName)
	content, err := aoc_utils.ReadInputAsArray(path)
	if err != nil {
		fmt.Println("Error reading input:", err)
		return
	}

	// Run the Parts
	p1Result := aoc_utils.MeasurePerformance(func() interface{} {
		return part1(content)
	})

	p2Result := aoc_utils.MeasurePerformance(func() interface{} {
		return part2(content)
	})

	// End the Timer!
	endTime := time.Now()
	duration := endTime.Sub(startTime)

	resultsForDay := aoc_utils.AOCDayResults{
		Year:     2015,
		Day:      15,
		Part1:    p1Result,
		Part2:    p2Result,
		Duration: duration.Nanoseconds(),
		Timestamp: aoc_utils.AOCTimestamp{
			Start: startTime.Format(time.RFC3339),
			End:   endTime.Format(time.RFC3339),
		},
	}
	jsonResults, _ := json.Marshal(resultsForDay)
	fmt.Println(string(jsonResults))
}

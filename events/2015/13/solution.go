package main

import (
	"encoding/json"
	"fmt"
	"os"
	"slices"
	"strconv"
	"strings"
	"time"
	"yod_aoc/utils/go/aoc_utils"
)

func factorial(n int) int {
	if n > 0 {
		return n * factorial(n-1)
	}
	return 1
}

func calculateHappiness(people map[string]map[string]int, arrangement []string) int {
	total := 0

	len := len(arrangement)

	for i := 0; i < len; i++ {
		person := arrangement[i]
		left := arrangement[(i-1+len)%len]
		right := arrangement[(i+1)%len]

		total += people[person][left] + people[person][right]
	}

	return total
}

func generateAllPermutations(names []string) [][]string {
	if len(names) <= 1 {
		return [][]string{names}
	}

	output := make([][]string, 0, factorial(len(names)))

	for i := 0; i < len(names); i++ {
		rest := append(append([]string{}, names[:i]...), names[i+1:]...)
		permutations := generateAllPermutations((rest))

		for index := range permutations {
			result := permutations[index]
			output = append(output, append([]string{names[i]}, result...))
		}
	}

	return output
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	people := make(map[string]map[string]int)
	names := make([]string, 0)

	for i := 0; i < len(input); i++ {
		if len(input[i]) == 0 {
			continue
		}

		parts := strings.Split(input[i], " ")
		personA := parts[0]
		personB := parts[10]
		personB = personB[:len(personB)-1]
		change := parts[3]
		posOrNeg := parts[2]

		if people[personA] == nil {
			people[personA] = make(map[string]int)
		}

		if posOrNeg == "gain" {
			people[personA][personB], _ = strconv.Atoi(change)
		} else if posOrNeg == "lose" {
			num, _ := strconv.Atoi(change)
			people[personA][personB] = -num
		}

		if !slices.Contains(names, personA) {
			names = append(names, personA)
		}
	}

	first := names[0]
	rest := names[1:]
	permutationsOfRest := generateAllPermutations(rest)
	allPermutataions := make([][]string, len(permutationsOfRest))
	for i, perm := range permutationsOfRest {
		allPermutataions[i] = append([]string{first}, perm...)
	}

	maxHapiness := 0
	for i, perm := range allPermutataions {
		hapiness := calculateHappiness(people, perm)
		if hapiness > maxHapiness || i == 0 {
			maxHapiness = hapiness
		}
	}

	return maxHapiness
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
	people := make(map[string]map[string]int)
	names := make([]string, 0)

	for i := 0; i < len(input); i++ {
		if len(input[i]) == 0 {
			continue
		}

		parts := strings.Split(input[i], " ")
		personA := parts[0]
		personB := parts[10]
		personB = personB[:len(personB)-1]
		change := parts[3]
		posOrNeg := parts[2]

		if people[personA] == nil {
			people[personA] = make(map[string]int)
		}

		if posOrNeg == "gain" {
			people[personA][personB], _ = strconv.Atoi(change)
		} else if posOrNeg == "lose" {
			num, _ := strconv.Atoi(change)
			people[personA][personB] = -num
		}

		if !slices.Contains(names, personA) {
			names = append(names, personA)
		}
	}

	people["Me"] = make(map[string]int, 0)
	for person, _ := range people {
		people[person]["Me"] = 0
		people["Me"][person] = 0
	}
	names = append([]string{"Me"}, names...)

	first := names[0]
	rest := names[1:]
	permutationsOfRest := generateAllPermutations(rest)
	allPermutataions := make([][]string, len(permutationsOfRest))
	for i, perm := range permutationsOfRest {
		allPermutataions[i] = append([]string{first}, perm...)
	}

	maxHapiness := 0
	for i, perm := range allPermutataions {
		hapiness := calculateHappiness(people, perm)
		if hapiness > maxHapiness || i == 0 {
			maxHapiness = hapiness
		}
	}

	return maxHapiness
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
	path := aoc_utils.GetFilePath(2015, 13, fileName)
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
		Day:      13,
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

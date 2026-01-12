package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"
	"yod_aoc/utils/go/aoc_utils"
)

func countAll(input interface{}, ignoreRed bool) int {
	count := 0

	switch v := input.(type) {
	case []interface{}:
		for _, item := range v {
			count += countAll(item, ignoreRed)
		}
	case map[string]interface{}:
		if ignoreRed && hasRed(v) {
			return count
		}
		for _, item := range v {
			count += countAll(item, ignoreRed)
		}
	case int:
		count += v
	case float64:
		count += int(v)
	}

	return count
}

func hasRed(input map[string]interface{}) bool {
	for _, item := range input {
		if item == "red" {
			return true
		}
	}
	return false
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	rawInput := []byte(input[0])
	var jsonData map[string]interface{}

	err := json.Unmarshal(rawInput, &jsonData)

	if err != nil {
		panic(err)
	}

	count := countAll(jsonData, false)

	return count
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
	rawInput := []byte(input[0])
	var jsonData map[string]interface{}

	err := json.Unmarshal(rawInput, &jsonData)

	if err != nil {
		panic(err)
	}

	count := countAll(jsonData, true)

	return count
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
	path := aoc_utils.GetFilePath(2015, 12, fileName)
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
		Day:      12,
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

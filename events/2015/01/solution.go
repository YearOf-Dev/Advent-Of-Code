package main

import (
	"yod_aoc/utils/go/aoc_utils"
	"fmt"
	"time"
	"encoding/json"
	"os"
)

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	finalFloor := 0
	directions := input[0]

	for i := 0; i < len(directions); i++ {
		direction := string(directions[i])
		if direction == "(" {
			finalFloor++
		} else if direction == ")" {
			finalFloor--
		}
	}

	return finalFloor
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
	currentFloor := 0
	directions := input[0]

	for i := 0; i < len(directions); i++ {
		direction := string(directions[i])
		if direction == "(" {
			currentFloor++
		} else if direction == ")" {
			currentFloor--
		}

		// If we are in the basement, return the current index
		if currentFloor == -1 {
			return i + 1 // +1 as AoC is 1-indexed
		}
	}

	// If we never enter the basement, return -1
	return -1
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
	path := aoc_utils.GetFilePath(2015, 1, fileName)
	content, err := aoc_utils.ReadInputAsArray(path);
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
		Year: 2015,
		Day: 1,
		Part1: p1Result,
		Part2: p2Result,
		Duration: duration.Nanoseconds(),
		Timestamp: aoc_utils.AOCTimestamp{
			Start: startTime.Format(time.RFC3339),
			End: endTime.Format(time.RFC3339),
		},
	}
	jsonResults, _ := json.Marshal(resultsForDay)
	fmt.Println(string(jsonResults))
}
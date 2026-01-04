package main

import (
	"encoding/json"
	"fmt"
	"os"
	"slices"
	"time"
	"yod_aoc/utils/go/aoc_utils"
)

type Coord struct {
	x int
	y int
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	visited := []Coord{}

	var pos Coord = Coord{x: 0, y: 0}
	visited = append(visited, pos)

	for i := 0; i < len(input[0]); i++ {
		direction := string(input[0][i])

		if direction == "^" {
			pos.y = pos.y + 1
		} else if direction == "v" {
			pos.y = pos.y - 1
		} else if direction == "<" {
			pos.x = pos.x - 1
		} else if direction == ">" {
			pos.x = pos.x + 1
		}

		if !slices.Contains(visited, pos) {
			visited = append(visited, pos)
		}
	}

	return len(visited)
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
	visited := []Coord{}

	var santa_pos Coord = Coord{x: 0, y: 0}
	var robot_pos Coord = Coord{x: 0, y: 0}
	visited = append(visited, santa_pos)

	for i := 0; i < len(input[0]); i++ {
		direction := string(input[0][i])

		if i%2 == 0 {
			if direction == "^" {
				santa_pos.y = santa_pos.y + 1
			} else if direction == "v" {
				santa_pos.y = santa_pos.y - 1
			} else if direction == "<" {
				santa_pos.x = santa_pos.x - 1
			} else if direction == ">" {
				santa_pos.x = santa_pos.x + 1
			}

			if !slices.Contains(visited, santa_pos) {
				visited = append(visited, santa_pos)
			}
		} else {
			if direction == "^" {
				robot_pos.y = robot_pos.y + 1
			} else if direction == "v" {
				robot_pos.y = robot_pos.y - 1
			} else if direction == "<" {
				robot_pos.x = robot_pos.x - 1
			} else if direction == ">" {
				robot_pos.x = robot_pos.x + 1
			}

			if !slices.Contains(visited, robot_pos) {
				visited = append(visited, robot_pos)
			}
		}
	}

	return len(visited)
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
	path := aoc_utils.GetFilePath(2015, 03, fileName)
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
		Day:      03,
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

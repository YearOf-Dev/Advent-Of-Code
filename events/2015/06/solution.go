package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"
	"yod_aoc/utils/go/aoc_utils"

	"strconv"
	"strings"
)

type Coord struct {
	x int
	y int
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	max_x := 999
	max_y := 999

	// State Tracker
	var state map[int]map[int]bool = make(map[int]map[int]bool)

	for x := 0; x <= max_x; x++ {
		state[x] = make(map[int]bool)
		for y := 0; y <= max_y; y++ {
			state[x][y] = false
		}
	}

	// Loop over the input
	for _, command_line := range input {
		command_segments := strings.SplitN(command_line, " ", -1)

		// Extract Info
		var command string
		var start Coord
		var end Coord

		if len(command_segments) == 5 {
			command = command_segments[1]
			start_segments := strings.SplitN(command_segments[2], ",", -1)
			end_segments := strings.SplitN(command_segments[4], ",", -1)
			start.x, _ = strconv.Atoi(start_segments[0])
			start.y, _ = strconv.Atoi(start_segments[1])
			end.x, _ = strconv.Atoi(end_segments[0])
			end.y, _ = strconv.Atoi(end_segments[1])
		} else if len(command_segments) == 4 {
			command = "toggle"
			start_segments := strings.SplitN(command_segments[1], ",", -1)
			end_segments := strings.SplitN(command_segments[3], ",", -1)
			start.x, _ = strconv.Atoi(start_segments[0])
			start.y, _ = strconv.Atoi(start_segments[1])
			end.x, _ = strconv.Atoi(end_segments[0])
			end.y, _ = strconv.Atoi(end_segments[1])
		} else {
			continue
		}

		for x := start.x; x <= end.x; x++ {
			for y := start.y; y <= end.y; y++ {
				if command == "on" {
					state[x][y] = true
				} else if command == "off" {
					state[x][y] = false
				} else if command == "toggle" {
					state[x][y] = !state[x][y]
				}
			}
		}

	}

	count := 0
	for x := 0; x <= max_x; x++ {
		for y := 0; y <= max_y; y++ {
			if state[x][y] == true {
				count += 1
			}
		}
	}

	return count
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
	max_x := 999
	max_y := 999

	// State Tracker
	var state map[int]map[int]int = make(map[int]map[int]int)

	for x := 0; x <= max_x; x++ {
		state[x] = make(map[int]int)
		for y := 0; y <= max_y; y++ {
			state[x][y] = 0
		}
	}

	// Loop over the input
	for _, command_line := range input {
		command_segments := strings.SplitN(command_line, " ", -1)

		// Extract Info
		var command string
		var start Coord
		var end Coord

		if len(command_segments) == 5 {
			command = command_segments[1]
			start_segments := strings.SplitN(command_segments[2], ",", -1)
			end_segments := strings.SplitN(command_segments[4], ",", -1)
			start.x, _ = strconv.Atoi(start_segments[0])
			start.y, _ = strconv.Atoi(start_segments[1])
			end.x, _ = strconv.Atoi(end_segments[0])
			end.y, _ = strconv.Atoi(end_segments[1])
		} else if len(command_segments) == 4 {
			command = "toggle"
			start_segments := strings.SplitN(command_segments[1], ",", -1)
			end_segments := strings.SplitN(command_segments[3], ",", -1)
			start.x, _ = strconv.Atoi(start_segments[0])
			start.y, _ = strconv.Atoi(start_segments[1])
			end.x, _ = strconv.Atoi(end_segments[0])
			end.y, _ = strconv.Atoi(end_segments[1])
		} else {
			continue
		}

		for x := start.x; x <= end.x; x++ {
			for y := start.y; y <= end.y; y++ {
				if command == "on" {
					state[x][y] += 1
				} else if command == "off" {
					if state[x][y] == 0 {
						continue
					}
					state[x][y] -= 1
				} else if command == "toggle" {
					state[x][y] += 2
				}
			}
		}

	}

	count := 0
	for x := 0; x <= max_x; x++ {
		for y := 0; y <= max_y; y++ {
			count += state[x][y]
		}
	}

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
	path := aoc_utils.GetFilePath(2015, 06, fileName)
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
		Day:      06,
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

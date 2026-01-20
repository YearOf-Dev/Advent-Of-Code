package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"
	"yod_aoc/utils/go/aoc_utils"
)

func countLight(state [][]bool, y int, x int, count int) int {
	if state[y][x] {
		return count + 1
	}
	return count
}

func countNeighbours(state [][]bool) [][]int {
	gridSize := len(state)
	count := make([][]int, gridSize)

	// Build an empty count from state
	for y := 0; y < gridSize; y++ {
		count[y] = make([]int, gridSize)
	}

	// Work through every position
	for y := 0; y < gridSize; y++ {
		for x := 0; x < gridSize; x++ {
			countForLight := 0

			// Check the row Above
			if y != 0 {
				if x != 0 {
					countForLight = countLight(state, y-1, x-1, countForLight)
				}
				countForLight = countLight(state, y-1, x, countForLight)
				if x != gridSize-1 {
					countForLight = countLight(state, y-1, x+1, countForLight)
				}
			}

			// Check the current Row
			if x != 0 {
				countForLight = countLight(state, y, x-1, countForLight)
			}
			if x != gridSize-1 {
				countForLight = countLight(state, y, x+1, countForLight)
			}

			// Count the row below
			if y+1 != gridSize {
				if x != 0 {
					countForLight = countLight(state, y+1, x-1, countForLight)
				}
				countForLight = countLight(state, y+1, x, countForLight)
				if x != gridSize-1 {
					countForLight = countLight(state, y+1, x+1, countForLight)
				}
			}

			// Update the main count
			count[y][x] = countForLight
		}
	}

	return count
}

func forceCornersOn(state [][]bool, gridSize int) [][]bool {
	gridSize -= 1
	state[0][0] = true
	state[0][gridSize] = true
	state[gridSize][0] = true
	state[gridSize][gridSize] = true
	return state
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	var state [][]bool
	gridSizeY := 0
	gridSizeX := 0
	iterations := 100

	// Read through the input and build the state
	for i := 0; i < len(input); i++ {
		line := input[i]

		if len(line) == 0 {
			// This is a blank line, ignore it
			continue
		}

		// Increment GridSizeY
		gridSizeY += 1

		// Set the length of the line
		if gridSizeX == 0 {
			gridSizeX = len(line)
		} else if gridSizeX != len(line) {
			panic("Malformed input")
		}

		state = append(state, make([]bool, len(line)))
		for li := 0; li < len(line); li++ {
			if line[li] == '#' {
				state[i][li] = true
			} else {
				state[i][li] = false
			}
		}
	}

	// Run the iterations
	for it := 0; it < iterations; it++ {
		// Get the count for the current state
		count := countNeighbours(state)

		for y := 0; y < gridSizeY; y++ {
			for x := 0; x < gridSizeX; x++ {
				countForLight := count[y][x]

				if state[y][x] {
					if countForLight == 2 || countForLight == 3 {
						state[y][x] = true
					} else {
						state[y][x] = false
					}
				} else {
					if countForLight == 3 {
						state[y][x] = true
					} else {
						state[y][x] = false
					}
				}
			}
		}
	}

	// Count how many are on in the final state
	countOn := 0

	for y := 0; y < gridSizeY; y++ {
		for x := 0; x < gridSizeX; x++ {
			if state[y][x] {
				countOn += 1
			}
		}
	}

	return countOn
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
	var state [][]bool
	gridSizeY := 0
	gridSizeX := 0
	iterations := 100

	// Read through the input and build the state
	for i := 0; i < len(input); i++ {
		line := input[i]

		if len(line) == 0 {
			// This is a blank line, ignore it
			continue
		}

		// Increment GridSizeY
		gridSizeY += 1

		// Set the length of the line
		if gridSizeX == 0 {
			gridSizeX = len(line)
		} else if gridSizeX != len(line) {
			panic("Malformed input")
		}

		state = append(state, make([]bool, len(line)))
		for li := 0; li < len(line); li++ {
			if line[li] == '#' {
				state[i][li] = true
			} else {
				state[i][li] = false
			}
		}
	}

	// Force the corners on
	state = forceCornersOn(state, gridSizeX)

	// Run the iterations
	for it := 0; it < iterations; it++ {
		// Get the count for the current state
		count := countNeighbours(state)

		for y := 0; y < gridSizeY; y++ {
			for x := 0; x < gridSizeX; x++ {
				countForLight := count[y][x]

				if state[y][x] {
					if countForLight == 2 || countForLight == 3 {
						state[y][x] = true
					} else {
						state[y][x] = false
					}
				} else {
					if countForLight == 3 {
						state[y][x] = true
					} else {
						state[y][x] = false
					}
				}
			}
		}

		// Force the corners on
		state = forceCornersOn(state, gridSizeX)
	}

	// Count how many are on in the final state
	countOn := 0

	for y := 0; y < gridSizeY; y++ {
		for x := 0; x < gridSizeX; x++ {
			if state[y][x] {
				countOn += 1
			}
		}
	}

	return countOn
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
	path := aoc_utils.GetFilePath(2015, 18, fileName)
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
		Day:      18,
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

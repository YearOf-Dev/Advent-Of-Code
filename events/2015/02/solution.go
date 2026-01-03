package main

import (
	"encoding/json"
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
	"time"
	"yod_aoc/utils/go/aoc_utils"
)

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	totalArea := 0

	for _, present := range input {
		sides := strings.SplitN(present, "x", -1)
		//fmt.Println(sides)
		length, lerr := strconv.Atoi(sides[0])
		width, werr := strconv.Atoi(sides[1])
		height, herr := strconv.Atoi(sides[2])

		if lerr != nil || werr != nil || herr != nil {
			continue
		}

		area := (2 * length * width) + (2 * width * height) + (2 * height * length)

		smallestSide := math.Min(float64(length*width), float64(width*height))
		smallestSide = math.Min(smallestSide, float64(height*length))

		area = area + int(smallestSide)

		totalArea += area
		//fmt.Println(present)
	}

	return totalArea
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
	totalRibbon := 0

	for _, present := range input {
		sides := strings.SplitN(present, "x", -1)
		// fmt.Println(sides)
		length, lerr := strconv.Atoi(sides[0])
		width, werr := strconv.Atoi(sides[1])
		height, herr := strconv.Atoi(sides[2])

		if lerr != nil || werr != nil || herr != nil {
			continue
		}

		perimeter := 2 * int(math.Min(math.Min(float64(length+width), float64(width+height)), float64(height+length)))
		volume := length * width * height

		totalRibbon = totalRibbon + perimeter + volume
		// fmt.Println(present)
	}

	return totalRibbon
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
	path := aoc_utils.GetFilePath(2015, 2, fileName)
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
		Day:      2,
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

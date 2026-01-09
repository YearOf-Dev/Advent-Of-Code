package main

import (
	"encoding/json"
	"fmt"
	"os"
	"regexp"
	"strings"
	"time"
	"yod_aoc/utils/go/aoc_utils"
)

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	count_code := 0
	count_memory := 0

	for _, item := range input {
		item = strings.TrimSpace(item)

		length := len(item)
		count_code += length

		item = item[1 : length-1]

		hex := regexp.MustCompile(`(\\x[a-f,0-9][a-f,0-9])`)
		item = hex.ReplaceAllString(item, "z")

		d_slash := regexp.MustCompile(`\\{2}`)
		item = d_slash.ReplaceAllString(item, "z")

		e_quote := regexp.MustCompile(`(\\\")`)
		item = e_quote.ReplaceAllString(item, "z")

		count_memory += len(item)
	}

	return count_code - count_memory
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
	count_original := 0
	count_new := 0

	for _, item := range input {
		original := strings.TrimSpace(item)

		if len(original) == 0 {
			continue
		}

		count_original += len(original)

		slashes := regexp.MustCompile(`\\`)
		encoded := slashes.ReplaceAllString(original, `\\`)

		quotes := regexp.MustCompile(`"`)
		encoded = quotes.ReplaceAllString(encoded, `\"`)

		encoded = `"` + encoded + `"`

		count_new += len(encoded)
	}

	return count_new - count_original
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
	path := aoc_utils.GetFilePath(2015, 8, fileName)
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
		Day:      8,
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

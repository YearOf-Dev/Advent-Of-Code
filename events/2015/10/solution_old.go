package alternative

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"time"
	"yod_aoc/utils/go/aoc_utils"
)

func countDigits(input string) string {
	output := ""

	count := 0
	lastDigit := ""
	for i := range input {
		if i == 0 {
			count = 1
			lastDigit = string(input[0])
			continue
		}

		digit := string(input[i])
		if digit == lastDigit {
			count += 1
			continue
		} else {
			output += strconv.Itoa(count) + string(lastDigit)
			count = 1
			lastDigit = string(digit)
		}
	}
	output += strconv.Itoa(count) + string(lastDigit)

	return output
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	lastIteration := input[0]

	for i := 0; i < 40; i++ {
		lastIteration = countDigits(lastIteration)
	}

	return len(lastIteration)
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
	lastIteration := input[0]

	for i := 0; i < 50; i++ {
		fmt.Println(i)
		lastIteration = countDigits(lastIteration)
	}

	return len(lastIteration)
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
	path := aoc_utils.GetFilePath(2015, 10, fileName)
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
		Day:      10,
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

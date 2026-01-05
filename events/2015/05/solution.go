package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"
	"yod_aoc/utils/go/aoc_utils"

	"strings"
)

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	min_vowels := 3
	min_doubles := 1
	naughty_strings := []string{"ab", "cd", "pq", "xy"}

	nice_strings := 0

	for i := 0; i < len(input); i++ {
		test_string := input[i]

		// Check for the naughty strings
		contains_naughty_strings := false
		for j := 0; j < len(naughty_strings); j++ {
			if strings.Contains(test_string, naughty_strings[j]) {
				contains_naughty_strings = true
				break
			}
		}
		if contains_naughty_strings {
			continue
		}

		// Check for vowels
		vowel_count := 0
		for _, v := range []string{"a", "e", "i", "o", "u"} {
			vowel_count += strings.Count(test_string, v)
		}
		if vowel_count < min_vowels {
			continue
		}

		// Check for double characters
		doubles := 0
		for j := 1; j < len(test_string); j++ {
			if test_string[j] == test_string[j-1] {
				doubles += 1
			}
		}
		if doubles < min_doubles {
			continue
		}

		nice_strings += 1
	}

	return nice_strings
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
	min_spaced_doubles := 1

	nice_strings := 0

	for i := 0; i < len(input); i++ {
		test_string := input[i]

		// Spaced Doubles
		spaced_doubles := 0
		for j := 2; j < len(test_string); j++ {
			if test_string[j] == test_string[j-2] {
				spaced_doubles += 1
			}
		}
		if spaced_doubles < min_spaced_doubles {
			continue
		}

		// Non overlapping repeating doubles
		repeating_doubles := false
		for j := 1; j < len(test_string); j++ {
			double_string := test_string[j-1 : j+1]
			instances := 0
			var last_instance int = -1

			for s := 1; s < len(test_string); s++ {
				if test_string[s-1] == double_string[0] && test_string[s] == double_string[1] && last_instance != s-1 {
					instances += 1
					last_instance = s
				}
			}
			if instances >= 2 {
				repeating_doubles = true
			}
		}

		if repeating_doubles {
			nice_strings += 1
		}
	}

	return nice_strings
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
	path := aoc_utils.GetFilePath(2015, 05, fileName)
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
		Day:      05,
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

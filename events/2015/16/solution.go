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

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	theSues := make(map[int]map[string]int)

	for i := 0; i < len(input); i++ {
		item := input[i]

		if len(item) == 0 {
			continue
		}

		firstSplitIndex := strings.Index(item, ":")
		sueID, _ := strconv.Atoi(item[4:firstSplitIndex])
		properties := strings.Split(item[firstSplitIndex+2:], ",")

		theSues[sueID] = make(map[string]int)
		theSues[sueID]["ID"] = sueID

		for i := range properties {
			propertyStart := 1
			if i == 0 {
				propertyStart = 0
			}
			parts := strings.Split(properties[i], ":")
			property := parts[0][propertyStart:]
			count, _ := strconv.Atoi(parts[1][1:])

			theSues[sueID][property] = count
		}
	}

	invalid_sues := []int{}
	knownProperties := make(map[string]int)
	knownProperties["children"] = 3
	knownProperties["cats"] = 7
	knownProperties["samoyeds"] = 2
	knownProperties["pomeranians"] = 3
	knownProperties["akitas"] = 0
	knownProperties["vizslas"] = 0
	knownProperties["goldfish"] = 5
	knownProperties["trees"] = 3
	knownProperties["cars"] = 2
	knownProperties["perfumes"] = 1

	for i := range theSues {
		sueToCheck := theSues[i]

		for j := range sueToCheck {
			if j == "ID" {
				continue
			}

			if sueToCheck[j] != knownProperties[j] {
				if !slices.Contains(invalid_sues, sueToCheck["ID"]) {
					invalid_sues = append(invalid_sues, sueToCheck["ID"])
				}
			}
		}
	}

	for i := range theSues {
		if !slices.Contains(invalid_sues, theSues[i]["ID"]) {
			return theSues[i]["ID"]
		}
	}

	return -1
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
	theSues := make(map[int]map[string]int)

	for i := 0; i < len(input); i++ {
		item := input[i]

		if len(item) == 0 {
			continue
		}

		firstSplitIndex := strings.Index(item, ":")
		sueID, _ := strconv.Atoi(item[4:firstSplitIndex])
		properties := strings.Split(item[firstSplitIndex+2:], ",")

		theSues[sueID] = make(map[string]int)
		theSues[sueID]["ID"] = sueID

		for i := range properties {
			propertyStart := 1
			if i == 0 {
				propertyStart = 0
			}
			parts := strings.Split(properties[i], ":")
			property := parts[0][propertyStart:]
			count, _ := strconv.Atoi(parts[1][1:])

			theSues[sueID][property] = count
		}
	}

	invalid_sues := []int{}
	knownProperties := make(map[string]int)
	knownProperties["children"] = 3
	knownProperties["cats"] = 7
	knownProperties["samoyeds"] = 2
	knownProperties["pomeranians"] = 3
	knownProperties["akitas"] = 0
	knownProperties["vizslas"] = 0
	knownProperties["goldfish"] = 5
	knownProperties["trees"] = 3
	knownProperties["cars"] = 2
	knownProperties["perfumes"] = 1

	for i := range theSues {
		sueToCheck := theSues[i]

		for j := range sueToCheck {
			if j == "ID" {
				continue
			}

			if j == "cats" || j == "trees" {
				if sueToCheck[j] <= knownProperties[j] {
					if !slices.Contains(invalid_sues, sueToCheck["ID"]) {
						invalid_sues = append(invalid_sues, sueToCheck["ID"])
					}
				}
			} else if j == "pomeranians" || j == "goldfish" {
				if sueToCheck[j] >= knownProperties[j] {
					if !slices.Contains(invalid_sues, sueToCheck["ID"]) {
						invalid_sues = append(invalid_sues, sueToCheck["ID"])
					}
				}
			} else {
				if sueToCheck[j] != knownProperties[j] {
					if !slices.Contains(invalid_sues, sueToCheck["ID"]) {
						invalid_sues = append(invalid_sues, sueToCheck["ID"])
					}
				}
			}
		}
	}

	for i := range theSues {
		if !slices.Contains(invalid_sues, theSues[i]["ID"]) {
			return theSues[i]["ID"]
		}
	}

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
	path := aoc_utils.GetFilePath(2015, 16, fileName)
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
		Day:      16,
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

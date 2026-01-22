package main

import (
	"encoding/json"
	"fmt"
	"math"
	"os"
	"slices"
	"strings"
	"time"
	"yod_aoc/utils/go/aoc_utils"
)

func findSubstitutes(medicine string, molecule string, replacement string) []string {
	medLen := len(medicine)
	molLen := len(molecule)

	if medLen < molLen {
		return []string{}
	}

	// newMedicine := ""
	foundMedicines := []string{}
	newMedicine := ""

	for i := range medLen - molLen + 1 {
		testPart := medicine[i : i+molLen]

		if molecule == testPart {
			new := newMedicine + replacement + medicine[i+molLen:]
			foundMedicines = append(foundMedicines, new)
		}
		newMedicine += medicine[i : i+1]
	}

	return foundMedicines
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	replacements := make(map[string][]string)
	foundMedicines := []string{}
	medicine := ""

	for index := range input {
		line := input[index]

		if len(line) == 0 {
			continue
		}

		if strings.Contains(line, " => ") {
			parts := strings.Split(line, " => ")

			if replacements[parts[0]] == nil {
				replacements[parts[0]] = []string{parts[1]}
			} else {
				replacements[parts[0]] = append(replacements[parts[0]], parts[1])
			}
		} else {
			medicine = line
		}
	}

	for molecule, value := range replacements {
		for i := range value {
			substitute := value[i]

			results := findSubstitutes(medicine, molecule, substitute)

			for _, res := range results {
				if !slices.Contains(foundMedicines, res) {
					foundMedicines = append(foundMedicines, res)
				}
			}
		}
	}

	return len(foundMedicines)
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func reverse(input string) string {
	asRune := []rune(input)

	for i, j := 0, len(asRune)-1; i < j; i, j = i+1, j-1 {
		asRune[i], asRune[j] = asRune[j], asRune[i]
	}

	result := string(asRune)
	return result
}

func part2(input []string) int {
	replacements := make(map[string]string)
	medicine := ""

	for index := range input {
		line := input[index]

		if len(line) == 0 {
			continue
		}

		if strings.Contains(line, " => ") {
			parts := strings.Split(line, " => ")

			replacements[reverse(parts[1])] = reverse(parts[0])
		} else {
			medicine = reverse(line)
		}
	}

	steps := 0

	for len(medicine) > 1 {
		bestIndex := math.MaxInt
		bestFrom := ""
		bestTo := ""

		for from, to := range replacements {
			index := strings.Index(medicine, from)

			if index != -1 && index < bestIndex {
				bestIndex = index
				bestFrom = from
				bestTo = to
			}
		}

		if bestFrom != "" {
			medicine = medicine[:bestIndex] + bestTo + medicine[bestIndex+len(bestFrom):]
			steps += 1
		} else {
			fmt.Println(fmt.Errorf("Stuck after %d steps", steps))
			return -1
		}
	}

	return steps
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
	path := aoc_utils.GetFilePath(2015, 19, fileName)
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
		Day:      19,
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

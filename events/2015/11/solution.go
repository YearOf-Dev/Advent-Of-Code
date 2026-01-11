package main

import (
	"encoding/json"
	"fmt"
	"os"
	"slices"
	"strings"
	"time"
	"yod_aoc/utils/go/aoc_utils"
)

func incrementPassword(password string) string {
	alphabet := []string{"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"}
	newPassword := password[0 : len(password)-1]

	lastCharacter := password[len(password)-1:]
	lastCharacterIndex := slices.Index(alphabet, lastCharacter)

	if len(password) == 1 {
		if lastCharacterIndex == 25 {
			return "a"
		} else {
			return alphabet[lastCharacterIndex+1]
		}
	}

	if lastCharacterIndex == 25 {
		return incrementPassword(newPassword) + "a"
	} else {
		return newPassword + alphabet[lastCharacterIndex+1]
	}
}

func isPasswordValid(password string) bool {
	alphabet := []string{"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"}

	if strings.Contains(password, "i") || strings.Contains(password, "o") || strings.Contains(password, "l") {
		return false
	}

	repeatingLetters := 0
	lastRepeatIndex := 0
	for i, _ := range password {
		if i == 0 {
			continue
		}
		if password[i:i+1] == password[i-1:i] {
			// Repeating letter
			if lastRepeatIndex == 0 {
				repeatingLetters += 1
				lastRepeatIndex = i
			} else if lastRepeatIndex == i-1 {
				continue
			} else {
				repeatingLetters += 1
				lastRepeatIndex = i
			}

		}
	}
	if repeatingLetters < 2 {
		return false
	}

	for i, _ := range password {
		currentCharacter := password[i : i+1]
		currentLetterIndex := slices.Index(alphabet, currentCharacter)

		if i < 2 {
			continue
		}

		if currentCharacter == "a" || currentCharacter == "b" {
			continue
		}

		if password[i-1:i] == alphabet[currentLetterIndex-1] && password[i-2:i-1] == alphabet[currentLetterIndex-2] {
			return true
		}
	}
	return false
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) string {
	currentPassword := input[0]
	nextPassword := currentPassword
	isValid := false

	for !isValid {
		nextPassword = incrementPassword(nextPassword)
		isValid = isPasswordValid(nextPassword)
	}

	return nextPassword
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) string {
	currentPassword := part1(input)
	nextPassword := currentPassword
	isValid := false

	for !isValid {
		nextPassword = incrementPassword(nextPassword)
		isValid = isPasswordValid(nextPassword)
	}

	return nextPassword
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
	path := aoc_utils.GetFilePath(2015, 11, fileName)
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
		Day:      11,
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

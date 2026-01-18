package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"time"
	"yod_aoc/utils/go/aoc_utils"
)

func countPermutations(containerSizes []int, target int) int {
	// Create array to track the number of ways to make any value between zero and the target
	waysToMakeSum := make([]int, target+1)
	// There is only one way to make a value of 0, use no containers!
	waysToMakeSum[0] = 1

	// Loop over each container
	for _, container := range containerSizes {
		// Traverse backwards to avoid using same container twice
		for i := target; i >= container; i-- {
			waysToMakeSum[i] += waysToMakeSum[i-container]
		}
	}

	return waysToMakeSum[target]
}

func countMinPermutations(containerSizes []int, target int) (int, int) {
	// First pass: find minimum containers needed
	maxInt := int(^uint(0) >> 1)
	minContainersNeeded := make([]int, target+1)
	for i := range minContainersNeeded {
		minContainersNeeded[i] = maxInt
	}
	minContainersNeeded[0] = 0

	for _, container := range containerSizes {
		for i := target; i >= container; i-- {
			if minContainersNeeded[i-container] != maxInt &&
				minContainersNeeded[i-container]+1 < minContainersNeeded[i] {
				minContainersNeeded[i] = minContainersNeeded[i-container] + 1
			}
		}
	}

	minContainers := minContainersNeeded[target]

	// Check if target is unreachable
	if minContainers == maxInt || minContainers < 0 || minContainers > target {
		return -1, 0 // or return 0, 0 depending on your preference
	}

	// Second pass: count permutations using exactly minContainers
	waysToMakeSumWithNContainers := make([][]int, target+1)
	for i := range waysToMakeSumWithNContainers {
		waysToMakeSumWithNContainers[i] = make([]int, minContainers+1)
	}
	waysToMakeSumWithNContainers[0][0] = 1

	for _, container := range containerSizes {
		for sum := target; sum >= container; sum-- {
			for numContainers := minContainers; numContainers >= 1; numContainers-- {
				waysToMakeSumWithNContainers[sum][numContainers] +=
					waysToMakeSumWithNContainers[sum-container][numContainers-1]
			}
		}
	}

	return minContainers, waysToMakeSumWithNContainers[target][minContainers]
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	containerSizes := []int{}
	total := 150

	for i := 0; i < len(input); i++ {
		if len(input[i]) == 0 {
			continue
		}

		num, _ := strconv.Atoi(input[i])
		containerSizes = append(containerSizes, num)
	}

	permutations := countPermutations(containerSizes, total)
	return permutations
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
	containerSizes := []int{}
	total := 150

	for i := 0; i < len(input); i++ {
		if len(input[i]) == 0 {
			continue
		}

		num, _ := strconv.Atoi(input[i])
		containerSizes = append(containerSizes, num)
	}

	_, permutations := countMinPermutations(containerSizes, total)
	return permutations
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
	path := aoc_utils.GetFilePath(2015, 17, fileName)
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
		Day:      17,
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

package main

import (
	"encoding/json"
	"fmt"
	"math"
	"os"
	"strconv"
	"time"
	"yod_aoc/utils/go/aoc_utils"
)

func elvesWhoVisited(house int) []int {
	elves := []int{1, house}

	house_sqrt := int(math.Floor(math.Sqrt(float64(house))))

	for i := 2; i < house_sqrt; i++ {
		if house%i == 0 {
			elves = append(elves, i)

			house_i := int(math.Floor(float64(house / i)))

			if i != house_i {
				elves = append(elves, house_i)
			}
		}
	}
	return elves
}

func elvesWhoVisitedLimited(house int, limit int) []int {
	elves := []int{}

	house_sqrt := int(math.Floor(math.Sqrt(float64(house))))

	if limit >= house {
		elves = append(elves, 1)
	}

	for i := 2; i < house_sqrt; i++ {
		if house%i == 0 {
			if i*limit >= house {
				elves = append(elves, i)
			}

			house_i := int(math.Floor(float64(house / i)))

			if i != house_i && house_i*limit >= house {
				elves = append(elves, house_i)
			}
		}
	}

	elves = append(elves, house)

	return elves
}

func sumArr(arr []int) int {
	sum := 0

	for _, v := range arr {
		sum += v
	}

	return sum
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	target, targetErr := strconv.Atoi(input[0])
	if targetErr != nil {
		panic("Unable to get Target Value from Input")
	}
	lastHouse := 0

	for true {
		elves := elvesWhoVisited(lastHouse + 1)
		sum := sumArr(elves) * 10
		if sum >= target {
			return lastHouse + 1
		}
		lastHouse += 1
	}

	return -1
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
	target, targetErr := strconv.Atoi(input[0])
	if targetErr != nil {
		panic("Unable to get Target Value from Input")
	}
	lastHouse := 0

	for true {
		elves := elvesWhoVisitedLimited(lastHouse+1, 50)
		sum := sumArr(elves) * 11
		if sum >= target {
			return lastHouse + 1
		}
		lastHouse += 1
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
	path := aoc_utils.GetFilePath(2015, 20, fileName)
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
		Day:      20,
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

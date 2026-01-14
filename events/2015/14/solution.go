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

type ReindeerStats struct {
	FlySpeed     int
	FlyDuration  int
	RestDuration int
	Points       int
}

func whoIsInTheLead(reindeers map[string]ReindeerStats, duration int) ([]string, int) {
	maxDistance := 0
	winningReindeer := []string{}

	for reindeer, stats := range reindeers {
		distance := 0
		distancePerBurst := stats.FlySpeed * stats.FlyDuration
		durationRemaining := duration
		fullPeriod := stats.FlyDuration + stats.RestDuration

		if duration < stats.FlyDuration {
			distance = stats.FlySpeed * duration
		} else {
			distance += distancePerBurst
			durationRemaining -= stats.FlyDuration

			potentialBursts := math.Floor(float64(durationRemaining) / float64(fullPeriod))
			distance += distancePerBurst * int(potentialBursts)

			timeAfterBursts := durationRemaining - (int(potentialBursts) * fullPeriod)
			if timeAfterBursts > stats.RestDuration {
				extraTime := timeAfterBursts - stats.RestDuration
				distance += extraTime * stats.FlySpeed
			}
		}

		if distance > maxDistance {
			maxDistance = distance
			winningReindeer = []string{reindeer}
		} else if distance == maxDistance {
			winningReindeer = append(winningReindeer, reindeer)
		}
	}

	return winningReindeer, maxDistance
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	duration := 2503
	reindeers := make(map[string]ReindeerStats)

	for i := 0; i < len(input); i++ {
		if len(input[i]) == 0 {
			continue
		}
		parts := strings.Split(input[i], " ")

		speed, speedErr := strconv.Atoi(parts[3])
		fdur, fdurErr := strconv.Atoi(parts[6])
		rdur, rdurErr := strconv.Atoi(parts[13])

		if speedErr != nil || fdurErr != nil || rdurErr != nil {
			panic("Error converting reindeer stats")
		}

		stats := ReindeerStats{
			FlySpeed:     speed,
			FlyDuration:  fdur,
			RestDuration: rdur,
		}

		reindeers[parts[0]] = stats
	}

	_, maxDistance := whoIsInTheLead(reindeers, duration)
	return maxDistance
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
	duration := 2503
	reindeers := make(map[string]ReindeerStats)

	for i := 0; i < len(input); i++ {
		if len(input[i]) == 0 {
			continue
		}
		parts := strings.Split(input[i], " ")

		speed, speedErr := strconv.Atoi(parts[3])
		fdur, fdurErr := strconv.Atoi(parts[6])
		rdur, rdurErr := strconv.Atoi(parts[13])

		if speedErr != nil || fdurErr != nil || rdurErr != nil {
			panic("Error converting reindeer stats")
		}

		stats := ReindeerStats{
			FlySpeed:     speed,
			FlyDuration:  fdur,
			RestDuration: rdur,
		}

		reindeers[parts[0]] = stats
	}

	for s := range duration {
		winners, _ := whoIsInTheLead(reindeers, s+1)

		for _, winner := range winners {
			if _, ok := reindeers[winner]; !ok {
				continue
			}

			stats := reindeers[winner]
			stats.Points += 1
			reindeers[winner] = stats
		}
	}

	maxPoints := 0
	for _, stats := range reindeers {
		if stats.Points > maxPoints {
			maxPoints = stats.Points
		}
	}

	return maxPoints
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
	path := aoc_utils.GetFilePath(2015, 14, fileName)
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
		Day:      14,
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

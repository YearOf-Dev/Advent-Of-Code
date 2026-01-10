package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
	"yod_aoc/utils/go/aoc_utils"
)

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func bestNextHop(distances map[string]int, visited map[string]bool) (string, int, map[string]bool) {
	nextHopName := ""
	nextHopDistance := int(^uint(0) >> 1)

	for place := range distances {
		if distances[place] < nextHopDistance && !visited[place] {
			nextHopName = place
			nextHopDistance = distances[place]
		}
	}

	visited[nextHopName] = true

	return nextHopName, nextHopDistance, visited
}

func bestRouteFor(distances map[string]map[string]int, startAt string) int {
	visited := make(map[string]bool)
	places_to_visit := 0
	for place := range distances {
		visited[place] = false
		places_to_visit += 1
	}
	visited[startAt] = true

	currentlyAt := startAt
	totalDistance := 0

	for range places_to_visit - 1 {
		addDistance := 0
		currentlyAt, addDistance, visited = bestNextHop(distances[currentlyAt], visited)
		totalDistance += addDistance
	}

	return totalDistance
}

func part1(input []string) int {
	distances := make(map[string]map[string]int)
	routes := make(map[string]int)

	for _, info := range input {
		split_input := strings.Split(info, " ")

		if len(split_input) < 5 {
			continue
		}

		from := split_input[0]
		destination := split_input[2]
		distance_raw := split_input[4]
		var distance int

		distance, ok := strconv.Atoi(distance_raw)

		if ok != nil {
			continue
		}

		if distances[from] == nil {
			distances[from] = make(map[string]int)
		}
		if distances[destination] == nil {
			distances[destination] = make(map[string]int)
		}

		distances[from][destination] = distance
		distances[destination][from] = distance
	}

	shortestRoute := int(^uint(0) >> 1)
	for place := range distances {
		routes[place] = bestRouteFor(distances, place)

		if routes[place] < shortestRoute {
			shortestRoute = routes[place]
		}
	}

	return shortestRoute
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func worstNextHop(distances map[string]int, visited map[string]bool) (string, int, map[string]bool) {
	nextHopName := ""
	nextHopDistance := 0

	for place := range distances {
		if distances[place] > nextHopDistance && !visited[place] {
			nextHopName = place
			nextHopDistance = distances[place]
		}
	}

	visited[nextHopName] = true

	return nextHopName, nextHopDistance, visited
}

func worstRouteFor(distances map[string]map[string]int, startAt string) int {
	visited := make(map[string]bool)
	places_to_visit := 0
	for place := range distances {
		visited[place] = false
		places_to_visit += 1
	}
	visited[startAt] = true

	currentlyAt := startAt
	totalDistance := 0

	for range places_to_visit - 1 {
		addDistance := 0
		currentlyAt, addDistance, visited = worstNextHop(distances[currentlyAt], visited)
		totalDistance += addDistance
	}

	return totalDistance
}

func part2(input []string) int {
	distances := make(map[string]map[string]int)
	routes := make(map[string]int)

	for _, info := range input {
		split_input := strings.Split(info, " ")

		if len(split_input) < 5 {
			continue
		}

		from := split_input[0]
		destination := split_input[2]
		distance_raw := split_input[4]
		var distance int

		distance, ok := strconv.Atoi(distance_raw)

		if ok != nil {
			continue
		}

		if distances[from] == nil {
			distances[from] = make(map[string]int)
		}
		if distances[destination] == nil {
			distances[destination] = make(map[string]int)
		}

		distances[from][destination] = distance
		distances[destination][from] = distance
	}

	longestRoute := 0
	for place := range distances {
		routes[place] = worstRouteFor(distances, place)

		if routes[place] > longestRoute {
			longestRoute = routes[place]
		}
	}

	return longestRoute
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
	path := aoc_utils.GetFilePath(2015, 9, fileName)
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
		Day:      9,
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

package main

import (
	"encoding/json"
	"fmt"
	"os"
	"reflect"
	"strconv"
	"strings"
	"time"
	"yod_aoc/utils/go/aoc_utils"
)

func update_connections(connections map[string]interface{}) map[string]interface{} {
	for wire, command := range connections {
		if reflect.TypeOf(command).String() == "uint16" {
			continue
		}

		if len(command.([]interface{})) == 1 {
			new_command, ok := command.([]interface{})[0].(string)

			if ok {
				num, err := strconv.ParseUint(new_command, 10, 16)
				if err == nil {
					connections[wire] = uint16(num)
				}
			}
		}
	}

	return connections
}

func solve_connection(connections map[string]interface{}, wire string) (uint16, map[string]interface{}) {
	connections = update_connections(connections)
	wc, exists := connections[wire]

	if !exists {
		return 0, connections
	}

	wcType := reflect.TypeOf(wc).String()

	if wcType == "uint16" {
		return wc.(uint16), connections
	}

	length := len(wc.([]interface{}))

	if reflect.TypeOf(wc).String() == "uint16" {
		return wc.(uint16), connections
	}

	if length == 1 {

		val := wc.([]interface{})[0]

		if num, ok := val.(uint16); ok {
			connections[wire] = num
			return num, connections
		}

		if str, ok := val.(string); ok {
			if num, err := strconv.ParseUint(str, 10, 16); err == nil {
				result := uint16(num)
				connections[wire] = result
				return result, connections
			}

			result, connections := solve_connection(connections, str)
			connections[wire] = result
			return result, connections
		}
	} else if length == 2 {
		nv := wc.([]interface{})[1]

		nv_num, ok := nv.(uint16)
		if !ok {
			nvStr, isStr := nv.(string)
			if isStr {
				num, err := strconv.ParseUint(nvStr, 10, 16)
				if err == nil {
					nv_num = uint16(num)
					ok = true
				}
			}

			if !ok {
				nv_num, connections = solve_connection(connections, nv.(string))
			}
		}

		ans := uint16(^nv_num)
		connections[wire] = ans
		return ans, connections
	} else if length == 3 {
		op := wc.([]interface{})[1].(string)

		a := wc.([]interface{})[0]
		b := wc.([]interface{})[2]

		a_num, a_ok := a.(uint16)
		b_num, b_ok := b.(uint16)

		if !a_ok {
			aStr, isStr := a.(string)

			if isStr {
				num, err := strconv.ParseUint(aStr, 10, 16)
				if err == nil {
					a_num = uint16(num)
					a_ok = true
				}
			}

			if !a_ok {
				a_num, connections = solve_connection(connections, a.(string))
			}
		} else {
			a = a_num
		}

		if !b_ok {
			bStr, isStr := b.(string)

			if isStr {
				num, err := strconv.ParseUint(bStr, 10, 16)
				if err == nil {
					b_num = uint16(num)
					b_ok = true
				}
			}

			if !b_ok {
				b_num, connections = solve_connection(connections, b.(string))
			}
		} else {
			b = b_num
		}

		if op == "AND" {
			ans := uint16(a_num & b_num)
			connections[wire] = ans
			return ans, connections
		} else if op == "OR" {
			ans := uint16(a_num | b_num)
			connections[wire] = ans
			return ans, connections
		} else if op == "LSHIFT" {
			ans := uint16(a_num << b_num)
			connections[wire] = ans
			return ans, connections
		} else if op == "RSHIFT" {
			ans := uint16(a_num >> b_num)
			connections[wire] = ans
			return ans, connections
		}
	}

	return 0, connections
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) uint16 {
	connections := make(map[string]interface{})

	for _, command := range input {
		destination := strings.TrimSpace(strings.Split(command, "->")[1])
		instruction := strings.Split(strings.TrimSpace(strings.Split(command, "->")[0]), " ")

		// Convert instructions from []string to []interface{}
		new_instruction := make([]interface{}, len(instruction))
		for i, v := range instruction {
			new_instruction[i] = v
		}

		connections[destination] = new_instruction
	}

	ans := uint16(0)
	ans, connections = solve_connection(connections, "a")

	return ans
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) uint16 {
	b := part1(input)
	connections := make(map[string]interface{})

	for _, command := range input {
		destination := strings.TrimSpace(strings.Split(command, "->")[1])
		instruction := strings.Split(strings.TrimSpace(strings.Split(command, "->")[0]), " ")

		// Convert instructions from []string to []interface{}
		new_instruction := make([]interface{}, len(instruction))
		for i, v := range instruction {
			new_instruction[i] = v
		}

		connections[destination] = new_instruction
	}
	connections["b"] = b

	ans := uint16(0)
	ans, connections = solve_connection(connections, "a")

	return ans
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
	path := aoc_utils.GetFilePath(2015, 07, fileName)
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
		Day:      07,
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

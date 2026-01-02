package aoc_utils

import (
	"os"
	"bufio"
	"runtime"
	"path/filepath"
	"strconv"
)

func ReadInputAsArray(filePath string) ([]string, error) {
	// Open the file
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	// Set up the output array and scanner
	var lines []string
	scanner := bufio.NewScanner(file)

	// Read the file line by line
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	// Check for any errors
	if scanErr := scanner.Err(); scanErr != nil {
		return nil, scanErr
	}

	// Return the lines
	return lines, nil
}

func GetFilePath(year int, day int, file string) string {
	// Get the filePaths for key directories
	_, filename, _, _ := runtime.Caller(0)
	utilsDir := filepath.Dir(filename)
	rootDir := filepath.Dir(filepath.Dir(filepath.Dir(utilsDir)))
	eventDir := filepath.Join(rootDir, "events")

	// Construct the full file path
	dayStr := strconv.Itoa(day)
	if day < 10 {
		dayStr = "0" + dayStr
	}
	return filepath.Join(eventDir, strconv.Itoa(year), dayStr, file)
}
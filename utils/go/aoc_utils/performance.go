package aoc_utils

import (
	"time"
)

func MeasurePerformance(fn func() interface{}) AOCPartResult {

	// Run the Function and time it
	startTime := time.Now()
	result := fn()
	endTime := time.Now()

	// Calculate the Duration
	duration := endTime.Sub(startTime)

	// Return the Result
	return AOCPartResult{
		Result: result,
		ExecutionTime: duration.Nanoseconds(),
		Timestamp: AOCTimestamp{
			Start: startTime.Format(time.RFC3339),
			End: endTime.Format(time.RFC3339),
		},
	}
}
package aoc_utils

type AOCPartResult struct {
	Result any
	ExecutionTime int64
	Timestamp AOCTimestamp
}

type AOCTimestamp struct {
	Start string
	End string
}

type AOCDayResults struct {
	Year int
	Day int
	Part1 AOCPartResult
	Part2 AOCPartResult
	Duration int64
	Timestamp struct {
		Start string
		End string
	}
}
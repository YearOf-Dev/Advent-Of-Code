export type AOCTimestamp = {
  Start: string;
  End: string;
};

export type AOCPartResult = {
  Result: any;
  ExecutionTime: number;
  Timestamp: AOCTimestamp;
};

export type AOCDayResults = {
  Year: number;
  Day: number;
  Part1: AOCPartResult;
  Part2: AOCPartResult;
  Duration: number;
  Timestamp: AOCTimestamp;
};
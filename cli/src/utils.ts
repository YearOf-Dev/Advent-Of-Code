export type TimeStamp = {
  Start: string;
  End: string;
};

export type PartResult = {
  Result: any;
  ExecutionTime: number;
  Timestamp: TimeStamp;
};

export type SingleRunResult = {
  Part1: PartResult;
  Part2: PartResult;
  Duration: number;
  Timestamp: TimeStamp;
};

export type MultipleRunResults = {
  Language: string;
  TotalRuns: number;
  TimeStats: TimeStats;
  Results: Results;
  Timestamp: TimeStamp;
  Runs: SingleRunResult[];
}

export type Results = {
  Part1: any;
  Part2: any;
}

export type TimeStats = {
  Run: ExecTimeStats;
  Part1: ExecTimeStats;
  Part2: ExecTimeStats;

}

export type ExecTimeStats = {
  Fastest: number;
  Slowest: number;
  Average: number;
}

export type ChallengeResults = {
  Timestamp: TimeStamp;
  Winners: {
    Overall: string;
    Part1: string;
    Part2: string;
  };
  Losers: {
    Overall: string;
    Part1: string;
    Part2: string;
  };
  Typescript: MultipleRunResults | undefined;
  Go: MultipleRunResults | undefined;
  Python: MultipleRunResults | undefined;
  Rust: MultipleRunResults | undefined;
}

export type ResultsFile = {
  [year: string]: {
    [day: string]: ChallengeResults;
  };
}
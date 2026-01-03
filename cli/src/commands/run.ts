import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import type { ChallengeResults, MultipleRunResults, ResultsFile, SingleRunResult } from '../utils';


export function addCommand_run(program: Command) {
  program
    .command('run')
    .description('Run a solution for a given day')
    .argument('<year>', 'The year of the Advent of Code event')
    .argument('<day>', 'The day of the Advent of Code event')
    .option('-l, --location <location>', 'The location of the Advent of Code events', 'events')
    .option('-i, --input <input>', 'The input file to use', 'input.txt')
    .option('-s, --solution <solution>', 'The solution to run', 'ts')
    .option('-m, --multiple <multiple>', 'Run the solution multiple times', '1')
    .option('-n, --no-auto-prepend-input', 'Disable Auto prepending the input file to the solution', false)
    .action((year: string, day: string, options: { location: string, input: string, solution: string, multiple: string, noAutoPrependInput: boolean }) => {
      console.log('✨ Running a solution for a given day...');

      // Ensure the day is two digits long
      if (day.length < 2) {
        day = '0' + day;
      }

      // Ensure the year is four digits long
      if (year.length < 4) {
        year = '20' + year;
      }

      // Prepend the input file
      let inputFile = path.join(options.location, year, day, options.input);
      if (options.noAutoPrependInput) {
        inputFile = options.input;
      }

      // Check the solution exists
      if (!fs.existsSync(path.join(options.location, year, day, `solution.${options.solution}`))) {
        console.error(`    🚨 Solution ${options.solution} ${chalk.red('does not')} exist...`);
        process.exit(1);
      }

      // Run it!
      let results: MultipleRunResults | undefined = undefined;

      if (options.solution === 'ts') {
        results = runSolution_TS(path.join(options.location, year, day, `solution.${options.solution}`), inputFile, parseInt(options.multiple));
      } else if (options.solution === 'go') {
        results = runSolution_Go(path.join(options.location, year, day, `solution.${options.solution}`), options.input, parseInt(options.multiple));
      } else if (options.solution === 'py') {
        results = runSolution_Py(path.join(options.location, year, day, `solution.${options.solution}`), inputFile, parseInt(options.multiple));
      } else if (options.solution === 'rs') {
        results = runSolution_Rs(path.join(options.location, year, day, 'Cargo.toml'), inputFile, parseInt(options.multiple));
      }

      if (results !== undefined) {
        console.log(JSON.stringify(results, null, 2));
        process.exit(0);
      } else {
        console.error(`    🚨 Solution ${options.solution} ${chalk.red('failed to run')}...`);
        process.exit(1);
      }
     
    });
}

export function addCommand_runAll(program: Command) {
  program
    .command('run-all')
    .description('Run a solution for a given day')
    .argument('<year>', 'The year of the Advent of Code event')
    .argument('<day>', 'The day of the Advent of Code event')
    .option('-l, --location <location>', 'The location of the Advent of Code events', 'events')
    .option('-i, --input <input>', 'The input file to use', 'input.txt')
    .option('-m, --multiple <multiple>', 'Run the solution multiple times', '5')
    .option('-n, --no-auto-prepend-input', 'Disable Auto prepending the input file to the solution', false)
    .option('-r, --results <results>', 'The results file to use', 'results.json')
    .option('-d, --dry-run', 'Dry run the solution', false)
    .action((year: string, day: string, options: { location: string, input: string, multiple: string, noAutoPrependInput: boolean, results: string, dryRun: boolean }) => {
      console.log('✨ Running all solutions for a given day...');
      console.log(`    [Results]: ${options.dryRun ? chalk.yellow('Ignored') : chalk.green('Saved to')} ${options.results}...`);

      // Ensure the day is two digits long
      if (day.length < 2) {
        day = '0' + day;
      }

      // Ensure the year is four digits long
      if (year.length < 4) {
        year = '20' + year;
      }

      // Prepend the input file
      let inputFile = path.join(options.location, year, day, options.input);
      if (options.noAutoPrependInput) {
        inputFile = options.input;
      }

      // Overview of all solution results
      let challengeResults: ChallengeResults = {
        Timestamp: {
          Start: new Date().toISOString(),
          End: new Date().toISOString(),
        },
        Winners: {
          Overall: '',
          Part1: '',
          Part2: '',
        },
        Losers: {
          Overall: '',
          Part1: '',
          Part2: '',
        },
        Typescript: undefined,
        Go: undefined,
        Python: undefined,
        Rust: undefined,
      };

      let solutions = ['ts', 'go', 'py', 'rs'];

      for (let solution of solutions) {
        // Check the solution exists
        if (!fs.existsSync(path.join(options.location, year, day, `solution.${solution}`))) {
          console.error(`    🚨 Solution ${solution} ${chalk.red('does not')} exist...`);
          process.exit(1);
        }

        // Run it!
        let results: MultipleRunResults | undefined = undefined;

        if (solution === 'ts') {
          results = runSolution_TS(path.join(options.location, year, day, `solution.${solution}`), inputFile, parseInt(options.multiple));
        } else if (solution === 'go') {
          results = runSolution_Go(path.join(options.location, year, day, `solution.${solution}`), options.input, parseInt(options.multiple));
        } else if (solution === 'py') {
          results = runSolution_Py(path.join(options.location, year, day, `solution.${solution}`), inputFile, parseInt(options.multiple));
        } else if (solution === 'rs') {
          results = runSolution_Rs(path.join(options.location, year, day, 'Cargo.toml'), inputFile, parseInt(options.multiple));
        }

        if (results === undefined) {
          console.error(`    🚨 Solution ${solution} ${chalk.red('failed to run')}, Aborting...`);
          process.exit(1);
        }

        switch (solution) {
          case 'ts':
            challengeResults.Typescript = results;
            break;
          case 'go':
            challengeResults.Go = results;
            break;
          case 'py':
            challengeResults.Python = results;
            break;
          case 'rs':
            challengeResults.Rust = results;
            break;
        }
      }

      // Perform the final calculations
      challengeResults.Timestamp.End = new Date().toISOString();

      challengeResults.Winners.Overall = pickWinner(challengeResults.Typescript?.TimeStats.Run.Average ?? 0, challengeResults.Go?.TimeStats.Run.Average ?? 0, challengeResults.Python?.TimeStats.Run.Average ?? 0, challengeResults.Rust?.TimeStats.Run.Average ?? 0);
      challengeResults.Losers.Overall = pickLoser(challengeResults.Typescript?.TimeStats.Run.Average ?? 0, challengeResults.Go?.TimeStats.Run.Average ?? 0, challengeResults.Python?.TimeStats.Run.Average ?? 0, challengeResults.Rust?.TimeStats.Run.Average ?? 0);
      challengeResults.Winners.Part1 = pickWinner(challengeResults.Typescript?.TimeStats.Part1.Average ?? 0, challengeResults.Go?.TimeStats.Part1.Average ?? 0, challengeResults.Python?.TimeStats.Part1.Average ?? 0, challengeResults.Rust?.TimeStats.Part1.Average ?? 0);
      challengeResults.Losers.Part1 = pickLoser(challengeResults.Typescript?.TimeStats.Part1.Average ?? 0, challengeResults.Go?.TimeStats.Part1.Average ?? 0, challengeResults.Python?.TimeStats.Part1.Average ?? 0, challengeResults.Rust?.TimeStats.Part1.Average ?? 0);
      challengeResults.Winners.Part2 = pickWinner(challengeResults.Typescript?.TimeStats.Part2.Average ?? 0, challengeResults.Go?.TimeStats.Part2.Average ?? 0, challengeResults.Python?.TimeStats.Part2.Average ?? 0, challengeResults.Rust?.TimeStats.Part2.Average ?? 0);
      challengeResults.Losers.Part2 = pickLoser(challengeResults.Typescript?.TimeStats.Part2.Average ?? 0, challengeResults.Go?.TimeStats.Part2.Average ?? 0, challengeResults.Python?.TimeStats.Part2.Average ?? 0, challengeResults.Rust?.TimeStats.Part2.Average ?? 0);

      // Is it a dry run?
      if (options.dryRun) {
        console.log(JSON.stringify(challengeResults, null, 2));
        return;
      }
      
      // Read the existing results
      let existingResults: ResultsFile | undefined = undefined;
      if (fs.existsSync(options.results)) {
        existingResults = JSON.parse(fs.readFileSync(options.results, 'utf8'));
      }

      // Merge or add our new results to the existing results
      if (existingResults !== undefined) {
        if (existingResults[year] === undefined) {
          existingResults[year] = {};
        }
        existingResults[year][day] = challengeResults;
      } else {
        existingResults = {
          [year]: {
            [day]: challengeResults,
          },
        };
      }

      // Save the results
      fs.writeFileSync(options.results, JSON.stringify(existingResults, null, 2));
      console.log(`    ✅ Results saved to ${options.results}...`);

     
    });
}

function pickWinner(ts: number, go: number, py: number, rs: number) {
  let Winner: string = 'Typescript';
  let WinningTime: number = ts;

  if (go < WinningTime) {
    Winner = 'Go';
    WinningTime = go;
  }

  if (py < WinningTime) {
    Winner = 'Python';
    WinningTime = py;
  }

  if (rs < WinningTime) {
    Winner = 'Rust';
    WinningTime = rs;
  }

  return Winner;
}

function pickLoser(ts: number, go: number, py: number, rs: number) {
  let Loser: string = 'Typescript';
  let LosingTime: number = ts;

  if (go > LosingTime) {
    Loser = 'Go';
    LosingTime = go;
  }

  if (py > LosingTime) {
    Loser = 'Python';
    LosingTime = py;
  }

  if (rs > LosingTime) {
    Loser = 'Rust';
    LosingTime = rs;
  }

  return Loser;
}

function parseResult(stdout: Buffer) {

  // Parse the result
  const rawResult = JSON.parse(stdout.toString());

  const result: SingleRunResult = {
    Part1: {
      Result: rawResult.Part1.Result,
      ExecutionTime: rawResult.Part1.ExecutionTime,
      Timestamp: rawResult.Part1.Timestamp,
    },
    Part2: {
      Result: rawResult.Part2.Result,
      ExecutionTime: rawResult.Part2.ExecutionTime,
      Timestamp: rawResult.Part2.Timestamp,
    },
    Duration: rawResult.Duration,
    Timestamp: rawResult.Timestamp,
  };

  return result;
}

function runSolution_TS(path: string, input: string, multiplier: number) {
  let results: MultipleRunResults = {
    Language: 'TypeScript',
    TotalRuns: multiplier,
    TimeStats: {
      Run: {
        Fastest: 0,
        Slowest: 0,
        Average: 0,
      },
      Part1: {
        Fastest: 0,
        Slowest: 0,
        Average: 0,
      },
      Part2: {
        Fastest: 0,
        Slowest: 0,
        Average: 0,
      },
    },
    Results: {
      Part1: undefined,
      Part2: undefined,
    },
    Timestamp: {
      Start: new Date().toISOString(),
      End: new Date().toISOString(),
    },
    Runs: [] as SingleRunResult[],
  };

  // Set up some running totals
  let runTotal = 0;
  let part1Total = 0;
  let part2Total = 0;

  for (let i = 0; i < multiplier; i++) {
    console.log(`🔄 Running TypeScript Solution ${i + 1} of ${multiplier}...`);
    let stdout = execSync(`tsx ${path} ${input}`);
    let result = parseResult(stdout);

    // Add the Result to our runs
    results.Runs.push(result);

    // Update the time stats
    runTotal += result.Duration;
    part1Total += result.Part1.ExecutionTime;
    part2Total += result.Part2.ExecutionTime;

    // Update the time stats
    results.TimeStats.Run.Fastest = results.TimeStats.Run.Fastest === 0 ? result.Duration : Math.min(results.TimeStats.Run.Fastest, result.Duration);
    results.TimeStats.Run.Slowest = Math.max(results.TimeStats.Run.Slowest, result.Duration);
    results.TimeStats.Part1.Fastest = results.TimeStats.Part1.Fastest === 0 ? result.Part1.ExecutionTime : Math.min(results.TimeStats.Part1.Fastest, result.Part1.ExecutionTime);
    results.TimeStats.Part1.Slowest = Math.max(results.TimeStats.Part1.Slowest, result.Part1.ExecutionTime);
    results.TimeStats.Part2.Fastest = results.TimeStats.Part2.Fastest === 0 ? result.Part2.ExecutionTime : Math.min(results.TimeStats.Part2.Fastest, result.Part2.ExecutionTime);
    results.TimeStats.Part2.Slowest = Math.max(results.TimeStats.Part2.Slowest, result.Part2.ExecutionTime);

    // Update the results
    results.Results.Part1 = result.Part1.Result;
    results.Results.Part2 = result.Part2.Result;
  }

  // Calculate the average times
  results.TimeStats.Run.Average = runTotal / multiplier;
  results.TimeStats.Part1.Average = part1Total / multiplier;
  results.TimeStats.Part2.Average = part2Total / multiplier;

  // Update the timestamp
  results.Timestamp.End = new Date().toISOString();

  return results;
}

function runSolution_Go(path: string, input: string, multiplier: number) {
  let results: MultipleRunResults = {
    Language: 'Go',
    TotalRuns: multiplier,
    TimeStats: {
      Run: {
        Fastest: 0,
        Slowest: 0,
        Average: 0,
      },
      Part1: {
        Fastest: 0,
        Slowest: 0,
        Average: 0,
      },
      Part2: {
        Fastest: 0,
        Slowest: 0,
        Average: 0,
      },
    },
    Results: {
      Part1: undefined,
      Part2: undefined,
    },
    Timestamp: {
      Start: new Date().toISOString(),
      End: new Date().toISOString(),
    },
    Runs: [] as SingleRunResult[],
  };

  // Set up some running totals
  let runTotal = 0;
  let part1Total = 0;
  let part2Total = 0;

  for (let i = 0; i < multiplier; i++) {
    console.log(`🔄 Running Go Solution ${i + 1} of ${multiplier}...`);
    let stdout = execSync(`go run ${path} ${input}`);
    let result = parseResult(stdout);

    // Add the Result to our runs
    results.Runs.push(result);

    // Update the time stats
    runTotal += result.Duration;
    part1Total += result.Part1.ExecutionTime;
    part2Total += result.Part2.ExecutionTime;

    // Update the time stats
    results.TimeStats.Run.Fastest = results.TimeStats.Run.Fastest === 0 ? result.Duration : Math.min(results.TimeStats.Run.Fastest, result.Duration);
    results.TimeStats.Run.Slowest = Math.max(results.TimeStats.Run.Slowest, result.Duration);
    results.TimeStats.Part1.Fastest = results.TimeStats.Part1.Fastest === 0 ? result.Part1.ExecutionTime : Math.min(results.TimeStats.Part1.Fastest, result.Part1.ExecutionTime);
    results.TimeStats.Part1.Slowest = Math.max(results.TimeStats.Part1.Slowest, result.Part1.ExecutionTime);
    results.TimeStats.Part2.Fastest = results.TimeStats.Part2.Fastest === 0 ? result.Part2.ExecutionTime : Math.min(results.TimeStats.Part2.Fastest, result.Part2.ExecutionTime);
    results.TimeStats.Part2.Slowest = Math.max(results.TimeStats.Part2.Slowest, result.Part2.ExecutionTime);

    // Update the results
    results.Results.Part1 = result.Part1.Result;
    results.Results.Part2 = result.Part2.Result;
  }

  // Calculate the average times
  results.TimeStats.Run.Average = runTotal / multiplier;
  results.TimeStats.Part1.Average = part1Total / multiplier;
  results.TimeStats.Part2.Average = part2Total / multiplier;

  // Update the timestamp
  results.Timestamp.End = new Date().toISOString();

  return results;
}

function runSolution_Py(path: string, input: string, multiplier: number) {
  let results: MultipleRunResults = {
    Language: 'Python',
    TotalRuns: multiplier,
    TimeStats: {
      Run: {
        Fastest: 0,
        Slowest: 0,
        Average: 0,
      },
      Part1: {
        Fastest: 0,
        Slowest: 0,
        Average: 0,
      },
      Part2: {
        Fastest: 0,
        Slowest: 0,
        Average: 0,
      },
    },
    Results: {
      Part1: undefined,
      Part2: undefined,
    },
    Timestamp: {
      Start: new Date().toISOString(),
      End: new Date().toISOString(),
    },
    Runs: [] as SingleRunResult[],
  };

  // Set up some running totals
  let runTotal = 0;
  let part1Total = 0;
  let part2Total = 0;

  for (let i = 0; i < multiplier; i++) {
    console.log(`🔄 Running Python Solution ${i + 1} of ${multiplier}...`);
    let stdout = execSync(`python3 ${path} ${input}`);
    let result = parseResult(stdout);

    // Add the Result to our runs
    results.Runs.push(result);

    // Update the time stats
    runTotal += result.Duration;
    part1Total += result.Part1.ExecutionTime;
    part2Total += result.Part2.ExecutionTime;

    // Update the time stats
    results.TimeStats.Run.Fastest = results.TimeStats.Run.Fastest === 0 ? result.Duration : Math.min(results.TimeStats.Run.Fastest, result.Duration);
    results.TimeStats.Run.Slowest = Math.max(results.TimeStats.Run.Slowest, result.Duration);
    results.TimeStats.Part1.Fastest = results.TimeStats.Part1.Fastest === 0 ? result.Part1.ExecutionTime : Math.min(results.TimeStats.Part1.Fastest, result.Part1.ExecutionTime);
    results.TimeStats.Part1.Slowest = Math.max(results.TimeStats.Part1.Slowest, result.Part1.ExecutionTime);
    results.TimeStats.Part2.Fastest = results.TimeStats.Part2.Fastest === 0 ? result.Part2.ExecutionTime : Math.min(results.TimeStats.Part2.Fastest, result.Part2.ExecutionTime);
    results.TimeStats.Part2.Slowest = Math.max(results.TimeStats.Part2.Slowest, result.Part2.ExecutionTime);

    // Update the results
    results.Results.Part1 = result.Part1.Result;
    results.Results.Part2 = result.Part2.Result;
  }

  // Calculate the average times
  results.TimeStats.Run.Average = runTotal / multiplier;
  results.TimeStats.Part1.Average = part1Total / multiplier;
  results.TimeStats.Part2.Average = part2Total / multiplier;

  // Update the timestamp
  results.Timestamp.End = new Date().toISOString();

  return results;
}

function runSolution_Rs(path: string, input: string, multiplier: number) {
  let results: MultipleRunResults = {
    Language: 'Rust',
    TotalRuns: multiplier,
    TimeStats: {
      Run: {
        Fastest: 0,
        Slowest: 0,
        Average: 0,
      },
      Part1: {
        Fastest: 0,
        Slowest: 0,
        Average: 0,
      },
      Part2: {
        Fastest: 0,
        Slowest: 0,
        Average: 0,
      },
    },
    Results: {
      Part1: undefined,
      Part2: undefined,
    },
    Timestamp: {
      Start: new Date().toISOString(),
      End: new Date().toISOString(),
    },
    Runs: [] as SingleRunResult[],
  };

  // Set up some running totals
  let runTotal = 0;
  let part1Total = 0;
  let part2Total = 0;

  for (let i = 0; i < multiplier; i++) {
    console.log(`🔄 Running Rust Solution ${i + 1} of ${multiplier}...`);
    let stdout = execSync(`cargo run --manifest-path ${path} --bin solution ${input}`);
    let result = parseResult(stdout);

    // Add the Result to our runs
    results.Runs.push(result);

    // Update the time stats
    runTotal += result.Duration;
    part1Total += result.Part1.ExecutionTime;
    part2Total += result.Part2.ExecutionTime;

    // Update the time stats
    results.TimeStats.Run.Fastest = results.TimeStats.Run.Fastest === 0 ? result.Duration : Math.min(results.TimeStats.Run.Fastest, result.Duration);
    results.TimeStats.Run.Slowest = Math.max(results.TimeStats.Run.Slowest, result.Duration);
    results.TimeStats.Part1.Fastest = results.TimeStats.Part1.Fastest === 0 ? result.Part1.ExecutionTime : Math.min(results.TimeStats.Part1.Fastest, result.Part1.ExecutionTime);
    results.TimeStats.Part1.Slowest = Math.max(results.TimeStats.Part1.Slowest, result.Part1.ExecutionTime);
    results.TimeStats.Part2.Fastest = results.TimeStats.Part2.Fastest === 0 ? result.Part2.ExecutionTime : Math.min(results.TimeStats.Part2.Fastest, result.Part2.ExecutionTime);
    results.TimeStats.Part2.Slowest = Math.max(results.TimeStats.Part2.Slowest, result.Part2.ExecutionTime);

    // Update the results
    results.Results.Part1 = result.Part1.Result;
    results.Results.Part2 = result.Part2.Result;
  }

  // Calculate the average times
  results.TimeStats.Run.Average = runTotal / multiplier;
  results.TimeStats.Part1.Average = part1Total / multiplier;
  results.TimeStats.Part2.Average = part2Total / multiplier;

  // Update the timestamp
  results.Timestamp.End = new Date().toISOString();

  return results;
}
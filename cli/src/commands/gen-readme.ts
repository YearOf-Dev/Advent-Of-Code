import chalk from "chalk";
import { Command } from "commander";
import fs from 'node:fs';
import path from 'node:path';


export function addCommand_genReadme(program: Command) {
  const genReadme = program
    .command('gen-readme')
    .description('Generate a README.md file')
    .action(() => {
      console.log(`✨ Generating a README.md file...`);
    });

  // Year Subcommand
  genReadme
    .command('year')
    .description('Generate a README.md file for a given year')
    .argument('<year>', 'The year of the Advent of Code event')
    .option('-l, --location <location>', 'The location of the Advent of Code events', 'events')
    .option('-r, --results <results>', 'The results file to use', 'results.json')
    .action((year: string, options: { location: string, results: string }) => {
      console.log(`✨ ${chalk.yellow('Year Readme Generation not yet implemented...')}`);
    });

  // Day Subcommand
  genReadme
    .command('day')
    .description('Generate a README.md file for a given day')
    .argument('<year>', 'The year of the Advent of Code event')
    .argument('<day>', 'The day of the Advent of Code event')
    .argument('<publishYear>', 'The year of the YearOf.Dev write up')
    .argument('<publishMonth>', 'The month of the YearOf.Dev write up')
    .argument('<publishDay>', 'The day of the YearOf.Dev write up')
    .option('-l, --location <location>', 'The location of the Advent of Code events', 'events')
    .option('-r, --results <results>', 'The results file to use', 'results.json')
    .action((year: string, day: string, publishYear: string, publishMonth: string, publishDay: string, options: { location: string, results: string }) => {
      console.log(`✨ Generating a README.md file for ${year} day ${day}...`);
      console.log(`    [Results]: ${options.results}...`);

      // Ensure the day is two digits long
      let dayNumber = parseInt(day)
      if (day.length < 2) {
        day = '0' + day;
      }

      // Ensure the year is four digits long
      if (year.length < 4) {
        year = '20' + year;
      }

      // Ensure the publish year is four digits long
      if (publishYear.length < 4) {
        publishYear = '20' + publishYear;
      }

      // Get the last two of the publish year
      let publishYearLastTwo = publishYear.slice(-2);

      // Ensure the publish day is two digits long
      if (publishDay.length < 2) {
        publishDay = '0' + publishDay;
      }

      // Ensure publish month is two digits long
      if (publishMonth.length < 2) {
        publishMonth = '0' + publishMonth;
      }

      const results = JSON.parse(fs.readFileSync(options.results, 'utf8'));
      const dayResults = results[year][day];

      if (dayResults === undefined) {
        console.error(`🚨 No results found for ${year} day ${day}...`);
        process.exit(1);
      }

      // Ensure the location exists
      let eventLocation = path.join(options.location, year, day);
      if (!fs.existsSync(eventLocation)) {
        console.error(`🚨 Location ${eventLocation} ${chalk.red('does not')} exist...`);
        process.exit(1);
      }

      // Generate the README.md file
      fs.writeFileSync(path.join(eventLocation, 'README.md'), `![Advent of Code ${year}, Day ${day}](../../../.gitlab/assets/headers/${year}-${day}.png)

[![AOC ${year} ${dayNumber}](https://img.shields.io/badge/YearOf.Dev-AOC--${year}--${day}-hotpink?style=for-the-badge)](https://yodev.link/${publishYearLastTwo}${publishMonth}${publishDay}-aoc) [![Advent of Code](https://img.shields.io/badge/AoC-%E2%AD%90%E2%AD%90-0f0f23?style=for-the-badge)](https://adventofcode.com/${year}/day/${dayNumber})

[![Typescript](https://img.shields.io/badge/Typescript-blue?style=for-the-badge)](solution.ts) [![Go](https://img.shields.io/badge/Go-lightblue?style=for-the-badge)](solution.go) [![Python](https://img.shields.io/badge/Python-yellow?style=for-the-badge)](solution.py) [![Rust](https://img.shields.io/badge/Rust-orange?style=for-the-badge)](solution.rs) 

The write up for this Advent of Code challenge is available on [YearOf.Dev](https://yearof.dev) at [htts://yearof.dev/${publishYear}/${publishMonth}/${publishDay}/aoc-${year}-${day}](htts://yearof.dev/${publishYear}/${publishMonth}/${publishDay}/aoc-${year}-${day}).

## Timings

| Language | Part 1 | Part 2 | Total |
| ----- | ----- | ----- | ----- |
| Typescript | ${Math.trunc(dayResults.Typescript.TimeStats.Part1.Average)} | ${Math.trunc(dayResults.Typescript.TimeStats.Part2.Average)} | ${Math.trunc(dayResults.Typescript.TimeStats.Run.Average)} |
| Go | ${Math.trunc(dayResults.Go.TimeStats.Part1.Average)} | ${Math.trunc(dayResults.Go.TimeStats.Part2.Average)} | ${Math.trunc(dayResults.Go.TimeStats.Run.Average)} |
| Python | ${Math.trunc(dayResults.Python.TimeStats.Part1.Average)} | ${Math.trunc(dayResults.Python.TimeStats.Part2.Average)} | ${Math.trunc(dayResults.Python.TimeStats.Run.Average)} |
| Rust | ${Math.trunc(dayResults.Rust.TimeStats.Part1.Average)} | ${Math.trunc(dayResults.Rust.TimeStats.Part2.Average)} | ${Math.trunc(dayResults.Rust.TimeStats.Run.Average)} |

## Win/Loss

| Language | Part 1 | Part 2 | Total |
| ----- | ----- | ----- | ----- |
| Typescript | ${dayResults.Winners.Part1 === 'Typescript' ? '⭐' : dayResults.Losers.Part1 === 'Typescript' ? '❌' : '➖'} | ${dayResults.Winners.Part2 === 'Typescript' ? '⭐' : dayResults.Losers.Part2 === 'Typescript' ? '❌' : '➖'} | ${dayResults.Winners.Overall === 'Typescript' ? '⭐' : dayResults.Losers.Overall === 'Typescript' ? '❌' : '➖'} |
| Go | ${dayResults.Winners.Part1 === 'Go' ? '⭐' : dayResults.Losers.Part1 === 'Go' ? '❌' : '➖'} | ${dayResults.Winners.Part2 === 'Go' ? '⭐' : dayResults.Losers.Part2 === 'Go' ? '❌' : '➖'} | ${dayResults.Winners.Overall === 'Go' ? '⭐' : dayResults.Losers.Overall === 'Go' ? '❌' : '➖'} |
| Python | ${dayResults.Winners.Part1 === 'Python' ? '⭐' : dayResults.Losers.Part1 === 'Python' ? '❌' : '➖'} | ${dayResults.Winners.Part2 === 'Python' ? '⭐' : dayResults.Losers.Part2 === 'Python' ? '❌' : '➖'} | ${dayResults.Winners.Overall === 'Python' ? '⭐' : dayResults.Losers.Overall === 'Python' ? '❌' : '➖'} |
| Rust | ${dayResults.Winners.Part1 === 'Rust' ? '⭐' : dayResults.Losers.Part1 === 'Rust' ? '❌' : '➖'} | ${dayResults.Winners.Part2 === 'Rust' ? '⭐' : dayResults.Losers.Part2 === 'Rust' ? '❌' : '➖'} | ${dayResults.Winners.Overall === 'Rust' ? '⭐' : dayResults.Losers.Overall === 'Rust' ? '❌' : '➖'} |
`);

      console.log(`    ✅ README.md file ${chalk.green('generated')}...`);
    });
}
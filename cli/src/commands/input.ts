import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import type { MultipleRunResults } from '../utils';


export function addCommand_input(program: Command) {
  const input = program
    .command('input')
    .description('Interact with Advent of Code Inputs');

  // Get Subcommand
  input
    .command('get')
    .description('Get the input for a given day')
    .argument('<year>', 'The year of the Advent of Code event')
    .argument('<day>', 'The day of the Advent of Code event')
    .option('-l, --location <location>', 'The location of the Advent of Code events', 'events')
    .option('-s, --session <session>', 'The session cookie to use')
    .action(async (year: string, day: string, options: { location: string, session: string }) => {
      let session = '';
      if (options.session !== undefined) {
        session = options.session;
      } else {
        session = getSessionFromConfigFile();
      }
      if (session === undefined) {
        console.error('🚨 No session cookie found...');
        process.exit(1);
      }

      let input = await getInput(year, day, session);

      // Ensure the day is two digits long
      let dayNumber = parseInt(day)
      if (day.length < 2) {
        day = '0' + day;
      }

      // Ensure the year is four digits long
      if (year.length < 4) {
        year = '20' + year;
      }

      // Ensure the location exists
      let eventLocation = path.join(options.location, year, day);
      if (!fs.existsSync(eventLocation)) {
        fs.mkdirSync(eventLocation, { recursive: true });
      }

      // Write the input to the file
      fs.writeFileSync(path.join(eventLocation, 'input.txt'), input);
      console.log(`    ✅ Input saved to ${path.join(eventLocation, 'input.txt')}...`);
    });
      
}

function searchForConfigFile() {
  // Search where we are running from for an aoc config file
  const currentDir = process.cwd();
  const configFile = path.join(currentDir, 'aoc.config.json');
  if (fs.existsSync(configFile)) {
    return JSON.parse(fs.readFileSync(configFile, 'utf8'));
  }
  return undefined;
}

function getSessionFromConfigFile() {
  const config = searchForConfigFile();
  if (config !== undefined) {
    return config.session;
  }
  return undefined;
}

async function getInput(year: string, day: string, session: string) {
  // Ensure the day is a single digit if less than 10
  let dayNumber = parseInt(day);
  day = dayNumber.toString();

  // Ensure the year is a four digit number
  if (year.length < 4) {
    year = '20' + year;
  }

  // Get the input for a given day
  const url = `https://adventofcode.com/${year}/day/${day}/input`;
  const response = await fetch(url, {
    headers: {
      'Cookie': `session=${session}`,
    },
  });
  if (response.ok) {
    return response.text();
  } else {
    console.error(`🚨 Failed to get input for ${year} day ${day}: ${response.statusText}`);
    process.exit(1);
  }
}
#! /usr/bin/env node

import { Command } from 'commander';
import { addCommand_init } from './commands/init';
import { addCommand_run, addCommand_runAll } from './commands/run';
import { addCommand_input } from './commands/input';
import { addCommand_genReadme } from './commands/gen-readme';
import { addCommand_languageStats } from './commands/language-stats';
const program = new Command();

program
  .name("aoc")
  .version('0.1.6')

// Add all the commands
addCommand_init(program);
addCommand_run(program);
addCommand_runAll(program);
addCommand_input(program);
addCommand_genReadme(program);
addCommand_languageStats(program);

// Parse the arguments
program.parse(process.argv);
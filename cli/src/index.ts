#! /usr/bin/env node

import { Command } from 'commander';
import { addCommand_init } from './commands/init';
import { addCommand_run, addCommand_runAll } from './commands/run';
import { addCommand_input } from './commands/input';
import { addCommand_genReadme } from './commands/gen-readme';

const program = new Command();

program
  .name("aoc")
  .version('0.1.5')

// Add all the commands
addCommand_init(program);
addCommand_run(program);
addCommand_runAll(program);
addCommand_input(program);
addCommand_genReadme(program);

// Parse the arguments
program.parse(process.argv);
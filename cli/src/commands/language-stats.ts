import { Command } from "commander";
import fs from 'node:fs';

type LanguageStatsData = {
  Wins: number;
  Losses: number;
}

type LanguageStats = {
  Typescript: LanguageStatsData;
  Go: LanguageStatsData;
  Python: LanguageStatsData;
  Rust: LanguageStatsData;
}


export function addCommand_languageStats(program: Command) {
  program
    .command('language-stats')
    .description('Generate language stats')
    .action(() => {
      console.log('🔄 Generating language stats...');

      const results = JSON.parse(fs.readFileSync('results.json', 'utf8'));

      let stats: LanguageStats = {
        Typescript: {
          Wins: 0,
          Losses: 0,
        },
        Go: {
          Wins: 0,
          Losses: 0,
        },
        Python: {
          Wins: 0,
          Losses: 0,
        },
        Rust: {
          Wins: 0,
          Losses: 0,
        },
      };

      for (const year in results) {
        for (const day in results[year]) {
          for (const part in results[year][day].Winners) {
            const language = results[year][day].Winners[part];
            
            if (language === 'Typescript') {
              stats.Typescript.Wins++;
            } else if (language === 'Go') {
              stats.Go.Wins++;
            } else if (language === 'Python') {
              stats.Python.Wins++;
            } else if (language === 'Rust') {
              stats.Rust.Wins++;
            }
          }
          for (const part in results[year][day].Losers) {
            const language = results[year][day].Losers[part];

            if (language === 'Typescript') {
              stats.Typescript.Losses++;
            } else if (language === 'Go') {
              stats.Go.Losses++;
            } else if (language === 'Python') {
              stats.Python.Losses++;
            } else if (language === 'Rust') {
              stats.Rust.Losses++;
            }
          }
        }
      }

      console.log("Typescript Wins: ", stats.Typescript.Wins);
      console.log("Typescript Losses: ", stats.Typescript.Losses);
      console.log("Go Wins: ", stats.Go.Wins);
      console.log("Go Losses: ", stats.Go.Losses);
      console.log("Python Wins: ", stats.Python.Wins);
      console.log("Python Losses: ", stats.Python.Losses);
      console.log("Rust Wins: ", stats.Rust.Wins);
      console.log("Rust Losses: ", stats.Rust.Losses);

    });
}
import { AOCDayResults } from "@repo/utils-ts/returnType";
import { readInputAsArray } from "@repo/utils-ts/readInput";
import { measurePerformance } from "@repo/utils-ts/measurePerformance";

type Bot = {
  id: number,
  chips: {
    a?: number,
    b?: number
  },
  instructions: {
    low?: BotInstructions,
    high?: BotInstructions
  },
  upstreamBots: number[]
}

type BotInstructions = {
  type: "bot" | "output"
  id: number
}

type OutputBin = {
  id: number,
  value?: number,
  upstreamBot?: number
}

function giveValueToBot(bots: Record<number, Bot>, botID: number, value: number) {
  // Check if the Bot exists
  if (bots[botID] == undefined) {
    bots[botID] = {
      id: botID,
      chips: {
        a: value
      },
      instructions: {},
      upstreamBots: []
    }
  } else if (bots[botID].chips.a == undefined) {
    bots[botID].chips.a = value
  } else if (bots[botID].chips.b == undefined) {
    bots[botID].chips.b = value
  } else {
    console.log("Chips already full")
  }

  return bots
}

function botHasBothChips(bots: Record<number, Bot>, botID: number): boolean {
  if (bots[botID] == undefined) {
    return false
  }

  if (bots[botID].chips.a == undefined || bots[botID].chips.b == undefined) {
    return false
  }

  return true
}

function ensureBotExists(bots: Record<number, Bot>, botID: number) {
  if (bots[botID] != undefined) {
    return bots
  }

  bots[botID] = {
    id: botID,
    chips: {},
    instructions: {},
    upstreamBots: []
  }

  return bots
}

function registerBotTrade(bots: Record<number, Bot>, givingBotID: number, receiverID: number, receiverType: string, highLow: string) {
  if (receiverType != "bot" && receiverType != "output") {
    return bots
  }

  bots = ensureBotExists(bots, givingBotID)

  if (highLow == "low") {
    bots[givingBotID].instructions.low = {
      type: receiverType,
      id: receiverID
    }
  } else if (highLow == "high") {
    bots[givingBotID].instructions.high = {
      type: receiverType,
      id: receiverID
    }
  }

  if (receiverType == "bot") {
    bots = ensureBotExists(bots, receiverID)
    bots[receiverID].upstreamBots.push(givingBotID)
  }

  return bots
}

function parseInput(input: string[]): [Record<number, Bot>, Record<number, OutputBin>] {
  let bots: Record<number, Bot> = {}
  let outputBins: Record<number, OutputBin> = {}

  for (var i = 0; i < input.length; i++) {
    let parts = input[i].split(" ")

    if (parts[0] == "value") {
      // Simple value passing
      let botID = parseInt(parts[5])
      let value = parseInt(parts[1])
      bots = giveValueToBot(bots, botID, value)
    } else if (parts[0] == "bot") {
      // Bot giving chips instruction
      let givingBot = parseInt(parts[1])
      let giveA_hl = parts[3]
      let giveA_type = parts[5]
      let giveA_id = parseInt(parts[6])
      let giveB_hl = parts[8]
      let giveB_type = parts[10]
      let giveB_id = parseInt(parts[11])

      bots = registerBotTrade(bots, givingBot, giveA_id, giveA_type, giveA_hl)
      bots = registerBotTrade(bots, givingBot, giveB_id, giveB_type, giveB_hl)

      if (giveA_type == "output") {
        if (outputBins[giveA_id] != undefined) {
          console.log("Output bin collision")
        } else {
          outputBins[giveA_id] = {
            id: giveA_id,
            upstreamBot: givingBot
          }
        }
      }

      if (giveB_type == "output") {
        if (outputBins[giveB_id] != undefined) {
          console.log("Output bin collision")
        } else {
          outputBins[giveB_id] = {
            id: giveB_id,
            upstreamBot: givingBot
          }
        }
      }
    }
  }

  return [bots, outputBins]
}

function doBotTrade(bots: Record<number, Bot>, outputBins: Record<number, OutputBin>, botID: number): [Record<number, Bot>, Record<number, OutputBin>] {
  // Ensure the bot has both chips
  if (!botHasBothChips(bots, botID)) { return [bots, outputBins] }
  if (bots[botID].chips.a == undefined || bots[botID].chips.b == undefined) { return [bots, outputBins] }

  // Decide high low
  let high = bots[botID].chips.a > bots[botID].chips.b ? bots[botID].chips.a : bots[botID].chips.b
  let low = bots[botID].chips.a < bots[botID].chips.b ? bots[botID].chips.a : bots[botID].chips.b

  // Get the details of the high trade
  let high_target = bots[botID].instructions.high?.type
  let high_id = bots[botID].instructions.high?.id

  // Get the details of the low trade
  let low_target = bots[botID].instructions.low?.type
  let low_id = bots[botID].instructions.low?.id

  // If anything is unset fail
  if (high == undefined || low == undefined || high_target == undefined || high_id == undefined || low_target == undefined || low_id == undefined) {
    return [bots, outputBins]
  }

  // handle the high trade
  if (high_target == "bot") {
    if (bots[high_id].chips.a == undefined) {
      bots[high_id].chips.a = high
    } else if (bots[high_id].chips.b == undefined) {
      bots[high_id].chips.b = high
    } else {
      console.log("Failed to handle bot trade")
    }
  } else {
    outputBins[high_id].value = high
  }

  // handle the low trade
  if (low_target == "bot") {
    if (bots[low_id].chips.a == undefined) {
      bots[low_id].chips.a = low
    } else if (bots[low_id].chips.b == undefined) {
      bots[low_id].chips.b = low
    } else {
      console.log("Failed to handle bot trade")
    }
  } else {
    outputBins[low_id].value = low
  }

  // Remove chips from original bot
  bots[botID].chips.a = undefined
  bots[botID].chips.b = undefined

  return [bots, outputBins]
}

function runBotsUntilSearchMet(bots: Record<number, Bot>, outputs: Record<number, OutputBin>, searchA: number, searchB: number): [Record<number, Bot>, Record<number, OutputBin>, number] {
  while (true) {
    for (const botIDString in bots) {
      let botID = parseInt(botIDString)

      if ((bots[botID].chips.a == searchA && bots[botID].chips.b == searchB) || (bots[botID].chips.b == searchA && bots[botID].chips.a == searchB)) {
        return [bots, outputs, botID]
      }

      if (botHasBothChips(bots, botID)) {
        [bots, outputs] = doBotTrade(bots, outputs, botID)
        continue
      }
    }
  }
}

function runBotsComplete(bots: Record<number, Bot>, outputs: Record<number, OutputBin>): [Record<number, Bot>, Record<number, OutputBin>] {
  let hasTrades = true
  while (hasTrades) {
    let didATrade = false
    for (const botIDString in bots) {
      let botID = parseInt(botIDString)

      if (botHasBothChips(bots, botID)) {
        [bots, outputs] = doBotTrade(bots, outputs, botID)
        didATrade = true
        continue
      }
    }

    if (!didATrade) {
      hasTrades = false
    }
  }

  return [bots, outputs]
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
function part1(input: string[]): number | undefined {
  let [bots, outputBins] = parseInput(input)
  var botID: number;
  [bots, outputBins, botID] = runBotsUntilSearchMet(bots, outputBins, 61, 17)

  return botID;
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
function part2(input: string[]): number | undefined {
  let [bots, outputBins] = parseInput(input);
  [bots, outputBins] = runBotsComplete(bots, outputBins)

  if (outputBins[0].value == undefined || outputBins[1].value == undefined || outputBins[2].value == undefined) {
    return undefined
  }

  let value = outputBins[0].value * outputBins[1].value * outputBins[2].value
  return value;
}


// ----------------------------------------------------------------------------------------------------
// | Solve the puzzle
// ----------------------------------------------------------------------------------------------------
function solve() {
  // Get the arguments
  const args = process.argv.slice(2);
  const fileName = args[0] || "input.txt";

  // Start the timer
  const startTimeStamp = new Date(Date.now()).toISOString();
  const startTime = performance.now();

  // Read the input as an array of strings
  const input = readInputAsArray(fileName);

// Run the parts
const p1Result = measurePerformance(() => part1(input));
const p2Result = measurePerformance(() => part2(input));

// End the timer
const endTimeStamp = new Date(Date.now()).toISOString();
const endTime = performance.now();
const duration = endTime - startTime;

// Return the results
return {
  Year: 2016,
  Day: 10,
  Part1: p1Result,
  Part2: p2Result,
  Duration: Math.round(duration * 1000000), // Convert to nanoseconds
  Timestamp: {
    Start: new Date(startTimeStamp).toISOString(),
    End: new Date(endTimeStamp).toISOString(),
  },
} as AOCDayResults;
  
}
const results = solve();
console.log(JSON.stringify(results, null, 2));
use std::fs::File;
use std::io::{BufReader, BufRead};
use std::any::Any;
use serde::Serialize;
use chrono::{DateTime, Utc};

#[derive(Serialize)]
pub struct AOCTimestamp {
    #[serde(rename = "Start")]
    pub start: String,
    #[serde(rename = "End")]
    pub end: String
}

#[derive(Serialize)]
pub struct AOCPartResult<T: Any> {
    #[serde(rename = "Result")]
    pub result: T,
    #[serde(rename = "ExecutionTime")]
    pub execution_time: u128,
    #[serde(rename = "Timestamp")]
    pub timestamp: AOCTimestamp
}

#[derive(Serialize)]
pub struct AOCDayResults<A: Any, B: Any> {
    #[serde(rename = "Year")]
    pub year: i16,
    #[serde(rename = "Day")]
    pub day: i8,
    #[serde(rename = "Part1")]
    pub part1: AOCPartResult<A>,
    #[serde(rename = "Part2")]
    pub part2: AOCPartResult<B>,
    #[serde(rename = "Duration")]
    pub duration: u128,
    #[serde(rename = "Timestamp")]
    pub timestamp: AOCTimestamp
}

pub fn read_input_as_array(filename: &String) -> std::io::Result<Vec<String>>{
    let file = File::open(filename)?;
    let reader = BufReader::new(file);
    let lines: Vec<String> = reader.lines().collect::<Result<_, _>>()?;
    Ok(lines)
}


pub fn measure_performance<T: Any, F>(func: F, input: &Vec<String>) -> AOCPartResult<T>
where
    F: Fn(&Vec<String>) -> T,
{
    let start_timestamp = std::time::SystemTime::now();
    let start_time = std::time::Instant::now();
    let result = func(input);
    let end_time = std::time::Instant::now();
    let end_timestamp = std::time::SystemTime::now();
    let duration = end_time.duration_since(start_time).as_nanos();

    AOCPartResult {
        result: result,
        execution_time: duration,
        timestamp: AOCTimestamp {
            start: DateTime::<Utc>::from(start_timestamp).to_rfc3339(),
            end: DateTime::<Utc>::from(end_timestamp).to_rfc3339(),
        },
    }
}
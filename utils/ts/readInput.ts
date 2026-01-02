// @ts-ignore - fs module is available at runtime via tsx
import * as fs from 'fs';

export function readInputAsArray(file: string): string[] {
  // Read the file
  const fileContent = fs.readFileSync(file, 'utf8');

  // Split the file content into an array of strings
  return fileContent.split('\n');
}
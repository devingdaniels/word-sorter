const fs = require("fs").promises;

const capitalizeAndTrim = (word) =>
  word.trim().charAt(0).toUpperCase() + word.slice(1).toLowerCase();

function processWords(wordsArray) {
  const duplicates = new Set();

  const uniques = new Set();

  for (const word of wordsArray) {
    const capitalizedWord = capitalizeAndTrim(word);
    if (uniques.has(capitalizedWord)) duplicates.add(capitalizedWord);
    else uniques.add(capitalizedWord);
  }

  return { sortedArray: [...uniques].sort(), duplicateArray: [...duplicates].sort() };
}

async function readFileAndCreateArray(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");

    const lines = content.split("\n").filter(Boolean);

    if (lines.length === 0) return [];

    const wordsArray = [];

    for (const line of lines) {
      const words = line.split(",");
      for (const word of words) {
        wordsArray.push(word.trim());
      }
    }
    return wordsArray;
  } catch (error) {
    console.error(`An error occurred while reading ${filePath}:`, error);
    return [];
  }
}

async function writeArraysToFile(sortedArray, duplicateArray) {
  try {
    await fs.writeFile("outputSortedWords.txt", sortedArray.join("\n"));
    await fs.writeFile("duplicateWords.txt", duplicateArray.join("\n"));
  } catch (error) {
    console.error("An error occurred while writing to files:", error);
  }
}

async function main() {
  const inputWords = "inputWords.txt";
  const wordsArray = await readFileAndCreateArray(inputWords);
  if (wordsArray.length > 0) {
    const { sortedArray, duplicateArray } = processWords(wordsArray);
    await writeArraysToFile(sortedArray, duplicateArray);
    console.log("Words sorted successfully!");
  } else {
    console.log("No words found in the file.");
  }
}

main();

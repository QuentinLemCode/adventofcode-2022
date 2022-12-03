import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
const rucksacks: string[] = [];

function getCommonCharacters(
  string1: string,
  string2: string,
  string3: string
) {
  const string1Characters: string[] = string1.split('');
  const commonCharacters: string[] = [];

  for (let i = 0; i < string2.length; i++) {
    const character = string2[i];
    if (
      string1Characters.includes(character) &&
      !commonCharacters.includes(character)
    ) {
      commonCharacters.push(character);
    }
  }
  for (let i = 0; i < string3.length; i++) {
    const character = string3[i];
    if (commonCharacters.includes(character)) {
      return character;
    }
  }
  throw new Error();
}

function getAlphabetNumber(character: string): number {
  const lowercaseCharacter = character.toLowerCase();
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const number = alphabet.indexOf(lowercaseCharacter) + 1;
  if (character === lowercaseCharacter) {
    return number;
  } else {
    return number + 26;
  }
}

function onEachLine(line: string) {
  rucksacks.push(line);
}

async function process() {
  await file.applyFunction(onEachLine);
  let sum = 0;
  for (let i = 0; i < rucksacks.length; i += 3) {
    const char = getCommonCharacters(
      rucksacks[i],
      rucksacks[i + 1],
      rucksacks[i + 2]
    );
    sum += getAlphabetNumber(char);
  }
  console.log(sum);
}
process().then();

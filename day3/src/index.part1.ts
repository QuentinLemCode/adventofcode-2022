import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
const rucksacks: string[] = [];

function splitInHalf(input: string): [string, string] {
  const middle = Math.floor(input.length / 2);
  const firstHalf = input.substring(0, middle);
  const secondHalf = input.substring(middle);
  return [firstHalf, secondHalf];
}

function getCommonCharacters(string1: string, string2: string) {
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
  return commonCharacters;
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
  rucksacks.forEach(rucksack => {
    const [firstHalf, secondHalf] = splitInHalf(rucksack);
    const commons = getCommonCharacters(firstHalf, secondHalf);
    commons.forEach(char => {
      sum += getAlphabetNumber(char);
    });
  });
  console.log(sum);
}
process().then();

import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
const pairs: string[] = [];

function onEachLine(line: string) {
  pairs.push(line);
}

async function process() {
  await file.applyFunction(onEachLine);
  const overlaps = pairs
    .map(pair => pair.split(','))
    .filter(([first, second]) => {
      const [minFirst, maxFirst] = first.split('-').map(x => Number(x));
      const [minSecond, maxSecond] = second.split('-').map(x => Number(x));
      if (minFirst >= minSecond && minFirst <= maxSecond) return true;
      if (maxFirst <= maxSecond && maxFirst >= minSecond) return true;
      if (minFirst >= minSecond && maxFirst <= maxSecond) return true;
      if (minSecond >= minFirst && maxSecond <= maxFirst) return true;
      return false;
    });
  console.log(overlaps.length);
}
process().then();

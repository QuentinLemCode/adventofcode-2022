import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
const map: number[][] = [];
const visibles = new Set<string>();

let index = 0;
function onEachLine(line: string) {
  map[index] = line.split('').map(n => +n);
  index++;
}

function scenicScore(indexRow: number, indexTree: number) {
  const tree = map[indexRow][indexTree];

  let i = 0;
  let up = 0;
  let down = 0;
  let right = 0;
  let left = 0;
  let upBlocked = false;
  let downBlocked = false;
  let rightBlocked = false;
  let leftBlocked = false;
  while (!upBlocked || !downBlocked || !rightBlocked || !leftBlocked) {
    i++;
    if (!upBlocked && indexRow - i > 0 && map[indexRow - i][indexTree] < tree) {
      up++;
    } else if (!upBlocked) {
      up++;
      upBlocked = true;
    }

    if (
      !downBlocked &&
      indexRow + i < map[0].length - 1 &&
      map[indexRow + i][indexTree] < tree
    ) {
      down++;
    } else if (!downBlocked) {
      down++;
      downBlocked = true;
    }

    if (
      !leftBlocked &&
      indexTree - i > 0 &&
      map[indexRow][indexTree - i] < tree
    ) {
      left++;
    } else if (!leftBlocked) {
      left++;
      leftBlocked = true;
    }

    if (
      !rightBlocked &&
      indexTree + i < map.length - 1 &&
      map[indexRow][indexTree + i] < tree
    ) {
      right++;
    } else if (!rightBlocked) {
      right++;
      rightBlocked = true;
    }
  }

  return right * up * down * left;
}

async function process() {
  await file.applyFunction(onEachLine);

  let max = -1;
  for (let indexRow = 1; indexRow < map.length - 1; indexRow++) {
    for (let indexTree = 1; indexTree < map[indexRow].length - 1; indexTree++) {
      const score = scenicScore(indexRow, indexTree);
      if (score > max) {
        console.log(indexRow, indexTree);
        max = score;
      }
    }
  }
  console.log(max);
}

process().then();

import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
const map: number[][] = [];
const visibles = new Set<string>();

let index = 0;
function onEachLine(line: string) {
  map[index] = line.split('').map(n => +n);
  index++;
}

async function process() {
  await file.applyFunction(onEachLine);
  //right - left
  for (let indexRow = 0; indexRow < map.length; indexRow++) {
    let max = -1;
    for (let indexTree = 0; indexTree < map[indexRow].length; indexTree++) {
      const tree = map[indexRow][indexTree];
      if (tree > max) {
        visibles.add(indexRow + '-' + indexTree);
        max = tree;
      }
      if (tree === 9) break;
    }

    max = -1;
    for (let indexTree = map[indexRow].length - 1; indexTree > 0; indexTree--) {
      const tree = map[indexRow][indexTree];
      if (tree > max) {
        visibles.add(indexRow + '-' + indexTree);
        max = tree;
      }
      if (tree === 9) break;
    }
  }

  // top - bottom
  for (let indexTree = 0; indexTree < map[0].length; indexTree++) {
    let max = -1;
    for (let indexRow = 0; indexRow < map.length; indexRow++) {
      const tree = map[indexRow][indexTree];
      if (tree > max) {
        visibles.add(indexRow + '-' + indexTree);
        max = tree;
      }
      if (tree === 9) break;
    }

    max = -1;
    for (let indexRow = map.length - 1; indexRow > 0; indexRow--) {
      const tree = map[indexRow][indexTree];
      if (tree > max) {
        visibles.add(indexRow + '-' + indexTree);
        max = tree;
      }
      if (tree === 9) break;
    }
  }

  console.log(visibles.size);
}

process().then();

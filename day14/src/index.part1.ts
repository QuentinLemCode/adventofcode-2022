import { setFips } from 'crypto';
import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');

const map: number[][] = [];

for (let i = 0; i < 1000; i++) {
  map[i] = [];
  for (let j = 0; j < 1000; j++) {
    map[i][j] = 0;
  }
}
type Position = [number, number];
const allDirections: Position[][] = [];

function onEachLine(line: string) {
  allDirections.push(
    line.split(' -> ').map(d => d.split(',').map(a => Number(a)) as Position)
  );
}

async function process() {
  await file.applyFunction(onEachLine);

  allDirections.forEach(directions => {
    for (let idx = 1; idx < directions.length; idx++) {
      const [fromX, fromY] = directions[idx - 1];
      const [toX, toY] = directions[idx];
      let vecX, vecY, steps: number;
      vecX = toX - fromX < 0 ? -1 : toX - fromX > 0 ? 1 : 0;
      vecY = toY - fromY < 0 ? -1 : toY - fromY > 0 ? 1 : 0;
      steps = Math.abs(toX - fromX) + Math.abs(toY - fromY);
      for (
        let step = 0, X = fromX, Y = fromY;
        step <= steps;
        step++, X += vecX, Y += vecY
      ) {
        map[X][Y] = 1;
      }
    }
  });

  let flowing = true;
  let count = 0;
  while (flowing) {
    let sandX = 500;
    let sandY = 0;
    let moving = true;
    count++;
    while (moving) {
      if (map[sandX][sandY + 1] > 0) {
        // try left
        if (map[sandX - 1][sandY + 1] === 0) {
          sandX -= 1;
        } else if (map[sandX + 1][sandY + 1] === 0) {
          sandX += 1;
        } else {
          moving = false;
          map[sandX][sandY] = 2;
          break;
        }
      }
      if (sandY > 1000) {
        moving = false;
        flowing = false;
        break;
      }
      sandY++;
    }
  }

  console.log(count - 1);
}
process().then();

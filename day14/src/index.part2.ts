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

  let maxY = 0;

  allDirections.forEach(directions => {
    for (let idx = 1; idx < directions.length; idx++) {
      const [fromX, fromY] = directions[idx - 1];
      const [toX, toY] = directions[idx];
      let vecX, vecY, steps: number;
      vecX = toX - fromX < 0 ? -1 : toX - fromX > 0 ? 1 : 0;
      vecY = toY - fromY < 0 ? -1 : toY - fromY > 0 ? 1 : 0;
      const Y = Math.max(fromY, toY);
      if (Y > maxY) maxY = Y;
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

  for (let i = 0; i < 1000; i++) {
    map[i][maxY + 2] = 1;
  }

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
          // try right
        } else if (map[sandX + 1][sandY + 1] === 0) {
          sandX += 1;
          // stop moving
        } else {
          moving = false;
          if (sandX === 500 && sandY === 0) {
            flowing = false;
            break;
          }
          map[sandX][sandY] = 2;
          break;
        }
      }
      sandY++;
    }
  }

  console.log(count);
}
process().then();

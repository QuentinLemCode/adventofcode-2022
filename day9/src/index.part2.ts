import { ReadFile } from './fileread';

type Direction = 'R' | 'L' | 'D' | 'U';
interface Position {
  X: number;
  Y: number;
}

const file = new ReadFile('input.txt');
const mouvements: { direction: Direction; number: number }[] = [];
const visited = new Set<string>();
visited.add('0-0');

const knots: Position[] = [];
for (let i = 0; i <= 9; i++) {
  knots.push({ X: 0, Y: 0 });
}

function onEachLine(line: string) {
  const [direction, number] = line.split(' ');
  mouvements.push({ direction: direction as Direction, number: +number });
}

function distance(HX: number, HY: number, TX: number, TY: number) {
  const dx = HX - TX;
  const dy = HY - TY;
  return Math.sqrt(dx * dx + dy * dy);
}

function tail() {
  return knots[9];
}

function head() {
  return knots[0];
}

async function process() {
  await file.applyFunction(onEachLine);
  let vecX = 0;
  let vecY = 0;
  for (const mouvement of mouvements) {
    vecX =
      mouvement.direction === 'R' ? 1 : mouvement.direction === 'L' ? -1 : 0;
    vecY =
      mouvement.direction === 'U' ? 1 : mouvement.direction === 'D' ? -1 : 0;

    for (let p = 0; p < mouvement.number; p++) {
      for (const [index, knot] of knots.entries()) {
        if (index === 0) {
          knot.X += vecX;
          knot.Y += vecY;
          continue;
        }
        const { X, Y } = knots[index - 1];
        if (distance(X, Y, knot.X, knot.Y) < 2) break;

        let minI: number | null = null;
        let minJ: number | null = null;
        let min = Infinity;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const dist = distance(X, Y, knot.X + i, knot.Y + j);
            if (dist > min) continue;
            min = dist;
            minI = i;
            minJ = j;
          }
        }
        if (minI == null || minJ == null) throw Error();
        knot.X += minI;
        knot.Y += minJ;
      }
      visited.add(tail().X + '-' + tail().Y);
    }
  }
  console.log(visited.size);
}
process().then();

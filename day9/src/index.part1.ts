import { ReadFile } from './fileread';

type Direction = 'R' | 'L' | 'D' | 'U';

const file = new ReadFile('input.txt');
const mouvements: { direction: Direction; number: number }[] = [];
const visited = new Set<string>();
visited.add('0-0');

function onEachLine(line: string) {
  const [direction, number] = line.split(' ');
  mouvements.push({ direction: direction as Direction, number: +number });
}

function isDistanceMoreThan1(HX: number, HY: number, TX: number, TY: number) {
  const dx = HX - TX;
  const dy = HY - TY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist >= 2;
}

async function process() {
  await file.applyFunction(onEachLine);
  let vecX = 0;
  let vecY = 0;
  let HX = 0;
  let HY = 0;
  let TX = 0;
  let TY = 0;
  for (const mouvement of mouvements) {
    vecX =
      mouvement.direction === 'R' ? 1 : mouvement.direction === 'L' ? -1 : 0;
    vecY =
      mouvement.direction === 'U' ? 1 : mouvement.direction === 'D' ? -1 : 0;

    for (let i = 0; i < mouvement.number; i++) {
      const curHX = HX;
      const curHY = HY;
      HX += vecX;
      HY += vecY;
      if (isDistanceMoreThan1(HX, HY, TX, TY)) {
        TX = curHX;
        TY = curHY;
        visited.add(TX + '-' + TY);
      }
    }
  }

  console.log(visited.size);
}
process().then();

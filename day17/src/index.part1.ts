import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');

class Jet {
  public next!: Jet;
  constructor(public flow: 1 | -1, public index: number) {}

  setNext(next: Jet) {
    this.next = next;
  }
}

const rocks = [
  [[1, 1, 1, 1]],
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  [[1], [1], [1], [1]],
  [
    [1, 1],
    [1, 1],
  ],
];

let start: Jet;

function onEachLine(line: string) {
  const calcFlow = (char: string) => (char === '>' ? 1 : -1);
  const chars = line.split('');
  start = new Jet(calcFlow(chars[0]), 0);
  let prev = start;
  for (let i = 1; i < chars.length; i++) {
    prev.setNext(new Jet(calcFlow(chars[i]), i));
    prev = prev.next;
  }
  prev.setNext(start);
}

function isOverlap(rock: number[][], map: number[][], x: number, y: number) {
  let overlap = false;
  for (let i = 0; i < rock[0].length; i++) {
    for (let j = 0; j < rock.length; j++) {
      if (rock[j][i] === 0) continue;
      if (map[x + i]?.[y + j] === 1) overlap = true;
    }
  }
  return overlap;
}

async function process() {
  await file.applyFunction(onEachLine);
  const map: number[][] = [];
  let highest = 0;
  let jet = start;

  for (let rockI = 0; rockI < 2022; rockI++) {
    if (rockI === 804) {
      draw(map);
      debugger;
    }
    const rock = rocks[rockI % 5];
    let falling = true;
    let x = 2;
    let y = highest + 3;
    while (falling) {
      x += jet.flow;
      if (x < 0) x = 0;
      if (x + rock[0].length > 7) x = 7 - rock[0].length;
      if (isOverlap(rock, map, x, y)) x -= jet.flow;
      jet = jet.next;

      y -= 1;
      if (y < 0 || isOverlap(rock, map, x, y)) {
        y += 1;
        for (let i = 0; i < rock[0].length; i++) {
          for (let j = 0; j < rock.length; j++) {
            if (!map[x + i]) map[x + i] = [];
            map[x + i][y + j] = map[x + i][y + j] === 1 ? 1 : rock[j][i];
          }
        }
        highest = Math.max(highest, y + rock.length);
        falling = false;
        // draw(map);
      }
    }
  }
  console.log(jet.index);
  console.log(highest);
}

function draw(map: number[][], minY = 0, maxY = 30) {
  let a = '';
  for (let y = maxY; y >= minY; y--) {
    for (let x = 0; x < 7; x++) {
      a += map[x]?.[y] || '.';
    }
    a += '\n';
  }
  console.log(a);
  console.log('----------');
}
process().then();

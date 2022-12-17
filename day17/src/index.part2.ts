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
  const memo = new Map<number, number[]>();
  let highest = 0;
  const allIncrease: number[] = [];
  let jet = start;
  let total = 1000000000000;
  let rockI = 0;
  while (total > 0) {
    total--;
    const rock = rocks[rockI % 5];
    rockI++;
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
        const newHigh = Math.max(highest, y + rock.length);
        const diff = newHigh - highest;
        allIncrease.push(diff);
        highest += diff;
        falling = false;

        const rockIndex = (rockI - 1) % 5;
        const state = jet.index * 5 + rockIndex;
        const prevIncrease = memo.get(state);
        if (!prevIncrease) {
          memo.set(state, [allIncrease.length - 1]);
          break;
        }
        prevIncrease?.push(allIncrease.length - 1);
        const cycleLength = findPattern(prevIncrease, allIncrease);
        if (cycleLength) {
          const q = Math.floor((total - rockIndex) / cycleLength);
          const r = total % cycleLength;
          console.log(
            highest +
              q *
                allIncrease.slice(-cycleLength).reduce((sum, v) => sum + v, 0) +
              allIncrease
                .slice(-cycleLength, -cycleLength + r)
                .reduce((sum, v) => sum + v, 0)
          );
          return;
        }
      }
    }
  }
  console.log(jet.index);
  console.log(highest);
}

function findPattern(prevIncrease: number[], allIncrease: number[]) {
  const lastIndex = prevIncrease[prevIncrease.length - 1];
  for (let i = 0; i < prevIncrease.length - 1; i++) {
    const testIndex = prevIncrease[i];
    const cycleLength = lastIndex - testIndex;
    if (testIndex + 1 < cycleLength) continue;
    let j = 0;
    while (j < cycleLength) {
      if (allIncrease[lastIndex - j] !== allIncrease[testIndex - j]) break;
      j++;
    }
    if (j === cycleLength) return cycleLength;
  }
  return 0;
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

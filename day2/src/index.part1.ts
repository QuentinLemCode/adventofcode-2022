import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');

enum Shape {
  ROCK = 1,
  PAPER = 2,
  SCISSOR = 3,
}

const map: Record<string, number> = {
  A: Shape.ROCK,
  B: Shape.PAPER,
  C: Shape.SCISSOR,
  X: Shape.ROCK,
  Y: Shape.PAPER,
  Z: Shape.SCISSOR,
};

function score(opponent: Shape, you: Shape) {
  let score = 0;
  if (opponent === you) {
    score += 3;
  }
  if (
    (opponent === 1 && you === 2) ||
    (opponent === 2 && you === 3) ||
    (opponent === 3 && you === 1)
  ) {
    score += 6;
  }
  score += you;
  return score;
}
let total = 0;

function onEachLine(line: string) {
  const [you, opp] = line.split(' ').map(x => Number(map[x.trim()]));
  total += score(you, opp);
}

async function process() {
  await file.applyFunction(onEachLine);
  console.log(total);
}
process().then();

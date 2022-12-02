import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');

enum Result {
  LOSE = 0,
  DRAW = 3,
  WIN = 6,
}

enum Shape {
  ROCK = 0,
  PAPER = 1,
  SCISSOR = 2,
}

const mapShape: Record<string, number> = {
  A: Shape.ROCK,
  B: Shape.PAPER,
  C: Shape.SCISSOR,
};

const mapResult: Record<string, number> = {
  X: Result.LOSE,
  Y: Result.DRAW,
  Z: Result.WIN,
};

function score(shape: Shape, result: Result) {
  let score = result;
  if (result === Result.DRAW) {
    score += shape + 1;
  }
  if (result === Result.LOSE) {
    score += ((shape + 2) % 3) + 1;
  }
  if (result === Result.WIN) {
    score += ((shape + 1) % 3) + 1;
  }
  return score;
}
let total = 0;

function onEachLine(line: string) {
  const [shape, result] = line.split(' ');
  total += score(mapShape[shape], mapResult[result]);
}

async function process() {
  await file.applyFunction(onEachLine);
  console.log(total);
}
process().then();

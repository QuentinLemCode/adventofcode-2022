import { ReadFile } from './fileread';

type Position = [number, number];

const file = new ReadFile('input.txt');
let maze: number[][] = [];
let start: Position = [0, 0];
let end: Position = [0, 0];

const directions = [
  [0, 1],
  [-1, 0],
  [0, -1],
  [1, 0],
];

function onEachLine(line: string, index: number) {
  maze[index] = line.split('').map((point, idx) => {
    if (point === 'S') {
      start = [index, idx];
      return 0;
    }
    if (point === 'E') {
      end = [index, idx];
      return 27;
    }
    return point.charCodeAt(0) - 96;
  });
}

function reachScore(x: number, y: number, value: number, visited: Set<string>) {
  if (x === start[0] && y === start[1]) return false;
  if (x < 0 || y < 0 || x >= maze.length || y >= maze[0].length) return false;
  if (visited.has(x + '-' + y)) return false;
  if (maze[x][y] <= value + 1) return true;
  return false;
}

function shortestPath(start: Position) {
  const queue: [Position, number][] = [[start, 0]];
  const visited = new Set<string>([start[0] + '-' + start[1]]);
  let res = Infinity;

  while (queue.length) {
    const shift = queue.shift();
    if (!shift) throw Error();
    const [pos, steps] = shift;
    const [x, y] = pos;

    if (end[0] === pos[0] && end[1] === pos[1]) {
      res = steps;
      break;
    }

    const value = maze[x][y];
    directions.forEach(([i, j]) => {
      const newX = x + i;
      const newY = y + j;
      if (reachScore(newX, newY, value, visited)) {
        visited.add(newX + '-' + newY);
        queue.push([[newX, newY], steps + 1]);
      }
    });
  }
  return res;
}

async function process() {
  await file.applyFunction(onEachLine);
  const starts: Position[] = [];
  maze.forEach((row, rowidx) =>
    row.forEach((col, colidx) => {
      if (col === 1) starts.push([rowidx, colidx]);
    })
  );
  console.log(
    starts.map(start => shortestPath(start)).sort((a, b) => a - b)[0]
  );
}

process().then();

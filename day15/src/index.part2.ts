import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');

type Position = [number, number];

type Range = [number, number];
type Ranges = Range[];

const ranges: Ranges[] = [];

function manhattanDistance(from: Position, to: Position) {
  return Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1]);
}

class Sensor {
  public distanceFromBeacon: number;
  constructor(public position: Position, public nearestBeacon: Position) {
    this.distanceFromBeacon = manhattanDistance(position, nearestBeacon);
    const minX = position[0] - this.distanceFromBeacon;
    const maxX = position[0] + this.distanceFromBeacon;
    let x = minX;
    let i = 0;
    const y = position[1];
    for (; x <= position[0]; x++, i++) {
      if (!ranges[x]) ranges[x] = [];
      ranges[x].push([y - i, y + i]);
    }
    i -= 2;
    for (; x <= maxX; x++, i--) {
      if (!ranges[x]) ranges[x] = [];
      ranges[x].push([y - i, y + i]);
    }
  }

  isPresentIn(position: Position) {
    return (
      manhattanDistance(position, this.position) <= this.distanceFromBeacon
    );
  }
}

function find(goodRanges: Ranges[]): Position | undefined {
  for (let i = 0; i <= 4000000; i++) {
    if (goodRanges[i].length === 2) {
      return [i, goodRanges[i][1][0] - 1];
    }
  }
  return undefined;
}

const sensors: Sensor[] = [];
let minX = 0,
  maxX = 0;

function onEachLine(line: string) {
  const split = line.split(' ');
  const sx = Number(split[2].slice(2, -1));
  const sy = Number(split[3].slice(2, -1));
  const nx = Number(split[8].slice(2, -1));
  const ny = Number(split[9].slice(2));
  const sensor = new Sensor([sx, sy], [nx, ny]);
  sensors.push(sensor);
  minX = Math.min(minX, sensor.position[0] - sensor.distanceFromBeacon);
  maxX = Math.max(maxX, sensor.position[0] + sensor.distanceFromBeacon);
}

async function process() {
  await file.applyFunction(onEachLine);
  const goodRanges = ranges.map(range => {
    const sorted = range.sort((a, b) => a[0] - b[0]);
    let min = sorted[0][0];
    let max = min;
    const result: Range[] = [];
    for (const r of sorted) {
      if (r[0] > max + 1) {
        result.push([min, max]);
        min = r[0];
        max = r[1];
      }
      if (r[1] > max) {
        max = r[1];
      }
    }
    result.push([min, max]);
    return result;
  });

  const pos = find(goodRanges);
  if (!pos) return;
  console.log(pos?.[0] * 4000000 + pos?.[1]);
}
process().then();

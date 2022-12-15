import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');

type Position = [number, number];

function manhattanDistance(from: Position, to: Position) {
  return Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1]);
}

class Sensor {
  public distanceFromBeacon: number;
  constructor(public position: Position, public nearestBeacon: Position) {
    this.distanceFromBeacon = manhattanDistance(position, nearestBeacon);
  }

  isPresentIn(position: Position) {
    return (
      manhattanDistance(position, this.position) <= this.distanceFromBeacon
    );
  }
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

  // for (let y = 0; y <= 22; y++) {
  //   let line = '';
  //   for (let x = minX; x < maxX; x++) {
  //     if (sensors.some(s => s.position[0] === x && s.position[1] === y)) {
  //       line += 'S';
  //       continue;
  //     }
  //     if (
  //       sensors.some(s => s.nearestBeacon[0] === x && s.nearestBeacon[1] === y)
  //     ) {
  //       line += 'B';
  //       continue;
  //     }
  //     if (sensors.some(sensor => sensor.isPresentIn([x, y]))) {
  //       line += '#';
  //       continue;
  //     }
  //     line += '.';
  //   }
  //   if (y === 10) line += '---';
  //   console.log(line);
  // }

  let count = 0;
  const y = 2000000;
  for (let x = minX; x < maxX; x++) {
    if (
      sensors.some(
        s =>
          (s.position[0] === x && s.position[1] === y) ||
          (s.nearestBeacon[0] === x && s.nearestBeacon[1] === y)
      )
    )
      continue;
    if (sensors.some(sensor => sensor.isPresentIn([x, y]))) {
      count++;
    }
  }
  console.log(count);
}
process().then();

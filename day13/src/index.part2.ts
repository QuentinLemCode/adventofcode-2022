import { readFileSync } from 'fs';
type Packet = number | Packet[];

const inputPairs = readFileSync('input.txt')
  .toString()
  .split('\n\n')
  .map(pairs => pairs.split('\n'));
const input: [Packet[], Packet[]][] = inputPairs.map(inputPair => [
  eval(inputPair[0]),
  eval(inputPair[1]),
]);

function compare(left: Packet[], right: Packet[]): number {
  for (let i = 0, len = Math.max(left.length, right.length); i < len; i++) {
    if (left.length <= i) return -1;
    if (right.length <= i) return 1;
    const leftValue = left[i];
    const rightValue = right[i];
    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      if (leftValue !== rightValue) {
        return leftValue < rightValue ? -1 : 1;
      }
    } else {
      const leftArr = Array.isArray(leftValue) ? leftValue : [leftValue];
      const rightArr = Array.isArray(rightValue) ? rightValue : [rightValue];
      const result = compare(leftArr, rightArr);
      if (result !== 0) {
        return result;
      }
    }
  }
  return 0;
}

const packet1 = [[2]];
const packet2 = [[6]];

const pairs = input.flat();
pairs.push(packet1);
pairs.push(packet2);
pairs.sort(compare);
console.log((1 + pairs.indexOf(packet1)) * (1 + pairs.indexOf(packet2)));

import { readFileSync } from 'fs';

const monkeys: Monkey[] = [];

class Monkey {
  public items: bigint[] = [];
  public operation!: (old: bigint) => bigint;
  public divide!: bigint;
  public trueMonkey!: number;
  public falseMonkey!: number;
  public count = 0;
}

function parse() {
  const file = readFileSync('input.txt').toString();
  const monkeysDescription = file.split('\n\n');
  monkeysDescription.forEach(monkey => {
    const newMonkey = new Monkey();
    const characteristics = monkey.split('\n');
    newMonkey.items = characteristics[1]
      .split(':')[1]
      .split(',')
      .map(i => BigInt(i.trim()));
    const operation = characteristics[2]
      .split(':')[1]
      .split('=')[1]
      .trim();
    const splitted = operation.split(' ');
    const operande = Number(splitted[2]);
    if (operande !== NaN) {
      splitted[2] = `BigInt(${splitted[2]})`;
    }
    newMonkey.operation = (old: bigint) => eval(splitted.join(' '));
    newMonkey.divide = BigInt(characteristics[3].split(' ')[5]);
    newMonkey.trueMonkey = +characteristics[4].trim().split(' ')[5];
    newMonkey.falseMonkey = +characteristics[5].trim().split(' ')[5];
    monkeys.push(newMonkey);
  });
}

parse();

const modulus = monkeys.reduce((acc, cur) => acc * cur.divide, BigInt(1));

for (let round = 0; round < 10000; round++) {
  console.log(round);
  monkeys.forEach(monkey => {
    const length = monkey.items.length;
    for (let i = 0; i < length; i++) {
      monkey.count++;
      const item = monkey.items.splice(0, 1)[0];
      // console.log('Monkey inspects an item with a worry level of ' + item);
      let worry = monkey.operation(item) % modulus;
      // worry = Math.floor(worry / 3);
      // console.log('worry level : ' + worry);
      if (worry % monkey.divide === BigInt(0)) {
        // console.log('thrown to ' + monkey.trueMonkey);
        monkeys[monkey.trueMonkey].items.push(worry);
      } else {
        // console.log('thrown to ' + monkey.falseMonkey);
        monkeys[monkey.falseMonkey].items.push(worry);
      }
    }
  });
}

monkeys.forEach((monkey, index) => {
  console.log(index + ' ' + monkey.count);
  // console.log(monkey.items.join(', '));
});

const scoreSorted = monkeys.map(m => m.count).sort((a, b) => b - a);
console.log(scoreSorted[0] * scoreSorted[1]);

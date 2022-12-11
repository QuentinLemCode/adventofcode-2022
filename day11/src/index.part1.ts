import { readFileSync } from 'fs';

const monkeys: Monkey[] = [];

class Monkey {
  public items: number[] = [];
  public operation!: (old: number) => number;
  public test!: (worry: number) => boolean;
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
      .map(i => Number(i.trim()));
    const operation = characteristics[2]
      .split(':')[1]
      .split('=')[1]
      .trim();
    newMonkey.operation = (old: number) => eval(operation);
    newMonkey.test = worry => worry % +characteristics[3].split(' ')[5] === 0;
    newMonkey.trueMonkey = +characteristics[4].trim().split(' ')[5];
    newMonkey.falseMonkey = +characteristics[5].trim().split(' ')[5];
    monkeys.push(newMonkey);
  });
}

parse();

for (let round = 0; round < 20; round++) {
  monkeys.forEach(monkey => {
    const length = monkey.items.length;
    for (let i = 0; i < length; i++) {
      monkey.count++;
      const item = monkey.items.splice(0, 1)[0];
      // console.log('Monkey inspects an item with a worry level of ' + item);
      let worry = monkey.operation(item);
      worry = Math.floor(worry / 3);
      // console.log('worry level : ' + worry);
      if (monkey.test(worry)) {
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

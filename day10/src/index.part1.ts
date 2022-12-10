import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
const commands: { type: string; value: number | undefined }[] = [];

function onEachLine(line: string) {
  const [type, value] = line.split(' ');
  commands.push({ type, value: Number(value) });
}

async function process() {
  await file.applyFunction(onEachLine);

  const mesures = [20, 60, 100, 140, 180, 220];
  let total = 0;
  let cycles = 0;
  let sp = 0;
  let w: number | null = null;
  let x = 1;
  let end = false;
  while (!end) {
    cycles++;
    const command = commands[sp];
    if (command.type === 'noop') {
      sp++;
    } else if (command.type === 'addx') {
      if (w === null) {
        w = 0;
      } else if (w === 0) {
        sp++;
        x += command.value!;
        w = null;
      } else {
        w--;
      }
    }
    if (mesures.includes(cycles + 1)) {
      total += (cycles + 1) * x;
    }
    if (sp >= commands.length - 1) {
      end = true;
    }
  }

  console.log(total);
}
process().then();

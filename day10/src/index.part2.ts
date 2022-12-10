import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
const commands: { type: string; value: number | undefined }[] = [];

function onEachLine(line: string) {
  const [type, value] = line.split(' ');
  commands.push({ type, value: Number(value) });
}

async function process() {
  await file.applyFunction(onEachLine);
  const rows: string[] = [];

  let cycles = 0;
  let sp = 0;
  let w = false;
  let x = 1;
  let end = false;
  let row: string[] = [];
  let spriteStart = 0;
  let spriteStop = 2;
  while (!end) {
    const column = cycles % 40;
    if (column === 0) console.log(row.join(''));
    row[column] = column >= spriteStart && column <= spriteStop ? '#' : '.';
    cycles++;
    const command = commands[sp];
    if (command.type === 'noop') {
      sp++;
    } else if (command.type === 'addx') {
      if (w === false) {
        w = true;
      } else {
        sp++;
        x += command.value!;
        spriteStart = x - 1;
        spriteStop = x + 1;
        w = false;
      }
    }
    if (sp >= commands.length - 1) {
      end = true;
    }
  }
  console.log(row.join(''));
}
process().then();

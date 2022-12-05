import { fileURLToPath } from 'url';
import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
const stacks: string[][] = [];
const commands: { from: number; to: number; count: number }[] = [];

function onEachLine(line: string) {
  if (line.includes(' 1   2 ')) {
    return;
  }
  if (line.includes('move')) {
    const result = /(\d+).*(\d+).*(\d+)/g.exec(line);
    if (!result) return;
    commands.push({
      from: Number(result[2]),
      to: Number(result[3]),
      count: Number(result[1]),
    });
  }
  const regex = /(\[\w\]|\s{3})\s?/g;
  let m: RegExpExecArray | null;
  for (let i = 0; (m = regex.exec(line)) !== null; i++) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    const match = m[1];
    if (match.includes('[')) {
      if (!stacks[i]) {
        stacks[i] = [];
      }
      stacks[i].push(match.charAt(1));
    }
  }
}

async function process() {
  await file.applyFunction(onEachLine);
  stacks.forEach(stack => stack.reverse());
  commands.forEach(command => {
    for (let i = 0; i < command.count; i++) {
      const stack = stacks[command.from - 1].pop();
      if (!stack) continue;
      stacks[command.to - 1].push(stack);
    }
  });
  let m = '';
  stacks.forEach(s => (m += s.pop() || ''));
  console.log(m);
}
process().then();

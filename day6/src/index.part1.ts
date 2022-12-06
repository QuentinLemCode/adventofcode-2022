import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
let stream: string;

function onEachLine(line: string) {
  stream = line;
}

async function process() {
  await file.applyFunction(onEachLine);
  const datas = stream.split('');
  for (let i = 3; i < datas.length; i++) {
    const group = datas.slice(i - 3, i + 1);
    const uniques = group.filter((v, i, s) => s.indexOf(v) === i);
    if (uniques.length === 4) {
      console.log(i + 1);
      break;
    }
  }
}
process().then();

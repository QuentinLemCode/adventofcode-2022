import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');

const names: string[] = [];
const flows: number[] = [];
const conns: string[][] = [];

function onEachLine(line: string) {
  const elems = line.split(' ');
  names.push(elems[1]);
  flows.push(Number(elems[4].split('=')[1].replaceAll(';', '')));
  conns.push(elems.slice(9).map(e => e.replaceAll(',', '')));
}

const memo = new Map<string, number>();
const memoKey = (cur: number, rest: number[], t: number) =>
  `${cur}-${rest.join(':')}-${t}`;

function dfs(cur: number, rest: number[], t: number): number {
  const memoized = memo.get(memoKey(cur, rest, t));
  if (memoized) return memoized;

  let best = 0;
  for (const r of rest) {
    if (dist[cur][r] > t) {
      continue;
    }

    const result =
      flows[r] * (t - dist[cur][r] - 1) +
      dfs(
        r,
        rest.filter(v => v !== r),
        t - dist[cur][r] - 1
      );
    if (result > best) best = result;
  }
  memo.set(memoKey(cur, rest, t), best);
  return best;
}

function elephantDfs(cur: number, rest: number[], t: number): number {
  let best = dfs(
    names.findIndex(n => n === 'AA'),
    rest,
    26
  );
  for (const r of rest) {
    if (dist[cur][r] > t) {
      continue;
    }

    const result =
      flows[r] * (t - dist[cur][r] - 1) +
      elephantDfs(
        r,
        rest.filter(v => v !== r),
        t - dist[cur][r] - 1
      );
    if (result > best) best = result;
  }
  return best;
}

const dist: number[][] = [];
async function process() {
  await file.applyFunction(onEachLine);

  for (let i = 0; i < names.length; i++) {
    dist[i] = [];
    for (let j = 0; j < names.length; j++) {
      dist[i][j] = Infinity;
    }
  }

  conns.forEach((conn, idx) => {
    conn.forEach(con => {
      dist[idx][names.findIndex(n => n === con)] = 1;
    });
  });

  names.forEach((_, idx) => (dist[idx][idx] = 0));

  for (let k = 0; k < names.length; k++) {
    for (let i = 0; i < names.length; i++) {
      for (let j = 0; j < names.length; j++) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  console.log(
    elephantDfs(
      names.findIndex(n => n === 'AA'),
      flows
        .map((f, i) => [f, i])
        .filter(([f]) => f > 0)
        .map(([_, i]) => i),
      26
    )
  );
}
process().then();

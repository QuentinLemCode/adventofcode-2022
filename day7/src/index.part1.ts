import { cp } from 'fs';
import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');

class Node {
  private nodes: Node[] = [];

  constructor(
    private type: 'file' | 'dir',
    public name: string,
    public parent?: Node,
    private size: number = 0
  ) {}

  public addDir(name: string) {
    this.nodes.push(new Node('dir', name, this));
  }

  public addFile(name: string, size: number) {
    this.addSize(size);
    this.nodes.push(new Node('file', name, this, size));
  }

  public getNodeByName(name: string) {
    return this.nodes.find(node => node.name === name);
  }

  protected addSize(size: number) {
    this.size += size;
    this.parent?.addSize(size);
  }

  public getSize() {
    return this.size;
  }

  public allDirectories(): Node[] {
    if (this.type === 'dir' && this.directories().length === 0) {
      return [this];
    }
    return this.directories().flatMap(n => {
      if (this.isRoot()) {
        return n.allDirectories();
      }
      return [...n.allDirectories(), this];
    });
  }

  private directories() {
    return this.nodes.filter(n => n.type === 'dir');
  }

  private isRoot() {
    return this.name === '/';
  }
}

let currentNode: Node;
let rootNode: Node;
let isListing = false;

function onEachLine(line: string) {
  if (line.charAt(0) === '$') {
    isListing = false;
    if (line.includes('cd /')) {
      rootNode = new Node('dir', '/');
      currentNode = rootNode;
      return;
    }
    if (line.includes('cd ..')) {
      const parent = currentNode.parent;
      if (!parent) throw Error();
      currentNode = parent;
      return;
    }
    if (line.indexOf('ls') === 2) {
      isListing = true;
      return;
    }
    const [_$, _cd, name] = line.split(' ');
    const cd = currentNode.getNodeByName(name);
    if (!cd) {
      throw Error();
    }
    currentNode = cd;
    return;
  }
  if (isListing) {
    if (line.indexOf('dir') === 0) {
      const [_, name] = line.split(' ');
      currentNode.addDir(name);
      return;
    }
    const [size, name] = line.split(' ');
    currentNode.addFile(name, +size);
  }
}

async function process() {
  await file.applyFunction(onEachLine);
  console.log(rootNode.getSize());
  console.log(
    rootNode
      .allDirectories()
      .filter(dir => dir.getSize() < 100000)
      .reduce((acc, cur) => acc + cur.getSize(), 0)
  );
}
process().then();

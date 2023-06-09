//Push drop into FallingState https://github.com/thedrlambda/five-lines/commit/1c712879b919931ddf14c7c15322cd4f84b96750
const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE,
  FALLING_STONE,
  BOX,
  FALLING_BOX,
  KEY1,
  LOCK1,
  KEY2,
  LOCK2,
}

interface RemoveStrategy {
  check(tile: Tile): boolean;
}
class RemoveLock1 implements RemoveStrategy {
  check(tile: Tile) {
    return tile.isLock1();
  }
}
class RemoveLock2 implements RemoveStrategy {
  check(tile: Tile) {
    return tile.isLock2();
  }
}

class KeyConfiguration {
  constructor(
    private color: string,
    private _1: boolean,
    private removeStrategy: RemoveStrategy
  ) {}
  setColor(g: CanvasRenderingContext2D) {
    g.fillStyle = this.color;
  }
  is1() {
    return this._1;
  }
  removeLock(map: Map) {
    map.remove(this.removeStrategy);
  }
}
const YELLOW_KEY = new KeyConfiguration("#ffcc00", true, new RemoveLock1());
const BLUE_KEY = new KeyConfiguration("#00ccff", false, new RemoveLock2());

interface FallingState {
  isFalling(): boolean;
  moveHorizontal(map: Map, player: Player, tile: Tile, dx: number): void;
  drop(map: Map, tile: Tile, x: number, y: number): void;
}

class Falling implements FallingState {
  isFalling() {
    return true;
  }
  moveHorizontal(map: Map, player: Player, tile: Tile, dx: number) {}
  drop(map: Map, tile: Tile, x: number, y: number) {
    map.getMap()[y + 1][x] = tile;
    map.getMap()[y][x] = new Air();
  }
}
class Resting implements FallingState {
  isFalling() {
    return false;
  }
  moveHorizontal(map: Map, player: Player, tile: Tile, dx: number) {
    player.pushHorizontal(map, tile, dx);
  }
  drop(map: Map, tile: Tile, x: number, y: number) {}
}
class FallStrategy {
  constructor(private falling: FallingState) {}
  update(map: Map, tile: Tile, x: number, y: number) {
    this.falling = map.getMap()[y + 1][x].getBlockOnTopState();
    this.falling.drop(map, tile, x, y);
  }
  moveHorizontal(map: Map, player: Player, tile: Tile, dx: number) {
    this.falling.moveHorizontal(map, player, tile, dx);
  }
}

interface Input {
  handle(map: Map, player: Player): void;
}

interface Tile {
  isAir(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  moveHorizontal(map: Map, player: Player, dx: number): void;
  moveVertical(map: Map, player: Player, dy: number): void;
  update(map: Map, x: number, y: number): void;
  getBlockOnTopState(): FallingState;
}

class Air implements Tile {
  isAir() {
    return true;
  }
  isFlux() {
    return false;
  }

  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
  color(g: CanvasRenderingContext2D) {}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {}
  moveHorizontal(map: Map, player: Player, dx: number) {
    player.move(map, dx, 0);
  }
  moveVertical(map: Map, player: Player, dy: number) {
    player.move(map, 0, dy);
  }
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState() {
    return new Falling();
  }
}

class Flux implements Tile {
  isAir() {
    return false;
  }
  isFlux() {
    return true;
  }

  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
  color(g: CanvasRenderingContext2D) {
    g.fillStyle = "#ccffcc";
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ccffcc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {
    player.move(map, dx, 0);
  }
  moveVertical(map: Map, player: Player, dy: number) {
    player.move(map, 0, dy);
  }
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState() {
    return new Resting();
  }
}

class Unbreakable implements Tile {
  isAir() {
    return false;
  }

  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
  color(g: CanvasRenderingContext2D) {
    g.fillStyle = "#999999";
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {}
  moveVertical(map: Map, player: Player, dy: number) {}
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState() {
    return new Resting();
  }
}

class PlayerTile implements Tile {
  isAir() {
    return false;
  }

  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
  color(g: CanvasRenderingContext2D) {}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {}
  moveHorizontal(map: Map, player: Player, dx: number) {}
  moveVertical(map: Map, player: Player, dy: number) {}
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState() {
    return new Resting();
  }
}

class Stone implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  isAir() {
    return false;
  }
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
  color(g: CanvasRenderingContext2D) {
    g.fillStyle = "#0000cc";
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {
    this.fallStrategy.moveHorizontal(map, player, this, dx);
  }
  moveVertical(map: Map, player: Player, dy: number) {}
  update(map: Map, x: number, y: number) {
    this.fallStrategy.update(map, this, x, y);
  }
  getBlockOnTopState() {
    return new Resting();
  }
}

class Box implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  isAir() {
    return false;
  }
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
  color(g: CanvasRenderingContext2D) {
    g.fillStyle = "#8b4513";
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {
    this.fallStrategy.moveHorizontal(map, player, this, dx);
  }
  moveVertical(map: Map, player: Player, dy: number) {}
  update(map: Map, x: number, y: number) {
    this.fallStrategy.update(map, this, x, y);
  }
  getBlockOnTopState() {
    return new Resting();
  }
}

class Key implements Tile {
  constructor(private keyConf: KeyConfiguration) {}
  isAir() {
    return false;
  }
  isLock1() {
    return false;
  }
  isLock2() {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    this.keyConf.setColor(g);
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {
    this.keyConf.removeLock(map);
    player.move(map, dx, 0);
  }
  moveVertical(map: Map, player: Player, dy: number) {
    this.keyConf.removeLock(map);
    player.move(map, 0, dy);
  }
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState() {
    return new Resting();
  }
}

class Lock2 implements Tile {
  constructor(private keyConf: KeyConfiguration) {}
  isAir() {
    return false;
  }
  isLock1() {
    return this.keyConf.is1();
  }
  isLock2() {
    return !this.keyConf.is1();
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    this.keyConf.setColor(g);
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {}
  moveVertical(map: Map, player: Player, dy: number) {}
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState() {
    return new Resting();
  }
}

enum RawInput {
  RIGHT,
  LEFT,
  UP,
  DOWN,
}

let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];
class Map {
  private map: Tile[][];
  getMap() {
    return this.map;
  }
  constructor() {
    this.map = new Array(rawMap.length);
    for (let y = 0; y < rawMap.length; y++) {
      this.map[y] = new Array(rawMap[y].length);
      for (let x = 0; x < rawMap[y].length; x++) {
        this.map[y][x] = transformTile(rawMap[y][x]);
      }
    }
  }
  update() {
    for (let y = this.map.length - 1; y >= 0; y--) {
      for (let x = 0; x < this.map[y].length; x++) {
        this.map[y][x].update(this, x, y);
      }
    }
  }
  draw(g: CanvasRenderingContext2D) {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        this.map[y][x].draw(g, x, y);
      }
    }
  }
  isAir(x: number, y: number) {
    return this.map[y][x].isAir();
  }
  drop(tile: Tile, x: number, y: number) {
    this.map[y + 1][x] = tile;
    this.map[y][x] = new Air();
  }
  getBlockOnTopState(x: number, y: number) {
    return this.map[y][x].getBlockOnTopState();
  }
  movePlayer(x: number, y: number, newx: number, newy: number) {
    this.map[y][x] = new Air();
    this.map[newy][newx] = new PlayerTile();
  }
  moveHorizontal(player: Player, x: number, y: number, dx: number) {
    this.map[y][x + dx].moveHorizontal(this, player, dx);
  }
  moveVertical(player: Player, x: number, y: number, dy: number) {
    this.map[y + dy][x].moveVertical(this, player, dy);
  }
  remove(shouldRemove: RemoveStrategy) {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (shouldRemove.check(this.map[y][x])) {
          this.map[y][x] = new Air();
        }
      }
    }
  }
  pushHorizontal(player: Player, tile: Tile, x: number, y: number, dx: number) {
    if (this.map[y][x + dx + dx].isAir() && !this.map[y + 1][x + dx].isAir()) {
      this.map[y][x + dx + dx] = tile;
      player.moveToTile(this, x + dx, y);
    }
  }
}
let map = new Map();
let inputs: Input[] = [];

class Player {
  private x = 1;
  private y = 1;
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  setX(x: number) {
    this.x = x;
  }
  setY(y: number) {
    this.y = y;
  }
  draw(g: CanvasRenderingContext2D) {
    g.fillStyle = "#ff0000";
    g.fillRect(
      player.getX() * TILE_SIZE,
      player.getY() * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    );
  }
  moveHorizontal(map: Map, dx: number) {
    map.moveHorizontal(this, this.x, this.y, dx);
  }
  moveVertical(map: Map, dy: number) {
    map.moveVertical(this, this.x, this.y, dy);
  }
  move(map: Map, dx: number, dy: number) {
    this.moveToTile(map, this.x + dx, this.y + dy);
  }
  pushHorizontal(map: Map, tile: Tile, dx: number) {
    map.pushHorizontal(this, tile, this.x, this.y, dx);
  }
  moveToTile(map: Map, newx: number, newy: number) {
    map.movePlayer(this.x, this.y, newx, newy);

    this.x = newx;
    this.y = newy;
  }
}
let player = new Player();

function assertExhausted(x: never): never {
  throw new Error("Unexpected object: " + x);
}
function transformTile(tile: RawTile) {
  switch (tile) {
    case RawTile.AIR:
      return new Air();
    case RawTile.PLAYER:
      return new PlayerTile();
    case RawTile.UNBREAKABLE:
      return new Unbreakable();
    case RawTile.STONE:
      return new Stone(new Resting());
    case RawTile.FALLING_STONE:
      return new Stone(new Falling());
    case RawTile.BOX:
      return new Box(new Resting());
    case RawTile.FALLING_BOX:
      return new Box(new Falling());
    case RawTile.FLUX:
      return new Flux();
    case RawTile.KEY1:
      return new Key(YELLOW_KEY);
    case RawTile.LOCK1:
      return new Lock2(YELLOW_KEY);
    case RawTile.KEY2:
      return new Key(BLUE_KEY);
    case RawTile.LOCK2:
      return new Lock2(BLUE_KEY);
    default:
      assertExhausted(tile);
  }
}

function update(map: Map, player: Player) {
  handleInputs(map, player);
  map.update();

  function handleInputs(map: Map, player: Player) {
    while (inputs.length > 0) {
      let input = inputs.pop();
      input.handle(map, player);
    }
  }
}

function draw(map: Map, player: Player) {
  const g = createGraphics();
  map.draw(g);
  player.draw(g);

  function createGraphics() {
    let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
    let g = canvas.getContext("2d");

    g.clearRect(0, 0, canvas.width, canvas.height);

    return g;
  }
}

function gameLoop(map: Map) {
  let before = Date.now();
  update(map, player);
  draw(map, player);
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(map), sleep);
}

window.onload = () => {
  gameLoop(map);
};

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";

class Right implements Input {
  handle(map: Map, player: Player) {
    player.moveHorizontal(map, 1);
  }
}

class Left implements Input {
  handle(map: Map, player: Player) {
    player.moveHorizontal(map, -1);
  }
}

class Up implements Input {
  handle(map: Map, player: Player) {
    player.moveVertical(map, -1);
  }
}

class Down implements Input {
  handle(map: Map, player: Player) {
    player.moveVertical(map, 1);
  }
}

window.addEventListener("keydown", (e) => {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});

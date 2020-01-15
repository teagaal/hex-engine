import Point from "./Point";

export default class Grid<T> {
  _kind = "grid";
  size: Point;
  data: Array<Array<T>>;
  defaultValue: T;

  constructor(rows: number, columns: number, defaultValue: T);
  constructor(rowsAndCols: Point, defaultValue: T);
  constructor(
    rowsOrRowsAndCols: number | Point,
    columnsOrDefaultValue: number | T,
    maybeDefaultValue?: T
  ) {
    let rows: number, columns: number, defaultValue: T;
    if (
      typeof rowsOrRowsAndCols === "number" &&
      typeof columnsOrDefaultValue === "number"
    ) {
      rows = rowsOrRowsAndCols;
      columns = columnsOrDefaultValue;
      defaultValue = maybeDefaultValue!;
    } else {
      rows = (rowsOrRowsAndCols as Point).x;
      columns = (rowsOrRowsAndCols as Point).y;
      defaultValue = maybeDefaultValue as T;
    }

    this.data = Array(columns)
      .fill(defaultValue)
      .map(() => Array(rows).fill(defaultValue));

    this.defaultValue = defaultValue;
    this.size = new Point(rows, columns);
  }

  setData(data: Array<T>) {
    let currentX = 0;
    let currentY = 0;
    for (const item of data) {
      if (currentX + 1 > this.size.x) {
        currentY++;
        currentX = 0;
      }
      this.set(currentX, currentY, item);
      currentX++;
    }
  }

  get(row: number, column: number): T;
  get(pos: Point): T;
  get(rowOrPos: number | Point, maybeColumn?: number) {
    let row: number, column: number;
    if (typeof rowOrPos === "number" && typeof maybeColumn === "number") {
      row = rowOrPos;
      column = maybeColumn;
    } else {
      row = (rowOrPos as Point).x;
      column = (rowOrPos as Point).y;
    }

    if (
      row > this.size.x - 1 ||
      row < 0 ||
      column > this.size.y - 1 ||
      column < 0
    ) {
      return this.defaultValue;
    } else {
      return this.data[column][row];
    }
  }

  set(row: number, column: number, value: T): void;
  set(pos: Point, value: T): void;
  set(rowOrPos: number | Point, columnOrValue: number | T, maybeValue?: T) {
    let row: number, column: number, value: T;
    if (typeof rowOrPos === "number" && typeof columnOrValue === "number") {
      row = rowOrPos;
      column = columnOrValue;
      value = maybeValue!;
    } else {
      row = (rowOrPos as Point).x;
      column = (rowOrPos as Point).y;
      value = columnOrValue as T;
    }

    if (
      row > this.size.x - 1 ||
      row < 0 ||
      column > this.size.y - 1 ||
      column < 0
    ) {
      throw new Error(
        `Attempted to set data into grid of size '${this.size.x}, ${this.size.y}' at out-of-bounds index: ${row}, ${column}`
      );
    } else {
      this.data[column][row] = value;
    }
  }

  *contents(): Generator<[number, number, T]> {
    for (let i = 0; i < this.size.x; i++) {
      for (let j = 0; j < this.size.y; j++) {
        yield [i, j, this.get(i, j)];
      }
    }
  }
}

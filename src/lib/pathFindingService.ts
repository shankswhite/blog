const GRID_SIZE = 20;
const START: Coordinate = [0, 0];
const GOAL: Coordinate = [GRID_SIZE - 1, GRID_SIZE - 1];

type Coordinate = [number, number];

export interface PathFindingResponse {
  map: number[][];
  pathInformation: PathStep[];
}

export interface PathStep {
  [key: string]:
    | {
        [coord: string]: number[][];
      }
    | number[][]
    | undefined;
  finalPath?: number[][];
}

const keyFor = ([row, col]: Coordinate) => `${row},${col}`;

const neighborsFor = ([row, col]: Coordinate): Coordinate[] =>
  [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ].filter(
    ([nextRow, nextCol]) =>
      nextRow >= 0 &&
      nextRow < GRID_SIZE &&
      nextCol >= 0 &&
      nextCol < GRID_SIZE
  ) as Coordinate[];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function blankMap(): number[][] {
  return Array.from({ length: GRID_SIZE }, (_, row) =>
    Array.from({ length: GRID_SIZE }, (_, col) =>
      row === START[0] && col === START[1]
        ? 1
        : row === GOAL[0] && col === GOAL[1]
          ? 2
          : 0
    )
  );
}

function placeObstacles(
  protectedCoordinates: Set<string>,
  obstacleCount: number
): number[][] {
  const map = blankMap();
  const candidates: Coordinate[] = [];

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const coordinate: Coordinate = [row, col];
      if (!protectedCoordinates.has(keyFor(coordinate))) {
        candidates.push(coordinate);
      }
    }
  }

  for (const [row, col] of shuffle(candidates).slice(0, obstacleCount)) {
    map[row][col] = 6;
  }

  return map;
}

function guaranteedMap(obstacleCount: number): number[][] {
  const corridor = new Set<string>([keyFor(START), keyFor(GOAL)]);
  let row = START[0];
  let col = START[1];

  while (row !== GOAL[0] || col !== GOAL[1]) {
    const canMoveDown = row < GOAL[0];
    const canMoveRight = col < GOAL[1];

    if (canMoveDown && canMoveRight) {
      if (Math.random() < 0.5) row += 1;
      else col += 1;
    } else if (canMoveDown) {
      row += 1;
    } else {
      col += 1;
    }

    corridor.add(keyFor([row, col]));
  }

  return placeObstacles(corridor, obstacleCount);
}

function reconstructPath(
  parents: Map<string, string>,
  finalCoordinate: Coordinate
): Coordinate[] {
  const path: Coordinate[] = [finalCoordinate];
  let currentKey = keyFor(finalCoordinate);

  while (currentKey !== keyFor(START)) {
    const parentKey = parents.get(currentKey);
    if (!parentKey) return [];
    const [row, col] = parentKey.split(",").map(Number);
    path.unshift([row, col]);
    currentKey = parentKey;
  }

  return path;
}

function solveMap(map: number[][], algorithm: number) {
  const frontier: Array<{
    coordinate: Coordinate;
    distance: number;
    priority: number;
  }> = [{ coordinate: START, distance: 0, priority: 0 }];
  const distances = new Map<string, number>([[keyFor(START), 0]]);
  const parents = new Map<string, string>();
  const visited = new Set<string>();
  const steps: PathStep[] = [];

  while (frontier.length > 0) {
    frontier.sort((left, right) => left.priority - right.priority);
    const current = frontier.shift();
    if (!current) break;

    const currentKey = keyFor(current.coordinate);
    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    if (currentKey === keyFor(GOAL)) {
      return {
        path: reconstructPath(parents, current.coordinate),
        steps,
      };
    }

    const allNeighbors = neighborsFor(current.coordinate);
    steps.push({
      search: {
        [currentKey]: allNeighbors,
      },
    });

    for (const neighbor of allNeighbors) {
      const [row, col] = neighbor;
      if (map[row][col] === 6) continue;

      const neighborKey = keyFor(neighbor);
      const nextDistance = current.distance + 1;
      if (nextDistance >= (distances.get(neighborKey) ?? Infinity)) continue;

      distances.set(neighborKey, nextDistance);
      parents.set(neighborKey, currentKey);

      const heuristic =
        algorithm === 0
          ? 0
          : Math.abs(GOAL[0] - row) + Math.abs(GOAL[1] - col);

      frontier.push({
        coordinate: neighbor,
        distance: nextDistance,
        priority: nextDistance + heuristic,
      });
    }
  }

  return { path: [] as Coordinate[], steps };
}

function createSolvableMap(algorithm: number, obstacleCount: number) {
  const safeObstacleCount = Math.max(
    20,
    Math.min(200, Math.round(obstacleCount))
  );

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const map = placeObstacles(
      new Set([keyFor(START), keyFor(GOAL)]),
      safeObstacleCount
    );
    const result = solveMap(map, algorithm);
    if (result.path.length > 0) return { map, ...result };
  }

  const map = guaranteedMap(safeObstacleCount);
  return { map, ...solveMap(map, algorithm) };
}

export const pathFindingService = {
  generateNewMap: async (
    algorithm: number,
    obstacleCount: number
  ): Promise<PathFindingResponse> => {
    // The archived service exposed Jump Point Search as option 2. The local
    // edition uses the same admissible A* core for that option so it stays
    // correct and account-free without claiming JPS-specific pruning.
    const safeAlgorithm = algorithm === 0 ? 0 : 1;
    const { map, path, steps } = createSolvableMap(
      safeAlgorithm,
      obstacleCount
    );

    return {
      map,
      pathInformation: [...steps, { finalPath: path }],
    };
  },
};

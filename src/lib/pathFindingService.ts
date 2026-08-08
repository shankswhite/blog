const PATHFINDING_API_URL =
  "https://ozqm91hsm0.execute-api.us-east-1.amazonaws.com/pathfinding-generator";
const REQUEST_TIMEOUT_MS = 15_000;

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

function isPathFindingResponse(value: unknown): value is PathFindingResponse {
  if (!value || typeof value !== "object") return false;

  const response = value as Partial<PathFindingResponse>;
  return (
    Array.isArray(response.map) &&
    response.map.every(
      (row) => Array.isArray(row) && row.every((cell) => typeof cell === "number")
    ) &&
    Array.isArray(response.pathInformation)
  );
}

export const pathFindingService = {
  generateNewMap: async (
    algorithm: number,
    obstacleCount: number
  ): Promise<PathFindingResponse> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(PATHFINDING_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ algorithm, obstacleCount }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Pathfinding service returned ${response.status} ${response.statusText}`.trim()
        );
      }

      const result: unknown = await response.json();
      if (!isPathFindingResponse(result)) {
        throw new Error("Pathfinding service returned an invalid response");
      }

      return result;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(
          `Pathfinding service timed out after ${REQUEST_TIMEOUT_MS / 1_000} seconds`,
          { cause: error }
        );
      }

      if (error instanceof Error) {
        throw new Error(`Unable to load pathfinding data: ${error.message}`, {
          cause: error,
        });
      }

      throw new Error("Unable to load pathfinding data");
    } finally {
      clearTimeout(timeout);
    }
  },
};

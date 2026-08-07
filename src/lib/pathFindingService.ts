const BASE_URL = 'https://ozqm91hsm0.execute-api.us-east-1.amazonaws.com/pathfinding-generator';

export interface PathFindingResponse {
  map: number[][];
  pathInformation: PathStep[];
}

export interface PathStep {
  [key: string]: {
    [coord: string]: number[][];
  } | number[][] | undefined;
  finalPath?: number[][];
}

export const pathFindingService = {
  generateNewMap: async (algorithm: number, obstacleCount: number): Promise<PathFindingResponse> => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          algorithm,
          obstacleCount,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating map:', error);
      throw error;
    }
  }
};

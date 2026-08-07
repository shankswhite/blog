"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './PathFindingComponent.module.scss';
import { pathFindingService } from '@/lib/pathFindingService';

const GRID_SIZE = 20;

interface NodeType {
  row: number;
  col: number;
  status: number;
  distanceToStart?: number;
  distanceToEnd?: number;
}

function convertToOrthogonalPath(path: number[][]): number[][] {
  if (!path || path.length === 0) return [];
  return path;
}

function PathFindingComponent() {
  const [grid, setGrid] = useState<NodeType[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [algorithm, setAlgorithm] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [pathInfo, setPathInfo] = useState<any>(null);
  const [obstacleCount, setObstacleCount] = useState<number>(GRID_SIZE);
  const [visitedCount, setVisitedCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasMountedAlgorithmEffect = useRef(false);

  const createInitialGrid = useCallback(() => {
    const initialGrid: NodeType[][] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      const currentRow: NodeType[] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        currentRow.push({
          row,
          col,
          status: (row === 0 && col === 0) ? 1 :
                  (row === GRID_SIZE - 1 && col === GRID_SIZE - 1) ? 2 :
                  0,
          distanceToStart: Infinity,
          distanceToEnd: Infinity,
        });
      }
      initialGrid.push(currentRow);
    }
    return initialGrid;
  }, []);

  useEffect(() => {
    const initializeGrid = async () => {
      try {
        const { map, pathInformation } = await pathFindingService.generateNewMap(0, GRID_SIZE);

        if (map && map.length > 0) {
          const processedMap = map.map((row: number[], rowIndex: number) =>
            row.map((status: number, colIndex: number) => ({
              row: rowIndex,
              col: colIndex,
              status: status,
              distanceToStart: Infinity,
              distanceToEnd: Infinity
            }))
          );

          setGrid(processedMap);
          setPathInfo(pathInformation);
        } else {
          setGrid(createInitialGrid());
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize grid:', error);
        setGrid(createInitialGrid());
        setErrorMessage('The live pathfinding service is unavailable. You can still inspect the grid layout and project notes.');
        setIsLoading(false);
      }
    };

    initializeGrid();
  }, [createInitialGrid]);

  const regenerateMap = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await pathFindingService.generateNewMap(algorithm, obstacleCount);

      if (response.map && response.map.length > 0) {
        const processedMap = response.map.map((row: number[], rowIndex: number) =>
          row.map((status: number, colIndex: number) => ({
            row: rowIndex,
            col: colIndex,
            status: status,
            distanceToStart: Infinity,
            distanceToEnd: Infinity
          }))
        );

        setGrid(processedMap);
        setPathInfo(response.pathInformation);
        setCurrentStep(0);
        setVisitedCount(0);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to regenerate map:', error);
      setErrorMessage('A new map could not be generated. Please try again in a moment.');
      setIsLoading(false);
    }
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const nextStep = async () => {
    if (!pathInfo || currentStep >= pathInfo.length) {
      return;
    }

    const currentLevelInfo = pathInfo[currentStep];
    const newGrid = grid.map(row => row.map(cell => ({...cell})));
    let newVisitedCount = visitedCount;

    if (currentLevelInfo.finalPath) {
      newGrid.forEach(row => {
        row.forEach(node => {
          if (node.status === 4) node.status = 3;
        });
      });

      for (const [row, col] of convertToOrthogonalPath(currentLevelInfo.finalPath)) {
        if (
          newGrid[row]?.[col] &&
          ![1, 2, 6, 7].includes(newGrid[row][col].status)
        ) {
          newGrid[row][col].status = 5;
        }
      }

      setGrid(newGrid);
      setCurrentStep(prev => prev + 1);
      return;
    }

    Object.entries(currentLevelInfo).forEach(([_, nodeInfo]: [string, any]) => {
      Object.keys(nodeInfo).forEach(coordStr => {
        const [row, col] = coordStr.split(',').map(Number);

        if (!isNaN(row) && !isNaN(col) &&
            row >= 0 && row < GRID_SIZE &&
            col >= 0 && col < GRID_SIZE) {

          if (newGrid[row][col].status !== 1 &&
              newGrid[row][col].status !== 2 &&
              newGrid[row][col].status !== 6) {
            if (newGrid[row][col].status === 4) {
              newGrid[row][col].status = 3;
              newVisitedCount++;
            } else if (newGrid[row][col].status === 0) {
              newGrid[row][col].status = 3;
              newVisitedCount++;
            }
          }

          const neighbors = nodeInfo[coordStr];
          if (Array.isArray(neighbors)) {
            neighbors.forEach(([nextRow, nextCol]: number[]) => {
              if (nextRow >= 0 && nextRow < GRID_SIZE &&
                  nextCol >= 0 && nextCol < GRID_SIZE) {
                if (newGrid[nextRow][nextCol].status === 6) {
                  newGrid[nextRow][nextCol].status = 7;
                } else if (newGrid[nextRow][nextCol].status === 0) {
                  newGrid[nextRow][nextCol].status = 4;
                }
              }
            });
          }
        }
      });
    });

    setGrid(newGrid);
    setVisitedCount(newVisitedCount);
    setCurrentStep(prev => prev + 1);
  };

  const goToEnd = async () => {
    if (!pathInfo || pathInfo.length === 0) return;
    setIsProcessing(true);

    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    let newVisitedCount = visitedCount;
    const animationDelay = Math.max(
      2,
      Math.min(18, Math.floor(1600 / Math.max(pathInfo.length, 1)))
    );

    for (let step = currentStep; step < pathInfo.length - 1; step++) {
      const currentLevelInfo = pathInfo[step];
      Object.entries(currentLevelInfo).forEach(([_, nodeInfo]: [string, any]) => {
        Object.keys(nodeInfo).forEach(coordStr => {
          const [row, col] = coordStr.split(',').map(Number);

          if (
            !isNaN(row) &&
            !isNaN(col) &&
            row >= 0 &&
            row < GRID_SIZE &&
            col >= 0 &&
            col < GRID_SIZE
          ) {
            if (
              newGrid[row][col].status !== 1 &&
              newGrid[row][col].status !== 2 &&
              newGrid[row][col].status !== 6
            ) {
              if (newGrid[row][col].status === 4) {
                newGrid[row][col].status = 3;
                newVisitedCount++;
              } else if (newGrid[row][col].status === 0) {
                newGrid[row][col].status = 3;
                newVisitedCount++;
              }
            }

            const neighbors = nodeInfo[coordStr];
            if (Array.isArray(neighbors)) {
              neighbors.forEach(([nextRow, nextCol]: number[]) => {
                if (
                  nextRow >= 0 &&
                  nextRow < GRID_SIZE &&
                  nextCol >= 0 &&
                  nextCol < GRID_SIZE
                ) {
                  if (newGrid[nextRow][nextCol].status === 6) {
                    newGrid[nextRow][nextCol].status = 7;
                  } else if (newGrid[nextRow][nextCol].status === 0) {
                    newGrid[nextRow][nextCol].status = 4;
                  }
                }
              });
            }
          }
        });
      });

      setGrid([...newGrid.map(row => [...row])]);
      setVisitedCount(newVisitedCount);
      await sleep(animationDelay);
    }

    const finalPathStep = pathInfo[pathInfo.length - 1];
    if (finalPathStep && finalPathStep.finalPath) {
      newGrid.forEach(row => {
        row.forEach(node => {
          if (node.status === 4) {
            node.status = 3;
          }
        });
      });

      const optimizedPath = convertToOrthogonalPath(finalPathStep.finalPath);

      for (const [row, col] of optimizedPath) {
        if (newGrid[row][col].status !== 6 &&
            newGrid[row][col].status !== 7 &&
            newGrid[row][col].status !== 1 &&
            newGrid[row][col].status !== 2) {
          newGrid[row][col].status = 5;
          setGrid([...newGrid.map(r => [...r])]);
          await sleep(animationDelay);
        }
      }
    }

    setCurrentStep(pathInfo.length);
    setIsProcessing(false);
  };

  useEffect(() => {
    return () => {
      setIsProcessing(false);
    };
  }, []);

  const getNodeClassName = (node: NodeType) => {
    const baseClass = styles.node;

    switch (node.status) {
      case 0:
        return `${baseClass} ${styles.nodeEmpty}`;
      case 1:
        return `${baseClass} ${styles.nodeStart}`;
      case 2:
        return `${baseClass} ${styles.nodeEnd}`;
      case 3:
        return `${baseClass} ${styles.nodeVisited}`;
      case 4:
        return `${baseClass} ${styles.nodeNext}`;
      case 5:
        return `${baseClass} ${styles.nodePath}`;
      case 6:
        return `${baseClass} ${styles.nodeObstacle}`;
      case 7:
        return `${baseClass} ${styles.nodeBlock}`;
      default:
        return `${baseClass} ${styles.nodeEmpty}`;
    }
  };

  useEffect(() => {
    if (!hasMountedAlgorithmEffect.current) {
      hasMountedAlgorithmEffect.current = true;
      return;
    }
    regenerateMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm]);

  if (isLoading) {
    return (
      <div className={styles.loading} role="status">
        <span className={styles.loadingDot} />
        Preparing the pathfinding grid…
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.workspace}>
        <div>
          <div
            className={styles.gridContainer}
            role="img"
            aria-label={`20 by 20 ${['Dijkstra', 'A star', 'legacy JPS compatibility mode using A star'][algorithm]} search grid. ${visitedCount} nodes traversed.`}
          >
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.row}>
                {row.map((node, nodeIndex) => (
                  <span
                    key={`${rowIndex}-${nodeIndex}`}
                    className={getNodeClassName(node)}
                    aria-hidden="true"
                  />
                ))}
              </div>
            ))}
          </div>

          <div className={styles.legend} aria-label="Grid legend">
            {[
              [styles.nodeStart, 'Start'],
              [styles.nodeEnd, 'Goal'],
              [styles.nodeVisited, 'Visited'],
              [styles.nodeNext, 'Frontier'],
              [styles.nodePath, 'Final path'],
              [styles.nodeObstacle, 'Obstacle'],
            ].map(([className, label]) => (
              <span key={label} className={styles.legendItem}>
                <span className={`${styles.legendSwatch} ${className}`} aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <aside className={styles.controls} aria-label="Pathfinding controls">
          <div>
            <p className={styles.controlEyebrow}>Experiment controls</p>
            <h2 className={styles.controlTitle}>Shape the search.</h2>
            <p className={styles.controlCopy}>
              Choose an algorithm, generate a map, then reveal the search one
              step at a time or animate directly to the result.
            </p>
          </div>

          <label className={styles.fieldLabel} htmlFor="pathfinding-algorithm">
            Algorithm
            <select
              id="pathfinding-algorithm"
              value={algorithm}
              onChange={(event) => setAlgorithm(Number(event.target.value))}
              disabled={isProcessing}
            >
              <option value={0}>Dijkstra</option>
              <option value={1}>A*</option>
              <option value={2}>Legacy JPS mode (A* fallback)</option>
            </select>
          </label>

          <label className={styles.fieldLabel} htmlFor="obstacleCount">
            Obstacles
            <input
              id="obstacleCount"
              type="number"
              value={obstacleCount}
              onChange={(event) =>
                setObstacleCount(
                  Math.max(20, Math.min(200, Number.parseInt(event.target.value) || 20))
                )
              }
              min="20"
              max="200"
              disabled={isProcessing}
            />
          </label>

          <div className={styles.buttonStack}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={regenerateMap}
              disabled={isProcessing}
            >
              Generate new map
            </button>
            <div className={styles.buttonRow}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={nextStep}
                disabled={isProcessing || !pathInfo || currentStep >= pathInfo.length}
              >
                Next step
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={goToEnd}
                disabled={isProcessing || !pathInfo || currentStep >= pathInfo.length}
              >
                {isProcessing ? 'Running…' : 'Go to end'}
              </button>
            </div>
          </div>

          <dl className={styles.stats}>
            <div>
              <dt>Algorithm</dt>
              <dd>{['Dijkstra', 'A*', 'JPS → A*'][algorithm]}</dd>
            </div>
            <div>
              <dt>Traversed</dt>
              <dd>{visitedCount}</dd>
            </div>
            <div>
              <dt>Step</dt>
              <dd>{currentStep}</dd>
            </div>
          </dl>

          <p className={styles.liveStatus} aria-live="polite">
            {isProcessing
              ? 'Animating the remaining search steps.'
              : currentStep >= (pathInfo?.length ?? Number.POSITIVE_INFINITY)
                ? 'Search complete. The final route is highlighted.'
                : 'Ready for the next step.'}
          </p>

          {errorMessage && (
            <p className={styles.error} role="alert">
              {errorMessage}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

export default PathFindingComponent;

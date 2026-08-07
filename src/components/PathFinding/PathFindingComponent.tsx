"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './PathFindingComponent.module.scss';
import GlowingButton from './GlowingButton';
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
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
      audioRef.current.pause();
    }
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
        setIsLoading(false);
      }
    };

    initializeGrid();
  }, [createInitialGrid]);

  const regenerateMap = async () => {
    try {
      setIsLoading(true);
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
    const animationDelay = algorithm === 1 ? 2 : 50;

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

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(error => {
          console.log('Audio playback failed:', error);
        });
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96 text-lg">Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <audio
        ref={audioRef}
        src="/audio/algorithm-music.mp3"
        preload="none"
        loop
      />

      <div className={styles.mainContent}>
        <div className={styles['grid-container']}>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              {row.map((node, nodeIndex) => {
                const inlineStyle = node.status === 4 ? {
                  backgroundColor: '#00f',
                  border: '2px solid yellow',
                  zIndex: 10,
                  position: 'relative' as const,
                  boxShadow: '0 0 10px blue'
                } : undefined;

                return (
                  <div
                    key={`${rowIndex}-${nodeIndex}`}
                    className={getNodeClassName(node)}
                    style={inlineStyle}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className={styles.controls}>
          <div className={styles.selectWrapper}>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(Number(e.target.value))}
            >
              <option value={0}>Dijkstra</option>
              <option value={1}>A*</option>
              <option value={2}>JPS</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <label htmlFor="obstacleCount">Obstacle Num:</label>
              <input
                id="obstacleCount"
                type="number"
                value={obstacleCount}
                onChange={(e) => setObstacleCount(Math.max(20, Math.min(200, parseInt(e.target.value) || 20)))}
                min="20"
                max="200"
              />
              <button
                className={styles.musicToggle}
                onClick={toggleMusic}
                aria-label="Toggle music"
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
            </div>
          </div>

          <GlowingButton
            color="#ff6b6b"
            onClick={regenerateMap}
          >
            Generate New Map
          </GlowingButton>

          <GlowingButton
            color="#2ecc71"
            onClick={nextStep}
          >
            Next Step
          </GlowingButton>

          <GlowingButton
            color="#9c27b0"
            onClick={goToEnd}
            disabled={isProcessing}
          >
            Go to End
          </GlowingButton>

          <div className={styles.stats}>
            Nodes Traversed: {visitedCount}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PathFindingComponent;

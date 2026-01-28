export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type Cell = {
  value: number | null;
  isFixed: boolean;
  notes: number[];
};

export type Grid = Cell[][];

// Check if a number is valid in a specific position
function isValid(grid: (number | null)[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
}

// Fill the grid with valid numbers using backtracking
function fillGrid(grid: (number | null)[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        // Randomize the order of numbers to try
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

        for (const num of numbers) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) {
              return true;
            }
            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Count solutions (used to ensure unique solution)
function countSolutions(grid: (number | null)[][], count: number = 0): number {
  if (count > 1) return count; // Early exit if more than one solution

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            count = countSolutions(grid, count);
            grid[row][col] = null;
            if (count > 1) return count;
          }
        }
        return count;
      }
    }
  }
  return count + 1;
}

// Remove numbers from grid based on difficulty
function removeNumbers(grid: (number | null)[][], difficulty: Difficulty): void {
  const cellsToRemove: Record<Difficulty, number> = {
    easy: 35,
    medium: 45,
    hard: 52,
    expert: 58,
  };

  const toRemove = cellsToRemove[difficulty];
  const positions: [number, number][] = [];

  // Create list of all positions
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push([i, j]);
    }
  }

  // Shuffle positions
  positions.sort(() => Math.random() - 0.5);

  let removed = 0;
  for (const [row, col] of positions) {
    if (removed >= toRemove) break;

    const backup = grid[row][col];
    grid[row][col] = null;

    // Make a copy to test uniqueness
    const testGrid = grid.map((r) => [...r]);
    const solutions = countSolutions(testGrid);

    if (solutions !== 1) {
      // Restore if not unique
      grid[row][col] = backup;
    } else {
      removed++;
    }
  }
}

// Generate a new Sudoku puzzle
export function generateSudoku(difficulty: Difficulty = 'medium'): { puzzle: Grid; solution: number[][] } {
  // Create empty grid
  const solutionGrid: (number | null)[][] = Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));

  // Fill it completely
  fillGrid(solutionGrid);

  // Store the solution
  const solution = solutionGrid.map((row) => row.map((cell) => cell as number));

  // Remove numbers based on difficulty
  removeNumbers(solutionGrid, difficulty);

  // Convert to Cell format
  const puzzle: Grid = solutionGrid.map((row) =>
    row.map((value) => ({
      value,
      isFixed: value !== null,
      notes: [],
    }))
  );

  return { puzzle, solution };
}

// Check if the current grid is complete and correct
export function checkSolution(grid: Grid, solution: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col].value !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}

// Check if a move is valid
export function isValidMove(grid: Grid, row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (x !== col && grid[row][x].value === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (x !== row && grid[x][col].value === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const r = boxRow + i;
      const c = boxCol + j;
      if (r !== row && c !== col && grid[r][c].value === num) return false;
    }
  }

  return true;
}

// Check if grid is complete (all cells filled)
export function isComplete(grid: Grid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col].value === null) return false;
    }
  }
  return true;
}

// Get hint (reveal a random empty cell)
export function getHint(grid: Grid, solution: number[][]): { row: number; col: number; value: number } | null {
  const emptyCells: { row: number; col: number }[] = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col].value === null) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const { row, col } = emptyCells[randomIndex];

  return { row, col, value: solution[row][col] };
}

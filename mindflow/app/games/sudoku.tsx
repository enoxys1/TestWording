import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeStore } from '../../src/stores/themeStore';
import { useGameStore } from '../../src/stores/gameStore';
import { Card, Button } from '../../src/components/ui';
import {
  generateSudoku,
  Grid,
  Cell,
  Difficulty,
  checkSolution,
  isValidMove,
  isComplete,
} from '../../src/games/sudoku/generator';

interface SudokuCellProps {
  cell: Cell;
  row: number;
  col: number;
  isSelected: boolean;
  isHighlighted: boolean;
  isError: boolean;
  onPress: () => void;
}

function SudokuCell({
  cell,
  row,
  col,
  isSelected,
  isHighlighted,
  isError,
  onPress,
}: SudokuCellProps) {
  const theme = useThemeStore((s) => s.getTheme());
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const getBackgroundColor = () => {
    if (isSelected) return theme.colors.primary + '40';
    if (isHighlighted) return theme.colors.surfaceLight;
    return 'transparent';
  };

  const getBorderStyle = () => {
    const borders: any = {
      borderColor: theme.colors.border,
      borderWidth: 0.5,
    };

    // Thicker borders for 3x3 boxes
    if (col % 3 === 0) borders.borderLeftWidth = 2;
    if (col === 8) borders.borderRightWidth = 2;
    if (row % 3 === 0) borders.borderTopWidth = 2;
    if (row === 8) borders.borderBottomWidth = 2;

    return borders;
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          animatedStyle,
          {
            width: 38,
            height: 38,
            backgroundColor: getBackgroundColor(),
            justifyContent: 'center',
            alignItems: 'center',
            ...getBorderStyle(),
          },
        ]}
      >
        {cell.value !== null ? (
          <Text
            style={{
              color: isError
                ? '#EF4444'
                : cell.isFixed
                ? theme.colors.text
                : theme.colors.primary,
              fontSize: 20,
              fontWeight: cell.isFixed ? '700' : '500',
            }}
          >
            {cell.value}
          </Text>
        ) : cell.notes.length > 0 ? (
          <View className="flex-row flex-wrap justify-center items-center" style={{ width: 36, height: 36 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <Text
                key={n}
                style={{
                  width: 12,
                  height: 12,
                  fontSize: 8,
                  textAlign: 'center',
                  color: cell.notes.includes(n) ? theme.colors.textSecondary : 'transparent',
                }}
              >
                {n}
              </Text>
            ))}
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

interface NumberPadProps {
  onNumberPress: (num: number) => void;
  onDelete: () => void;
  onNotesToggle: () => void;
  notesMode: boolean;
  numberCounts: Record<number, number>;
}

function NumberPad({ onNumberPress, onDelete, onNotesToggle, notesMode, numberCounts }: NumberPadProps) {
  const theme = useThemeStore((s) => s.getTheme());

  return (
    <View className="items-center">
      <View className="flex-row mb-3">
        {[1, 2, 3, 4, 5].map((num) => {
          const remaining = 9 - (numberCounts[num] || 0);
          const isComplete = remaining === 0;

          return (
            <Pressable
              key={num}
              onPress={() => !isComplete && onNumberPress(num)}
              className="mx-1"
              style={{
                width: 56,
                height: 56,
                backgroundColor: isComplete ? theme.colors.surface : theme.colors.surfaceLight,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: isComplete ? 0.5 : 1,
              }}
            >
              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 24,
                  fontWeight: '600',
                }}
              >
                {num}
              </Text>
              {!isComplete && (
                <Text
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: 10,
                    position: 'absolute',
                    bottom: 4,
                  }}
                >
                  {remaining}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      <View className="flex-row">
        {[6, 7, 8, 9].map((num) => {
          const remaining = 9 - (numberCounts[num] || 0);
          const isComplete = remaining === 0;

          return (
            <Pressable
              key={num}
              onPress={() => !isComplete && onNumberPress(num)}
              className="mx-1"
              style={{
                width: 56,
                height: 56,
                backgroundColor: isComplete ? theme.colors.surface : theme.colors.surfaceLight,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: isComplete ? 0.5 : 1,
              }}
            >
              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 24,
                  fontWeight: '600',
                }}
              >
                {num}
              </Text>
              {!isComplete && (
                <Text
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: 10,
                    position: 'absolute',
                    bottom: 4,
                  }}
                >
                  {remaining}
                </Text>
              )}
            </Pressable>
          );
        })}

        {/* Delete button */}
        <Pressable
          onPress={onDelete}
          className="mx-1"
          style={{
            width: 56,
            height: 56,
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="backspace-outline" size={24} color={theme.colors.text} />
        </Pressable>
      </View>

      {/* Notes toggle */}
      <Pressable
        onPress={onNotesToggle}
        className="mt-3 flex-row items-center px-4 py-2 rounded-full"
        style={{
          backgroundColor: notesMode ? theme.colors.primary : theme.colors.surface,
        }}
      >
        <Ionicons
          name="pencil"
          size={18}
          color={notesMode ? '#fff' : theme.colors.textSecondary}
        />
        <Text
          className="ml-2 font-medium"
          style={{
            color: notesMode ? '#fff' : theme.colors.textSecondary,
          }}
        >
          Notes {notesMode ? 'ON' : 'OFF'}
        </Text>
      </Pressable>
    </View>
  );
}

export default function SudokuScreen() {
  const router = useRouter();
  const theme = useThemeStore((s) => s.getTheme());
  const { updateGameStats, completeDailyChallenge } = useGameStore();

  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [grid, setGrid] = useState<Grid | null>(null);
  const [solution, setSolution] = useState<number[][] | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [notesMode, setNotesMode] = useState(false);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [startTime, setStartTime] = useState(Date.now());
  const [timer, setTimer] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won'>('playing');
  const [showResult, setShowResult] = useState(false);

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  // Timer
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const interval = setInterval(() => {
      setTimer(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, gameStatus]);

  const startNewGame = () => {
    const { puzzle, solution: sol } = generateSudoku(difficulty);
    setGrid(puzzle);
    setSolution(sol);
    setSelectedCell(null);
    setErrors(new Set());
    setStartTime(Date.now());
    setTimer(0);
    setGameStatus('playing');
    setShowResult(false);
  };

  const handleCellPress = (row: number, col: number) => {
    if (grid && !grid[row][col].isFixed) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberPress = useCallback(
    (num: number) => {
      if (!grid || !selectedCell || !solution) return;
      const { row, col } = selectedCell;
      if (grid[row][col].isFixed) return;

      const newGrid = grid.map((r) => r.map((c) => ({ ...c, notes: [...c.notes] })));

      if (notesMode) {
        // Toggle note
        const notes = newGrid[row][col].notes;
        const index = notes.indexOf(num);
        if (index >= 0) {
          notes.splice(index, 1);
        } else {
          notes.push(num);
        }
        newGrid[row][col].notes = notes;
      } else {
        // Set value
        newGrid[row][col].value = num;
        newGrid[row][col].notes = [];

        // Check for errors
        const newErrors = new Set<string>();
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            const val = newGrid[r][c].value;
            if (val !== null && !isValidMove(newGrid, r, c, val)) {
              newErrors.add(`${r}-${c}`);
            }
          }
        }
        setErrors(newErrors);

        // Check for win
        if (isComplete(newGrid) && checkSolution(newGrid, solution)) {
          setGameStatus('won');
          const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
          updateGameStats('sudoku', true, timeElapsed);
          completeDailyChallenge('sudoku', 100, timeElapsed);
          setTimeout(() => setShowResult(true), 500);
        }
      }

      setGrid(newGrid);
    },
    [grid, selectedCell, notesMode, solution, startTime]
  );

  const handleDelete = useCallback(() => {
    if (!grid || !selectedCell) return;
    const { row, col } = selectedCell;
    if (grid[row][col].isFixed) return;

    const newGrid = grid.map((r) => r.map((c) => ({ ...c, notes: [...c.notes] })));
    newGrid[row][col].value = null;
    newGrid[row][col].notes = [];
    setGrid(newGrid);

    // Recheck errors
    const newErrors = new Set<string>();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = newGrid[r][c].value;
        if (val !== null && !isValidMove(newGrid, r, c, val)) {
          newErrors.add(`${r}-${c}`);
        }
      }
    }
    setErrors(newErrors);
  }, [grid, selectedCell]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate number counts for the pad
  const numberCounts: Record<number, number> = {};
  if (grid) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = grid[r][c].value;
        if (val !== null) {
          numberCounts[val] = (numberCounts[val] || 0) + 1;
        }
      }
    }
  }

  const difficulties: { id: Difficulty; label: string }[] = [
    { id: 'easy', label: 'Facile' },
    { id: 'medium', label: 'Moyen' },
    { id: 'hard', label: 'Difficile' },
    { id: 'expert', label: 'Expert' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <Animated.View
        entering={FadeIn.delay(100)}
        className="flex-row items-center justify-between px-4 py-3"
      >
        <Pressable onPress={() => router.back()} className="p-2">
          <Ionicons name="close" size={28} color={theme.colors.text} />
        </Pressable>
        <View className="items-center">
          <Text style={{ color: theme.colors.text }} className="text-xl font-bold">
            Sudoku
          </Text>
          <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
            {formatTime(timer)}
          </Text>
        </View>
        <Pressable onPress={startNewGame} className="p-2">
          <Ionicons name="refresh" size={24} color={theme.colors.primary} />
        </Pressable>
      </Animated.View>

      {/* Difficulty selector */}
      <Animated.View entering={FadeInDown.delay(150)} className="flex-row justify-center mb-4">
        {difficulties.map((d) => (
          <Pressable
            key={d.id}
            onPress={() => setDifficulty(d.id)}
            className="px-3 py-1 mx-1 rounded-full"
            style={{
              backgroundColor: difficulty === d.id ? theme.colors.primary : theme.colors.surface,
            }}
          >
            <Text
              style={{
                color: difficulty === d.id ? '#fff' : theme.colors.textSecondary,
                fontSize: 12,
                fontWeight: '500',
              }}
            >
              {d.label}
            </Text>
          </Pressable>
        ))}
      </Animated.View>

      {/* Grid */}
      <Animated.View entering={FadeInUp.delay(200)} className="items-center mb-6">
        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 8,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: theme.colors.border,
          }}
        >
          {grid?.map((row, rowIndex) => (
            <View key={rowIndex} className="flex-row">
              {row.map((cell, colIndex) => {
                const isSelected =
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                const isHighlighted =
                  selectedCell &&
                  (selectedCell.row === rowIndex ||
                    selectedCell.col === colIndex ||
                    (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
                      Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3)));
                const isError = errors.has(`${rowIndex}-${colIndex}`);

                return (
                  <SudokuCell
                    key={`${rowIndex}-${colIndex}`}
                    cell={cell}
                    row={rowIndex}
                    col={colIndex}
                    isSelected={isSelected}
                    isHighlighted={!!isHighlighted && !isSelected}
                    isError={isError}
                    onPress={() => handleCellPress(rowIndex, colIndex)}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Number Pad */}
      <Animated.View entering={FadeInUp.delay(300)} className="px-4">
        <NumberPad
          onNumberPress={handleNumberPress}
          onDelete={handleDelete}
          onNotesToggle={() => setNotesMode(!notesMode)}
          notesMode={notesMode}
          numberCounts={numberCounts}
        />
      </Animated.View>

      {/* Result Modal */}
      {showResult && (
        <Animated.View
          entering={FadeIn}
          className="absolute inset-0 bg-black/70 justify-center items-center px-6"
        >
          <Card variant="elevated" padding="lg" style={{ width: '100%', maxWidth: 320 }}>
            <View className="items-center">
              <Ionicons name="trophy" size={64} color={theme.colors.correct} />
              <Text
                style={{ color: theme.colors.text }}
                className="text-2xl font-bold mt-4 mb-2"
              >
                Bravo !
              </Text>
              <Text style={{ color: theme.colors.textSecondary }} className="text-center mb-4">
                Sudoku {difficulty} complété en {formatTime(timer)} !
              </Text>

              <View className="w-full gap-3 mt-2">
                <Button variant="primary" onPress={startNewGame}>
                  Nouvelle partie
                </Button>
                <Button variant="ghost" onPress={() => router.back()}>
                  Retour
                </Button>
              </View>
            </View>
          </Card>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

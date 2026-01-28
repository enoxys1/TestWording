import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
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
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useThemeStore } from '../../src/stores/themeStore';
import { useGameStore } from '../../src/stores/gameStore';
import { Card, Button } from '../../src/components/ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CELL_SIZE = Math.floor((SCREEN_WIDTH - 48) / 9);

type CellData = {
  id: string;
  value: number;
  eliminated: boolean;
};

// Generate initial grid
function generateGrid(): CellData[] {
  const initial = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 1, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9];
  const cells: CellData[] = [];

  // Add more random numbers to fill the grid
  const numbers: number[] = [...initial];
  while (numbers.length < 81) {
    numbers.push(Math.floor(Math.random() * 9) + 1);
  }

  // Shuffle
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  for (let i = 0; i < numbers.length; i++) {
    cells.push({
      id: `cell-${i}`,
      value: numbers[i],
      eliminated: false,
    });
  }

  return cells;
}

// Check if two cells can be matched
function canMatch(cells: CellData[], index1: number, index2: number): boolean {
  if (index1 === index2) return false;

  const cell1 = cells[index1];
  const cell2 = cells[index2];

  if (cell1.eliminated || cell2.eliminated) return false;

  // Values must match or sum to 10
  if (cell1.value !== cell2.value && cell1.value + cell2.value !== 10) {
    return false;
  }

  // Get active cells (not eliminated)
  const activeCells = cells.map((c, i) => ({ ...c, originalIndex: i })).filter((c) => !c.eliminated);

  // Find positions in active grid
  const pos1 = activeCells.findIndex((c) => c.originalIndex === index1);
  const pos2 = activeCells.findIndex((c) => c.originalIndex === index2);

  if (pos1 === -1 || pos2 === -1) return false;

  const cols = 9;
  const row1 = Math.floor(pos1 / cols);
  const col1 = pos1 % cols;
  const row2 = Math.floor(pos2 / cols);
  const col2 = pos2 % cols;

  // Adjacent horizontally
  if (row1 === row2 && Math.abs(col1 - col2) === 1) return true;

  // Adjacent vertically
  if (col1 === col2 && Math.abs(row1 - row2) === 1) return true;

  // Check if there are only eliminated cells between them horizontally
  if (row1 === row2) {
    const minCol = Math.min(col1, col2);
    const maxCol = Math.max(col1, col2);
    let allEliminated = true;
    for (let c = minCol + 1; c < maxCol; c++) {
      const idx = row1 * cols + c;
      if (idx < activeCells.length && !activeCells[idx].eliminated) {
        allEliminated = false;
        break;
      }
    }
    if (allEliminated) return true;
  }

  // Check if there are only eliminated cells between them vertically
  if (col1 === col2) {
    const minRow = Math.min(row1, row2);
    const maxRow = Math.max(row1, row2);
    let allEliminated = true;
    for (let r = minRow + 1; r < maxRow; r++) {
      const idx = r * cols + col1;
      if (idx < activeCells.length && !activeCells[idx].eliminated) {
        allEliminated = false;
        break;
      }
    }
    if (allEliminated) return true;
  }

  return false;
}

// Check if there are any valid moves left
function hasValidMoves(cells: CellData[]): boolean {
  const activeCells = cells.filter((c) => !c.eliminated);
  if (activeCells.length === 0) return false;

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].eliminated) continue;
    for (let j = i + 1; j < cells.length; j++) {
      if (cells[j].eliminated) continue;
      if (canMatch(cells, i, j)) return true;
    }
  }
  return false;
}

interface NumberCellProps {
  cell: CellData;
  index: number;
  isSelected: boolean;
  onPress: () => void;
}

function NumberCell({ cell, index, isSelected, onPress }: NumberCellProps) {
  const theme = useThemeStore((s) => s.getTheme());
  const scale = useSharedValue(1);
  const opacity = useSharedValue(cell.eliminated ? 0 : 1);

  useEffect(() => {
    if (cell.eliminated) {
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [cell.eliminated]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  if (cell.eliminated) {
    return <View style={{ width: CELL_SIZE, height: CELL_SIZE }} />;
  }

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          animatedStyle,
          {
            width: CELL_SIZE,
            height: CELL_SIZE,
            backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceLight,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 2,
          },
        ]}
      >
        <Text
          style={{
            color: isSelected ? '#fff' : theme.colors.text,
            fontSize: 20,
            fontWeight: '600',
          }}
        >
          {cell.value}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export default function NumberMatchScreen() {
  const router = useRouter();
  const theme = useThemeStore((s) => s.getTheme());
  const { updateGameStats, completeDailyChallenge } = useGameStore();

  const [cells, setCells] = useState<CellData[]>(() => generateGrid());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [timer, setTimer] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'stuck'>('playing');
  const [showResult, setShowResult] = useState(false);

  // Timer
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const interval = setInterval(() => {
      setTimer(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, gameStatus]);

  // Check game state
  useEffect(() => {
    const activeCells = cells.filter((c) => !c.eliminated);

    if (activeCells.length === 0) {
      setGameStatus('won');
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      updateGameStats('numbermatch', true, timeElapsed, score);
      completeDailyChallenge('numbermatch', score, timeElapsed);
      setTimeout(() => setShowResult(true), 500);
    } else if (!hasValidMoves(cells)) {
      setGameStatus('stuck');
    }
  }, [cells, score, startTime]);

  const handleCellPress = useCallback(
    (index: number) => {
      if (gameStatus !== 'playing') return;
      if (cells[index].eliminated) return;

      if (selectedIndex === null) {
        setSelectedIndex(index);
      } else if (selectedIndex === index) {
        setSelectedIndex(null);
      } else {
        // Try to match
        if (canMatch(cells, selectedIndex, index)) {
          // Match successful
          const newCells = [...cells];
          newCells[selectedIndex] = { ...newCells[selectedIndex], eliminated: true };
          newCells[index] = { ...newCells[index], eliminated: true };
          setCells(newCells);
          setScore((s) => s + 10);
        }
        setSelectedIndex(null);
      }
    },
    [cells, selectedIndex, gameStatus]
  );

  const handleAddNumbers = () => {
    // Add remaining numbers to the end (like in the original game)
    const activeCells = cells.filter((c) => !c.eliminated);
    const newCells = [...cells];

    for (const cell of activeCells) {
      newCells.push({
        id: `cell-${newCells.length}`,
        value: cell.value,
        eliminated: false,
      });
    }

    setCells(newCells);
    setGameStatus('playing');
  };

  const handleNewGame = () => {
    setCells(generateGrid());
    setSelectedIndex(null);
    setScore(0);
    setGameStatus('playing');
    setShowResult(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const activeCells = cells.filter((c) => !c.eliminated);
  const rows: CellData[][] = [];
  let currentRow: CellData[] = [];

  for (let i = 0; i < cells.length; i++) {
    currentRow.push(cells[i]);
    if (currentRow.length === 9) {
      rows.push(currentRow);
      currentRow = [];
    }
  }
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

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
            Number Match
          </Text>
          <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
            {formatTime(timer)}
          </Text>
        </View>
        <Pressable onPress={handleNewGame} className="p-2">
          <Ionicons name="refresh" size={24} color={theme.colors.primary} />
        </Pressable>
      </Animated.View>

      {/* Score */}
      <Animated.View entering={FadeInDown.delay(150)} className="flex-row justify-center mb-4 gap-6">
        <View className="items-center">
          <Text style={{ color: theme.colors.text }} className="text-2xl font-bold">
            {score}
          </Text>
          <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
            Score
          </Text>
        </View>
        <View className="items-center">
          <Text style={{ color: theme.colors.text }} className="text-2xl font-bold">
            {activeCells.length}
          </Text>
          <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
            Restants
          </Text>
        </View>
      </Animated.View>

      {/* Grid */}
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16 }}>
        <Animated.View entering={FadeInUp.delay(200)}>
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 12,
              padding: 8,
            }}
          >
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} className="flex-row justify-center">
                {row.map((cell, colIndex) => {
                  const globalIndex = rowIndex * 9 + colIndex;
                  // Find actual index in cells array
                  let actualIndex = 0;
                  let count = 0;
                  for (let i = 0; i < cells.length; i++) {
                    if (count === globalIndex) {
                      actualIndex = i;
                      break;
                    }
                    count++;
                  }

                  return (
                    <NumberCell
                      key={cell.id}
                      cell={cell}
                      index={cells.indexOf(cell)}
                      isSelected={selectedIndex === cells.indexOf(cell)}
                      onPress={() => handleCellPress(cells.indexOf(cell))}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Stuck state */}
        {gameStatus === 'stuck' && (
          <Animated.View entering={FadeIn} className="mt-6 items-center">
            <Card variant="outlined" padding="lg">
              <View className="items-center">
                <Ionicons name="help-circle" size={40} color={theme.colors.present} />
                <Text
                  style={{ color: theme.colors.text }}
                  className="text-lg font-bold mt-2 mb-2"
                >
                  Plus de coups possibles !
                </Text>
                <Text
                  style={{ color: theme.colors.textSecondary }}
                  className="text-sm text-center mb-4"
                >
                  Ajoutez les nombres restants pour continuer
                </Text>
                <Button variant="primary" onPress={handleAddNumbers}>
                  Ajouter les nombres
                </Button>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Instructions */}
        <Animated.View entering={FadeInUp.delay(300)} className="mt-6 mb-10">
          <Card variant="default" padding="md">
            <Text
              style={{ color: theme.colors.textSecondary }}
              className="text-sm text-center"
            >
              Éliminez les paires de nombres identiques ou dont la somme fait 10.
              Les nombres doivent être adjacents (horizontalement ou verticalement).
            </Text>
          </Card>
        </Animated.View>
      </ScrollView>

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
                Félicitations !
              </Text>
              <Text style={{ color: theme.colors.textSecondary }} className="text-center mb-4">
                Grille complétée en {formatTime(timer)} avec {score} points !
              </Text>

              <View className="w-full gap-3 mt-2">
                <Button variant="primary" onPress={handleNewGame}>
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

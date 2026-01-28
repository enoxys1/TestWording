import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useThemeStore } from '../../src/stores/themeStore';
import { useGameStore } from '../../src/stores/gameStore';
import { Card, Button } from '../../src/components/ui';
import {
  GameState,
  initGame,
  addLetter,
  removeLetter,
  submitGuess,
  evaluateGuess,
  getKeyboardStatus,
  isValidWord,
  LetterStatus,
} from '../../src/games/motus/logic';

const KEYBOARD_ROWS = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['ENTER', 'W', 'X', 'C', 'V', 'B', 'N', 'BACK'],
];

interface TileProps {
  letter: string;
  status: LetterStatus;
  index: number;
  rowIndex: number;
  animate: boolean;
}

function Tile({ letter, status, index, rowIndex, animate }: TileProps) {
  const theme = useThemeStore((s) => s.getTheme());
  const scale = useSharedValue(1);
  const rotateX = useSharedValue(0);

  useEffect(() => {
    if (animate && status !== 'empty' && status !== 'filled') {
      const delay = index * 100;
      setTimeout(() => {
        rotateX.value = withSequence(
          withTiming(90, { duration: 150 }),
          withTiming(0, { duration: 150 })
        );
      }, delay);
    }
  }, [status, animate, index]);

  useEffect(() => {
    if (letter && status === 'filled') {
      scale.value = withSequence(
        withSpring(1.1, { damping: 10, stiffness: 400 }),
        withSpring(1, { damping: 10, stiffness: 400 })
      );
    }
  }, [letter]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotateX: `${rotateX.value}deg` }],
  }));

  const getBackgroundColor = () => {
    switch (status) {
      case 'correct':
        return theme.colors.correct;
      case 'present':
        return theme.colors.present;
      case 'absent':
        return theme.colors.absent;
      case 'filled':
        return theme.colors.surfaceLight;
      default:
        return 'transparent';
    }
  };

  const getBorderColor = () => {
    if (status === 'empty') return theme.colors.border;
    if (status === 'filled') return theme.colors.textSecondary;
    return 'transparent';
  };

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: 56,
          height: 56,
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: status === 'empty' || status === 'filled' ? 2 : 0,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 3,
        },
      ]}
    >
      <Text
        style={{
          color: status === 'empty' || status === 'filled' ? theme.colors.text : '#ffffff',
          fontSize: 28,
          fontWeight: '700',
        }}
      >
        {letter}
      </Text>
    </Animated.View>
  );
}

interface KeyProps {
  letter: string;
  status?: LetterStatus;
  onPress: () => void;
  wide?: boolean;
}

function Key({ letter, status, onPress, wide }: KeyProps) {
  const theme = useThemeStore((s) => s.getTheme());
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'correct':
        return theme.colors.correct;
      case 'present':
        return theme.colors.present;
      case 'absent':
        return theme.colors.absent;
      default:
        return theme.colors.surfaceLight;
    }
  };

  const isSpecial = letter === 'ENTER' || letter === 'BACK';

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          animatedStyle,
          {
            backgroundColor: getBackgroundColor(),
            borderRadius: 6,
            paddingVertical: 14,
            paddingHorizontal: wide ? 14 : 10,
            minWidth: wide ? 50 : 32,
            margin: 3,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        {letter === 'BACK' ? (
          <Ionicons name="backspace-outline" size={22} color={theme.colors.text} />
        ) : letter === 'ENTER' ? (
          <Ionicons name="return-down-back" size={22} color={theme.colors.text} />
        ) : (
          <Text
            style={{
              color: status === 'correct' || status === 'present' ? '#ffffff' : theme.colors.text,
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            {letter}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export default function MotusScreen() {
  const router = useRouter();
  const theme = useThemeStore((s) => s.getTheme());
  const { updateGameStats, completeDailyChallenge } = useGameStore();

  const [game, setGame] = useState<GameState>(() => initGame(true));
  const [startTime] = useState(Date.now());
  const [showResult, setShowResult] = useState(false);

  const keyboardStatus = getKeyboardStatus(game.guesses, game.targetWord);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (game.gameStatus !== 'playing') return;

      if (key === 'ENTER') {
        if (game.currentGuess.length !== game.wordLength) {
          // Shake animation would go here
          return;
        }
        if (!isValidWord(game.currentGuess)) {
          Alert.alert('Mot invalide', 'Ce mot n\'est pas dans le dictionnaire.');
          return;
        }
        setGame((prev) => submitGuess(prev));
      } else if (key === 'BACK') {
        setGame((prev) => removeLetter(prev));
      } else {
        setGame((prev) => addLetter(prev, key));
      }
    },
    [game.gameStatus, game.currentGuess, game.wordLength]
  );

  useEffect(() => {
    if (game.gameStatus !== 'playing' && !showResult) {
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      const won = game.gameStatus === 'won';

      updateGameStats('motus', won, timeElapsed, game.guesses.length);

      if (won) {
        completeDailyChallenge('motus', game.guesses.length, timeElapsed);
      }

      setTimeout(() => setShowResult(true), 1500);
    }
  }, [game.gameStatus]);

  const handleNewGame = () => {
    setGame(initGame(false));
    setShowResult(false);
  };

  const handleClose = () => {
    router.back();
  };

  // Build grid rows
  const rows = [];
  for (let i = 0; i < game.maxAttempts; i++) {
    const guess = game.guesses[i];
    const isCurrentRow = i === game.guesses.length && game.gameStatus === 'playing';
    const currentGuess = isCurrentRow ? game.currentGuess : '';
    const results = guess ? evaluateGuess(guess, game.targetWord) : null;

    const tiles = [];
    for (let j = 0; j < game.wordLength; j++) {
      let letter = '';
      let status: LetterStatus = 'empty';

      if (guess) {
        letter = guess[j];
        status = results![j].status;
      } else if (isCurrentRow && currentGuess[j]) {
        letter = currentGuess[j];
        status = 'filled';
      }

      tiles.push(
        <Tile
          key={`${i}-${j}`}
          letter={letter}
          status={status}
          index={j}
          rowIndex={i}
          animate={!!guess}
        />
      );
    }

    rows.push(
      <Animated.View
        key={i}
        entering={FadeInDown.delay(i * 50)}
        className="flex-row justify-center"
      >
        {tiles}
      </Animated.View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <Animated.View
        entering={FadeIn.delay(100)}
        className="flex-row items-center justify-between px-4 py-3"
      >
        <Pressable onPress={handleClose} className="p-2">
          <Ionicons name="close" size={28} color={theme.colors.text} />
        </Pressable>
        <Text style={{ color: theme.colors.text }} className="text-xl font-bold">
          Motus
        </Text>
        <View className="p-2 opacity-0">
          <Ionicons name="close" size={28} />
        </View>
      </Animated.View>

      {/* Grid */}
      <View className="flex-1 justify-center items-center px-4">
        {rows}
      </View>

      {/* Keyboard */}
      <Animated.View entering={FadeInUp.delay(300)} className="pb-4 px-2">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-center">
            {row.map((key) => (
              <Key
                key={key}
                letter={key}
                status={keyboardStatus[key]}
                onPress={() => handleKeyPress(key)}
                wide={key === 'ENTER' || key === 'BACK'}
              />
            ))}
          </View>
        ))}
      </Animated.View>

      {/* Result Modal */}
      {showResult && (
        <Animated.View
          entering={FadeIn}
          className="absolute inset-0 bg-black/70 justify-center items-center px-6"
        >
          <Card variant="elevated" padding="lg" style={{ width: '100%', maxWidth: 320 }}>
            <View className="items-center">
              <Ionicons
                name={game.gameStatus === 'won' ? 'trophy' : 'sad'}
                size={64}
                color={game.gameStatus === 'won' ? theme.colors.correct : theme.colors.present}
              />
              <Text
                style={{ color: theme.colors.text }}
                className="text-2xl font-bold mt-4 mb-2"
              >
                {game.gameStatus === 'won' ? 'Bravo !' : 'Perdu...'}
              </Text>
              <Text
                style={{ color: theme.colors.textSecondary }}
                className="text-center mb-2"
              >
                {game.gameStatus === 'won'
                  ? `Trouvé en ${game.guesses.length} essai${game.guesses.length > 1 ? 's' : ''} !`
                  : `Le mot était : ${game.targetWord}`}
              </Text>

              {/* Stats */}
              <View className="flex-row gap-4 my-4">
                <View className="items-center">
                  <Text style={{ color: theme.colors.text }} className="text-2xl font-bold">
                    {game.guesses.length}
                  </Text>
                  <Text style={{ color: theme.colors.textSecondary }} className="text-xs">
                    Essais
                  </Text>
                </View>
                <View className="items-center">
                  <Text style={{ color: theme.colors.text }} className="text-2xl font-bold">
                    {Math.floor((Date.now() - startTime) / 1000)}s
                  </Text>
                  <Text style={{ color: theme.colors.textSecondary }} className="text-xs">
                    Temps
                  </Text>
                </View>
              </View>

              <View className="w-full gap-3 mt-2">
                <Button variant="primary" onPress={handleNewGame}>
                  Nouvelle partie
                </Button>
                <Button variant="ghost" onPress={handleClose}>
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

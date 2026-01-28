import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useThemeStore } from '../../src/stores/themeStore';
import { useGameStore, GameType } from '../../src/stores/gameStore';
import { Card } from '../../src/components/ui';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  const theme = useThemeStore((s) => s.getTheme());

  return (
    <Card variant="default" padding="md" style={{ flex: 1, minWidth: 100 }}>
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mb-3"
        style={{ backgroundColor: color + '20' }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={{ color: theme.colors.text }} className="text-2xl font-bold">
        {value}
      </Text>
      <Text style={{ color: theme.colors.textSecondary }} className="text-sm mt-1">
        {title}
      </Text>
      {subtitle && (
        <Text style={{ color: theme.colors.accent }} className="text-xs mt-1">
          {subtitle}
        </Text>
      )}
    </Card>
  );
}

interface GameStatsRowProps {
  game: GameType;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  delay: number;
}

function GameStatsRow({ game, title, icon, color, delay }: GameStatsRowProps) {
  const theme = useThemeStore((s) => s.getTheme());
  const stats = useGameStore((s) => s.stats[game]);

  const winRate = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()}>
      <Card variant="default" padding="md" style={{ marginBottom: 12 }}>
        <View className="flex-row items-center mb-4">
          <View
            className="w-12 h-12 rounded-xl items-center justify-center mr-3"
            style={{ backgroundColor: color + '20' }}
          >
            <Ionicons name={icon} size={24} color={color} />
          </View>
          <View className="flex-1">
            <Text style={{ color: theme.colors.text }} className="text-lg font-bold">
              {title}
            </Text>
            <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
              {stats.gamesPlayed} parties jouées
            </Text>
          </View>
          <View className="items-end">
            <Text style={{ color: theme.colors.correct }} className="text-xl font-bold">
              {winRate}%
            </Text>
            <Text style={{ color: theme.colors.textSecondary }} className="text-xs">
              victoires
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="flex-row gap-3">
          <View className="flex-1 items-center py-2 rounded-lg" style={{ backgroundColor: theme.colors.surfaceLight }}>
            <Text style={{ color: theme.colors.text }} className="text-lg font-bold">
              {stats.gamesWon}
            </Text>
            <Text style={{ color: theme.colors.textSecondary }} className="text-xs">
              Victoires
            </Text>
          </View>
          <View className="flex-1 items-center py-2 rounded-lg" style={{ backgroundColor: theme.colors.surfaceLight }}>
            <Text style={{ color: theme.colors.text }} className="text-lg font-bold">
              {stats.currentStreak}
            </Text>
            <Text style={{ color: theme.colors.textSecondary }} className="text-xs">
              Série actuelle
            </Text>
          </View>
          <View className="flex-1 items-center py-2 rounded-lg" style={{ backgroundColor: theme.colors.surfaceLight }}>
            <Text style={{ color: theme.colors.text }} className="text-lg font-bold">
              {stats.maxStreak}
            </Text>
            <Text style={{ color: theme.colors.textSecondary }} className="text-xs">
              Meilleure série
            </Text>
          </View>
          <View className="flex-1 items-center py-2 rounded-lg" style={{ backgroundColor: theme.colors.surfaceLight }}>
            <Text style={{ color: theme.colors.text }} className="text-lg font-bold">
              {formatTime(stats.bestTime)}
            </Text>
            <Text style={{ color: theme.colors.textSecondary }} className="text-xs">
              Meilleur temps
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

export default function StatsScreen() {
  const theme = useThemeStore((s) => s.getTheme());
  const { stats, globalStreak } = useGameStore();

  const totalPlayed = Object.values(stats).reduce((acc, s) => acc + s.gamesPlayed, 0);
  const totalWon = Object.values(stats).reduce((acc, s) => acc + s.gamesWon, 0);
  const overallWinRate = totalPlayed > 0 ? Math.round((totalWon / totalPlayed) * 100) : 0;
  const maxStreak = Math.max(...Object.values(stats).map((s) => s.maxStreak), 0);

  const gamesList: { game: GameType; title: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
    { game: 'motus', title: 'Motus', icon: 'text', color: '#22C55E' },
    { game: 'sudoku', title: 'Sudoku', icon: 'grid', color: '#6366F1' },
    { game: 'numbermatch', title: 'Number Match', icon: 'calculator', color: '#06B6D4' },
    { game: 'anagram', title: 'Anagrammes', icon: 'shuffle', color: '#F59E0B' },
    { game: '2048', title: '2048', icon: 'apps', color: '#EC4899' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="px-5 pt-4 pb-2"
        >
          <Text style={{ color: theme.colors.text }} className="text-3xl font-bold mb-2">
            Statistiques
          </Text>
          <Text style={{ color: theme.colors.textSecondary }} className="text-base">
            Suivez votre progression
          </Text>
        </Animated.View>

        {/* Global Stats */}
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          className="px-5 py-4"
        >
          <View className="flex-row gap-3 mb-3">
            <StatCard
              title="Parties jouées"
              value={totalPlayed}
              icon="game-controller"
              color={theme.colors.primary}
            />
            <StatCard
              title="Victoires"
              value={totalWon}
              icon="trophy"
              color={theme.colors.correct}
            />
          </View>
          <View className="flex-row gap-3">
            <StatCard
              title="Taux de victoire"
              value={`${overallWinRate}%`}
              icon="stats-chart"
              color={theme.colors.accent}
            />
            <StatCard
              title="Série actuelle"
              value={globalStreak}
              subtitle={maxStreak > 0 ? `Record: ${maxStreak}` : undefined}
              icon="flame"
              color="#F59E0B"
            />
          </View>
        </Animated.View>

        {/* Per-Game Stats */}
        <View className="px-5 py-4">
          <Animated.Text
            entering={FadeInUp.delay(400).springify()}
            style={{ color: theme.colors.text }}
            className="text-xl font-bold mb-4"
          >
            Par jeu
          </Animated.Text>

          {gamesList.map((game, index) => (
            <GameStatsRow
              key={game.game}
              {...game}
              delay={500 + index * 100}
            />
          ))}
        </View>

        {/* Achievement Preview */}
        <Animated.View
          entering={FadeInUp.delay(1000).springify()}
          className="px-5 pb-10"
        >
          <Card variant="outlined" padding="lg">
            <View className="flex-row items-center">
              <Ionicons name="medal" size={32} color={theme.colors.primary} />
              <View className="ml-4 flex-1">
                <Text style={{ color: theme.colors.text }} className="text-lg font-bold">
                  Achievements
                </Text>
                <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
                  Connectez GameCenter pour débloquer les achievements
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

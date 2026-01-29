import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useThemeStore } from '../../src/stores/themeStore';
import { useGameStore, GameType } from '../../src/stores/gameStore';
import { AnimatedView, Card, Button } from '../../src/components/ui';

interface DailyChallengeCardProps {
  game: GameType;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  completed: boolean;
  score?: number | null;
  time?: number | null;
  onPress: () => void;
  delay: number;
}

function DailyChallengeCard({
  title,
  icon,
  completed,
  score,
  time,
  onPress,
  delay,
}: DailyChallengeCardProps) {
  const theme = useThemeStore((s) => s.getTheme());

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatedView entering={FadeInUp.delay(delay).springify()}>
      <Card
        variant="elevated"
        onPress={onPress}
        style={{ width: 140, marginRight: 12 }}
      >
        <View className="items-center">
          <View
            style={{
              backgroundColor: completed ? theme.colors.correct + '20' : theme.colors.surfaceLight,
              borderRadius: 12,
              padding: 12,
              marginBottom: 8,
            }}
          >
            <Ionicons
              name={completed ? 'checkmark-circle' : icon}
              size={32}
              color={completed ? theme.colors.correct : theme.colors.primary}
            />
          </View>
          <Text
            style={{ color: theme.colors.text }}
            className="font-semibold text-base mb-1"
          >
            {title}
          </Text>
          {completed ? (
            <View className="items-center">
              {score !== null && score !== undefined && (
                <Text style={{ color: theme.colors.correct }} className="text-sm font-medium">
                  Score: {score}
                </Text>
              )}
              {time !== null && time !== undefined && (
                <Text style={{ color: theme.colors.textSecondary }} className="text-xs">
                  {formatTime(time)}
                </Text>
              )}
            </View>
          ) : (
            <Text style={{ color: theme.colors.accent }} className="text-sm">
              Jouer
            </Text>
          )}
        </View>
      </Card>
    </AnimatedView>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const theme = useThemeStore((s) => s.getTheme());
  const { globalStreak, dailyChallenges, stats } = useGameStore();

  const today = new Date().toISOString().split('T')[0];

  const getDailyStatus = (game: GameType) => {
    const challenge = dailyChallenges.find((c) => c.gameType === game && c.date === today);
    return {
      completed: challenge?.completed || false,
      score: challenge?.score,
      time: challenge?.time,
    };
  };

  const dailyGames: { game: GameType; title: string; icon: keyof typeof Ionicons.glyphMap; route: string }[] = [
    { game: 'motus', title: 'Motus', icon: 'text', route: '/games/motus' },
    { game: 'sudoku', title: 'Sudoku', icon: 'grid', route: '/games/sudoku' },
    { game: 'numbermatch', title: 'Numbers', icon: 'calculator', route: '/games/numbermatch' },
  ];

  const completedToday = dailyGames.filter((g) => getDailyStatus(g.game).completed).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <AnimatedView
          entering={FadeInDown.delay(100).springify()}
          className="px-5 pt-4 pb-6"
        >
          <Text style={{ color: theme.colors.textSecondary }} className="text-base mb-1">
            Bonjour !
          </Text>
          <View className="flex-row items-center justify-between">
            <Text style={{ color: theme.colors.text }} className="text-3xl font-bold">
              MindFlow
            </Text>
            <View
              className="flex-row items-center px-4 py-2 rounded-full"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <Ionicons name="flame" size={20} color={theme.colors.accent} />
              <Text
                style={{ color: theme.colors.accent }}
                className="text-lg font-bold ml-1"
              >
                {globalStreak}
              </Text>
            </View>
          </View>
        </AnimatedView>

        {/* Streak Banner */}
        <AnimatedView
          entering={FadeInUp.delay(200).springify()}
          className="mx-5 mb-6"
        >
          <Card variant="elevated" padding="lg">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text style={{ color: theme.colors.text }} className="text-xl font-bold mb-1">
                  {globalStreak > 0
                    ? `${globalStreak} jour${globalStreak > 1 ? 's' : ''} de série !`
                    : 'Commencez votre série !'}
                </Text>
                <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
                  {completedToday}/{dailyGames.length} défis du jour complétés
                </Text>
              </View>
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: theme.colors.primary + '20' }}
              >
                <Ionicons name="trophy" size={32} color={theme.colors.primary} />
              </View>
            </View>

            {/* Progress bar */}
            <View
              className="h-2 rounded-full mt-4 overflow-hidden"
              style={{ backgroundColor: theme.colors.surfaceLight }}
            >
              <View
                className="h-full rounded-full"
                style={{
                  backgroundColor: theme.colors.primary,
                  width: `${(completedToday / dailyGames.length) * 100}%`,
                }}
              />
            </View>
          </Card>
        </AnimatedView>

        {/* Daily Challenges */}
        <View className="mb-6">
          <AnimatedView
            entering={FadeInUp.delay(300).springify()}
            className="flex-row items-center justify-between px-5 mb-4"
          >
            <Text style={{ color: theme.colors.text }} className="text-xl font-bold">
              Défis du jour
            </Text>
            <Pressable>
              <Text style={{ color: theme.colors.primary }} className="text-sm font-medium">
                Voir tout
              </Text>
            </Pressable>
          </AnimatedView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {dailyGames.map((game, index) => {
              const status = getDailyStatus(game.game);
              return (
                <DailyChallengeCard
                  key={game.game}
                  game={game.game}
                  title={game.title}
                  icon={game.icon}
                  completed={status.completed}
                  score={status.score}
                  time={status.time}
                  onPress={() => router.push(game.route as any)}
                  delay={400 + index * 100}
                />
              );
            })}
          </ScrollView>
        </View>

        {/* Quick Stats */}
        <AnimatedView
          entering={FadeInUp.delay(700).springify()}
          className="px-5 mb-6"
        >
          <Text style={{ color: theme.colors.text }} className="text-xl font-bold mb-4">
            Statistiques rapides
          </Text>
          <View className="flex-row gap-3">
            <Card variant="default" padding="md" style={{ flex: 1 }}>
              <Ionicons name="game-controller" size={24} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.text }} className="text-2xl font-bold mt-2">
                {Object.values(stats).reduce((acc, s) => acc + s.gamesPlayed, 0)}
              </Text>
              <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
                Parties jouées
              </Text>
            </Card>

            <Card variant="default" padding="md" style={{ flex: 1 }}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.correct} />
              <Text style={{ color: theme.colors.text }} className="text-2xl font-bold mt-2">
                {Object.values(stats).reduce((acc, s) => acc + s.gamesWon, 0)}
              </Text>
              <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
                Victoires
              </Text>
            </Card>

            <Card variant="default" padding="md" style={{ flex: 1 }}>
              <Ionicons name="flame" size={24} color={theme.colors.accent} />
              <Text style={{ color: theme.colors.text }} className="text-2xl font-bold mt-2">
                {Math.max(...Object.values(stats).map((s) => s.maxStreak), 0)}
              </Text>
              <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
                Meilleure série
              </Text>
            </Card>
          </View>
        </AnimatedView>

        {/* CTA */}
        <AnimatedView
          entering={FadeInUp.delay(800).springify()}
          className="px-5 mb-10"
        >
          <Button
            variant="primary"
            size="lg"
            onPress={() => router.push('/games' as any)}
            icon={<Ionicons name="play" size={20} color="#fff" />}
          >
            Jouer maintenant
          </Button>
        </AnimatedView>
      </ScrollView>
    </SafeAreaView>
  );
}

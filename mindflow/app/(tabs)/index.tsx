import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useThemeStore } from '../../src/stores/themeStore';
import { useGameStore, GameType } from '../../src/stores/gameStore';
import { AnimatedView, Card, Button } from '../../src/components/ui';

// Container for max-width on desktop
const MAX_WIDTH = 480;

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
        <View style={{ alignItems: 'center' }}>
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
            style={{ color: theme.colors.text, fontWeight: '600', fontSize: 16, marginBottom: 4 }}
          >
            {title}
          </Text>
          {completed ? (
            <View style={{ alignItems: 'center' }}>
              {score !== null && score !== undefined && (
                <Text style={{ color: theme.colors.correct, fontSize: 14, fontWeight: '500' }}>
                  Score: {score}
                </Text>
              )}
              {time !== null && time !== undefined && (
                <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
                  {formatTime(time)}
                </Text>
              )}
            </View>
          ) : (
            <Text style={{ color: theme.colors.accent, fontSize: 14 }}>
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
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {/* Container with max width for desktop */}
        <View style={{ width: '100%', maxWidth: MAX_WIDTH }}>
          {/* Header */}
          <AnimatedView
            entering={FadeInDown.delay(100).springify()}
            style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}
          >
            <Text style={{ color: theme.colors.textSecondary, fontSize: 16, marginBottom: 4 }}>
              Bonjour !
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: theme.colors.text, fontSize: 30, fontWeight: 'bold' }}>
                MindFlow
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: theme.colors.surface,
                }}
              >
                <Ionicons name="flame" size={20} color={theme.colors.accent} />
                <Text
                  style={{ color: theme.colors.accent, fontSize: 18, fontWeight: 'bold', marginLeft: 4 }}
                >
                  {globalStreak}
                </Text>
              </View>
            </View>
          </AnimatedView>

          {/* Streak Banner */}
          <AnimatedView
            entering={FadeInUp.delay(200).springify()}
            style={{ marginHorizontal: 20, marginBottom: 24 }}
          >
            <Card variant="elevated" padding="lg">
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>
                    {globalStreak > 0
                      ? `${globalStreak} jour${globalStreak > 1 ? 's' : ''} de série !`
                      : 'Commencez votre série !'}
                  </Text>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
                    {completedToday}/{dailyGames.length} défis du jour complétés
                  </Text>
                </View>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.primary + '20',
                  }}
                >
                  <Ionicons name="trophy" size={32} color={theme.colors.primary} />
                </View>
              </View>

              {/* Progress bar */}
              <View
                style={{
                  height: 8,
                  borderRadius: 4,
                  marginTop: 16,
                  overflow: 'hidden',
                  backgroundColor: theme.colors.surfaceLight,
                }}
              >
                <View
                  style={{
                    height: '100%',
                    borderRadius: 4,
                    backgroundColor: theme.colors.primary,
                    width: `${(completedToday / dailyGames.length) * 100}%`,
                  }}
                />
              </View>
            </Card>
          </AnimatedView>

          {/* Daily Challenges */}
          <View style={{ marginBottom: 24 }}>
            <AnimatedView
              entering={FadeInUp.delay(300).springify()}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 }}
            >
              <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: 'bold' }}>
                Défis du jour
              </Text>
              <Pressable>
                <Text style={{ color: theme.colors.primary, fontSize: 14, fontWeight: '500' }}>
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
            style={{ paddingHorizontal: 20, marginBottom: 24 }}
          >
            <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
              Statistiques rapides
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Card variant="default" padding="md" style={{ flex: 1 }}>
                <Ionicons name="game-controller" size={24} color={theme.colors.primary} />
                <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>
                  {Object.values(stats).reduce((acc, s) => acc + s.gamesPlayed, 0)}
                </Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
                  Parties jouées
                </Text>
              </Card>

              <Card variant="default" padding="md" style={{ flex: 1 }}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.correct} />
                <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>
                  {Object.values(stats).reduce((acc, s) => acc + s.gamesWon, 0)}
                </Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
                  Victoires
                </Text>
              </Card>

              <Card variant="default" padding="md" style={{ flex: 1 }}>
                <Ionicons name="flame" size={24} color={theme.colors.accent} />
                <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>
                  {Math.max(...Object.values(stats).map((s) => s.maxStreak), 0)}
                </Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
                  Meilleure série
                </Text>
              </Card>
            </View>
          </AnimatedView>

          {/* CTA */}
          <AnimatedView
            entering={FadeInUp.delay(800).springify()}
            style={{ paddingHorizontal: 20, marginBottom: 40 }}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

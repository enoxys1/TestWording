import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useThemeStore } from '../../src/stores/themeStore';
import { useGameStore, GameType } from '../../src/stores/gameStore';
import { Card } from '../../src/components/ui';

interface GameCardProps {
  game: GameType;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
  delay: number;
}

function GameCard({ title, description, icon, color, route, delay, game }: GameCardProps) {
  const router = useRouter();
  const theme = useThemeStore((s) => s.getTheme());
  const stats = useGameStore((s) => s.stats[game]);

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()}>
      <Card
        variant="elevated"
        onPress={() => router.push(route as any)}
        style={{ marginBottom: 16 }}
      >
        <View className="flex-row items-center">
          <View
            className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
            style={{ backgroundColor: color + '20' }}
          >
            <Ionicons name={icon} size={32} color={color} />
          </View>
          <View className="flex-1">
            <Text style={{ color: theme.colors.text }} className="text-lg font-bold mb-1">
              {title}
            </Text>
            <Text style={{ color: theme.colors.textSecondary }} className="text-sm mb-2">
              {description}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="game-controller-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={{ color: theme.colors.textSecondary }} className="text-xs ml-1 mr-3">
                {stats.gamesPlayed} parties
              </Text>
              <Ionicons name="trophy-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={{ color: theme.colors.textSecondary }} className="text-xs ml-1">
                {stats.gamesWon} victoires
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
        </View>
      </Card>
    </Animated.View>
  );
}

type CategoryType = 'all' | 'words' | 'numbers';

export default function GamesScreen() {
  const theme = useThemeStore((s) => s.getTheme());
  const [category, setCategory] = React.useState<CategoryType>('all');

  const games: (GameCardProps & { category: 'words' | 'numbers' })[] = [
    {
      game: 'motus',
      title: 'Motus',
      description: 'Devinez le mot en 6 essais',
      icon: 'text',
      color: '#22C55E',
      route: '/games/motus',
      delay: 200,
      category: 'words',
    },
    {
      game: 'sudoku',
      title: 'Sudoku',
      description: 'Remplissez la grille avec les chiffres 1-9',
      icon: 'grid',
      color: '#6366F1',
      route: '/games/sudoku',
      delay: 300,
      category: 'numbers',
    },
    {
      game: 'numbermatch',
      title: 'Number Match',
      description: 'Éliminez les paires de nombres',
      icon: 'calculator',
      color: '#06B6D4',
      route: '/games/numbermatch',
      delay: 400,
      category: 'numbers',
    },
    {
      game: 'anagram',
      title: 'Anagrammes',
      description: 'Formez des mots avec les lettres',
      icon: 'shuffle',
      color: '#F59E0B',
      route: '/games/motus', // Placeholder - same screen for now
      delay: 500,
      category: 'words',
    },
    {
      game: '2048',
      title: '2048',
      description: 'Fusionnez les tuiles pour atteindre 2048',
      icon: 'apps',
      color: '#EC4899',
      route: '/games/numbermatch', // Placeholder
      delay: 600,
      category: 'numbers',
    },
  ];

  const filteredGames = category === 'all' ? games : games.filter((g) => g.category === category);

  const categories: { id: CategoryType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'all', label: 'Tous', icon: 'apps' },
    { id: 'words', label: 'Mots', icon: 'text' },
    { id: 'numbers', label: 'Chiffres', icon: 'calculator' },
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
            Jeux
          </Text>
          <Text style={{ color: theme.colors.textSecondary }} className="text-base">
            Choisissez un jeu et entraînez votre cerveau
          </Text>
        </Animated.View>

        {/* Category Filters */}
        <Animated.View
          entering={FadeInUp.delay(150).springify()}
          className="flex-row px-5 py-4"
        >
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => setCategory(cat.id)}
              className="flex-row items-center mr-3 px-4 py-2 rounded-full"
              style={{
                backgroundColor: category === cat.id ? theme.colors.primary : theme.colors.surface,
              }}
            >
              <Ionicons
                name={cat.icon}
                size={16}
                color={category === cat.id ? '#fff' : theme.colors.textSecondary}
              />
              <Text
                className="ml-2 font-medium"
                style={{
                  color: category === cat.id ? '#fff' : theme.colors.textSecondary,
                }}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </Animated.View>

        {/* Games List */}
        <View className="px-5 pb-6">
          {filteredGames.map((game) => (
            <GameCard key={game.game} {...game} />
          ))}
        </View>

        {/* Coming Soon */}
        <Animated.View
          entering={FadeInUp.delay(700).springify()}
          className="px-5 pb-10"
        >
          <Card variant="outlined" padding="lg">
            <View className="items-center">
              <Ionicons name="rocket" size={40} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.text }} className="text-lg font-bold mt-3 mb-2">
                Plus de jeux bientôt !
              </Text>
              <Text
                style={{ color: theme.colors.textSecondary }}
                className="text-sm text-center"
              >
                Mots fléchés, Kakuro, Nonogram et plus encore arrivent prochainement.
              </Text>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

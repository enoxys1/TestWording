import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useThemeStore, themes, ThemeId } from '../../src/stores/themeStore';
import { Card, Button } from '../../src/components/ui';

interface ThemeCardProps {
  themeId: ThemeId;
  delay: number;
}

function ThemeCard({ themeId, delay }: ThemeCardProps) {
  const currentTheme = useThemeStore((s) => s.getTheme());
  const currentThemeId = useThemeStore((s) => s.currentTheme);
  const hasTheme = useThemeStore((s) => s.hasTheme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const purchaseTheme = useThemeStore((s) => s.purchaseTheme);

  const themeData = themes[themeId];
  const owned = hasTheme(themeId);
  const isActive = currentThemeId === themeId;

  const handlePress = () => {
    if (owned) {
      setTheme(themeId);
    } else {
      Alert.alert(
        `Acheter ${themeData.name}`,
        'Voulez-vous acheter ce thème pour 0.99€ ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Acheter',
            onPress: () => {
              // Simulate purchase
              purchaseTheme(themeId);
              setTheme(themeId);
              Alert.alert('Merci !', `Le thème ${themeData.name} a été débloqué.`);
            },
          },
        ]
      );
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify()}
      style={{ width: '48%', marginBottom: 12 }}
    >
      <Pressable onPress={handlePress}>
        <View
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: themeData.colors.surface,
            borderWidth: isActive ? 2 : 0,
            borderColor: currentTheme.colors.primary,
          }}
        >
          {/* Theme Preview */}
          <View className="p-4 h-24" style={{ backgroundColor: themeData.colors.background }}>
            <View className="flex-row gap-1 mb-2">
              {['correct', 'present', 'absent'].map((status, i) => (
                <View
                  key={status}
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: themeData.colors[status as keyof typeof themeData.colors] }}
                />
              ))}
            </View>
            <View
              className="h-2 rounded-full w-3/4"
              style={{ backgroundColor: themeData.colors.primary }}
            />
          </View>

          {/* Theme Info */}
          <View className="p-3" style={{ backgroundColor: themeData.colors.surface }}>
            <View className="flex-row items-center justify-between">
              <Text style={{ color: themeData.colors.text }} className="font-semibold">
                {themeData.name}
              </Text>
              {isActive ? (
                <Ionicons name="checkmark-circle" size={18} color={currentTheme.colors.correct} />
              ) : owned ? (
                <Text style={{ color: currentTheme.colors.textSecondary }} className="text-xs">
                  Possédé
                </Text>
              ) : (
                <Text style={{ color: currentTheme.colors.accent }} className="text-xs font-medium">
                  0.99€
                </Text>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

interface DonationButtonProps {
  amount: string;
  emoji: string;
  onPress: () => void;
}

function DonationButton({ amount, emoji, onPress }: DonationButtonProps) {
  const theme = useThemeStore((s) => s.getTheme());

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center py-4 rounded-xl mx-1"
      style={{ backgroundColor: theme.colors.surface }}
    >
      <Text className="text-2xl mb-1">{emoji}</Text>
      <Text style={{ color: theme.colors.text }} className="font-bold">
        {amount}
      </Text>
    </Pressable>
  );
}

export default function ShopScreen() {
  const theme = useThemeStore((s) => s.getTheme());
  const [showDonation, setShowDonation] = useState(false);

  const themeIds = Object.keys(themes) as ThemeId[];

  const handleDonation = (amount: string) => {
    Alert.alert(
      'Merci !',
      `Votre don de ${amount} nous aide à continuer le développement. ❤️`,
      [{ text: 'OK' }]
    );
  };

  const handleUltimatePack = () => {
    Alert.alert(
      'Pack Ultime',
      'Débloquez tous les thèmes, sons et outils actuels et futurs pour 9.99€ ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Acheter',
          onPress: () => {
            themeIds.forEach((id) => useThemeStore.getState().purchaseTheme(id));
            Alert.alert('Merci !', 'Tous les contenus ont été débloqués !');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="px-5 pt-4 pb-2"
        >
          <Text style={{ color: theme.colors.text }} className="text-3xl font-bold mb-2">
            Boutique
          </Text>
          <Text style={{ color: theme.colors.textSecondary }} className="text-base">
            Personnalisez votre expérience
          </Text>
        </Animated.View>

        {/* Ultimate Pack Banner */}
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          className="px-5 py-4"
        >
          <Pressable onPress={handleUltimatePack}>
            <Card
              variant="elevated"
              padding="lg"
              style={{
                backgroundColor: theme.colors.primary,
              }}
            >
              <View className="flex-row items-center">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="star" size={20} color="#FFD700" />
                    <Text className="text-white font-bold text-lg ml-2">
                      Pack Ultime
                    </Text>
                  </View>
                  <Text className="text-white/80 text-sm mb-1">
                    Tous les thèmes, sons et outils
                  </Text>
                  <Text className="text-white/80 text-sm">
                    + Tous les futurs contenus inclus
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-white/60 text-sm line-through">19.99€</Text>
                  <Text className="text-white font-bold text-2xl">9.99€</Text>
                  <Text className="text-white/80 text-xs">-50%</Text>
                </View>
              </View>
            </Card>
          </Pressable>
        </Animated.View>

        {/* Themes Section */}
        <View className="px-5 py-4">
          <Animated.Text
            entering={FadeInUp.delay(300).springify()}
            style={{ color: theme.colors.text }}
            className="text-xl font-bold mb-4"
          >
            Thèmes visuels
          </Animated.Text>

          <View className="flex-row flex-wrap justify-between">
            {themeIds.map((id, index) => (
              <ThemeCard key={id} themeId={id} delay={400 + index * 50} />
            ))}
          </View>
        </View>

        {/* Sound Packs */}
        <Animated.View
          entering={FadeInUp.delay(800).springify()}
          className="px-5 py-4"
        >
          <Text style={{ color: theme.colors.text }} className="text-xl font-bold mb-4">
            Packs de sons
          </Text>

          <Card variant="outlined" padding="md" style={{ marginBottom: 12 }}>
            <View className="flex-row items-center">
              <Ionicons name="leaf" size={24} color="#22C55E" />
              <View className="flex-1 ml-3">
                <Text style={{ color: theme.colors.text }} className="font-semibold">
                  Ambiance Zen
                </Text>
                <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
                  Nature, pluie, forêt
                </Text>
              </View>
              <Text style={{ color: theme.colors.accent }} className="font-bold">
                1.99€
              </Text>
            </View>
          </Card>

          <Card variant="outlined" padding="md" style={{ marginBottom: 12 }}>
            <View className="flex-row items-center">
              <Ionicons name="musical-notes" size={24} color="#EC4899" />
              <View className="flex-1 ml-3">
                <Text style={{ color: theme.colors.text }} className="font-semibold">
                  Clics Satisfaisants
                </Text>
                <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
                  Sons ASMR
                </Text>
              </View>
              <Text style={{ color: theme.colors.accent }} className="font-bold">
                1.99€
              </Text>
            </View>
          </Card>

          <Card variant="outlined" padding="md">
            <View className="flex-row items-center">
              <Ionicons name="game-controller" size={24} color="#F59E0B" />
              <View className="flex-1 ml-3">
                <Text style={{ color: theme.colors.text }} className="font-semibold">
                  Rétro 8-bit
                </Text>
                <Text style={{ color: theme.colors.textSecondary }} className="text-sm">
                  Sons pixelisés
                </Text>
              </View>
              <Text style={{ color: theme.colors.accent }} className="font-bold">
                1.99€
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Donation Section */}
        <Animated.View
          entering={FadeInUp.delay(900).springify()}
          className="px-5 py-4 pb-10"
        >
          <Card variant="elevated" padding="lg">
            <View className="items-center mb-4">
              <Ionicons name="heart" size={40} color="#EC4899" />
              <Text style={{ color: theme.colors.text }} className="text-xl font-bold mt-3 mb-2">
                Soutenir MindFlow
              </Text>
              <Text
                style={{ color: theme.colors.textSecondary }}
                className="text-sm text-center"
              >
                MindFlow est gratuit et sans pub. Si vous appréciez l'app, vous pouvez nous aider à continuer.
              </Text>
            </View>

            <View className="flex-row mb-4">
              <DonationButton amount="1€" emoji="☕" onPress={() => handleDonation('1€')} />
              <DonationButton amount="3€" emoji="🍕" onPress={() => handleDonation('3€')} />
              <DonationButton amount="5€" emoji="🎁" onPress={() => handleDonation('5€')} />
            </View>

            <Text
              style={{ color: theme.colors.textSecondary }}
              className="text-xs text-center"
            >
              En remerciement : Badge "Supporter" sur votre profil ❤️
            </Text>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

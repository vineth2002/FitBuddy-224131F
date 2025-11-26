import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSelector } from 'react-redux';

import { Colors } from '@/constants/theme';
import { RootState } from '@/redux/store';

export default function FavouritesScreen() {
  const router = useRouter();
  const themeMode = useSelector((state: RootState) => state.auth.themeMode);
  const theme = Colors[themeMode];
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
        onPress={() => router.push(`/details/${item.id}`)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradientOverlay}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={[styles.categoryBadge, { backgroundColor: theme.tint }]}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <Ionicons name="heart" size={20} color="#FF4444" />
            </View>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.headerTitle, { color: theme.text }]}>Favourites</Text>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.card }]}>
            <Ionicons name="heart-outline" size={64} color={theme.icon} />
          </View>
          <Text style={[styles.emptyText, { color: theme.text }]}>No favourites yet</Text>
          <Text style={[styles.emptySubText, { color: theme.icon }]}>
            Save your favorite workouts here!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 16,
  },
  card: {
    borderRadius: 20,
    marginBottom: 20,
    height: 180,
    overflow: 'hidden',
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: 15,
  },
  cardContent: {
    justifyContent: 'flex-end',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

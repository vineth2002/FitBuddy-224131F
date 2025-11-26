import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';

import WaterTracker from '@/components/WaterTracker';
import WellnessTips from '@/components/WellnessTips';
import { Colors } from '@/constants/theme';
import { toggleTheme } from '@/redux/auth.slice';
import { RootState } from '@/redux/store';
import { api } from '@/services/api';

interface Exercise {
  id: string;
  title: string;
  image: string;
  description: string;
  category: string;
  duration: string;
}

const CATEGORIES = ['All', 'Cardio', 'Strength', 'Flexibility', 'HIIT'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Expert'];
const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const router = useRouter();
  const themeMode = useSelector((state: RootState) => state.auth.themeMode);
  const theme = Colors[themeMode];
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, selectedCategory, selectedDifficulty, exercises]);

  const loadData = async () => {
    try {
      const response = await api.getExercises();
      setExercises(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let result = exercises;

    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    if (selectedDifficulty !== 'All') {

    }

    if (searchQuery) {
      result = result.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExercises(result);
  };

  const renderItem = ({ item, index }: { item: Exercise; index: number }) => (
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
              <View style={styles.durationBadge}>
                <Ionicons name="time-outline" size={12} color="#fff" />
                <Text style={styles.durationText}>{item.duration}</Text>
              </View>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.text }]}>Hello, {user?.name?.split(' ')[0] || 'User'}!</Text>
          <Text style={[styles.subGreeting, { color: theme.icon }]}>Ready to sweat?</Text>
        </View>
        <TouchableOpacity onPress={() => dispatch(toggleTheme())} style={[styles.themeButton, { backgroundColor: theme.card }]}>
          <Ionicons name={themeMode === 'light' ? 'moon' : 'sunny'} size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
          <Ionicons name="search" size={20} color={theme.icon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search workouts..."
            placeholderTextColor={theme.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => setShowFilterModal(true)}>
            <Ionicons name="options-outline" size={24} color={theme.tint} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category
                  ? { backgroundColor: theme.tint }
                  : { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.card }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category ? { color: '#fff' } : { color: theme.text }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.tint} style={styles.loader} />
      ) : (
        <FlatList
          data={filteredExercises}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            !searchQuery && selectedCategory === 'All' ? (
              <View style={styles.heroContainer}>
                <LinearGradient
                  colors={[theme.tint, theme.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.heroBanner}
                >
                  <Text style={styles.heroTitle}>Weekly Challenge</Text>
                  <Text style={styles.heroSubtitle}>Complete 3 Cardio sessions</Text>
                  <TouchableOpacity style={styles.heroButton}>
                    <Text style={[styles.heroButtonText, { color: theme.tint }]}>Join Now</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <View style={{ marginTop: 20 }}>
                  <WellnessTips />
                  <WaterTracker />
                </View>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.text }]}>No workouts found</Text>
            </View>
          }
        />
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.filterLabel, { color: theme.text }]}>Difficulty</Text>
            <View style={styles.filterOptions}>
              {DIFFICULTIES.map((diff) => (
                <TouchableOpacity
                  key={diff}
                  style={[
                    styles.filterChip,
                    selectedDifficulty === diff
                      ? { backgroundColor: theme.tint }
                      : { backgroundColor: theme.background, borderWidth: 1, borderColor: theme.background }
                  ]}
                  onPress={() => setSelectedDifficulty(diff)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedDifficulty === diff ? { color: '#fff' } : { color: theme.text }
                  ]}>{diff}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: theme.tint }]}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeButton: {
    padding: 10,
    borderRadius: 20,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subGreeting: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: '500',
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 15,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    marginRight: 10,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesList: {
    paddingRight: 20,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
  },
  categoryChipText: {
    fontWeight: '600',
    fontSize: 14,
  },
  list: {
    paddingBottom: 20,
  },
  loader: {
    marginTop: 50,
  },
  heroContainer: {
    marginBottom: 25,
  },
  heroBanner: {
    padding: 20,
    borderRadius: 20,
    height: 160,
    justifyContent: 'center',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    marginBottom: 15,
  },
  heroButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    borderRadius: 20,
    marginBottom: 20,
    height: 220,
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
    marginBottom: 10,
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
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  durationText: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 4,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  applyButton: {
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

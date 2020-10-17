import React, { useState, useEffect } from 'react';
import create from 'zustand';
import { StyleSheet, Text, ScrollView, TextInput, Button, ActivityIndicator, View, FlatList, Item, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();
const useMoviesStore = create(set => ({
  movies: null,
  setMovies: async (title) => {
    set({ loading: true })
    try {
      const response = await fetch(`http://www.omdbapi.com/?t=${title}&apikey=9bcdf7b3`);
      const movies = await response.json();
      set({ movies })
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },
  loading: false,
  error: false
}));

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Search' component={Search} />
        <Stack.Screen name='Movies' component={Movies} />
        <Stack.Screen name='Details' component={MovieDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Search({ navigation }) {
  const [title, setTitle] = useState('');
  const setMovies = useMoviesStore(state => state.setMovies);
  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
      <TextInput value={title} onChangeText={text => setTitle(text)} style={styles.searchInput} placeholder='Search the film' />
      <Button title='Search' onPress={() => {
        navigation.navigate('Movies');
        setMovies(title);
      }} />
    </ScrollView>
  )
}

function Movies({ navigation }) {
  const { movies, setMovies, loading, error } = useMoviesStore(state => state);
  const renderItem = ({ item }) => {
    console.log(item);
    return (
    <Text>{item["Actors"]}</Text>
  )};
  return (
    <SafeAreaView style = {styles.container}>
      {
        movies &&
        <FlatList
          data={movies}
          renderItem={renderItem}
          keyExtractor={item => item.imdbID}
        />
      }
      <ActivityIndicator animating={loading} size='large' />
    </ SafeAreaView >
  )
}

function MovieDetails() {
  return (
    <View>
      <Text>Movies Detailed</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    width: 280,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20
  }
});

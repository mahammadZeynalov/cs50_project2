import React, { useState, useEffect } from 'react';
import create from 'zustand';
import { StyleSheet, Image, useWindowDimensions, View, ScrollView } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Spinner, Item, Input, H1 } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();
const useMoviesStore = create(set => ({
  movie: null,
  setMovie: async (title) => {
    set({ movie: null, loading: true, error: false })
    try {
      const response = await fetch(`http://www.omdbapi.com/?t=${title}&apikey=9bcdf7b3`);
      const movie = await response.json();
      console.log(movie);
      if (!(movie.Response === 'False')) {
        set({ movie })
      } else {
        set({ error: movie.Error })
      }
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
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name='Search' component={Search} />
        <Stack.Screen name='Movie' component={Movie} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Search({ navigation }) {
  const [title, setTitle] = useState('star');
  const window = useWindowDimensions();
  const setMovie = useMoviesStore(state => state.setMovie);
  return (
    <Container>
      <Header>
        <Left />
        <Body>
          <Title>Search</Title>
        </Body>
        <Right />
      </Header>
      <Content>
        <Item regular style={{ width: window.width * 0.8, marginTop: 30, alignSelf: 'center' }}>
          <Input
            placeholder='Regular Textbox'
            value={title}
            onChangeText={text => setTitle(text)}
            placeholder='Search the film'
          />
        </Item>
        <Button
          info
          style={{ padding: '10%', alignSelf: 'center', marginTop: 20 }}
          onPress={() => {
            navigation.navigate('Movie');
            setMovie(title);
          }}>
          <Text>Search</Text>
        </Button>
      </Content>
    </Container>
  )
}

function Movie({ navigation }) {
  const movie = useMoviesStore(state => state.movie);
  const loading = useMoviesStore(state => state.loading);
  const error = useMoviesStore(state => state.error);
  // const setMovie = useMoviesStore(state => state.setMovie);
  const window = useWindowDimensions();

  // useEffect(() => {
  //   setMovie('the lord of the rings');
  // }, []);
  return (
    <Container>
      <Header>
        <Left />
        <Body>
          <Title>Movie</Title>
        </Body>
        <Right />
      </Header>
      <Content>
        {loading && <Spinner />}
        {error && <Text>{error}</Text>}
        {movie &&
          <>
            <H1
              style={{
                width: window.width,
                textAlign: 'center',
                padding: 10,
                marginBottom: 10
              }}
            >{movie.Title}</H1>
            <View style={[styles.shadow, { alignItems: 'center', width: window.width }]}>
              <Image
                source={{
                  uri: movie.Poster
                }}
                style={[
                  styles.poster,
                  {
                    width: window.width / 2.5,
                    height: window.height / 2.7
                  }]}
              />
            </View>
            <View style={styles.infoBlock}>
              <Text>Country: {movie.Country}</Text>
              <Text>Released: {movie.Released}</Text>
              <Text>Genre: {movie.Genre}</Text>
              <Text>Director: {movie.Director}</Text>
              <Text>Actors: {movie.Actors}</Text>
              <Text>Duration: {movie.Runtime}</Text>
              {
                movie.Awards && <Text>Awards: {movie.Awards}</Text>
              }
              <Text>IMDB rating: {movie.imdbRating}</Text>
              <Text>{movie.Plot}</Text>
              <View>
                {
                  movie.Ratings.map(rating =>
                    <View key={rating.Source}>
                      <Text>{rating.Source}</Text>
                      <Text>{rating.Value}</Text>
                    </View>)
                }
              </View>
            </View>
          </>
        }
      </Content>
    </ Container >
  )
}

const styles = StyleSheet.create({
  poster: {
    overflow: 'visible'
  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 3,
    shadowOpacity: 0.8
  },
  infoBlock: {
    marginTop: 20,
    padding: 10
  },
  infoItem: {
    padding: 5
  }
});

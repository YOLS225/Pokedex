import { Text, View, StyleSheet, Image, FlatList, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeText } from "./components/ThemeText";
import { useThemeColors } from "./hooks/useThemeColors";
import { Card } from "./components/Card";
import { PokemonCard } from "./components/pokemon/PokemonCard";
import { useFetchQuery, useInfiniteFetchQuery } from "./hooks/useFetchQuery";
import { getpokemonId } from "./functions/pokemons";
import { useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { Row } from "./components/Row";

export default function Index() {
  const colors = useThemeColors();
  const { data, isFetching, fetchNextPage } = useInfiniteFetchQuery('pokemon?limit=21'); // Correction ici
  const pokemons = data?.pages.flatMap(page => page.results) ?? [];
  const [search,setSearch] = useState('')
  const filteredPokemons = search ? pokemons.filter(p=>p.name.includes(search.toLocaleLowerCase()) || getpokemonId(p.url).toString()== search ) : pokemons

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
      <Row style={styles.header} gap={16}>
        <Image source={require('@/assets/images/pokeball.png')} width={24} height={24} tintColor={'white'} />
        <ThemeText variant="headline" color="grayLight">POKEDEX</ThemeText>
      </Row>

      <Row>
          <SearchBar value={search} onChange={setSearch}/>
      </Row>

      <Card style={styles.body}>
        <FlatList 
          data={filteredPokemons} 
          numColumns={3}
          onEndReached={search ? undefined :()=>fetchNextPage}
          columnWrapperStyle={styles.gridGap}
          ListFooterComponent={isFetching ? <ActivityIndicator color={colors.tint} /> : null}
          contentContainerStyle={[styles.gridGap, styles.list]}
          renderItem={({ item }) => 
            <PokemonCard id={getpokemonId(item.url)} name={item.name} style={{ flex: 1 / 3 }} />
          } 
          keyExtractor={(item) => item.url} 
        />
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    flex: 1,
    padding: 4,
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical:8
  },
  body: {
    flex: 1,
    marginTop:16
  },
  gridGap: {
    gap: 8
  },
  list: {
    padding: 12
  }
});

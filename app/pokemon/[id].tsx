import { Text, View,StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Pokemon() {
    const params = useLocalSearchParams()
    return (
      <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}
      >
        <Text>voir l'id du Pokémon : Pokémon {params.id}</Text>
      </View>
    );
  }
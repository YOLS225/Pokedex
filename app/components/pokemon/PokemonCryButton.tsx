import { Pressable, StyleSheet, ActivityIndicator } from "react-native"
import { Audio } from "expo-av"
import { useState } from "react"
import { ThemeText } from "../ThemeText"

type Props = {
    pokemonName: string
    color: string
}

export function PokemonCryButton({ pokemonName, color }: Props) {
    const [loading, setLoading] = useState(false)

    async function playCry() {
        if (loading) return
        setLoading(true)
        try {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
            const { sound } = await Audio.Sound.createAsync(
                { uri: `https://play.pokemonshowdown.com/audio/cries/${pokemonName}.mp3` },
                { shouldPlay: true }
            )
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync()
                }
            })
        } catch {
            // son indisponible pour ce Pokémon
        } finally {
            setLoading(false)
        }
    }

    return (
        <Pressable
            onPress={playCry}
            style={[styles.button, { borderColor: color }]}
        >
            {loading
                ? <ActivityIndicator size="small" color={color} />
                : <ThemeText variant="subtitle3" style={{ color }}>♪ Cry</ThemeText>
            }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 1.5,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
        height: 32,
    },
})
import { View, Image, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePokemonQuery, usePokemonSpeciesQuery } from "./hooks/useFetchQuery";
import { ThemeText } from "./components/ThemeText";
import { Colors } from "./constants/Colors";
import { Row } from "./components/Row";
import { PokemonTabs } from "./components/pokemon/PokemonTabs";
import { PokemonCryButton } from "./components/pokemon/PokemonCryButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

const IMAGE_SIZE = 200
const CARD_PADDING_TOP = IMAGE_SIZE / 2 + 24

export default function About() {
    const { id } = useLocalSearchParams() as { id: string }
    const router = useRouter()
    const { data: pokemon, isLoading: loadingPokemon } = usePokemonQuery(id)
    const { data: species, isLoading: loadingSpecies } = usePokemonSpeciesQuery(id)
    const insets = useSafeAreaInsets()
    const [headerHeight, setHeaderHeight] = useState(140)

    const mainType = pokemon?.types[0]?.type?.name as keyof typeof Colors.type
    const bgColor = mainType ? (Colors.type[mainType] ?? Colors.light.tint) : Colors.light.tint

    if (loadingPokemon || loadingSpecies || !pokemon || !species) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: bgColor }]}>
                <ActivityIndicator color="white" size="large" />
            </View>
        )
    }

    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    const imageTop = headerHeight - IMAGE_SIZE / 2

    const flavorText = species.flavor_text_entries
        .find(e => e.language.name === 'en')
        ?.flavor_text
        .replace(/\f/g, ' ')
        .replace(/\n/g, ' ') ?? ''

    const genus = species.genera
        .find(g => g.language.name === 'en')
        ?.genus ?? ''

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            {/* Header */}
            <View
                onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
                style={[styles.header, { paddingTop: insets.top + 8 }]}
            >
                <Image
                    source={require('@/assets/images/pokeball.png')}
                    style={styles.pokeballWatermark}
                    tintColor="white"
                />
                <Row gap={8} style={styles.headerRow}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ThemeText color="grayWhite" style={styles.backArrow}>←</ThemeText>
                    </Pressable>
                    <ThemeText variant="headline" color="grayWhite" style={styles.pokemonName}>
                        {pokemonName}
                    </ThemeText>
                    <ThemeText variant="subtitle2" color="grayWhite">
                        #{pokemon.id.toString().padStart(3, '0')}
                    </ThemeText>
                </Row>
            </View>

            {/* Scrollable card */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                bounces={false}
            >
                <View style={styles.card}>
                    {/* Types + Cry */}
                    <Row gap={8} style={styles.typesRow}>
                        {pokemon.types.map(({ type }) => (
                            <View
                                key={type.name}
                                style={[styles.typeBadge, { backgroundColor: Colors.type[type.name as keyof typeof Colors.type] ?? bgColor }]}
                            >
                                <ThemeText variant="subtitle3" color="grayWhite">
                                    {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                                </ThemeText>
                            </View>
                        ))}
                        <PokemonCryButton pokemonName={pokemon.name} color={bgColor} />
                    </Row>

                    {/* Tabs */}
                    <PokemonTabs id={pokemon.id} active="about" color={bgColor} />

                    {/* Description */}
                    {flavorText ? (
                        <ThemeText style={styles.description}>{flavorText}</ThemeText>
                    ) : null}

                    {/* Info table */}
                    <ThemeText variant="subtitle1" style={[styles.sectionTitle, { color: bgColor }]}>
                        Pokédex Data
                    </ThemeText>

                    <InfoRow label="Species" value={genus} color={bgColor} />
                    <InfoRow label="Height" value={`${pokemon.height / 10} m`} color={bgColor} />
                    <InfoRow label="Weight" value={`${pokemon.weight / 10} kg`} color={bgColor} />
                    {species.habitat && (
                        <InfoRow label="Habitat" value={capitalize(species.habitat.name)} color={bgColor} />
                    )}
                    <InfoRow label="Growth Rate" value={capitalize(species.growth_rate.name)} color={bgColor} />

                    {/* Training */}
                    <ThemeText variant="subtitle1" style={[styles.sectionTitle, { color: bgColor }]}>
                        Training
                    </ThemeText>

                    <InfoRow label="Catch Rate" value={species.capture_rate.toString()} color={bgColor} />
                    <InfoRow label="Base Happiness" value={species.base_happiness.toString()} color={bgColor} />
                    {species.is_legendary && (
                        <InfoRow label="Rarity" value="Legendary" color={bgColor} />
                    )}
                    {species.is_mythical && (
                        <InfoRow label="Rarity" value="Mythical" color={bgColor} />
                    )}
                </View>
            </ScrollView>

            {/* Pokemon image */}
            <View style={[styles.pokemonImageWrapper, { top: imageTop }]} pointerEvents="none">
                <Image
                    source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
                    style={styles.pokemonImage}
                />
            </View>
        </View>
    )
}

function capitalize(str: string) {
    return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function InfoRow({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <Row style={styles.infoRow}>
            <ThemeText variant="subtitle3" style={[styles.infoLabel, { color }]}>{label}</ThemeText>
            <View style={styles.infoDivider} />
            <ThemeText variant="body3" style={styles.infoValue}>{value}</ThemeText>
        </Row>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 72,
    },
    pokeballWatermark: {
        position: 'absolute',
        right: -20,
        bottom: -10,
        width: 208,
        height: 208,
        opacity: 0.2,
    },
    headerRow: {
        alignItems: 'center',
    },
    backButton: {
        padding: 4,
    },
    backArrow: {
        fontSize: 24,
        lineHeight: 32,
    },
    pokemonName: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    card: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: CARD_PADDING_TOP,
        paddingHorizontal: 24,
        paddingBottom: 32,
        flex: 1,
    },
    typesRow: {
        justifyContent: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    typeBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    description: {
        textAlign: 'center',
        lineHeight: 20,
        fontSize: 12,
        color: '#666666',
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    sectionTitle: {
        textAlign: 'center',
        marginBottom: 12,
        marginTop: 8,
    },
    infoRow: {
        alignSelf: 'stretch',
        alignItems: 'flex-start',
        marginBottom: 10,
        paddingVertical: 4,
    },
    infoLabel: {
        width: 100,
        textAlign: 'right',
    },
    infoDivider: {
        width: 1,
        height: 16,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 12,
        marginTop: 2,
    },
    infoValue: {
        flex: 1,
        lineHeight: 20,
    },
    pokemonImageWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    pokemonImage: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
    },
})
import { View, Image, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import { usePokemonQuery } from "../hooks/useFetchQuery";
import { ThemeText } from "../components/ThemeText";
import { Colors } from "../constants/Colors";
import { Row } from "../components/Row";
import { PokemonTabs } from "../components/pokemon/PokemonTabs";
import { PokemonCryButton } from "../components/pokemon/PokemonCryButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

const IMAGE_SIZE = 200
const CARD_PADDING_TOP = IMAGE_SIZE / 2 + 24

const statNames: Record<string, string> = {
    "hp": "HP",
    "attack": "ATK",
    "defense": "DEF",
    "special-attack": "SATK",
    "special-defense": "SDEF",
    "speed": "SPD",
}

export default function Pokemon() {
    const params = useLocalSearchParams() as { id: string };
    const router = useRouter()
    const { data, isLoading } = usePokemonQuery(params.id);
    const insets = useSafeAreaInsets();
    const [headerHeight, setHeaderHeight] = useState(140);

    const mainType = data?.types[0]?.type?.name as keyof typeof Colors.type;
    const bgColor = mainType ? (Colors.type[mainType] ?? Colors.light.tint) : Colors.light.tint;

    if (isLoading || !data) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: bgColor }]}>
                <ActivityIndicator color="white" size="large" />
            </View>
        );
    }

    const pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const imageTop = headerHeight - IMAGE_SIZE / 2;

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            {/* Header */}
            <View
                onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
                style={[styles.header, { paddingTop: insets.top + 8 }]}
            >
                {/* Pokeball watermark */}
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
                        #{data.id.toString().padStart(3, '0')}
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
                        {data.types.map(({ type }) => (
                            <View
                                key={type.name}
                                style={[styles.typeBadge, { backgroundColor: Colors.type[type.name as keyof typeof Colors.type] ?? bgColor }]}
                            >
                                <ThemeText variant="subtitle3" color="grayWhite">
                                    {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                                </ThemeText>
                            </View>
                        ))}
                        <PokemonCryButton pokemonName={data.name} color={bgColor} />
                    </Row>

                    {/* Tabs */}
                    <PokemonTabs id={data.id} active="stats" color={bgColor} />

                    {/* Stats */}
                    <ThemeText variant="subtitle1" style={[styles.sectionTitle, { color: bgColor }]}>
                        Base Stats
                    </ThemeText>
                    {data.stats.map(({ base_stat, stat }) => (
                        <Row key={stat.name} gap={8} style={styles.statRow}>
                            <ThemeText variant="subtitle3" style={[styles.statName, { color: bgColor }]}>
                                {statNames[stat.name] ?? stat.name}
                            </ThemeText>
                            <View style={styles.statDivider} />
                            <ThemeText variant="subtitle3" style={styles.statValue}>{base_stat}</ThemeText>
                            <View style={styles.statBarBg}>
                                <View
                                    style={[
                                        styles.statBar,
                                        { backgroundColor: bgColor, width: `${Math.min((base_stat / 255) * 100, 100)}%` as any }
                                    ]}
                                />
                            </View>
                        </Row>
                    ))}
                </View>
            </ScrollView>

            {/* Pokemon image – rendu en dernier pour apparaître au-dessus */}
            <View style={[styles.pokemonImageWrapper, { top: imageTop }]} pointerEvents="none">
                <Image
                    source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png` }}
                    style={styles.pokemonImage}
                />
            </View>
        </View>
    );
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
        marginBottom: 20,
    },
    typeBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    sectionTitle: {
        textAlign: 'center',
        marginBottom: 12,
    },
statRow: {
        alignSelf: 'stretch',
        alignItems: 'center',
        marginBottom: 10,
    },
    statName: {
        width: 44,
        textAlign: 'right',
    },
    statDivider: {
        width: 1,
        height: 16,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 2,
    },
    statValue: {
        width: 32,
        textAlign: 'right',
    },
    statBarBg: {
        flex: 1,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    statBar: {
        height: 4,
        borderRadius: 2,
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
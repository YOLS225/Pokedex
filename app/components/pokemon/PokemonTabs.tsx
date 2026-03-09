import { Pressable, StyleSheet, View } from "react-native"
import { Link } from "expo-router"
import { ThemeText } from "../ThemeText"

type Props = {
    id: number
    active: 'about' | 'stats'
    color: string
}

export function PokemonTabs({ id, active, color }: Props) {
    return (
        <View style={styles.tabs}>
            <Link href={{ pathname: '/about', params: { id } }} asChild replace>
                <Pressable style={styles.tab}>
                    <ThemeText
                        variant="subtitle3"
                        style={[styles.tabText, active === 'about' && { color, borderBottomColor: color, borderBottomWidth: 2 }]}
                    >
                        About
                    </ThemeText>
                </Pressable>
            </Link>
            <Link href={{ pathname: '/pokemon/[id]', params: { id } }} asChild replace>
                <Pressable style={styles.tab}>
                    <ThemeText
                        variant="subtitle3"
                        style={[styles.tabText, active === 'stats' && { color, borderBottomColor: color, borderBottomWidth: 2 }]}
                    >
                        Stats
                    </ThemeText>
                </Pressable>
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    tabText: {
        paddingBottom: 8,
        color: '#666666',
    },
})
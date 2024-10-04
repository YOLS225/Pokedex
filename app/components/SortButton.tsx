import { View, StyleSheet, Image, Pressable, Modal, Dimensions } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { useRef, useState } from "react";
import { ThemeText } from "./ThemeText";
import { Card } from "./Card";
import { Row } from "./Row";
import { Radio } from './Radio';
import { Shadows } from "../constants/Shadows";

type Props = {
    value: "id" | "name";
    onChange: (v: "id" | "name") => void;
};

const options = [
    { label: "Number", value: "id" },
    { label: "Name", value: "name" }
] as const;

export function SortButton({ value, onChange }: Props) {
    const [isVisible, setVisible] = useState(false);
    const colors = useThemeColors();
    const buttonRef = useRef<View>(null);
    const [position, setPosition] = useState<{ top: number; right: number } | null>(null);

    function onButtonPress() {
        buttonRef.current?.measureInWindow((x, y, width, height) => {
            setPosition({
                top: y + height,
                right: Dimensions.get('window').width - x - width
            });
            setVisible(true);
        });
    }

    function onClose() {
        setVisible(false);
    }

    return (
        <>
            <Pressable onPress={onButtonPress}>
                <View ref={buttonRef} style={[styles.button, { backgroundColor: colors.grayWhite }]}>
                    <Image
                        source={
                            value == "id" ? require("@/assets/images/tag.png") : require("@/assets/images/text_format.png")
                        }
                    />
                </View>
            </Pressable>
            <Modal transparent visible={isVisible} onRequestClose={onClose}>
                <Pressable style={styles.backdrop} onPress={onClose} />
                {position && (
                    <View 
                        style={[styles.popup, { backgroundColor: colors.tint, top: position.top, right: position.right }]}>
                        <ThemeText style={styles.title} variant="subtitle2" color="grayWhite">
                            SORT BY :
                        </ThemeText>
                        <Card style={styles.card}>
                            {options.map(p =>
                                <Pressable key={p.value} onPress={() => onChange(p.value)}>
                                    <Row gap={10}>
                                        <Radio checked={p.value == value} />
                                        <ThemeText>{p.label}</ThemeText>
                                    </Row>
                                </Pressable>
                            )}
                        </Card>
                    </View>
                )}
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 52,
        height: 52,
        borderRadius: 52,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    backdrop: {
        flex: 1,
        backgroundColor: "hsla(100, 20%, 30%, 0.3)"
    },
    popup: {
        position: 'absolute',
        width: 113,
        padding: 4,
        paddingTop: 16,
        gap: 16,
        borderRadius: 12,
        ...Shadows.dp2
    },
    title: {
        paddingRight: 20
    },
    card: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 16
    }
});

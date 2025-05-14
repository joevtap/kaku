import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Alert,
} from "react-native";
import { colors } from "@/src/constants/colors";
import { useDecksStore } from "@/src/stores/DecksStore";
import { StaticDeck } from "@/src/types/Deck";

export default function CreateDeckPage() {
    const router = useRouter();
    const { createDeck } = useDecksStore();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        if (!name.trim()) return;

        const newDeck: StaticDeck = {
            slug: name.toLowerCase().replace(/\s+/g, "-"),
            name,
            description,
            version: "1.0.0",
            cards: [],
        };

        await createDeck(newDeck);
        router.replace("/");
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Criar Deck" }} />
            <Text style={styles.label}>Nome</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: Japonês básico"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: Introdução ao japonês"
                value={description}
                onChangeText={setDescription}
            />

            <Pressable style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Criar</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 16,
        backgroundColor: "#fff",
    },
    label: {
        fontSize: 16,
        fontFamily: "Lato-Regular",
        color: colors.fg,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        fontFamily: "Lato-Regular",
    },
    button: {
        backgroundColor: colors.fg,
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 24,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Lato-Bold",
    },
});
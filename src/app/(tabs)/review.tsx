import { colors } from "@/src/constants/colors";
import { useFetchAllReviewCards } from "@/src/hooks/useFetchAllReviewCards";
import { Stack, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface DeckToReview {
    slug: string;
    name: string;
    reviewCount: number;
}

export default function ReviewScreen() {
    const [cards, error, loading] = useFetchAllReviewCards();
    const router = useRouter();

    const decksToReview = useMemo<DeckToReview[]>(() => {
        if (loading || error || !cards) {
            return [];
        }

        const grouped = cards.reduce(
            (acc, item) => {
                if (!acc[item.deckSlug]) {
                    acc[item.deckSlug] = {
                        slug: item.deckSlug,
                        name: item.deckName,
                        reviewCount: 0,
                    };
                }
                acc[item.deckSlug].reviewCount++;
                return acc;
            },
            {} as Record<string, DeckToReview>,
        );

        return Object.values(grouped);
    }, [cards, loading, error]);

    const handlePressDeck = (slug: string) => {
        router.push({ pathname: "/decks/review", params: { deck: slug } });
    };

    const renderDeckItem = ({ item }: { item: DeckToReview }) => (
        <Pressable style={styles.deckItem} onPress={() => handlePressDeck(item.slug)}>
            <Text style={styles.deckName}>{item.name}</Text>
            <Text style={styles.cardCount}>
                {`${item.reviewCount} card${item.reviewCount > 1 ? "s" : ""} para revisar`}
            </Text>
        </Pressable>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.fg} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.infoText}>Ocorreu um erro ao buscar as revisões.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Revisão" }} />

            {decksToReview.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.infoText}>Nenhum card para revisar hoje! ✨</Text>
                </View>
            ) : (
                <FlatList
                    data={decksToReview}
                    renderItem={renderDeckItem}
                    keyExtractor={(item) => item.slug}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    infoText: {
        fontSize: 18,
        color: colors.fg,
        textAlign: "center",
    },
    list: {
        padding: 16,
    },
    deckItem: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    deckName: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.fg,
    },
    cardCount: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
});

import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { DecksFileSystemHandler } from "../infra/filesystem/DecksFileSystemHandler";
import { CardReview } from "../types/Deck";
import { DeckManifest } from "../types/Manifest";

export interface GlobalCardReview {
    deckSlug: string;
    deckName: string;
    review: CardReview;
}

export function useFetchAllReviewCards() {
    const [cards, setCards] = useState<GlobalCardReview[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    const decksFileSystemHandler = new DecksFileSystemHandler();

    const fetchData = async () => {
        setLoading(true);
        try {
            const manifest = await decksFileSystemHandler.getManifest();
            if (!manifest || manifest.decks.length === 0) {
                setCards([]);
                setLoading(false);
                return;
            }

            const reviewPromises = manifest.decks.map(async (deckInfo: DeckManifest) => {
                const reviewedDeck = await decksFileSystemHandler.readReviewedDeckUntilToday(deckInfo.slug);
                return {
                    deckInfo,
                    reviews: reviewedDeck?.reviews || [],
                };
            });

            const results = await Promise.all(reviewPromises);

            const allCards: GlobalCardReview[] = [];
            results.forEach(({ deckInfo, reviews }) => {
                reviews.forEach((review: CardReview) => {
                    allCards.push({
                        deckSlug: deckInfo.slug,
                        deckName: deckInfo.name,
                        review: review,
                    });
                });
            });

            // Opcional: Embaralhar a lista de cards
            // allCards.sort(() => Math.random() - 0.5);

            setCards(allCards);
        } catch (e) {
            console.error("Erro ao buscar todos os cards para revisão:", e);
            setError(e as Error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    return [cards, error, loading, fetchData] as const;
}
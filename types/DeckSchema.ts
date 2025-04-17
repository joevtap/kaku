import type { Card, ReviewLog } from "ts-fsrs";

export type FlashCardId = number | string;

export type WritingSystem = "jp" | "latin";

export type ContentType = "text" | "image";

export interface FlashCardFront {
  type: ContentType;
  content: string;
  writingSystem: WritingSystem;
}

export interface FlashCardBack {
  type: ContentType;
  content: string;
  writingSystem: WritingSystem;
}

export interface FlashCard {
  id: FlashCardId;
  front: FlashCardFront[];
  back: FlashCardBack[];
}

export interface StaticDeck {
  slug: string;
  version: string;
  name: string;
  description: string;
  cards: FlashCard[];
}

export interface ReviewedDeck {
  slug: string;
  reviews: CardReview[];
}

export interface CardReview {
  id: FlashCardId;
  card: Card;
  log?: ReviewLog;
}

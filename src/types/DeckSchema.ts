import { fonts } from "../constants/fonts";

export type Id = number | string;

export type WritingSystem = keyof typeof fonts;

export type ContentType = "text" | "image";

export interface CardFront {
  type: ContentType;
  content: string;
  writingSystem: WritingSystem;
}

export interface CardBack {
  type: ContentType;
  content: string;
  writingSystem: WritingSystem;
}

export interface CardSchema {
  id: Id;
  front: CardFront[];
  back: CardBack[];
}

export interface DeckSchema {
  id: Id;
  name: string;
  description: string;
  cards: CardSchema[];
}

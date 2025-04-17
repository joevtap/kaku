import { Card, createEmptyCard, FSRS, Rating } from "ts-fsrs";
const f: FSRS = new FSRS({});
let card: Card = createEmptyCard();

console.log(card);

const preview = f.repeat(card, new Date());

console.log(preview[Rating.Easy]);

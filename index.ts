import { readFile } from "fs/promises";
import { ReviewedDeck, StaticDeck, FlashCardId } from "./types/DeckSchema";
import { createEmptyCard, FSRS, fsrs, Grade } from "ts-fsrs";
import { addDays, addHours } from "date-fns";

async function main() {
  // This deck is loaded from disk
  const staticDeck: StaticDeck = JSON.parse(
    await readFile("./deck.json", "utf-8")
  );

  // We start the deck loaded from disk (static) with the current date
  let reviewedDeck = startDeck(staticDeck, new Date());

  // Now we can see the due date of all cards, which is now
  for (const review of reviewedDeck.reviews) {
    console.log(
      `Card ${review.id.toString().padStart(3, "0")} due to:`,
      review.card.due.toLocaleDateString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }

  // We can simulate the deck being reviewed multiple times
  const reviewAmount = 30;

  for (let i = 0; i < reviewAmount; i++) {
    for (const review of reviewedDeck.reviews) {
      reviewedDeck = reviewCard(
        staticDeck,
        reviewedDeck,
        review.id,
        // Randomly generate a grade between 1 and 4
        (Math.floor(Math.random() * 4) + 1) as Grade,
        // Rating.Easy,
        // We can pass a date to simulate the review being done at a specific time
        addDays(new Date(), i),
        fsrs({
          enable_fuzz: true,
          maximum_interval: 365,
          request_retention: 0.8,
        })
      );
    }
  }

  console.log(`\nCards were reviewed ${reviewAmount} times...\n`);

  // Now we can see the new due date of all cards
  for (const review of reviewedDeck.reviews) {
    console.log(
      `Card ${review.id.toString().padStart(3, "0")} were reviewed ${
        review.card.reps
      } times, has state ${review.card.state} and is due to:`,
      review.card.due.toLocaleDateString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }

  // We can even order them by due date
  const sortedReviews = reviewedDeck.reviews.sort((a, b) => {
    return a.card.due.getTime() - b.card.due.getTime();
  });

  console.log(`\nCards sorted by due date:\n`);
  for (const review of sortedReviews) {
    console.log(
      `Card ${review.id.toString().padStart(3, "0")} were reviewed ${
        review.card.reps
      } times, has state ${review.card.state} and is due to:`,
      review.card.due.toLocaleDateString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }

  // We can cap the amount of reviews we are going to do
  const maxReviews = 10;

  const cappedReviews = reviewedDeck.reviews.slice(0, maxReviews);
  console.log(`\nCards capped to ${maxReviews}:\n`);
  for (const review of cappedReviews) {
    console.log(
      `Card ${review.id.toString().padStart(3, "0")} were reviewed ${
        review.card.reps
      } times, has state ${review.card.state} and is due to:`,
      review.card.due.toLocaleDateString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }

  // Better yet, we can get the reviews that we need to do today
  const now = new Date();

  const toReview = reviewedDeck.reviews.filter((c) => {
    return c.card.due <= addHours(now, hoursUntilTomorrow(now));
  });

  if (toReview.length === 0) {
    console.log(`\nCards to review today (${toReview.length}):\n`);
    console.log(`No cards to review today`);
  } else {
    console.log(`\nCards to review today (${toReview.length}):\n`);
    for (const review of toReview) {
      console.log(
        `Card ${review.id.toString().padStart(3, "0")} were reviewed ${
          review.card.reps
        } times, has state ${review.card.state} and is due to:`,
        review.card.due.toLocaleDateString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  }

  // Or we can get the reviews that we need to do at a specific day
  const specificDate = addDays(new Date(), 30);

  const toReviewAtSpecificDate = reviewedDeck.reviews.filter((c) => {
    return (
      c.card.due <= addHours(specificDate, hoursUntilTomorrow(specificDate))
    );
  });

  console.log(
    `\nCards to review at ${specificDate.toLocaleDateString("pt-BR")}: (${
      toReviewAtSpecificDate.length
    }):\n`
  );
  for (const review of toReviewAtSpecificDate) {
    console.log(
      `Card ${review.id.toString().padStart(3, "0")} were reviewed ${
        review.card.reps
      } times, has state ${review.card.state} and is due to:`,
      review.card.due.toLocaleDateString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }
}

function reviewCard(
  sd: StaticDeck,
  rd: ReviewedDeck,
  cardId: FlashCardId,
  grade: Grade,
  now: Date = new Date(),
  f: FSRS = fsrs()
): ReviewedDeck {
  const card = sd.cards.find((c) => c.id === cardId);
  if (!card) {
    throw new Error(`Card with id ${cardId} not found`);
  }

  const progress = rd.reviews.find((c) => c.id === cardId);
  if (!progress) {
    throw new Error(`Progress for card with id ${cardId} not found`);
  }

  const { card: newCard, log } = f.next(progress.card, now, grade);

  return {
    slug: rd.slug,
    reviews: rd.reviews.map((c) => {
      if (c.id === cardId) {
        return {
          ...c,
          card: newCard,
          log: log,
        };
      }
      return c;
    }),
  };
}

function startDeck(deck: StaticDeck, now: Date): ReviewedDeck {
  return {
    slug: deck.slug,
    reviews: deck.cards.map((c) => {
      return createEmptyCard(now, (d) => {
        return {
          id: c.id,
          card: d,
        };
      });
    }),
  };
}

function hoursUntilTomorrow(now: Date, dayStartsAt = 0) {
  if (dayStartsAt < 0 || dayStartsAt > 23) {
    throw new Error("dayStartsAt must be between 0 and 23");
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(dayStartsAt, 0, 0, 0);

  return Math.ceil((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60));
}

main().catch((err) => {
  console.log(err);
});

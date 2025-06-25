import {
  FlashCard,
  FlashCardId,
  StaticDeck,
  ReviewedDeck,
} from "@/src/types/Deck";
import { Manifest } from "@/src/types/Manifest";
import { addHours } from "date-fns";
import { Directory, File, Paths } from "expo-file-system/next";
import uuid from "react-native-uuid";
import Rusha from "rusha";
import { createEmptyCard, FSRS, fsrs } from "ts-fsrs";

export interface IFileSystemHandler {
  bootstrap(): Promise<void>;
}

export class DecksFileSystemHandler implements IFileSystemHandler {
  private readonly decksPath: string = Paths.join(Paths.document, "decks");
  private readonly reviewedDecksPath: string = Paths.join(
    Paths.document,
    "reviewed-decks",
  );

  public async bootstrap(): Promise<void> {
    const exampleDeck: StaticDeck = require("@assets/decks/yojijukugo.json");
    const dir = new Directory(this.decksPath);
    const reviewedDir = new Directory(this.reviewedDecksPath);

    if (!dir.exists) {
      dir.create();
      console.log("[DecksFileSystemHandler] Decks directory created");
    }

    if (!reviewedDir.exists) {
      reviewedDir.create();
      console.log("[DecksFileSystemHandler] Reviewed decks directory created");
    }

    if (dir.exists) {
      const file = new File(Paths.join(this.decksPath, "yojijukugo.json"));
      const manifest = new File(Paths.join(Paths.document), "manifest.json");

      if (!manifest.exists) {
        manifest.create();
        const { name, slug, description } = exampleDeck;

        const _manifest: Manifest = {
          decks: [
            { name, slug, description, cardAmount: exampleDeck.cards.length },
          ],
        };

        manifest.write(JSON.stringify(_manifest));
      }

      if (!file.exists) {
        file.create();
        file.write(JSON.stringify(exampleDeck));
        console.log("[DecksFileSystemHandler] Example deck file created");
      } else {
        console.log(
          "[DecksFileSystemHandler] Checking if example deck is up to date",
        );

        const exampleDeckText = file.text();
        const manifestText = manifest.text();

        const deckDigest = await this._digest(exampleDeckText);
        const exampleDeckDigest = await this._digest(
          JSON.stringify(exampleDeck),
        );

        const differentDigest = deckDigest !== exampleDeckDigest;

        if (differentDigest) {
          file.write(JSON.stringify(exampleDeck));
          console.log(
            `[DecksFileSystemHandler] Example deck file updated to version v${exampleDeck.version}`,
          );

          const _manifest: Manifest = JSON.parse(manifestText);

          _manifest.decks
            .filter((deck) => deck.slug === exampleDeck.slug)
            .forEach((deck) => {
              const { name, slug, description } = exampleDeck;

              deck.name = name;
              deck.slug = slug;
              deck.description = description;
              deck.cardAmount = exampleDeck.cards.length;
            });

          manifest.write(JSON.stringify(_manifest));

          console.log("[DecksFileSystemHandler] Manifest updated");
        }
      }

      console.log(`[DecksFileSystemHandler] Loaded ${dir.list().length} decks`);
    }

    if (reviewedDir.exists) {
      const file = new File(
        Paths.join(this.reviewedDecksPath, "yojijukugo.json"),
      );

      if (!file.exists) {
        file.create();
        const reviewedDeck: ReviewedDeck = this._startDeck(
          exampleDeck,
          new Date(),
        );
        file.write(JSON.stringify(reviewedDeck));
        console.log("[DecksFileSystemHandler] Reviewed deck file created");
      } else {
        console.log(
          "[DecksFileSystemHandler] Reviewed deck file already exists",
        );
      }
    }
  }

  public async read(slug: string): Promise<StaticDeck | null> {
    const file = new File(Paths.join(this.decksPath, `${slug}.json`));

    if (file.exists) {
      return JSON.parse(file.text()) as StaticDeck;
    }

    return null;
  }

  public async readReviewedDeckUntilToday(slug: string): Promise<ReviewedDeck> {
    const now = new Date();
    const hoursUntilTomorrow = this._hoursUntilTomorrow(now, 0);
    const limitDate = addHours(now, hoursUntilTomorrow);
    const file = new File(Paths.join(this.reviewedDecksPath, `${slug}.json`));

    if (!file.exists || file.size === 0) {
      return { slug: slug, reviews: [] };
    }

    const reviewedDeckFromFile = JSON.parse(file.text()) as ReviewedDeck;

    const reviewsReadyToday = reviewedDeckFromFile.reviews
      .map(review => {
        review.card.due = new Date(review.card.due);
        return review;
      })
      .filter(review => {
        return review.card.due <= limitDate;
      });

    return {
      slug: reviewedDeckFromFile.slug,
      reviews: reviewsReadyToday,
    };
  }

  public async getManifest(): Promise<Manifest> {
    const _manifest = new File(Paths.join(Paths.document, "manifest.json"));

    const manifest: Manifest = JSON.parse(_manifest.text());

    return manifest;
  }

  public async write(deck: StaticDeck): Promise<void> {
    const file = new File(Paths.join(this.decksPath, `${deck.slug}.json`));
    const manifest = new File(Paths.join(Paths.document, "manifest.json"));
    const reviewedDeckFile = new File(
      Paths.join(this.reviewedDecksPath, `${deck.slug}.json`),
    );

    if (!file.exists) file.create();
    if (!reviewedDeckFile.exists) reviewedDeckFile.create();
    file.write(JSON.stringify(deck));

    if (!manifest.exists) manifest.create();

    const manifestData = manifest.exists
      ? (JSON.parse(manifest.text()) as Manifest)
      : { decks: [] };

    const existingIndex = manifestData.decks.findIndex(
      (d) => d.slug === deck.slug,
    );

    const manifestEntry = {
      name: deck.name,
      slug: deck.slug,
      description: deck.description,
      cardAmount: deck.cards.length,
    };

    if (existingIndex !== -1) {
      manifestData.decks[existingIndex] = manifestEntry;
    } else {
      manifestData.decks.push(manifestEntry);
    }

    manifest.write(JSON.stringify(manifestData));
    console.log(
      `[DecksFileSystemHandler] Deck "${deck.name}" salvo com sucesso.`,
    );

    const reviewedDeck: ReviewedDeck = this._startDeck(deck, new Date());
    reviewedDeckFile.write(JSON.stringify(reviewedDeck));
    console.log(
      `[DecksFileSystemHandler] Reviewed deck "${deck.name}" salvo com sucesso.`,
    );
  }

  public async updateDeck(
    slug: string,
    updatedData: { name: string; description: string },
  ): Promise<void> {
    const filePath = Paths.join(this.decksPath, `${slug}.json`);
    const file = new File(filePath);

    if (!file.exists) {
      throw new Error(
        `[DecksFileSystemHandler] Deck "${slug}" não encontrado.`,
      );
    }

    const currentDeck = JSON.parse(file.text()) as StaticDeck;
    currentDeck.name = updatedData.name;
    currentDeck.description = updatedData.description;

    file.write(JSON.stringify(currentDeck));
    console.log(
      `[DecksFileSystemHandler] Arquivo do deck "${slug}" atualizado.`,
    );

    const manifest = new File(Paths.join(Paths.document, "manifest.json"));
    const manifestData = JSON.parse(manifest.text()) as Manifest;

    const deckIndex = manifestData.decks.findIndex((d) => d.slug === slug);
    if (deckIndex !== -1) {
      manifestData.decks[deckIndex].name = updatedData.name;
      manifestData.decks[deckIndex].description = updatedData.description;
    }

    manifest.write(JSON.stringify(manifestData));
    console.log(
      `[DecksFileSystemHandler] Manifesto atualizado para o deck "${slug}".`,
    );
  }

  public async deleteDeck(slug: string): Promise<void> {
    const file = new File(Paths.join(this.decksPath, `${slug}.json`));
    const manifest = new File(Paths.join(Paths.document, "manifest.json"));
    const reviewedDeckFile = new File(
      Paths.join(this.reviewedDecksPath, `${slug}.json`),
    );
    const manifestData = JSON.parse(manifest.text()) as Manifest;
    const deckIndex = manifestData.decks.findIndex((d) => d.slug === slug);
    if (deckIndex !== -1) {
      manifestData.decks.splice(deckIndex, 1);
      manifest.write(JSON.stringify(manifestData));
      console.log(
        `[DecksFileSystemHandler] Deck "${slug}" removido com sucesso.`,
      );
    } else {
      console.log(`[DecksFileSystemHandler] Deck "${slug}" não encontrado.`);
    }
    if (file.exists) {
      file.delete();
      reviewedDeckFile.delete();
      console.log(`[DecksFileSystemHandler] Arquivo "${slug}.json" removido.`);
    } else {
      console.log(
        `[DecksFileSystemHandler] Arquivo "${slug}.json" não encontrado.`,
      );
    }
  }

  public async addCard(slug: string, card: Omit<FlashCard, "id">) {
    const deck = (await this.getManifest()).decks.find(
      (deck) => deck.slug === slug,
    );

    if (!deck) {
      throw new Error(`Deck "${slug}" não encontrado.`);
    }

    const newCard: FlashCard = {
      id: uuid.v4(),
      front: card.front,
      back: card.back,
    };

    const deckFile = new File(Paths.join(this.decksPath, `${slug}.json`));
    const deckData = JSON.parse(deckFile.text()) as StaticDeck;
    deckData.cards.push(newCard);

    deckFile.write(JSON.stringify(deckData));

    const manifest = new File(Paths.join(Paths.document, "manifest.json"));
    const manifestData = JSON.parse(manifest.text()) as Manifest;
    const deckIndex = manifestData.decks.findIndex((d) => d.slug === slug);
    if (deckIndex !== -1) {
      manifestData.decks[deckIndex].cardAmount = deckData.cards.length;
    }
    manifest.write(JSON.stringify(manifestData));
    console.log(`[DecksFileSystemHandler] Card added to deck "${deck.name}".`);

    const reviewedDeckFile = new File(
      Paths.join(this.reviewedDecksPath, `${slug}.json`),
    );

    const reviewedDeckData = JSON.parse(
      reviewedDeckFile.text(),
    ) as ReviewedDeck;
    reviewedDeckData.reviews.push(
      createEmptyCard(new Date(), (d) => ({
        id: newCard.id,
        card: d,
      })),
    );
    reviewedDeckFile.write(JSON.stringify(reviewedDeckData));
    console.log(
      `[DecksFileSystemHandler] Card added to reviewed deck "${deck.name}".`,
    );
  }

  public async updateCard(slug: string, updatedCard: FlashCard): Promise<void> {
    const deckFile = new File(Paths.join(this.decksPath, `${slug}.json`));
    const deckData = JSON.parse(deckFile.text()) as StaticDeck;

    const cardIndex = deckData.cards.findIndex(
      (card) => card.id === updatedCard.id,
    );

    if (cardIndex !== -1) {
      deckData.cards[cardIndex] = updatedCard;
      deckFile.write(JSON.stringify(deckData));

      const manifest = new File(Paths.join(Paths.document, "manifest.json"));
      const manifestData = JSON.parse(manifest.text()) as Manifest;
      const deckIndex = manifestData.decks.findIndex((d) => d.slug === slug);
      if (deckIndex !== -1) {
        manifestData.decks[deckIndex].cardAmount = deckData.cards.length;
      }
      manifest.write(JSON.stringify(manifestData));
      console.log(
        `[DecksFileSystemHandler] Card with id "${updatedCard.id}" updated in deck "${slug}".`,
      );
    } else {
      console.log(
        `[DecksFileSystemHandler] Card with id "${updatedCard.id}" not found in deck "${slug}".`,
      );
    }

    const reviewedDeckFile = new File(
      Paths.join(this.reviewedDecksPath, `${slug}.json`),
    );
    const reviewedDeckData = JSON.parse(
      reviewedDeckFile.text(),
    ) as ReviewedDeck;

    const reviewIndex = reviewedDeckData.reviews.findIndex(
      (review) => review.id === updatedCard.id,
    );

    if (reviewIndex !== -1) {
      reviewedDeckData.reviews[reviewIndex] = createEmptyCard(
        new Date(),
        (d) => ({
          id: updatedCard.id,
          card: d,
        }),
      );
      reviewedDeckFile.write(JSON.stringify(reviewedDeckData));
      console.log(
        `[DecksFileSystemHandler] Reviewed card with id "${updatedCard.id}" updated in reviewed deck "${slug}".`,
      );
    } else {
      console.log(
        `[DecksFileSystemHandler] Reviewed card with id "${updatedCard.id}" not found in reviewed deck "${slug}".`,
      );
    }
  }

  public async deleteCard(slug: string, id: FlashCardId) {
    const deckFile = new File(Paths.join(this.decksPath, `${slug}.json`));
    const deckData = JSON.parse(deckFile.text()) as StaticDeck;

    const cardIndex = deckData.cards.findIndex((card) => card.id === id);

    if (cardIndex !== -1) {
      deckData.cards.splice(cardIndex, 1);
      deckFile.write(JSON.stringify(deckData));

      const manifest = new File(Paths.join(Paths.document, "manifest.json"));
      const manifestData = JSON.parse(manifest.text()) as Manifest;
      const deckIndex = manifestData.decks.findIndex((d) => d.slug === slug);
      if (deckIndex !== -1) {
        manifestData.decks[deckIndex].cardAmount = deckData.cards.length;
      }
      manifest.write(JSON.stringify(manifestData));
      console.log(
        `[DecksFileSystemHandler] Card with id "${id}" removed from deck "${slug}".`,
      );
    } else {
      console.log(
        `[DecksFileSystemHandler] Card with id "${id}" not found in deck "${slug}".`,
      );
    }

    const reviewedDeckFile = new File(
      Paths.join(this.reviewedDecksPath, `${slug}.json`),
    );

    const reviewedDeckData = JSON.parse(
      reviewedDeckFile.text(),
    ) as ReviewedDeck;

    const reviewIndex = reviewedDeckData.reviews.findIndex(
      (review) => review.id === id,
    );

    if (reviewIndex !== -1) {
      reviewedDeckData.reviews.splice(reviewIndex, 1);
      reviewedDeckFile.write(JSON.stringify(reviewedDeckData));
      console.log(
        `[DecksFileSystemHandler] Reviewed card with id "${id}" removed from reviewed deck "${slug}".`,
      );
    } else {
      console.log(
        `[DecksFileSystemHandler] Reviewed card with id "${id}" not found in reviewed deck "${slug}".`,
      );
    }
  }

  public async reviewCard(
    slug: string,
    cardId: FlashCardId,
    grade: number,
    now: Date = new Date(),
    f: FSRS = fsrs(),
  ): Promise<ReviewedDeck> {
    const deckFile = new File(Paths.join(this.decksPath, `${slug}.json`));
    const reviewedDeckFile = new File(
      Paths.join(this.reviewedDecksPath, `${slug}.json`),
    );

    if (!deckFile.exists || !reviewedDeckFile.exists) {
      throw new Error(`Deck "${slug}" not found.`);
    }

    const deck = JSON.parse(deckFile.text()) as StaticDeck;
    const reviewedDeck = JSON.parse(reviewedDeckFile.text()) as ReviewedDeck;
    const card = deck.cards.find((c) => c.id === cardId);
    if (!card) {
      throw new Error(`Card with id ${cardId} not found`);
    }

    const progress = reviewedDeck.reviews.find((c) => c.id === cardId);
    if (!progress) {
      throw new Error(`Progress for card with id ${cardId} not found`);
    }

    const { card: newCard, log } = f.next(progress.card, now, grade);

    reviewedDeck.reviews = reviewedDeck.reviews.map((c) => {
      if (c.id === cardId) {
        return {
          ...c,
          card: newCard,
          log: log,
        };
      }
      return c;
    });

    reviewedDeckFile.write(JSON.stringify(reviewedDeck));

    return reviewedDeck;
  }

  private async _digest(str: string) {
    const digest = Rusha.createHash().update(str).digest("hex").toString();

    return digest;
  }

  private _startDeck(deck: StaticDeck, now: Date): ReviewedDeck {
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

  private _hoursUntilTomorrow(now: Date, dayStartsAt = 0) {
    if (dayStartsAt < 0 || dayStartsAt > 23) {
      throw new Error("dayStartsAt must be between 0 and 23");
    }

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(dayStartsAt, 0, 0, 0);

    return Math.ceil((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60));
  }
}

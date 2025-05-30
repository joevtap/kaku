import { FlashCard, FlashCardId, StaticDeck } from "@/src/types/Deck";
import { Manifest } from "@/src/types/Manifest";
import { Directory, File, Paths } from "expo-file-system/next";
import Rusha from "rusha";
import uuid from "react-native-uuid";

export interface IFileSystemHandler {
  bootstrap(): Promise<void>;
}

export class DecksFileSystemHandler implements IFileSystemHandler {
  private readonly decksPath: string = Paths.join(Paths.document, "decks");

  public async bootstrap(): Promise<void> {
    const exampleDeck: StaticDeck = require("@assets/decks/yojijukugo.json");
    const dir = new Directory(this.decksPath);

    if (!dir.exists) {
      dir.create();
      console.log("[DecksFileSystemHandler] Decks directory created");
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
  }

  public async read(slug: string): Promise<StaticDeck | null> {
    const file = new File(Paths.join(this.decksPath, `${slug}.json`));

    if (file.exists) {
      return JSON.parse(file.text()) as StaticDeck;
    }

    return null;
  }

  public async getManifest(): Promise<Manifest> {
    const _manifest = new File(Paths.join(Paths.document, "manifest.json"));

    const manifest: Manifest = JSON.parse(_manifest.text());

    return manifest;
  }

  public async write(deck: StaticDeck): Promise<void> {
    const file = new File(Paths.join(this.decksPath, `${deck.slug}.json`));
    const manifest = new File(Paths.join(Paths.document, "manifest.json"));

    if (!file.exists) file.create();
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
  }

  public async updateDeck(
    slug: string,
    updatedData: { name: string; description: string }
  ): Promise<void> {
    const filePath = Paths.join(this.decksPath, `${slug}.json`);
    const file = new File(filePath);

    if (!file.exists) {
      throw new Error(`[DecksFileSystemHandler] Deck "${slug}" não encontrado.`);
    }

    const currentDeck = JSON.parse(file.text()) as StaticDeck;
    currentDeck.name = updatedData.name;
    currentDeck.description = updatedData.description;

    file.write(JSON.stringify(currentDeck));
    console.log(`[DecksFileSystemHandler] Arquivo do deck "${slug}" atualizado.`);

    const manifest = new File(Paths.join(Paths.document, "manifest.json"));
    const manifestData = JSON.parse(manifest.text()) as Manifest;

    const deckIndex = manifestData.decks.findIndex((d) => d.slug === slug);
    if (deckIndex !== -1) {
      manifestData.decks[deckIndex].name = updatedData.name;
      manifestData.decks[deckIndex].description = updatedData.description;
    }

    manifest.write(JSON.stringify(manifestData));
    console.log(`[DecksFileSystemHandler] Manifesto atualizado para o deck "${slug}".`);
  }

  public async deleteDeck(slug: string): Promise<void> {
    const file = new File(Paths.join(this.decksPath, `${slug}.json`));
    const manifest = new File(Paths.join(Paths.document, "manifest.json"));
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
  }

  private async _digest(str: string) {
    const digest = Rusha.createHash().update(str).digest("hex").toString();

    return digest;
  }
}

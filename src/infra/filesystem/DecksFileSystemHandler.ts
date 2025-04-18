import { StaticDeck } from "@/src/types/Deck";
import { Directory, File, Paths } from "expo-file-system/next";
import Rusha from "rusha";

export interface IFileSystemHandler {
  bootstrap(): Promise<void>;
}

export class DecksFileSystemHandler implements IFileSystemHandler {
  private readonly decksPath: string = Paths.join(Paths.document, "decks");

  public async bootstrap(): Promise<void> {
    const exampleDeck = require("@assets/decks/yojijukugo.json");
    const dir = new Directory(this.decksPath);

    if (!dir.exists) {
      dir.create();
      console.log("[DecksFileSystemHandler] Decks directory created");
    }

    if (dir.exists) {
      const file = new File(Paths.join(this.decksPath, "yojijukugo.json"));

      if (!file.exists) {
        file.create();
        file.write(JSON.stringify(exampleDeck));
        console.log("[DecksFileSystemHandler] Example deck file created");
      } else {
        console.log(
          "[DecksFileSystemHandler] Checking if example deck is up to date",
        );

        const text = file.text();

        const deckDigest = await this._digest(text);
        const exampleDeckDigest = await this._digest(
          JSON.stringify(exampleDeck),
        );

        const differentDigest = deckDigest !== exampleDeckDigest;

        if (differentDigest) {
          file.write(JSON.stringify(exampleDeck));
          console.log(
            `[DecksFileSystemHandler] Example deck file updated to version v${exampleDeck.version}`,
          );
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

  public async getAllDecks(): Promise<StaticDeck[]> {
    const uris = await this._getDecksUris();
    const decks: StaticDeck[] = [];

    for (const uri of uris) {
      const file = new File(uri);
      const text = file.text();
      const deck = JSON.parse(text) as StaticDeck;
      decks.push(deck);
    }

    return decks;
  }

  private async _digest(str: string) {
    const digest = Rusha.createHash().update(str).digest();

    return digest;
  }

  private async _getDecksUris(): Promise<string[]> {
    const dir = new Directory(this.decksPath);
    const files = dir.list();

    const uris: string[] = [];

    for (const file of files) {
      if (file.name.endsWith(".json")) {
        uris.push(file.uri);
      }
    }

    return uris;
  }
}

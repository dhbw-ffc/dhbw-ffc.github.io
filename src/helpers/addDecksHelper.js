export function addDecksFromFile(context, fileContent) {
  try {
    addDecksFromJSON(context, JSON.parse(fileContent));
  } catch (e) {
    context.showSnackbar(e);
  }
}

export function addDecksFromJSON(context, fileContent) {
  // Following decks have been added: d0 (5 cards), d1 (76 cards)...
  const addedDecksAndCards = [];
  try {
    for (const deckShortName in fileContent.decks) {
      const cards = [];
      for (const cardId in fileContent.decks[deckShortName].cards) {
        cards.push({
          id: Number(cardId),
          q: fileContent.decks[deckShortName].cards[cardId].q,
          a: fileContent.decks[deckShortName].cards[cardId].a,
          r: [],
        });
      }

      const name =
        fileContent.decks[deckShortName].meta.deck_name || deckShortName;
      context.decks.push({
        id: context.decks.reduce((acc, cur) => Math.max(acc, cur.id), 0) + 1,
        selected: false,
        name,
        meta: {
          file: fileContent.meta,
          deck: {
            ...fileContent.decks[deckShortName].meta,
            short_name: deckShortName,
          },
        },
        cards,
      });
      addedDecksAndCards.push({ name, numberOfCards: cards.length });
    }

    showAddedDecksConfirmation(context, addedDecksAndCards);
  } catch (e) {
    context.showSnackbar(e);
  }
}

function showAddedDecksConfirmation(context, addedDecksAndCards) {
  const numberOfAddedCards = addedDecksAndCards.reduce(
    (total, deck) => total + deck.numberOfCards,
    0
  );
  if (numberOfAddedCards === 0) {
    throw new Error("No decks have been added");
  }

  const options = {
    title: "Successfully Imported Decks",
    message: "Following decks have been added:",
    tableHead: { name: "Deck", value: "Number of Cards" },
    table: addedDecksAndCards.map((deck) => {
      return {
        name: deck.name,
        value: deck.numberOfCards,
      };
    }),
    buttons: [
      {
        name: "Close",
        color: "indigo",
        callback: function() {
          context.$router.push("/");
        },
      },
    ],
  };
  context.showCustomDialog(options);
}
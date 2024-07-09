# Online Card Game Project

This repository contains the source code and documentation for an online card game using the Deck of Cards API and Firestore.

## Project Overview

The objective of this project is to create an interactive online card game where players compete against a computer player. The game uses the Deck of Cards API to manage card information and Firestore to track game outcomes.

## Features

- User registration and game creation
- Game interface where the user plays against a computer player
- Deck retrieval and shuffling using the Deck of Cards API
- Card distribution with face-up display for the user and face-down for the computer
- Gameplay rules based on card values and suits
- Score calculation and display
- Round-based gameplay with card replenishment
- End-of-game conditions and winner announcement
- Game results stored in Firestore and displayed to the user


# Game Rules

## Game Start:

-The user enters their name and starts a new game.
-A shuffled deck is retrieved, and each player receives five cards.
-One card is placed face-down as the "draw card."


### Gameplay:

-Players aim to play a card closest to the value of the draw card without exceeding it.
-Closeness is calculated by the difference in values and suit/color matching.
-Aces have a value of 1, Jacks 11, Queens 12, and Kings 13.
-Jokers are excluded from the deck.
-Exact suit matches add 0 points, color matches add 2 points, and different colors add 4 points.


### Computer Player:

-The computer player uses the color of the draw card to decide its move.
-It cannot see the value of the draw card before it is revealed.


### Scoring:

-First, subtract the number value of the player’s card from the draw card.
-An exact suit match adds 0 points, a color match adds 2 points, and a different color adds 4 points.
-Negative results indicate that the player played a card with a higher number value than the draw card and cannot win the round.
-The player with the lowest closeness score wins the round.
-Points awarded equal the sum of the number values of the played cards.


### Game End:

-After each round, each player is given a card from the draw pile to replace the card they just played.
-The game ends when there are not enough cards left for a new round.
-The player with the most points is declared the winner.
-Results are saved to Firestore, tracking the scores and player names.

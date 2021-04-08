# Spirit Island Web

This is a multiplayer implementation of the board game Spirit Island for the web browser. As it is a coop game all players can control every part of the game - even the hand cards of other players. This implementation dose not enforce the game rules, but only shows the boards, tokens and cards. The players need to enforce the game rules by themselves.

To learn more about Spirit Island look at [Board Game Geeks](https://boardgamegeek.com/boardgame/162886/spirit-island).

[Screen shots and videos of game play]

See the current state of development in the [Online Version](https://spiritislandweb.herokuapp.com/).

This is an early version of the game, and it is still under development. The raodmap is shown below. The items are implemented in order, and checked when finished. After each heading there will be a new release.

[Link to Subscription List]

## Road Map version 0.1

### Server and multi player

- [x] Set Nickname dialog
- [x] create a new game
- [x] display lobby
  - [x] with link to share 
  - [x] current joined players
  - [x] start button
- [x] join a game by URL
- [x] game play: Display one board for all, no actions (Hello World)

### Design board layout

- [ ] 4 base game boards (no thematic)
- [ ] ~~zoom and pan the boards, don't sync zoom and pan between clients~~ (not in design phase, breaking dragdrop)
- [ ] ~~button to center the view (show all boards)~~ (not in design phase, breaking dragdrop)
- [x] display list with available boards on the left
- [ ] drag drop boards and highlight drop spots
- [ ] rotate boards with two buttons
- [ ] snap to correct position, after rotation
- [ ] animate rotation
- [x] synchronize board layout with other players
- [ ] animate board move/rotation when updating
- [x] delete board by dropping back into the list ~~(drop spot is highlighted (recycle bin))~~

### Publication

- [ ] Bring the game to the cloud as fast as possible. After each improvement there will be an update of the online version.
- [ ] Add options to subscribe to updates, users get an email when a new version is available.
- [ ] Ask other to help, help is most welcome.

### Add Spirits

- [ ] show spirit list on the right, 8 base game spirits
- [ ] spirits show as a circular image with fade out border, there name below
- [ ] initially no spirits on the boards
- [ ] drag drop spirits onto boards
- [ ] spirits images are shown in center of the board
- [ ] drag drop spirit, when spirit is clicked; drag drop board, when board is clicked
- [ ] swap spirits, when drag drop to a board which has already a spirit
- [ ] start game button active, when all boards have a spirits

### Display tokens on board

- [ ] Token display in each region
  - [ ] all tokens greater than zero displayed as <Icon> x <Number>
  - [ ] at least space for 8 tokens with one digit count in each region
  - [ ] decrees size of all tokens in one region, if too full
  - [ ] don't overlap over region border, even when two digit and lots of tokens 
  - [ ] hide when count reaches zero
- [ ] Possible tokens
  - [ ] Explorer
  - [ ] Town
  - [ ] City
  - [ ] Dahan
  - [ ] Blight
  - [ ] Presence for each color
  - [ ] Wild
  - [ ] Beast
  - [ ] Disease
  - [ ] Badlands
- [ ] User Interaction
  - [ ] Every Player can change every region
  - [ ] Plus Icon to add new token, shows dialog with all possible tokens
  - [ ] small plus/minus icons on each count to increase/decrease number
  - [ ] Actions are keep in sync with all players
  - [ ] No animation on update

### Display spirit boards

- [ ] Display Spirit boards of all chosen spirits
- [ ] Possibility to show back site
- [ ] possibility to minimize the boards (make it smaller)
- [ ] Show Tokens on Presence Track
- [ ] Drag Drop tokens on presence tracks into regions (removes token from track, adds token in region)

### Display spirits cards

- [ ] show hand cards
- [ ] show discarded cards
- [ ] reclaim all and reclaim one button
- [ ] option to delete a card (forget a power)
- [ ] option to choose cards, display chosen cards (for all players)
- [ ] button to end round. All chosen cards will be discarded
- [ ] choose innate powers, show beside of chosen cards, don't discard them
- [ ] option to undo play card (take the active card back to hand)

### Draw cards

- [ ] random card pile with all power cards from the base game
- [ ] option to draw a minor or major
- [ ] dialog with four cards
- [ ] player chooses one, which is added to his hand
- [ ] other three are discarded to discard pile
- [ ] option to show discard pile
- [ ] reshuffle when empty
- [ ] when player forgets a minor/major it is added to the discard pile
- [ ] option to claim one card from the discard pile (for some special rules)

### Invader Cards

- [ ] display random card pile, face down
- [ ] default configuration for cards
- [ ] display slots for explore, build, rage
- [ ] display discard pile, face down
- [ ] option to show content of discard pile
- [ ] flip top card on click, pile
- [ ] drag drop cards from one slot to the next

### Fear Cards and Terror

- [ ] Display random card pile, face down
- [ ] option to show content, but face down
- [ ] display slot for earned cards
- [ ] display slot for discard cards
- [ ] option to flip any card, will be shown face up the rest of the game
- [ ] move cards to next slot by drag drop 
- [ ] show current terror level
- [ ] Show fear count, just a number
- [ ] Small Plus sign to increase number
- [ ] Reset Sign to reset number to zero

### Blight

- [ ] Display Blight count
- [ ] Small Plus/Minus sign to increase/decrease number

## Road Map version 0.2

### Server and multi player

- [ ] spectate game, when joining after setup phase?!

### Design board layout

- [ ] thematic boards
- [ ] boards from extension (E, F)

### Add Spirits

- [ ] Spirits from all extensions
- [ ] choose which extensions, before game start
- [ ] Options to add custom spirits

### Display tokens on board

- [ ] Explorer + x Strife
- [ ] Town + x Strife
- [ ] City + x Strife
- [ ] transform to basic type, when strife count reaches zero
- [ ] Strife has extra plus/minus signs

### Display spirit boards

- [ ] Spirit Boards from all extensions
- [ ] choose which extensions, before game start
- [ ] Options to add custom boards

### Draw cards

- [ ] random card pile with all power cards from the base game and extension
- [ ] choose which extensions, before game start

### Invader Cards

- [ ] possibility to display multiply cards in one slot
- [ ] possibility to change structure of deck, before game start

### Fear Cards and Tokens

- [ ] possibility to change structure of deck, before game start
- [ ] fear counter, auto reset and move card when count is <numPlayers>*4

### Blight

- [ ] Auto decrease/increase number when blight is changed in one region

### Events

- [ ] show random deck, face down
- [ ] flip top card on click
- [ ] show discard deck

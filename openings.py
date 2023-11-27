import chess
import chess.pgn
import json

# Open the PGN file
pgn = open("eco.pgn")

# Initialize an empty list to store the game information
games_data = []
variations = []

# Loop through all games in the PGN file
while True:
    game = chess.pgn.read_game(pgn)
    # Break the loop if there are no more games
    if game is None:
        break

    # Get the ECO code and opening name
    eco_code = game.headers["Site"]
    opening_name = game.headers["White"]
    variation_name = game.headers["Black"]
    moves = game.headers["Result"]

    # Combine both names if the variation name exists
    if variation_name != "?":
        opening_name += " - " + variation_name

    # Strip the space from the opening name
    opening_name = opening_name.strip()

    if opening_name in variations:
        continue

    variations.append(opening_name)

    # Get the final board state
    board = game.board()
    for move in game.mainline_moves():
        board.push(move)
    final_board_state = board.fen()

    # Store the game data
    games_data.append({
        "eco_code": eco_code,
        "opening_name": opening_name,
        "final_board_state": final_board_state
    })

# Close the PGN file
pgn.close()

# Write the data to a JSON file
with open("openings_data.json", "w") as json_file:
    json.dump(games_data, json_file)
import chess
import chess.pgn
import json

# Open the PGN file
pgn = open("eco.pgn")
nodes = {}

# Add more recurssion limit
import sys
sys.setrecursionlimit(1000000)

def find_variants(mainline_node, parent_node):

    game = chess.pgn.read_game(pgn)

    if game is None:
        return

    eco_code = game.headers["Site"]
    opening_name = game.headers["White"]
    variation_name = game.headers["Black"]

    if variation_name != "?":
        opening_name += " - " + variation_name

    opening_name = opening_name.strip()

    move_list = []

    board = game.board()
    for move in game.mainline_moves():
        board.push(move)
        move_list.append(str(move))

    current_move = ''.join(move_list)
    
    final_board_state = board.fen()

    if parent_node["move_list"] in current_move and parent_node["eco_code"] == eco_code:
        current_node = {"name": opening_name,
                        "parent": parent_node["name"],
                        "type": "variant",
                        "eco_code": eco_code,
                        "move_list": current_move,
                        "board_state": final_board_state,
                        "children": []}
        
        game = find_variants(mainline_node, current_node)
        
        parent_node["children"].append(current_node)

        return game

    elif mainline_node["move_list"] in current_move and mainline_node["eco_code"] == eco_code:
        current_node = {"name": opening_name,
                        "parent": mainline_node["name"],
                        "type": "variant",
                        "eco_code": eco_code,
                        "move_list": current_move,
                        "board_state": final_board_state,
                        "children": []}
        
        game = find_variants(mainline_node, current_node)
        
        mainline_node["children"].append(current_node)

        return game

    else:
        return game

first_iter = True

while True:

    if first_iter:
        game = chess.pgn.read_game(pgn)

    if game is None:
        break

    eco_code = game.headers["Site"]
    opening_name = game.headers["White"]
    variation_name = game.headers["Black"]

    # Create ECO code node if it doesn't exist
    if eco_code not in nodes:
        nodes[eco_code] = {
            "name": eco_code,
            "type": "eco",
            "children": []
        }

    if variation_name != "?":
        parent = False
        opening_name += " - " + variation_name

    opening_name = opening_name.strip()

    move_list = []
    # Get the final board state
    board = game.board()
    for move in game.mainline_moves():
        board.push(move)
        move_list.append(str(move))

    current_move = ''.join(move_list)
    
    final_board_state = board.fen()

    current_node = {"name": opening_name,
                    "parent": eco_code,
                    "eco_code": eco_code,
                    "type": "mainline",
                    "move_list": current_move,
                    "board_state": final_board_state,
                    "children": []}
    
    game = find_variants(current_node, current_node)

    nodes[eco_code]["children"].append(current_node)

    first_iter = False


# Write the data to a json file
with open("openings_data2.json", "w") as json_file:
    json.dump(nodes, json_file)

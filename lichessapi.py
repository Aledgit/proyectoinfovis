## Use lichess API

import requests
import json

# Get a game from lichess from FEN

def get_game(fen):
    url = "https://explorer.lichess.ovh/lichess?variant=standard&speeds[]=blitz&speeds[]=rapid&speeds[]=classical&ratings[]=1600&ratings[]=1800&ratings[]=2000&ratings[]=2200&fen=" + fen
    response = requests.get(url)
    data = json.loads(response.text)
    return data

# Get a game from lichess from a list of moves
game = get_game("rnbqkb1r/pppppppp/7n/8/1P6/8/P1PPPPPP/RNBQKBNR w KQkq - 1 2")

# Print the game
print(game)
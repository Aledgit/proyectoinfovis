#open aperturas.csv

# crear un diccionario para uno de los rangos de elo [700,800), [800,900) .... , [2600,2700)
# dentro de ese diccionario, crear un diccionario para cada 'FirstMove', y para cada una de esas jugadas, contar cuantas veces aparece cada "ECO"

import json

# read openings_data.json and create a dictionary with the following structure:
# {'eco_code': eco code,
#   'variations': {'opening_name': opening_name', 'final_board_state': final_board_state}}

with open('openings_data.json') as f:
    openings = json.load(f)

    openings_dict = {}

    for opening in openings:
        eco_code = opening['eco_code']
        opening_name = opening['opening_name']
        final_board_state = opening['final_board_state']

        if eco_code not in openings_dict:
            openings_dict[eco_code] = []

        openings_dict[eco_code].append({
            'opening_name': opening_name,
            'final_board_state': final_board_state
        })


# now open aperturas.csv

with open('aperturas.csv') as f:

    # we want a dictionary with the following structure:
    # {'elo': {
    #   'FirstMove': {
        


        

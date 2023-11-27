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

print(openings_dict)
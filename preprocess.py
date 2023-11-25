#open aperturas.csv

# crear un diccionario para uno de los rangos de elo [700,800), [800,900) .... , [2600,2700)
# dentro de ese diccionario, crear un diccionario para cada 'FirstMove', y para cada una de esas jugadas, contar cuantas veces aparece cada "ECO"

import json

with open('aperturas.csv') as f:
    lines = f.readlines()

    rangos = [(700,799), (800,899), (900,999), (1000,1099), (1100,1199), (1200,1299), (1300,1399), (1400,1499), (1500,1599), (1600,1699), (1700,1799), (1800,1899), (1900,1999), (2000,2099), (2100,2199), (2200,2299), (2300,2399), (2400,2499), (2500,2599), (2600,2700)]
    jugadas = ['Nf3', 'c4', 'd4', 'e3', 'e4']
    eco_count_dict = {}

    for line in lines:

        #ignore first line
        if line == lines[0]:
            continue
        elo = int(line.split(',')[0])
        eco = line.split(',')[1]
        first_move = line.strip('\n').split(',')[2]

        if first_move not in jugadas:
            continue

        # check what range elo is in
        for rango in rangos:
            if elo >= rango[0] and elo <= rango[1]:
                elo_range = rango
                break
        
        elo_range = str(elo_range[0]) + '-' + str(elo_range[1])
        # create a dictionary for that elo range as a string if it doesn't exist
        if elo_range not in eco_count_dict:
            #convert the tuple to a string
            eco_count_dict[elo_range] = {}
        
        # create a dictionary for that first move if it doesn't exist
        if first_move not in eco_count_dict[elo_range]:
            eco_count_dict[elo_range][first_move] = {}

        # add 1 to the count of that eco
        if eco not in eco_count_dict[elo_range][first_move]:
            eco_count_dict[elo_range][first_move][eco] = 1
        else:
            eco_count_dict[elo_range][first_move][eco] += 1

print(eco_count_dict.keys())
with open('eco_count_dict.json', 'w') as outfile:
        json.dump(eco_count_dict, outfile)

        

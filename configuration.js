////////////////////////////
// NO EDITAR ESTE ARCHIVO //
////////////////////////////
/* Cada vez que se seleccione un tipo de planeta, esta función será llamada
para actualizar la segunda visualización */
let JUGADAS = [];
let VARIANTES = [];
let previous_eco = '';

function preprocesarNodo_Enlace(elegidas, rango_elo, data_1, new_data, colorDict) {
    // y lo guardo en mi variable externa "SATELITES".
    if (JUGADAS.length == 0) {
        d3.json('eco_count_dict.json').then(dataset => {
            // Como no pongo let antes, sobrescribo la variable anterior.
            JUGADAS = dataset;
            // Find all the eco_codes for the selected elo range for the selected jugadas
            // Llamo de nuevo a preprocesarSatelites 
            // para que ahora si se ejecute cuando SATELITES tenga datos
            preprocesarNodo_Enlace(elegidas, rango_elo, data_1, new_data, colorDict)
        })
        // Hacemos return para que la función no continue su ejecución
        return 0;
    }

    let elo_filtered = JUGADAS[rango_elo];
    let eco_codes = [];
            elegidas.forEach(d => {
                eco_codes.push([d, Object.keys(elo_filtered[d])]);
            })

    console.log(eco_codes)

    if (VARIANTES.length == 0) {
        d3.json('openings_data2.json').then(dataset => {
            VARIANTES = dataset;
            preprocesarNodo_Enlace(elegidas, rango_elo, data_1, new_data, colorDict)            
        })
        return 0;
    }

    console.log(VARIANTES["A21"])

    let eco_dict = {};
    eco_codes.forEach(tuple => {
        eco_dict[tuple[0]] = [];
        tuple[1].forEach(eco => {
            eco_dict[tuple[0]].push(VARIANTES[eco]["children"]);
        }) 
    })

    // Generamos una copia del dataset
    let data = JSON.parse(JSON.stringify(JUGADAS));

    nodo_enlace(data, elegidas, rango_elo, data_1, new_data, colorDict, eco_dict);
}

function preprocesarChess_Graph(eco) {

    if (eco != previous_eco) {
        d3.json('openings_data.json').then(dataset => {
            // Keep only the data where dataset['eco'] == eco
            VARIANTES = dataset.filter(d => d['eco_code'] == eco);
            // agregar las variantes a #variante
            previous_eco = eco;
            preprocesarChess_Graph(eco);
        })
        return 0;
    }

    // poblamos el select con las variantes
    // delete all previous options


    let select = document.getElementById("variante");
    // remove all options
    select.innerHTML = "";
    // add the options

    let variantes = VARIANTES.map(d => d['opening_name']);
    variantes.forEach(variante => {
        let option = document.createElement("option");
        option.text = variante;
        select.add(option);
    })

    d3.select("#variante").on("change", (_) => {
        let variante = document.getElementById("variante").selectedOptions[0].value;
        // get the final_board_state for the selected variante
        console.log(variante)
        let final_board_state = VARIANTES.filter(d => d['opening_name'] == variante)[0]['final_board_state'];
        console.log(final_board_state)
        chess_graph(final_board_state);
    })

    previous_eco = eco;

    //chess_graph(data, variante);
}



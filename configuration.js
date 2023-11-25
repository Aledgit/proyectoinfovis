////////////////////////////
// NO EDITAR ESTE ARCHIVO //
////////////////////////////
/* Cada vez que se seleccione un tipo de planeta, esta función será llamada
para actualizar la segunda visualización */
let JUGADAS = [];
let VARIANTES = [];
let previous_eco = '';

function preprocesarNodo_Enlace(jugadas, rango_elo, data_1, new_data, colorDict) {
    // y lo guardo en mi variable externa "SATELITES".
    if (JUGADAS.length == 0) {
        d3.json('eco_count_dict.json').then(dataset => {
            // Como no pongo let antes, sobrescribo la variable anterior.
            JUGADAS = dataset;
            // Llamo de nuevo a preprocesarSatelites 
            // para que ahora si se ejecute cuando SATELITES tenga datos
            preprocesarNodo_Enlace(jugadas, rango_elo, data_1, new_data, colorDict)
        })
        // Hacemos return para que la función no continue su ejecución
        return 0;
    }

    // Generamos una copia del dataset
    let data = JSON.parse(JSON.stringify(JUGADAS));

    nodo_enlace(data, jugadas, rango_elo, data_1, new_data, colorDict);
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



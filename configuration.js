////////////////////////////
// NO EDITAR ESTE ARCHIVO //
////////////////////////////
const satelitesURL = "https://gist.githubusercontent.com/Hernan4444/c3c1951d161fec6eea6cc70c9b06b597/raw/de6ecf7f0d217e2c7f093b307c506c5708d01764/satelites.json"

/* Cada vez que se seleccione un tipo de planeta, esta función será llamada
para actualizar la segunda visualización */
let JUGADAS = [];

function preprocesarNodo_Enlace(jugadas, rango_elo, data_1) {
    // Si la lista de datos está vacía, descargo el dataset
    // y lo guardo en mi variable externa "SATELITES".
    if (JUGADAS.length == 0) {
        d3.json('eco_count_dict.json').then(dataset => {
            // Como no pongo let antes, sobrescribo la variable anterior.
            JUGADAS = dataset;
            // Llamo de nuevo a preprocesarSatelites 
            // para que ahora si se ejecute cuando SATELITES tenga datos
            preprocesarNodo_Enlace(jugadas, rango_elo, data_1)
        })
        // Hacemos return para que la función no continue su ejecución
        return 0;
    }

    // Generamos una copia del dataset
    let data = JSON.parse(JSON.stringify(JUGADAS));

    d3.select("#order-by").on("change", (_) => {
        let rango_elo = d3.select("#order-by").property("value");
        nodo_enlace(data, jugadas, rango_elo, data_1);
    })

    nodo_enlace(data, jugadas, rango_elo, data_1);
}



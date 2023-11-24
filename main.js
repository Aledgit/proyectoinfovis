const SVG1 = d3.select("#vis-1").append("svg");
const SVG2 = d3.select("#vis-2").append("svg");
const SVG3 = d3.select("#vis-2").append("svg");
const data_vis_1 = "data_vis_1.csv"

const WIDTH_VIS_1 = 1400;
const HEIGHT_VIS_1 = 800;

const WIDTH_VIS_2 = 1400;
const HEIGHT_VIS_2 = 1200;

const WIDTH_VIS_3 = 800;
const HEIGHT_VIS_3 = 800;

const margins_1 = [50, 50, 50, 50]; //ZQUIERDA, DERECHA, ARRIBA, ABAJO
const margins_2 = [50, 50, 50, 50]; //ZQUIERDA, DERECHA, ARRIBA, ABAJO
const margins_3 = [50, 50, 50, 50]; //ZQUIERDA, DERECHA, ARRIBA, ABAJO



SVG1.attr("width", WIDTH_VIS_1).attr("height", HEIGHT_VIS_1);
SVG2.attr("width", WIDTH_VIS_2).attr("height", HEIGHT_VIS_2);
SVG3.attr("width", WIDTH_VIS_3).attr("height", HEIGHT_VIS_3);

cargar_datos();



function cargar_datos() {
    d3.csv(data_vis_1).then(function(d) {
        
        var data_1 = {};
      
        
        d.forEach(function(d) {
          d.Nf3 = +d.Nf3;
          d.c4 = +d.c4;
          d.d4 = +d.d4;
          d.e3 = +d.e3;
          d.e4 = +d.e4;
      
        
          data_1[d.elo_intervalo] = {
            Nf3: d.Nf3,
            c4: d.c4,
            d4: d.d4,
            e3: d.e3,
            e4: d.e4
          };
        });
      
        // console.log(dataDictionary["[700, 800)"]);
        // Output: { Nf3: 3, c4: 0, d4: 2, e3: 5, e4: 29 }
        mostrar_grafico(data_1);
        
      });       
}



function mostrar_grafico(data_1){

    var totals = Object.values(data_1).map(function(d) {
        return d.Nf3 + d.c4 + d.d4 + d.e3 + d.e4;
    });

    var normalizedData = Object.values(data_1).map(function(d, i) {
        return {
            elo_intervalo: Object.keys(data_1)[i],
            Nf3: (d.Nf3 / totals[i]) * 100,
            c4: (d.c4 / totals[i]) * 100,
            d4: (d.d4 / totals[i]) * 100,
            e3: (d.e3 / totals[i]) * 100,
            e4: (d.e4 / totals[i]) * 100,
        };
        });



    var series = d3.stack()
        .keys(["Nf3", "c4", "d4", "e3", "e4"])
        .order(d3.stackOrderDescending)
        .offset(d3.stackOffsetNone)
        .value(function(d, key) { return d[key]; })(normalizedData);
    
    var colorScale = d3.scaleOrdinal()
        .domain(["Nf3", "c4", "d4", "e3", "e4"])
        .range(d3.schemeAccent);
    
    var xScale = d3.scaleBand()
        .domain(normalizedData.map(function(d) { return d.elo_intervalo; }))
        .range([margins_1[0], WIDTH_VIS_1 - margins_1[1]])
        .padding(0.5);
    
    var yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([HEIGHT_VIS_1 - margins_1[2], margins_1[3]]);

    SVG1.selectAll("g")
        .data(series)
        .enter().append("g")
        .attr("fill", function(d) { return colorScale(d.key); })
        .on("click", function(event, d) {
            console.log(d.key);
        })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return xScale(d.data.elo_intervalo); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
        .attr("width", xScale.bandwidth())
        .on("click", function(event, d) {
            console.log(d.data.elo_intervalo);
        });
        
    
    // Añade ejes
    SVG1.append("g")
        .attr("transform", "translate(0," + (HEIGHT_VIS_1 - margins_1[2]) + ")")
        .call(d3.axisBottom(xScale));

    SVG1.append("text")
        .attr("transform", "translate(" + (WIDTH_VIS_1 / 2) + " ," + (HEIGHT_VIS_1 - margins_1[2] + 35) + ")")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Elo");
    
    SVG1.append("g")
        .attr("transform", "translate(" + margins_1[0] + ", 0)")
        .call(d3.axisLeft(yScale));

    SVG1.append("text")
        .attr("transform", "translate(" + (margins_1[0]) + " ," + (margins_1[2] - 15) + ")")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Porcentaje");
    preprocesarNodo_Enlace(["e4", "d4"], "700-799", data_1["[700, 800)"])

}


function nodo_enlace(data, jugadas, elo, data_1){
    console.log(data_1)

    svgHeight = HEIGHT_VIS_2 - margins_2[2] - margins_2[3];
    svgWidth = WIDTH_VIS_2 - margins_2[0] - margins_2[1];

    let dataArray = Object.values(data);

    // nos quedamos con los datos del rango de elo
    let datos = data[elo]
    let filteredData = {}

    let eloData = data[elo];
    jugadas.forEach(key => {
        filteredData[key] = eloData[key];})

    let entries = Object.entries(filteredData);
    entries.sort((a, b) => b[1] - a[1]);  // Sort in descending order
    let sortedData1 = Object.fromEntries(entries);

    let sortedData = {};

    Object.keys(sortedData1).forEach(move => {
        let openings = Object.entries(sortedData1[move])
            .sort((a, b) => b[1] - a[1]) // Ensure it's sorted in descending order
            .slice(0, 5) // Take the first 5 entries
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}); // Convert array back to object

        sortedData[move] = openings;
    });

    console.log(sortedData)

    // Find the max and min from the datos_1 dictionary
    const MAX_FIRSTMOVE = Math.max(...Object.values(data_1));
    const MIN_FIRSTMOVE = Math.min(...Object.values(data_1));

    console.log(MIN_FIRSTMOVE, MAX_FIRSTMOVE)

    // make a scale for the radius of the circles
    let firstMoveRadius = d3.scaleLinear()
        .domain([MIN_FIRSTMOVE, MAX_FIRSTMOVE])
        .range([30, 70]);

    let allValues = [];

    // Flatten all the values into a single array
    Object.values(sortedData).forEach(innerDict => {
        allValues.push(...Object.values(innerDict));
    });

    // Find the max and min from the array
    const MAX_OPENING = Math.max(...allValues);
    const MIN_OPENING = Math.min(...allValues);

    let openingRadius = d3.scaleLinear()
        .domain([MIN_OPENING, MAX_OPENING])
        .range([18, 30]);

    console.log(MAX_OPENING, MIN_OPENING)

    // create a 'g' element for each data entry, to make a node-link diagram with d3

    let numRegions = Object.keys(sortedData).length;
    let regionHeight = HEIGHT_VIS_2 / numRegions; 
    let regionWidth = WIDTH_VIS_2 / numRegions;

    let firstMovesKeys = Object.keys(sortedData);

    firstMovesKeys.forEach((move, i) => {
        SVG2.append("g")
        .attr("class", "region region-" + move)
        .attr("transform", `translate(${i * regionWidth}, 0)`);
    });

    let svg = SVG2;

    let datasets = firstMovesKeys.map(move => {
        let nodes = [{id: move, type: 'firstMove', sizeVariable: data_1[move], fixedY: 150}];
        let links = [];
    
        Object.keys(sortedData[move]).forEach(opening => {
            nodes.push({id: opening, type: 'opening', sizeVariable: sortedData[move][opening]});
            links.push({source: move, target: opening});
        });
    
        return {nodes, links, move};
    });

    datasets.forEach(dataset => {
        let regionGroup = svg.select(".region-" + dataset.move);
    
        let simulation = d3.forceSimulation(dataset.nodes)
            .force("link", d3.forceLink(dataset.links).id(d => d.id).distance(50))
            .force("charge", d3.forceManyBody().strength(-5000))
            .force("center", d3.forceCenter(regionWidth / 2, svgHeight / 2))
            .force("y", d3.forceY(d => d.fixedY ? d.fixedY : svgHeight / 2))
            .force("x", d3.forceX(regionWidth / 2));

    
        // Draw links
        let link = regionGroup.selectAll(".link")
            .data(dataset.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke", "white");
    
        // Draw nodes
        let node = regionGroup.selectAll(".node")
            .data(dataset.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", d => d.type === 'firstMove' ? firstMoveRadius(d.sizeVariable) : openingRadius(d.sizeVariable))
            .style("fill", d => d.type === 'firstMove' ? "blue" : "red");

        function calculateFontSize(radius) {
                // proportional to the radius
                console.log(radius)
                return 13 + radius / 2;
            }
        
        let labels = regionGroup.selectAll(".label")
            .data(dataset.nodes)
            .enter().append("text")
            .attr("class", "label")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", d => calculateFontSize(d.sizeVariable))
            .text(d => d.id);

        // Update positions on each tick
        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
    
            node.attr("cx", d => d.x)
                .attr("cy", d => d.y);

            labels.attr("x", d => d.x)
                .attr("y", d => d.y);
        });
    });

    return;
}



function crearSatelites(dataset, categoria, filtrar_dataset, ordenar_dataset) {
    // 1. Actualizo nombre de un H4 para saber qué hacer con el dataset
    let texto = `Categoria: ${categoria} - Filtrar: ${filtrar_dataset} - Orden: ${ordenar_dataset}`
    d3.selectAll("#selected").text(texto)

    // 2. Nos quedamos con los satelites asociados a la categoría seleccionada
    console.log(categoria)
    let datos = dataset.filter(d => CATEGORIAS_POR_PLANETA[d.planet] == categoria)

    // 3. Filtrar, cuando corresponde, por magnitud
    // Completar aquí
    console.log(filtrar_dataset)


    // 4. Quedarnos con solo 30 satelites. No editar esta línea
    datos = datos.slice(0, 30);
    console.log(datos)

    // 5. Ordenar, según corresponda, los 30 satelites. Completar aquí
    console.log(ordenar_dataset)



    // 6. Confeccionar la visualización


}
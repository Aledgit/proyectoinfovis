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

const CHESS_SQUARES = ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
    "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
    "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
    "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
    "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
    "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
    "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
    "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"];

const JUGADAS_POSIBLES = ["Nf3", "c4", "d4", "e3", "e4"];

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

    let firstKey = Object.keys(data_1)[0];
    let seleccionados = Object.values(data_1[firstKey]).map(item => false)
    console.log(seleccionados)

    var series = d3.stack()
        .keys(["Nf3", "c4", "d4", "e3", "e4"])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone)
        .value(function(d, key) { return d[key]; })(normalizedData);
    
    var colorScale = d3.scaleOrdinal()
        .domain(["Nf3", "c4", "d4", "e3", "e4"])
        .range(d3.schemeCategory10);
    
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
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return xScale(d.data.elo_intervalo); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
        .attr("width", xScale.bandwidth())
        .on('click', (event, d) => {
            preprocesarNodo_Enlace(d.data.elo_intervalo, data_1[d.data.elo_intervalo]);
        });
    
    // Añade ejes
    SVG1.append("g")
        .attr("transform", "translate(0," + (HEIGHT_VIS_1 - margins_1[2]) + ")")
        .call(d3.axisBottom(xScale));
    
        SVG1.append("g")
        .attr("transform", "translate(" + margins_1[0] + ", 0)")
        .call(d3.axisLeft(yScale));

    preprocesarNodo_Enlace(["e4", "e3", "d4", "Nf3", "c4"], "1000-1099", data_1["[1100, 1200)"])

}


function nodo_enlace(data, jugadas, elo, data_1){
    console.log(data_1)

    let dataArray = Object.values(data);

    let svg = SVG2;

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
    let firstMovesKeys = Object.keys(sortedData);

    let numFirstMoves = firstMovesKeys.length;

    let svgWidth = WIDTH_VIS_2;
    let svgHeight = HEIGHT_VIS_2;
    

    let cols = Math.min(2, numFirstMoves); // Maximum of 2 columns
    let rows = Math.ceil(numFirstMoves / cols);

    let regionWidth = svgWidth / cols;
    let regionHeight = svgHeight / rows;

    firstMovesKeys.forEach((move, i) => {
        let colIndex = i % cols;
        let rowIndex = Math.floor(i / cols);

        svg.append("g")
       .attr("class", "region region-" + move)
       .attr("transform", `translate(${colIndex * regionWidth}, ${rowIndex * regionHeight})`);
    });

    let datasets = firstMovesKeys.map(move => {
        let nodes = [{id: move, type: 'firstMove', sizeVariable: data_1[move], fixedY: 50}];
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
            .force("center", d3.forceCenter(regionWidth / 2, svgHeight / 5))
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
                return Math.min(10 + radius / 2, 15);
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

function chess_graph(opening){
    let svg = SVG3;
    let svgWidth = WIDTH_VIS_3;
    let svgHeight = HEIGHT_VIS_3;

    let numSquares = 8;
    let squareSize = Math.min(svgWidth, svgHeight) / numSquares;
}
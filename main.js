const SVG1 = d3.select("#vis-1").append("svg");
const SVG2 = d3.select("#vis-2").append("svg");
const SVG3 = d3.select("#vis-3").append("svg");
const data_vis_1 = "data_vis_1.csv"

const WIDTH_VIS_1 = 1400;
const HEIGHT_VIS_1 = 800;

const WIDTH_VIS_2 = 1400;
const HEIGHT_VIS_2 = 1200;

const WIDTH_VIS_3 = 800;
const HEIGHT_VIS_3 = 800;

const margins_1 = [50, 50, 100, 50]; //ZQUIERDA, DERECHA, ARRIBA, ABAJO
const margins_2 = [50, 50, 50, 50]; //ZQUIERDA, DERECHA, ARRIBA, ABAJO
const margins_3 = {top: 20, right: 20, bottom: 40, left: 40 };

const CHESS_SQUARES = ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
                        "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
                        "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
                        "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
                        "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
                        "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
                        "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
                        "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]

const JUGADAS_POSIBLES = ["Nf3", "c4", "d4", "e3", "e4"];

const ID_JUGADAS = {"Nf3": 0, "c4": 1, "d4": 2, "e3": 3, "e4": 4};

const unicodePieces = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

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

    var series = d3.stack()
        .keys(JUGADAS_POSIBLES)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone)
        .value(function(d, key) { return d[key]; })(normalizedData);

    // create a grey color scale
    var greyScale = d3.scaleOrdinal()
        .domain(JUGADAS_POSIBLES)
        .range(d3.schemeGreys[5]);
    
    var colorScale = d3.scaleOrdinal()
        .domain(JUGADAS_POSIBLES)
        .range(d3.schemeAccent);
    
    // fill the color dictionary with the colors using colorScale for the values
    var colorDict = {};
    JUGADAS_POSIBLES.forEach(function(d) {
        colorDict[d] = colorScale(d);
    });
    
    var xScale = d3.scaleBand()
        .domain(normalizedData.map(function(d) { return d.elo_intervalo; }))
        .range([margins_1[0], WIDTH_VIS_1 - margins_1[1]])
        .padding(0.5);
    
    var yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([HEIGHT_VIS_1 - margins_1[2], margins_1[3]]);

    let eloRange;
    let frecuencias;
    let previousElo;
    let new_data = false;
    
    SVG1.selectAll("g")
        .data(series)
        .enter().append("g")
        .attr("fill", function(d) { return colorScale(d.key); })
        .on("click", function(event, d) {
            let id_jugada = ID_JUGADAS[d.key];
            if (previousElo != eloRange){
                seleccionados = Object.values(data_1[firstKey]).map(item => false)
            }
            seleccionados[id_jugada] = !seleccionados[id_jugada];
            previousElo = eloRange;
            let selectedMoves = JUGADAS_POSIBLES.filter((_, i) => seleccionados[i]);

            let elegidos = SVG1.selectAll("rect")
                .filter(function(d, i) { return d.data.elo_intervalo == eloRange});
            
            let elegidos2 = elegidos.filter(function(d, i) { return seleccionados[i] == true});
            console.log(elegidos2)

            // make all rects gray except elegidos
            SVG1.selectAll("rect")
                .style("fill", function(d) { return greyScale(d.parentKey); });

            elegidos2.style("fill", function(d) { return colorScale(d.parentKey); });

            preprocesarNodo_Enlace(selectedMoves, eloRange , frecuencias, new_data, colorDict)
            new_data = true;
        })

        .selectAll("rect")
        .data(function(d) {
            // Here, modify each data item to include the parent's key
            return d.map(item => {
                return {...item, parentKey: d.key};
            });
        })
        .enter().append("rect")
        .attr("x", function(d) { return xScale(d.data.elo_intervalo); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
        .attr("width", xScale.bandwidth())
        .on("click", function(event, d) {
            //make every bar gray except the one that was clicked

            eloRange = d.data.elo_intervalo;
            frecuencias = data_1[eloRange];

            // filter all rects that are on the same eloRange as the one clicked and their index is true in seleccionados
        });
    
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
        .attr("transform", "translate(" + (margins_1[0]) + " ," + (margins_1[2]- 65) + ")")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Porcentaje");
    
    //Leyenda
    const leyendaDatos = series.map(d => ({ key: d.key, color: colorScale(d.key) }));

    const leyenda = SVG1.append("g")
    .attr("class", "leyenda")
    .attr("transform", "translate(492,"+(HEIGHT_VIS_1 - 50) + ")"); // Ajusta la posición de la leyenda según tus necesidades

    const elementosLeyenda = leyenda.selectAll("g")
    .data(leyendaDatos)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + i * 100 + ", 0)"; }); // Ajusta el espacio entre elementos

// Agregar círculo de color
    elementosLeyenda.append("circle")
    .attr("cx", 9)
    .attr("cy", 9)
    .attr("r", 9) // Ajusta el radio según tus necesidades
    .style("fill", function(d) { return d.color; });

// Agregar texto
    elementosLeyenda.append("text")
    .attr("x", 25)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d) { return d.key; });     

    leyenda.selectAll("text")
        .style("font-size", "12px")
        .style("font-family", "Arial")
        .style("fill", "white");
    //Fin leyenda

    d3.select("#filter-reset").on("click", function() {
        // delete everything in SVG1
        SVG1.selectAll("*").remove();
        SVG2.selectAll("*").remove();
        SVG3.selectAll("*").remove();

        // call itself again to reset the filter
        mostrar_grafico(data_1);});


}


function nodo_enlace(data, jugadas, elo, data_1, new_data, colorDict){

    if (new_data) {
        SVG2.selectAll("*").remove();
    }

    let svg = SVG2;

    let filteredData = {}

    let eloData = data[elo];

    jugadas.forEach(key => {
        filteredData[key] = eloData[key];})

    let entries = Object.entries(filteredData);
    entries.sort((a, b) => b[1] - a[1]); 
    let sortedData1 = Object.fromEntries(entries);

    let sortedData = {};

    Object.keys(sortedData1).forEach(move => {
        let openings = Object.entries(sortedData1[move])
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

        sortedData[move] = openings;
    });

    let MAX_FIRSTMOVE = Math.max(...Object.values(data_1));
    let MIN_FIRSTMOVE = Math.min(...Object.values(data_1));

    let firstMoveRadius = d3.scaleLinear()
        .domain([MIN_FIRSTMOVE, MAX_FIRSTMOVE])
        .range([30, 70]);

    let allValues = [];

    Object.values(sortedData).forEach(innerDict => {
        allValues.push(...Object.values(innerDict));
    });

    let MAX_OPENING = Math.max(...allValues);
    let MIN_OPENING = Math.min(...allValues);

    let openingRadius = d3.scaleLinear()
        .domain([MIN_OPENING, MAX_OPENING])
        .range([18, 30]);

    let firstMovesKeys = Object.keys(sortedData);

    let numFirstMoves = firstMovesKeys.length;

    let svgWidth = WIDTH_VIS_2;
    let svgHeight = HEIGHT_VIS_2;
    

    let cols = Math.min(2, numFirstMoves);
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

        if (new_data)
        {
            regionGroup.selectAll("*").remove();
        }

        // Idea de las simulaciones: https://d3-graph-gallery.com/graph/network_basic.html
    
        let simulation = d3.forceSimulation(dataset.nodes)
            .force("link", d3.forceLink(dataset.links).id(d => d.id).distance(50))
            .force("charge", d3.forceManyBody().strength(-5000))
            .force("center", d3.forceCenter(regionWidth / 2, svgHeight / 5))
            .force("y", d3.forceY(d => d.fixedY ? d.fixedY : svgHeight / 2))
            .force("x", d3.forceX(regionWidth / 2));
        
        let link = regionGroup.selectAll(".link")
            .data(dataset.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke", "white");

        let node = regionGroup.selectAll(".node")
            .data(dataset.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", d => d.type === 'firstMove' ? firstMoveRadius(d.sizeVariable) : openingRadius(d.sizeVariable))
            .style("fill", d => d.type === 'firstMove' ? colorDict[d.id] : "white")
            .on("click", function(event, d) {
                let eco = d.id;
                preprocesarChess_Graph(eco);
            })

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
            .style("fill", "black")
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

function chess_graph(board_state){

    let svg = SVG3;

    SVG3.style("background-color", "brown")

    let chessboardGroup = svg.append("g")
        .attr("transform", `translate(${margins_3.left}, ${margins_3.top})`);

    let squaresData = CHESS_SQUARES.map((square, index) => {
        let col = index % 8;
        let row = Math.floor(index / 8);
        let isWhiteSquare = (row + col) % 2 === 0;
        return {
            id: square,
            col: col,
            row: row,
            color: isWhiteSquare ? "#eedc97" : "#964d22"
        };
    });

    let svgWidth = WIDTH_VIS_3;
    let svgHeight = HEIGHT_VIS_3;
    let squareSize = Math.min((svgWidth - margins_3.left - margins_3.right), (svgHeight - margins_3.top - margins_3.bottom)) / 8;

    const rows = ["8", "7", "6", "5", "4", "3", "2", "1"]

    rows.forEach((row, i) => {
        chessboardGroup.append("text")
        .attr("x", -margins_3.left / 2)
        .attr("y", i * squareSize + squareSize / 2)
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("fill", "white")
        .text(rows[i]);
    })

    const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];
    columns.forEach((col, i) => {
        chessboardGroup.append("text")
            .attr("x", i * squareSize + squareSize / 2)
            .attr("y", 8 * squareSize + margins_3.bottom / 2)
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("fill", "white")
            .text(col);
    });

    let piecePlacement = board_state.split(' ')[0];
    let ranks = piecePlacement.split('/');

    let startingPositions = {};

    ranks.forEach((rank, rowIndex) => {
        let fileIndex = 0;
        for (let char of rank) {
            if (isNaN(char)) {
                const position = String.fromCharCode(97 + fileIndex) + (8 - rowIndex);
                startingPositions[position] = char;
                fileIndex++;
            } else {
                fileIndex += parseInt(char);
            }
        }
    });

    chessboardGroup.selectAll(".chess-square")
        .data(squaresData)
        .enter()
        .append("g")
        .attr("class", "chess-square")
        .attr("transform", d => `translate(${d.col * squareSize}, ${d.row * squareSize})`)
        .append("rect")
        .attr("width", squareSize)
        .attr("height", squareSize)
        .attr("fill", d => d.color);
    
    let piecesData = Object.entries(startingPositions).map(([position, piece], index) => {
        let col = position.charCodeAt(0) - 'a'.charCodeAt(0);
        let row = 8 - parseInt(position.charAt(1)); 
        return {
            id: position,
            piece: unicodePieces[piece] || piece,
            col: col,
            row: row,
            color: piece === piece.toUpperCase() ? "white" : "black"
        };
    });

    chessboardGroup.selectAll(".chess-piece")
        .data(piecesData)
        .enter()
        .append("g")
        .attr("class", "chess-piece")
        .attr("transform", d => `translate(${d.col * squareSize + squareSize / 2}, ${d.row * squareSize + squareSize / 2})`)
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .style("font-size", `${squareSize / 2}px`)
        .style("fill", d => d.color === "white" ? "white" : "black")
        .text(d => d.piece);
}
const SVG1 = d3.select("#vis-1").append("svg");
const SVG2 = d3.select("#vis-2").append("svg");
const SVG3 = d3.select("#vis-2").append("svg");
const data_vis_1 = "data_vis_1.csv"

const WIDTH_VIS_1 = 1400;
const HEIGHT_VIS_1 = 800;

const WIDTH_VIS_2 = 800;
const HEIGHT_VIS_2 = 800;

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
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return xScale(d.data.elo_intervalo); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
        .attr("width", xScale.bandwidth());
    
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
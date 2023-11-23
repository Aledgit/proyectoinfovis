const SVG1 = d3.select("#vis-1").append("svg");
const SVG2 = d3.select("#vis-2").append("svg");
const SVG3 = d3.select("#vis-2").append("svg");
const datos = "aperturas.csv"

const WIDTH_VIS_1 = 800;
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
    d3.csv(datos).then(d => {
        let data = d.map(item => ({
            first_move: item.FirstMove,
            elo: +item.WhiteElo,
            eco: item.ECO,
        }));
        mostrar_grafico(data);     
    })       
}



function mostrar_grafico(data){

    const n = Object.keys(data).length;
    console.log(n)

    const eloMinimo = 700;
    const eloMaximo = 2700;

    console.log(eloMinimo);
    console.log(eloMaximo);

    //Escalas

    const escala_vertical = d3.scaleLog()
        .domain([0, 100])
        .range([margins_1[3], HEIGHT_VIS_1 - margins_1[2]]);
    
    const escala_horizontal = d3.scaleLog()
        .domain([1, 10000])
        .range([margins_1[0], WIDTH_VIS_1] - margins_1[1]);


    //Figuras
    let planetsG = SVG1.append('g').attr('id', 'planetsG');
        planetsG
            .selectAll("text")
            .data(data)
            .join("text")
            .attr("x", d => escala_vertical(d.distance_from_sun))
            .attr("y", d => HEIGHT_VIS_1 / 2 + d.radius*350 + 10)
            .text(d => d.planet)
            .attr("fill", "white")
            .style("font-size", "5px");
        

        planetsG
            .selectAll("ellipse")
            .data(data)
            .enter()
            .append("ellipse")
            .attr("cx", 0) 
            .attr("cy",WIDTH_VIS_1/2) 
            .attr("rx", d => escala_vertical(d.distance_from_sun)) 
            .attr("ry", d => escala_vertical(d.distance_from_sun)/2) 
            .attr("fill", "none") 
            .attr("stroke", "gray")
            .attr("stroke-width", 0.2); 

        planetsG
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", d => escala_vertical(d.distance_from_sun))
            .attr("cy", HEIGHT_VIS_1 /2)
            .attr("r", d => d.radius * 350)
            .attr("fill", d => escala_colores(d.mean_temperature))
            .attr("data-planet", d => d.planet)
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip)
            .on("click", (event, d) => {
                handleCircleClick(event, d, CATEGORIAS_POR_PLANETA[d.planet]);
            });

    //Funciones
    function showTooltip(event, d) {  
        const xPosition = escala_vertical(d.distance_from_sun) - 95;
        const yPosition = HEIGHT_VIS_1 / 2;
        let tooltip = planetsG.select("#tooltip");
              
        if (tooltip.empty()) {
           tooltip = planetsG
                .append("foreignObject")
                .attr("id", "tooltip")
                .attr("width", 95) 
                .attr("height", 50) 
                .attr("x", xPosition)
                .attr("y", yPosition) 
                .append("xhtml:div")
                .style("width", "100%") 
                .style("height", "100%") 
                .style("background-color", "rgba(255, 255, 255, 0.9)") 
                .style("border", "1px solid gray") 
                .style("padding", "10px")
                .style("font-size", "5px") 
                .html(`<div style="color: black; text-align: left;">Planet: ${d.planet}<br>Diameter: ${d.diameter} km<br>
                Distance from sun: ${d.diameter} Gm<br>Mean temperature: ${d.mean_temperature} °C</div>`);
            }         
        }
              
    function hideTooltip() {
        if (tooltip) {
            tooltip.remove(); 
        }
    }


    function handleCircleClick(event, d, categoria) {
        planetsG.selectAll("circle")
          .filter(circleData => CATEGORIAS_POR_PLANETA[circleData.planet] !== categoria)
          .classed("selected", false);
      
        planetsG.selectAll("circle")
          .filter(circleData => CATEGORIAS_POR_PLANETA[circleData.planet] === categoria)
          .classed("selected", true);
      }
    

          
          

    const boton_1 = document.getElementById("showCat2");
    const boton_2 = document.getElementById("showCat1");
    boton_1.addEventListener("click", () => {
        handleCircleClick(null, null, "DemoranPoco");
      });
    boton_2.addEventListener("click", () => {
        handleCircleClick(null, null, "DemoranMucho");
      });
    
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
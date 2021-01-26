// @TODO: YOUR CODE HERE!

// DEBUGGER
// console.log(`Index: ${i}, ${data[i].poverty}`)
// console.log(`Index: ${i}, ${typeof(data[i].healthcare)}`)

// Define SVG area dimensions
let svgWidth = 960;
let svgHeight = 660;

// Define the chart's margins as an object
let chartMargin = {
  top: 30,
  right: 30,
  bottom: 100,
  left: 110
};

// Define dimensions of the chart area
let chartWidth = svgWidth - chartMargin.left - chartMargin.right;
let chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
let svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);




// -- This is where we load the data from data.csv
d3.csv("data.csv").then(function(data) {

    // ------ DEBUGGER ----
    // console.log(data);
    // console.log(Object.keys(data[12]))
    // console.log(typeof(data[0].smokes))

    // data.forEach(x => {
    //         console.log(x.smokes)
    //     });
    

    // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
    
    let color_list = []

    for (let i=0, n=data.length; i<n; i++){    
        data[i].poverty = +data[i].poverty
        data[i].healthcare = +data[i].healthcare
        data[i].age = +data[i].age
        data[i].income = +data[i].income
        data[i].obesity = +data[i].obesity
        data[i].smokes = +data[i].smokes
      
    // THIS IS FOR ADDING COLOR TO EACH BUBBLE:

        let color = d3.interpolateSinebow(Math.random())
        color_list.push(color)        

    }

    function select_color(x){
        let color = color_list[x]
        return color
    }

    
    // Add X axis label:
    chartGroup.append("text")
        .attr("x", chartWidth/2.1)
        .attr("y", chartHeight+40)
        .text("In Poverty (%)")
        .attr("class", "x_axis")
        .attr("value", "poverty");

    chartGroup.append("text")
        .attr("x", chartWidth/2.1)
        .attr("y", chartHeight+70)
        .text("Age (Median)")
        .attr("class", "x_axis")
        .attr("value", "age");

    chartGroup.append("text")
        .attr("x", chartWidth/2.4)
        .attr("y", chartHeight+100)
        .text("Household Income (Median)")
        .attr("class", "x_axis")
        .attr("value", "income");


  // Add Y axis label:
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -chartWidth/2.4)
        .attr("y", -40)
        .text("Lacks Healthcare (%)")
        .attr("class", "y_axis")
        .attr("value", "healthcare");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -chartWidth/2.7)
        .attr("y", -70)
        .text("Smokes (%)")
        .attr("class", "y_axis")
        .attr("value", "smokes");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -chartWidth/2.7)
        .attr("y", -100)
        .text("Obese (%)")
        .attr("class", "y_axis")
        .attr("value", "obesity");


    var xVariableSelected = "income"
    var yVariableSelected = "healthcare"

function create_graph(){

    // Create a linear scale for the horizontal axis.
    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d=>d[xVariableSelected])*.92,
            d3.max(data, d=>d[xVariableSelected])*1.02])
        .range([0, chartWidth])

    // Create a linear scale for the vertical axis.
        let yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d=>d[yVariableSelected])*.95,
            d3.max(data, d=>d[yVariableSelected])*1.025])
        .range([chartHeight, 0]);

    // Create two new functions passing our scales in as arguments
    // These will be used to create the chart's axes
        var bottomAxis = d3.axisBottom(xLinearScale).ticks(10);
        var leftAxis = d3.axisLeft(yLinearScale).ticks(12);

    // Append two SVG group elements to the chartGroup area,
    // and create the bottom and left axes inside of them
        chartGroup.append("g")
        .call(leftAxis);

        chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // Add SVG Circles:

    chartGroup.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[xVariableSelected]))
        .attr("cy", d => yLinearScale(d[yVariableSelected]))
        .attr("r", 11)
        .style("fill", d => select_color(d.id))
        .style("opacity", "0.7")
        .attr("stroke", "black");

    // Add Text to SVG Circles:

    chartGroup.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .style("text-anchor", "middle")
        .text( d => d.abbr)
        .attr("x", d => xLinearScale(d[xVariableSelected]))
        .attr("y", d => yLinearScale(d[yVariableSelected])*1.01)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11")

}

create_graph()

// ----- FALTA CORREGIR!!--

chartGroup.on("click", function() {
    let tag_class = d3.select(this).attr("class")

    console.log(tag_class)

    if (tag_class === "x_axis"){
        xVariableSelected = d3.select(this).attr("value")
    }else if (tag_class === "y_axis"){
        yVariableSelected = d3.select(this).attr("value")
    }
    
    create_graph()
})

}).catch(function(error) {
  console.log(error);
});

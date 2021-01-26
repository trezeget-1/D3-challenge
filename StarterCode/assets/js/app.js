// @TODO: YOUR CODE HERE!

// DEBUGGER

// console.log(`Index: ${i}, ${data[i].poverty}`)
// console.log(`Index: ${i}, ${typeof(data[i].healthcare)}`)
// console.log(data.length);

// Define SVG area dimensions
let svgWidth = 960;
let svgHeight = 660;

// Define the chart's margins as an object
let chartMargin = {
  top: 30,
  right: 30,
  bottom: 50,
  left: 50
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

    // console.log(data.length);

  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
    
for (let i=0, n=data.length; i<n; i++){    
    data[i].poverty = +data[i].poverty
    data[i].healthcare = +data[i].healthcare
}

  let xLinearScale = d3.scaleLinear()
    .domain([8,23])
    .range([0, chartWidth])

  // Create a linear scale for the vertical axis.
  let yLinearScale = d3.scaleLinear()
    .domain([2,26])
    .range([chartHeight, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale).ticks(8);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(12);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

    // Add X axis label:
chartGroup.append("text")
    .attr("x", chartWidth/2)
    .attr("y", chartHeight+40 )
    .text("In Poverty (%)");

  // Add Y axis label:
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
      .attr("x", -chartWidth/3)
      .attr("y", 0-40)      
      .text("Lacks Healthcare (%)")
      .attr("text-anchor", "start")


    // EL BUENAS PARA EL COLOR:

    

    // function color_picker(){
    //     // color_list = []

    //     data.forEach(x => {
    //         let color = d3.interpolateSinebow(Math.random())
    //         // color_list.push(color)        
    //         });
        
    //     console.log(color_list)
    // }



    chartGroup.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 11)
        .style("fill", d =>d3.interpolateSinebow(Math.random()))
        .style("opacity", "0.7")
        .attr("stroke", "black");
        
    chartGroup.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .style("text-anchor", "middle")
        .text( d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare)+4)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11")



}).catch(function(error) {
  console.log(error);
});

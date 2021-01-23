// @TODO: YOUR CODE HERE!

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

// Load data from data.csv
d3.csv("data.csv").then(function(data) {

    // console.log(data.length);


//   // Cast the hours value to a number for each piece of Data
//   data.forEach(function(d) {
//     d.hours = +d.hours;
//   });

  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
    
for (let i=0, n=data.length; i<n; i++){    
    data[i].poverty = +data[i].poverty
    // console.log(`Index: ${i}, ${data[i].poverty}`)
    data[i].healthcare = +data[i].healthcare
    // console.log(`Index: ${i}, ${typeof(data[i].healthcare)}`)
}

// console.log(data[0])

  let xBandScale = d3.scaleBand()
    .domain(d3.extent(data, x => x.poverty))
    .range([0, chartWidth])
    .padding(0.1);

//   // Create a linear scale for the vertical axis.
  let yLinearScale = d3.scaleLinear()
    .domain([0,27])
    .range([chartHeight, 0]);

//   // Create two new functions passing our scales in as arguments
//   // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale);

//   bottomAxis.ticks(7);
//   bottomAxis.tickValues([.08,.05,27])

//   // Append two SVG group elements to the chartGroup area,
//   // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis.ticks(12));

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis.ticks(7));

    // Add X axis label:
chartGroup.append("text")
    // .attr("text-anchor", "right")
    .attr("x", chartWidth/2)
    .attr("y", chartHeight+40 )
    .text("In Poverty (%)");

  // Add Y axis label:
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
    //   .attr("text-anchor", "end")
      .attr("x", -chartWidth/3)
      .attr("y", 0-40)
      
      .text("Lacks Healthcare (%)")
      .attr("text-anchor", "start")

//   // Create one SVG rectangle per piece of Data
//   // Use the linear and band scales to position each rectangle within the chart
//   chartGroup.selectAll(".bar")
//     .data(data)
//     .enter()
//     .append("rect")
//     .attr("class", "bar")
//     .attr("x", d => xBandScale(d.name))
//     .attr("y", d => yLinearScale(d.hours))
//     .attr("width", xBandScale.bandwidth())
//     .attr("height", d => chartHeight - yLinearScale(d.hours));

}).catch(function(error) {
  console.log(error);
});

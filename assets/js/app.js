let xVariableSelected = "poverty"
let yVariableSelected = "healthcare"

function makeResponsive() {


// if the SVG area isn't empty when the browser loads,
// remove it and replace it with a resized version of the chart
var svgArea = d3.select("body").select("svg");

if (!svgArea.empty()) {
    svgArea.remove();
}

    // svg params

    var svgWidth = 0

    if (window.innerWidth > 1320){
        svgWidth = 1320
    }else{
        svgWidth = window.innerWidth*.80;
    }

    var svgHeight = window.innerHeight/2;


// Define the chart's margins as an object
let chartMargin = {
  top: 30,
  right: 30,
  bottom: 100,
  left: 110
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

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


    // Create group for two x-axis labels
    var labelsGroup = chartGroup.append("g")
        // .attr("transform", `translate(${width / 2}, ${height + 20})`);

    
    // Add X axis label:
    labelsGroup.append("text")
        .attr("x", chartWidth/2)
        .attr("y", chartHeight+40)
        .text("In Poverty (%)")
        .attr("class", "x_axis active")
        .attr("id", "poverty")
        .attr("value", "poverty");
    
    labelsGroup.append("text")
        .attr("x", chartWidth/2)
        .attr("y", chartHeight+70)
        .text("Age (Median)")
        .attr("class", "x_axis inactive")
        .attr("id", "age")
        .attr("value", "age");

    labelsGroup.append("text")
        .attr("x", chartWidth/2)
        .attr("y", chartHeight+100)
        .text("Household Income (Median)")
        .attr("class", "x_axis inactive")
        .attr("id", "income")
        .attr("value", "income");


  // Add Y axis label:
  labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -chartHeight/2)
        .attr("y", -40)
        .text("Lacks Healthcare (%)")
        .attr("class", "y_axis active")
        .attr("id", "healthcare")
        .attr("value", "healthcare");

    labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -chartHeight/2)
        .attr("y", -70)
        .text("Smokes (%)")
        .attr("class", "y_axis inactive")
        .attr("id", "smokes")
        .attr("value", "smokes");

    labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -chartHeight/2)
        .attr("y", -100)
        .text("Obese (%)")
        .attr("class", "y_axis inactive")
        .attr("id", "obesity")
        .attr("value", "obesity");


function create_graph(xVariableSelected, yVariableSelected){

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
        .classed("left_axis",true)
        .call(leftAxis);

        chartGroup.append("g")
        .classed("bottom_axis",true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);



    // Add SVG Circles:

    chartGroup.append("g")
    // circlesGroup = circlesGroup
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .classed("circle",  true)
        .classed("tooltip-area",  true)        
        .attr("cx", d => xLinearScale(d[xVariableSelected]))
        .attr("cy", d => yLinearScale(d[yVariableSelected]))
        .attr("r", 11)
        .style("fill", d => select_color(d.id))
        .style("opacity", "0.7")
        .attr("stroke", "black")


    // Add Text to SVG Circles:

    chartGroup.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .classed("cicle_text",true)
        .style("text-anchor", "middle")
        .text( d => d.abbr)
        .attr("x", d => xLinearScale(d[xVariableSelected]))
        .attr("y", d => yLinearScale(d[yVariableSelected])*1.01)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11")
        .append('title')
        .html(d => `${d.state}<hr>

        ${d3.select("#"+[yVariableSelected]).text()}: ${d[yVariableSelected]}
        ${d3.select("#"+[xVariableSelected]).text()}: ${d[xVariableSelected]}`)
 
}

create_graph(xVariableSelected, yVariableSelected)


// x axis labels event listener
labelsGroup.selectAll("text").on("click", function() {

    let poverty_xAxis = d3.select("#poverty")
    let age_xAxis = d3.select("#age")
    let income_xAxis = d3.select("#income")

    let healthcare_yAxis = d3.select("#healthcare")
    let smokes_yAxis = d3.select("#smokes")
    let obesity_yAxis = d3.select("#obesity")


  // get value of selection
  let value = d3.select(this).attr("class");

    if (value === "x_axis active" || value === "x_axis inactive"){
        xVariableSelected = d3.select(this).attr("value");

        // changes classes to change bold text to x_axis 
        if (xVariableSelected === "poverty") {
            poverty_xAxis
                .classed("active", true)
                .classed("inactive", false);
            age_xAxis
                .classed("active", false)
                .classed("inactive", true);
            income_xAxis
                .classed("active", false)
                .classed("inactive", true);
        }else if (xVariableSelected === "age"){
            poverty_xAxis
                .classed("active", false)
                .classed("inactive", true);
            age_xAxis
                .classed("active", true)
                .classed("inactive", false);
            income_xAxis
                .classed("active", false)
                .classed("inactive", true);
        }else if (xVariableSelected === "income"){
            poverty_xAxis
                .classed("active", false)
                .classed("inactive", true);
            age_xAxis
                .classed("active", false)
                .classed("inactive", true);
            income_xAxis
                .classed("active", true)
                .classed("inactive", false);
        }

    }else if (value === "y_axis active" || value === "y_axis inactive"){
        yVariableSelected = d3.select(this).attr("value");

        // changes classes to change bold text to x_axis 
        if (yVariableSelected === "healthcare") {
            healthcare_yAxis
                .classed("active", true)
                .classed("inactive", false);
            smokes_yAxis
                .classed("active", false)
                .classed("inactive", true);
            obesity_yAxis
                .classed("active", false)
                .classed("inactive", true);
        }else if (yVariableSelected === "smokes"){
            healthcare_yAxis
                .classed("active", false)
                .classed("inactive", true);
            smokes_yAxis
                .classed("active", true)
                .classed("inactive", false);
            obesity_yAxis
                .classed("active", false)
                .classed("inactive", true);
        }else if (yVariableSelected === "obesity"){
            healthcare_yAxis
                .classed("active", false)
                .classed("inactive", true);
            smokes_yAxis
                .classed("active", false)
                .classed("inactive", true);
            obesity_yAxis
                .classed("active", true)
                .classed("inactive", false);
        }

    }

    d3.selectAll(".circle").remove()
    d3.selectAll(".cicle_text").remove()
    d3.selectAll(".left_axis").remove()
    d3.selectAll(".bottom_axis").remove()

    create_graph(xVariableSelected, yVariableSelected)

  });


}).catch(function(error) {
  console.log(error);
});

};

// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

makeResponsive();

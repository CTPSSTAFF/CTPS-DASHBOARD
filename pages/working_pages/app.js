//Code written by Beatrice Jin, 2016. Contact at beatricezjin@gmail.com.
var CTPS = {};
CTPS.demoApp = {};
var f = d3.format(".2")
var e = d3.format(".1f");

//Define Color Scale
var colorScale = d3.scaleLinear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);	

//Using the d3.queue.js library
d3.queue()
	.defer(d3.csv, "../../JSON/sidewalks_over_time.csv")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateSidewalk(results[0]);
    CTPS.demoApp.generateAccessibleTable(results[0]);
	}); 

CTPS.demoApp.generateSidewalk = function(allData) {	

var timeline = d3.select("#sidewalks").append("svg")
    .attr("width", "100%")
    .attr("height", 1400)

allData.sort(function(a, b){
  var nameA = a.town;
  var nameB = b.town;
  if (nameA < nameB) { return -1;}
  if (nameA > nameB) { return 1;}
  return 0;

})

var towns = [];
var capitalized = [];
allData.forEach(function(i){
  if (towns.indexOf(i) == -1) {
    i.town = i.town.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    towns.push(i.town);
  }
})

var colorToYear = d3.scaleLinear()
                  .domain([2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015])
                  .range(["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"]);
xScaleRatio = d3.scaleLinear().domain([0, 1]).range([80, 1080]);
yScale = d3.scalePoint().domain(towns).range([50, 1350]);

var xAxis = d3.axisTop(xScaleRatio).tickSize(-1300, 0, 0);
var yAxis = d3.axisLeft(yScale).tickSize(-1000, 0, 0);

timeline.append("text")
    .attr("x", 80)
    .attr("y", 20)
    .style("font-weight", 700)
    .text("Sidewalk per Center Line Mile")

timeline.append("g").attr("class", "axis")
    .attr("transform", "translate(0, 45)")
    .call(xAxis)
  
timeline.append("g").attr("class", "yaxis")
    .attr("transform", "translate(80, 0)")
    .call(yAxis)
    .selectAll("text")
    .attr("transform", "translate(-75, 0)")
    .style("text-anchor", "start")
    .style("font-size", 10);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 10])
    .html(function(d) {
      return d.town + "<br>" + d.year + "<br>Sidewalk Miles: " + d.sidewalk_miles + "<br>Centerline Miles: " + d.center_line_miles;
    })

timeline.call(tip); 

dataVizAll();

function dataVizAll() {
  timeline.selectAll("circle:not(.key)").remove();
  timeline.selectAll("rect").remove();


  timeline.selectAll(".markers")
    .data(allData)
    .enter()
    .append("rect")
      .attr("class", function(d) { return d.town })
      .attr("x", function(d) { return xScaleRatio(-0.025);})
      .attr("y", function(d) { return yScale(d.town)-1;})
      .attr("height", 2)
      .attr("width", 1005)
      .style("fill", "#fff")
      .style("opacity", 0)
      .on("mouseenter", function(d){
        var mystring = this.getAttribute("class");

        d3.selectAll("." + mystring)
          .style("opacity", 1)
      })
      .on("mouseleave", function(d){

        d3.selectAll("circle:not(.key)")
          .style("opacity", .1)
        
        d3.selectAll("rect")
          .style("opacity", 0)
      });


  timeline.selectAll(".roads")
    .data(allData)
    .enter()
    .append("circle")
      .attr("class", function(d) { return "yr" + d.year + " roads " + d.town;})
      .attr("cx", function(d) { return xScaleRatio(Math.ceil(d.sidewalk_to_miles*40)/40);})
      .attr("cy", function(d) { return yScale(d.town);})
      .attr("r", function(d) { return Math.sqrt(d.center_line_miles);})
      .style("stroke", function(d){ return colorToYear(d.year)})
      .style("stroke-width", 1)
      .style("fill", "none")
      .style("opacity", .1)
      .on("mouseenter", function(d){
        var mystring = this.getAttribute("class");
        var arr = mystring.split(" ");
        var thirdWord = arr[2]; 

        d3.selectAll("." + thirdWord)
          .style("opacity", 1)

        tip.show(d); 
      })
      .on("mouseleave", function(d){

        d3.selectAll("circle:not(.key)")
          .style("opacity", .1)
        
        d3.selectAll("rect")
          .style("opacity", 0)
        tip.hide(d); 
      });

  timeline.selectAll(".sidewalks")
    .data(allData)
    .enter()
    .append("circle")
      .attr("class", function(d) { return "yr" + d.year + " sidewalks " + d.town;})
      .attr("cx", function(d) { return xScaleRatio(Math.ceil(d.sidewalk_to_miles*40)/40);})
      .attr("cy", function(d) { return yScale(d.town);})
      .attr("r", function(d) { return Math.sqrt(d.sidewalk_miles);})
      .style("fill", function(d){ return colorToYear(d.year)})
      .style("stroke-width", 0)
      .style("opacity", .1)
      .on("mouseenter", function(d){
        var mystring = this.getAttribute("class");
        var arr = mystring.split(" ");
        var thirdWord = arr[2]; 

        d3.selectAll("." + thirdWord)
          .style("opacity", 1)

        tip.show(d); 
      })
      .on("mouseleave", function(d){
        d3.selectAll("circle:not(.key)")
          .style("opacity", .1)
        
        d3.selectAll("rect")
          .style("opacity", 0)
        tip.hide(d); 
      });
    
}

//button activation 
  d3.select("#alphabetize").on("click", function(){
    allData.sort(function(a,b) { 
        var nameA = a.town;
        var nameB = b.town; 
        if (nameA < nameB) { return -1; }
        if (nameA > nameB) { return 1; }
        return 0; 
      })
    
    towns = []; 

    allData.forEach(function(i){ 
      towns.push(i.town);
    })

    yScale = d3.scalePoint().domain(towns).range([50, 1350]);
    var yAxis = d3.axisLeft(yScale).tickSize(-1000, 0, 0);
    
    timeline.select(".yaxis").transition()
      .duration(750)
      .call(yAxis)
    .selectAll("text")
      .attr("transform", "translate(-75, 0)")
      .style("text-anchor", "start");

    dataVizAll();
  })

  d3.select("#byAverages").on("click", function(){
    allData.sort(function(a,b) { 
        var nameA = a.sidewalk_to_miles;
        var nameB = b.sidewalk_to_miles; 
        if (nameA < nameB) { return -1; }
        if (nameA > nameB) { return 1; }
        return 0; 
      })
    
     towns = []; 

    allData.forEach(function(i){ 
      towns.push(i.town);
    })

    yScale = d3.scalePoint().domain(towns).range([50, 1350]);
    var yAxis = d3.axisLeft(yScale).tickSize(-1000, 0, 0);
    
    timeline.select(".yaxis").transition()
      .duration(750)
      .call(yAxis)
    .selectAll("text")
      .attr("transform", "translate(-75, 0)")
      .style("text-anchor", "start");

    dataVizAll();
  })

  d3.selectAll(".yrpicker").on("click", function(){
    var mystring = this.getAttribute("class");
    var arr = mystring.split(" ");
    var thirdWord = arr[0]; 

    if (thirdWord == "allyrs") { 
      timeline.selectAll("circle:not(.key)").transition()
        .duration(750)
        .style("opacity", .1)
    } else {
      timeline.selectAll("circle:not(.key)").transition()
        .duration(750)
        .style("opacity", .05)

      timeline.selectAll("circle:not(.key)").filter("." + thirdWord).transition()
        .duration(750)
        .style("opacity", 1)
    }
  })

  //Color key
    var xPos = 950;
    var yPos = 120; 
    var height = 600; 
    //background
    timeline.append("text")
      .style("font-weight", 700)
      .attr("x", xPos + 20).attr("y", yPos - 40)
      .html("KEY").style("text-anchor","middle");
    //text and colors
    timeline.append("circle")
      .attr("class", "key")
      .style("fill", "none").style("stroke", "#fff")
      .attr("cx", xPos + 60).attr("cy", yPos).attr("r", 30)
    timeline.append("text")
      .style("font-weight", 300).style("text-anchor", "end")
      .attr("x", xPos + 20).attr("y", yPos + 7)
      .style("font-size", 12).html("900 Miles");
    timeline.append("circle")
      .attr("class", "key")
      .style("fill", "none").style("stroke", "#fff")
      .attr("cx", xPos + 60).attr("cy", yPos + 60).attr("r", 20)
    timeline.append("text")
      .style("font-weight", 300).style("text-anchor", "end")
      .attr("x", xPos + 30).attr("y", yPos + 67)
      .style("font-size", 12).html("400 Miles");
    timeline.append("circle")
      .attr("class", "key")
      .style("fill", "none").style("stroke", "#fff")
      .attr("cx", xPos + 60).attr("cy", yPos + 100).attr("r", 10)
    timeline.append("text")
      .style("font-weight", 300).style("text-anchor", "end")
      .attr("x", xPos + 40).attr("y", yPos + 107)
      .style("font-size", 12).html("100 Miles");
    timeline.append("circle")
      .attr("class", "key")
      .style("fill", "none").style("stroke", "#fff")
      .attr("cx", xPos + 60).attr("cy", yPos + 130).attr("r", 5)
    timeline.append("text")
      .style("font-weight", 300).style("text-anchor", "end")
      .attr("x", xPos + 40).attr("y", yPos + 133)
      .style("font-size", 12).html("Centerline Miles");
    timeline.append("circle")
      .attr("class", "key")
      .style("stroke", "none").style("fill", "#fff")
      .attr("cx", xPos + 60).attr("cy", yPos + 160).attr("r", 5)
    timeline.append("text")
      .style("font-weight", 300).style("text-anchor", "end")
      .attr("x", xPos + 40).attr("y", yPos + 163)
      .style("font-size", 12).html("Sidewalk Miles");
}

CTPS.demoApp.generateAccessibleTable = function(sidewalks){
  var colDesc = [{
    "dataIndex" : "town",
    "header" : "Town"
  },{ 
    "dataIndex" : "sidewalk_miles",
    "header" : "Sidewalk Miles"
  },{ 
    "dataIndex" : "sidewalk_to_miles",
    "header" : "Sidewalk Miles to Centerline Miles"
  }];

  var options = {
    "divId" : "sidewalkTableDiv",
    "caption": "Sidewalk Miles of Each Boston MPO Municipality",
  };

  $("#accessibleTable").accessibleGrid(colDesc, options, sidewalks);
}
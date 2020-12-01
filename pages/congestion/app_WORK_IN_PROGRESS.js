// JS code for congestion visualization for express highways.
// Code written by Beatrice Jin, 2016.
// Contact: beatricezjin@gmail.com
// Modified by Ben Krepp to reflect change to 97-town MPO, and migration of backing database to PostgreSQL, 2019.
// Contact: bkrepp@ctps.org
//

var CTPS = {};
CTPS.demoApp = {};
var f = d3.format(".2")
var e = d3.format(".1f");

//Define Color Scale
var cs = d3.scaleLinear().domain([.5, 1, 1.25]).range(["#D73027", "#fee08b", "#00B26F"]);	
var colorScale = d3.scaleThreshold()
				.domain([.4, .5, .7, .9])
				.range([cs(0), cs(.55), cs(.7), cs(.9), cs(1.2)])

//Using the d3.queue.js library
d3.queue()
	.defer(d3.json, "../../data/json/boston_region_mpo_towns_97.topo.json")
	.defer(d3.json, "../../data/json/cmp_2015_exp_routes_ext.geo.json")
	.awaitAll(function(error, results){
		CTPS.demoApp.generateMap(results[0],results[1]);
		CTPS.demoApp.generateChart(results[1]);
		//CTPS.demoApp.generateTimes(results[1]);
		//CTPS.demoApp.generateTraveller(results[0], results[1]);
	});
	//CTPS.demoApp.generateViz);

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(cities, congestion) {
	// Show name of MAPC Sub Region
	// Define Zoom Behavior
	var projection = d3.geoConicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([28000]) // N.B. The scale and translation vector were determined empirically.
	.translate([120, 1130]);

	var geoPath = d3.geoPath().projection(projection);

	var maxmin = [];

	// var interstateRoads = topojson.feature(congestion, congestion.objects.CMP_2014_EXP_ROUTES_MPO_ONLY).features;
    var interstateRoads = congestion.features;

	interstateRoads.forEach(function(i) {
		maxmin.push(i.properties.am_spd_ix);
	})

	// SVG Viewport
	var svgContainer = d3.select("#map").append("svg")
		.attr("width", "100%")
		.attr("height", 600);

	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([0, 10])
	  .html(function(d) {
	    return d.properties.route_num + "<br>Speed Limit: " + d.properties.spd_limit + "<br>Speed Index: " + d.properties.am_spd_ix;
	  })

	svgContainer.call(tip);

	// Create Boston Region MPO map with SVG paths for individual towns.
	var mapcSVG = svgContainer.selectAll(".subregion")
		.data(topojson.feature(cities, cities.objects.boston_region_mpo_towns).features)
		.enter()
		.append("path")
			.attr("class", "subregion")
			.attr("id", function(d, i) { return d.properties.border_link_id; })
			.attr("d", function(d, i) {return geoPath(d); })
			.style("fill", "#ddd")
			.style("stroke", "#191b1d")
			.style("stroke-width", "1px")
			.style("opacity", .1);

	var interstateSVG = svgContainer.selectAll(".interstate")
		.data(interstateRoads)
		.enter()
		.append("path")
			.attr("class", function(d) { return "interstate mapsegment" + d.id;})
			.attr("d", function(d, i) { return geoPath(d); })
			.style("fill", "#ddd")
			.style("stroke-width", function(d) { return (1/d.properties.am_spd_ix*5); })
			.style("stroke-linejoin", "round")
			.style("stroke", function(d) {
				return colorScale(d.properties.am_spd_ix);
			})
			.style("opacity", .2)//function(d) { return (d.properties.am_spd_ix-.5);})
		.on("mouseenter", function(d) {
            	tip.show(d);
            })
        .on("mouseleave", function(d) {
            	tip.hide(d);
	     })
} // CTPS.demoApp.generateViz()


CTPS.demoApp.generateChart = function(congestion) {
//Create chart comparing interstate roads by coordinates
	// Create AM chart
	var interstateRoads = topojson.feature(congestion, congestion.objects.CMP_2014_EXP_ROUTES_MPO_ONLY).features;
	// *** NOTE: In spite of the variable's name "interstateRoads" really is an array of interstate road SEGMENTS (i.e., TMC's)

	var twoCharts = d3.select("#speedindex").append("svg")
		.attr("id", "twoCharts")
		.attr("width", 800)
		.attr("height", 600)

	var amchartContainer = d3.select("#twoCharts").append("svg")
		.attr("width", 310)
		.attr("height", 600)
		.attr("x", 0)
		.attr("y", 0);

	//axis label
	amchartContainer.append("text")
		.style("font-size", "1.0em")
		.attr("x", "180px")
		.attr("y", "45px")
		.html("AM Speed Index");

	//mouseover function
	var tip2 = d3.tip()
	  .attr('class', 'd3-tip')
	  .attr("background", "black")
	  .attr("color", "white")
	  .offset([-10, 0])
	  .html(function(d) {
	    return d.properties.seg_begin + " <br>to " + d.properties.seg_end + "<br> AM/PM Speed Index: <br><b>" + f(d.properties.am_spd_ix) + " / " + f(d.properties.pm_spd_ix) + "</b>";
	  })
	  .style("line-height", 1.4)

	amchartContainer.call(tip2);


	var nested_directions = d3.nest()
	.key(function(d) {
		var directionKey = "";
		if (d.properties.direction == "Northbound") { directionKey = "NB"};
		if (d.properties.direction == "Eastbound") { directionKey = "EB"};
		if (d.properties.direction == "Westbound") { directionKey = "WB"};
		if (d.properties.direction == "Southbound") { directionKey = "SB"};
		return d.properties.route_num + " " + directionKey;})
	.entries(interstateRoads)

	var routes = [];
	var maxmins = [];

	interstateRoads.forEach(function(i){
		routes.push(i.properties.route_num)
		maxmins.push(i.properties.to_meas)
	})
	routes.sort();
	var routesByTotal = ["I-95", "I-495", "I-93", "I-90", "MA-3", "MA-2", "MA-128", "US-1", "MA-24", "US-3", "I-290"];
	//Assign scales and axes
	xScaleRoad = d3.scaleLinear().domain([d3.max(maxmins), 0]).range([5, 300]);
	xScaleSegment = d3.scaleLinear().domain([0, d3.max(maxmins)]).range([0, 295]);
	yScale = d3.scalePoint().domain(routesByTotal).range([90, 520]);

	var xAxis = d3.axisBottom(xScaleRoad).ticks(7);
	var yAxis = d3.axisLeft(yScale).tickSize(0);

	amchartContainer.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 540)").style("stroke-width", "1px")
		.style("font-size", "10px")
		.call(xAxis);

	amchartContainer.append("g").attr("class", "yaxis")
		.attr("transform", "translate(40, 0)")
		.style("font-size", "10px")
		.call(yAxis).selectAll("text").remove();

	function amfindFlipFrom(d) { 
		var fromstorage = []; 
		interstateRoads.forEach(function(j){ 
			if (j.properties.route_num == d.properties.route_num && j.properties.direction == d.properties.direction) { 
				fromstorage.push(j.properties.from_meas); 
			}
		})
		var frommax = d3.max(fromstorage);

		var tostorage = []; 
		interstateRoads.forEach(function(j){ 
			if (j.properties.route_num == d.properties.route_num && j.properties.direction == d.properties.direction) { 
				tostorage.push(j.properties.to_meas); 
			}
		})

		var tomax = d3.max(tostorage);

		var returnarray = [];
		returnarray.push(frommax); 
		returnarray.push(tomax - frommax);

		return returnarray;
	}

	//Normalize ROUTEFROM for display (flip westbounds and southbounds to match eastbound and north bound)
	interstateRoads.forEach(function(i){ 
		if ((i.properties.direction == "Westbound" || i.properties.direction == "Southbound")) { 
			i.properties.normalizedstart = -(i.properties.from_meas - amfindFlipFrom(i)[0]) + amfindFlipFrom(i)[1];
		} else if (i.properties.route_num == "MA-2" && i.properties.direction == "Eastbound") {
			i.properties.normalizedstart = i.properties.to_meas - 5751.4697;
		} else {
			i.properties.normalizedstart = i.properties.to_meas;
		}
	}); 

	amchartContainer.selectAll(".ambars")
		.data(interstateRoads)
		.enter()
		.append("rect")
			.attr("class", function(d) { return "segment" + d.id + " ambars";})
			.attr("height", 15)
			.attr("width", function(d) {
				if (isNaN(parseInt(d.properties.to_meas))) {
					return 0;
				} else {
					return xScaleSegment(Math.abs(d.properties.to_meas-d.properties.from_meas));
				}})
			.attr("x", function(d) {
				if (isNaN(parseInt(d.properties.from_meas))) {
					return -50;
				} else {
					return xScaleRoad(d.properties.normalizedstart)};
				})
			.attr("y", function(d) {
				if (d.properties.direction == "Eastbound" || d.properties.direction == "Northbound") {
					return yScale(d.properties.route_num) - 2 ;
				} else {
					return yScale(d.properties.route_num) - 20;

				}
			})
			.style("stroke", "none")
			.style("fill", function(d) {
					if (!isNaN(d.properties.am_spd_ix)){
						return colorScale(d.properties.am_spd_ix);
					} else { 
						return "#191b1d";
					}
				})
			.on("mouseenter", function (d) {
				var mystring = this.getAttribute("class");
				var arr = mystring.split(" ", 2);
				var firstWord = arr[0];

				d3.selectAll("." + firstWord).transition()
					.style("stroke", "#ddd")
					.style("stroke-width", 1)
					.attr("transform", "translate(0, -3)")
					.attr("height", 21);

				d3.selectAll(".map" + firstWord)
					.style("opacity", 1)
					.style("stroke-width", function(d) { return (4/d.properties.am_spd_ix*5); })

				tip2.show(d);
			})
			.on("mouseleave", function (d) {
				var mystring = this.getAttribute("class");
				var arr = mystring.split(" ", 2);
				var firstWord = arr[0];

				d3.selectAll("." + firstWord).transition()
					.style("stroke", "none")
					.style("stroke-width", 0)
					.attr("transform", "translate(0, 0)")
					.attr("height", 15);

				d3.selectAll(".map" + firstWord)
					.style("opacity", .2)
					.style("stroke-width", function(d) { return (1/d.properties.am_spd_ix*5); })

				tip2.hide(d);
			})
		.html(function(d) { return d.properties.route_num; });

	//Create PM Charts

var pmchartContainer = d3.select("#twoCharts").append("svg")
		.attr("width", 380)
		.attr("height", 600)
		.attr("x", 305)
		.attr("y", 0);


	pmchartContainer.call(tip2);

pmchartContainer.selectAll(".labels")
		.data(nested_directions)
		.enter()
		.append("text")
		.attr("class", "labels")
			.attr("x", 35)
			.attr("y", function(d) {
				if (d.values[0].properties.direction == "Eastbound" || d.values[0].properties.direction == "Southbound") {
					return yScale(d.values[0].properties.route_num) + 10;
				} else if (d.values[0].properties.direction == "Westbound" || d.values[0].properties.direction == "Northbound"){
					return yScale(d.values[0].properties.route_num) - 8;
				} else {
					return -200;
				}})
			.style("stroke", "none")
			.style("font-size", 11)
			.style("fill", "#ddd")
			.style("font-weight", 400)
			.style("text-anchor", "middle")
			.text(function(d) { return d.key;});

	function pmfindFlipFrom(d) {
			var storage = [];
			interstateRoads.forEach(function(j){ 
				if (j.properties.route_num == d.properties.route_num && j.properties.direction == d.properties.direction) {
					storage.push(j.properties.to_meas);
				}
			})
			var max = d3.max(storage);
			return max; 
		}

		//Normalize ROUTEFROM for display (flip westbounds and southbounds to match eastbound and north bound)
		interstateRoads.forEach(function(i){ 
			if ((i.properties.direction == "Westbound" || i.properties.direction == "Southbound")) { 
				i.properties.normalizedstart = -(i.properties.to_meas - pmfindFlipFrom(i));
			} else if (i.properties.route_num == "MA-2" && i.properties.direction == "Eastbound") {
				i.properties.normalizedstart = i.properties.from_meas - 5751.4697;
			} else {
				i.properties.normalizedstart = i.properties.from_meas;
			}
		}); 
	//Assign scales and axes 
	xScaleRoad = d3.scaleLinear().domain([0,d3.max(maxmins)]).range([75, 370]);
	xScaleSegment = d3.scaleLinear().domain([0,d3.max(maxmins)]).range([0, 295]);

	var xAxis = d3.axisBottom(xScaleRoad).ticks(7);
	var yAxis = d3.axisLeft(yScale).tickSize(0);

	pmchartContainer.append("text")
	.attr("x", 75)
	.attr("y", 45)
	.style("font-size", "1.0em")
	.style("text-align", "center")
	.html("PM Speed Index");

	pmchartContainer.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 540)").style("stroke-width", "1px")
		.style("font-size", "10px")
		.call(xAxis);

	pmchartContainer.selectAll(".pmbars")
		.data(interstateRoads)
		.enter()
		.append("rect")
			.attr("class", function(d) { return "segment" + d.id + " pmbars" ;})
			.attr("height", 15)
			.attr("width", function(d) {
				if (isNaN(parseInt(d.properties.to_meas))) {
					return 0;
				} else {
					return xScaleSegment(Math.abs(d.properties.to_meas-d.properties.from_meas));
				}})
			.attr("x", function(d) {
				if (isNaN(parseInt(d.properties.from_meas))) {
					return -50;
				} else {
					return xScaleRoad(d.properties.normalizedstart)};
				})
			.attr("y", function(d) {
				if (d.properties.direction == "Eastbound" || d.properties.direction == "Northbound") {
					return yScale(d.properties.route_num) - 2 ;
				} else {
					return yScale(d.properties.route_num) - 20;

				}
			})
			.style("stroke", "none")
			.style("fill", function(d) {
					if (!isNaN(d.properties.pm_spd_ix)){
						return colorScale(d.properties.pm_spd_ix);
					} else {
						return "#191b1d";
					}
				})
			.on("mouseenter", function (d) {
				var mystring = this.getAttribute("class");
				var arr = mystring.split(" ", 2);
				var firstWord = arr[0];

				d3.selectAll("." + firstWord).transition()
					.style("stroke", "#ddd")
					.style("stroke-width", 1)
					.attr("transform", "translate(0, -3)")
					.attr("height", 21);

				d3.selectAll(".map" + firstWord)
					.style("opacity", 1)
					.style("stroke-width", function(d) { return (4/d.properties.am_spd_ix*5); })

				tip2.show(d);
			})
			.on("mouseleave", function (d) {
				var mystring = this.getAttribute("class");
				var arr = mystring.split(" ", 2);
				var firstWord = arr[0]; 

				d3.selectAll("." + firstWord).transition()
					.style("stroke", "none")
					.style("stroke-width", 0)
					.attr("transform", "translate(0, 0)")
					.attr("height", 15);

				d3.selectAll(".map" + firstWord)
					.style("opacity", .2)
					.style("stroke-width", function(d) { return (1/d.properties.am_spd_ix*5); })

				tip2.hide(d);
			})
		.html(function(d) { return d.properties.route_num; });

		//Color key
		var xPos = 5;
		var yPos = 450;
		var height = 600;
		//background
		twoCharts.append("text")
			.style("font-weight", 700)
			.attr("x", xPos).attr("y", yPos -7)
			.text("Speed Index Key");
		//text and colors
		twoCharts.append("rect")
			.style("fill", colorScale(.25)).style("stroke", "none")
			.attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
		twoCharts.append("text")
			.style("font-weight", 300)
			.attr("x", xPos + 25).attr("y", yPos + 7)
			.text("< 0.40");
		twoCharts.append("rect")
			.style("fill", colorScale(.45)).style("stroke", "none")
			.attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
		twoCharts.append("text")
			.style("font-weight", 300)
			.attr("x", xPos + 25).attr("y", yPos + 22)
			.text("0.40 to 0.50");
		twoCharts.append("rect")
			.style("fill", colorScale(.6)).style("stroke", "none")
			.attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
		twoCharts.append("text")
			.style("font-weight", 300)
			.attr("x", xPos + 25).attr("y", yPos + 37)
			.text("0.50 to 0.70");
		twoCharts.append("rect")
			.style("fill", colorScale(.8)).style("stroke", "none")
			.attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
		twoCharts.append("text")
			.style("font-weight", 300)
			.attr("x", xPos + 25).attr("y", yPos + 52)
			.text("0.70 to 0.90");
		twoCharts.append("rect")
			.style("fill", colorScale(1)).style("stroke", "none")
			.attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
		twoCharts.append("text")
			.style("font-weight", 300)
			.attr("x", xPos + 25).attr("y", yPos + 67)
			.text("> 0.90");


}

/*
CTPS.demoApp.generateTimes = function(interstateRoads) {	

	var cumulativeTime = d3.select("#cumulativetime").append("svg")
		.attr("width", "100%")
		.attr("height", 600);

	var nested_roads = d3.nest()
	.key(function(d) { return d.properties.route_num + " " + d.properties.direction; })
	.entries(interstateRoads);

		//mouseover function	
	var tip2 = d3.tip()
	  .attr('class', 'd3-tip')
	  .attr("background", "black")
	  .attr("color", "white")
	  .offset([-10, 0])
	  .html(function(d) {
			return d.properties.route_num + " " + d.properties.direction;
	  });

	cumulativeTime.call(tip2); 

	var routes = []; 
	var maxmins = [];

	interstateRoads.forEach(function(i){ 
		routes.push(i.properties.route_num)
		maxmins.push(i.properties.to_meas)
	})
	routes.sort(); 

	//Assign scales and axes 
	xScale = d3.scaleLinear().domain([0, 3.5]).range([50, 1050]);
	yScale = d3.scaleLinear().domain([0, 6]).range([550, 60]);

	var xAxis = d3.axisBottom(xScale).ticks(7);
	var yAxis = d3.axisLeft(yScale).ticks(10);

	cumulativeTime.append("g").attr("class", "axis")
		.attr("transform", "translate(0, 550)").style("stroke-width", "1px")
		.style("font-size", "1.0em")
		.call(xAxis);
	
	cumulativeTime.append("g").attr("class", "axis")
		.attr("transform", "translate(50, 0)")
		.style("font-size", "1.0em")
		.call(yAxis); 

	cumulativeTime.append("line")
		.attr("x1", xScale(1))
		.attr("x2", xScale(1))
		.attr("y1", yScale(0))
		.attr("y2", yScale(6))
		.attr("stroke-width", .5)
		.attr("stroke", "#ddd")

	cumulativeTime.append("line")
		.attr("x1", xScale(0))
		.attr("x2", xScale(3.5))
		.attr("y1", yScale(1))
		.attr("y2", yScale(1))
		.attr("stroke-width", .5)
		.attr("stroke", "#ddd")

	nested_roads.forEach(function(i) { 
		var amcumulative = 0; 
		var pmcumulative = 0; 

		i.values.sort(function(a,b) { 
			var nameA = a.properties.normalizedstart; // ignore upper and lowercase
			var nameB = b.properties.normalizedstart;
			  if (nameA < nameB) {return -1; }
			  if (nameA > nameB) {return 1;}
			  return 0; 
		});

		i.values.forEach(function(j){ 

			cumulativeTime.append("circle")
					.attr("class", j.properties.route_num + j.properties.direction + " circles")
					.attr("cx", xScale(j.properties.am_spd_ix))
					.attr("cy", yScale(j.properties.am_avtt_ix))
					.attr("r", j.properties.lanes * j.properties.lanes)
					.style("stroke", "#FFd056")
					.style("fill", "#191b1d")
					.style("stroke-width", 1)
					.style("opacity", .5)
					.on("mouseenter", function () { 
						var mystring = this.getAttribute("class");
						var arr = mystring.split(" ", 2);
						var firstWord = arr[0]; 

						d3.selectAll(".circles")
							.style("opacity", .1);

						d3.selectAll("." + firstWord)
							.style("stroke-width", 2)
							.style("opacity", 1)

						tip2.show(j); 
					})
					.on("mouseleave", function () {
						d3.selectAll(".circles")
							.style("stroke-width", 1)
							.style("opacity", .5);

						tip2.hide(j);
					});

			cumulativeTime.append("circle")
					.attr("class", j.properties.route_num + j.properties.direction + " circles")
					.attr("cx", xScale(j.properties.pm_spd_ix))
					.attr("cy", yScale(j.properties.pm_avtt_ix))
					.attr("r", j.properties.lanes * j.properties.lanes)
					.style("stroke", "#408DFF")
					.style("fill", "#191b1d")
					.style("opacity", .5)
					.on("mouseenter", function () { 
						var mystring = this.getAttribute("class");
						var arr = mystring.split(" ", 2);
						var firstWord = arr[0]; 

						d3.selectAll(".circles")
							.style("opacity", .1);

						d3.selectAll("." + firstWord)
							.style("stroke-width", 2)
							.style("opacity", 1)

						tip2.show(j); 
					})
					.on("mouseleave", function () {
						d3.selectAll(".circles")
							.style("stroke-width", 1)
							.style("opacity", .5);

						tip2.hide(j);
					});
		})
	})

	cumulativeTime.append("text")
		.attr("x", xScale(2))
		.attr("y", yScale(1.05))
		.text("Congested Travel Time = Free Flow Travel Time")

	cumulativeTime.append("text")
		.attr("x", xScale(-1.2))
		.attr("y", yScale(2.7))
		.attr("transform", "rotate(-90)")
		.attr("text-anchor", "start")
		.text("Travelling at Speed Limit")
}

CTPS.demoApp.generateTraveller = function(cities, congestion) { 
	//Map of free flow
	// SVG Viewport
	var interstateRoads = topojson.feature(congestion, congestion.objects.collection).features;

	interstateRoads.sort(function(a,b){
		var nameA = a.properties.route_num;
		var nameB = b.properties.route_num;
		if (nameA < nameB) { return -1}
		if (nameA > nameB) { return 1}
		else { 
			var nameC = a.properties.from_meas;
			var nameD = b.properties.from_meas;
			if (nameC < nameD) { return -1}
			if (nameC > nameD) { return 1}
			return 0;
		}
	})

	var projection = d3.geoConicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([18000]) // N.B. The scale and translation vector were determined empirically.
	.translate([40,750]);
	
	var geoPath = d3.geoPath().projection(projection);

	var freeFlow = d3.select("#freeFlow").append("svg")
		.attr("width", "100%")
		.attr("height", 400);

	//Free Flow Map
	var mapcSVG = freeFlow.selectAll(".freeFlow")
		.data(topojson.feature(cities, cities.objects.boston_region_mpo_towns).features)
		.enter()
		.append("path")
			.attr("class", "freeFlow")
			.attr("id", function(d, i) { return d.properties.border_link_id; })
			.attr("d", function(d, i) {return geoPath(d); })
			.style("fill", "#ddd")
			.style("stroke", "#191b1d")
			.style("stroke-width", "1px")
			.style("opacity", .1);

	var interstateSVG = freeFlow.selectAll(".freeFlowRoad")
		.data(interstateRoads)
		.enter()
		.append("path")
			.attr("class", function(d) { return "freeFlowRoad mapsegment" + d.id;})
			.attr("d", function(d) { return geoPath(d);})
			.style("fill", "none")
			.style("stroke-width", 0)
			.style("stroke-linejoin", "round")
			.style("stroke", "#ddd")
			.style("opacity", 0)

	//AM Congestion Road
	var amCong = d3.select("#amCong").append("svg")
		.attr("width", "100%")
		.attr("height", 400);

	var mapcSVGam = amCong.selectAll(".amCong")
		.data(topojson.feature(cities, cities.objects.boston_region_mpo_towns).features)
		.enter()
		.append("path")
			.attr("class", "amCong")
			.attr("id", function(d, i) { return d.properties.border_link_id; })
			.attr("d", function(d, i) {return geoPath(d); })
			.style("fill", "#ddd")
			.style("stroke", "#191b1d")
			.style("stroke-width", "1px")
			.style("opacity", .1);

	var interstateSVGam = amCong.selectAll(".amCongRoad")
		.data(interstateRoads)
		.enter()
		.append("path")
			.attr("class", function(d) { return "amCongRoad mapsegment" + d.id;})
			.attr("d", function(d) { return geoPath(d);})
			.style("fill", "none")
			.style("stroke-width", 0)
			.style("stroke-linejoin", "round")
			.style("stroke", function(d) { 
				return colorScale(d.properties.am_spd_ix);
			})
			.style("opacity", 0)

	//PM Congestion Road
	var pmCong = d3.select("#pmCong").append("svg")
		.attr("width", "100%")
		.attr("height", 400);

	var mapcSVGpm = pmCong.selectAll(".pmCong")
		.data(topojson.feature(cities, cities.objects.boston_region_mpo_towns).features)
		.enter()
		.append("path")
			.attr("class", "pmCong")
			.attr("id", function(d, i) { return d.properties.border_link_id; })
			.attr("d", function(d, i) {return geoPath(d); })
			.style("fill", "#ddd")
			.style("stroke", "#191b1d")
			.style("stroke-width", "1px")
			.style("opacity", .1);

	var interstateSVGpm = pmCong.selectAll(".pmCongRoad")
		.data(interstateRoads)
		.enter()
		.append("path")
			.attr("class", function(d) { return "pmCongRoad mapsegment" + d.id;})
			.attr("d", function(d) { return geoPath(d);})
			.style("fill", "none")
			.style("stroke-width", 0)
			.style("stroke-linejoin", "round")
			.style("stroke", function(d) { 
				return colorScale(d.properties.pm_spd_ix);
			})
			.style("opacity", 0)

	//Minute counters
	/*freeFlow.append("text")
		.attr("class", "freeFlow")
		.attr("x", 0)
		.attr("y", 30)
		.style("font-weight", 300)
		.text("Time spent in congestion:" + minutes + " min")*/
/*
	//Click button to start animation
	d3.selectAll("#congAnim").on("click", function() { 
	//Freeflow Animation
		var timecounter = 0;
	    var minutes = 0; 

	    d3.selectAll(".freeFlowRoad")
			.transition()
			.delay(function(d) { 
				timecounter += d.properties.spd_limit ;
				return timecounter;
			})
			.duration(2400)
			.style("stroke-width", 3)
			.style("opacity", 1)
			

		//AM Animation
		var timecounteram = 0;
	    d3.selectAll(".amCongRoad").transition()
			.delay(function(d) { 
				timecounteram += (1/d.properties.am_spd_ix) * d.properties.spd_limit ;
				return timecounteram;
			})
			.duration(function(d) { return (1/d.properties.am_spd_ix) * 2400; })
			.style("stroke-width", function(d) { return 1/d.properties.am_spd_ix * 5; })
			.style("opacity", 1)

		//PM Animation
		var timecounterpm = 0;
	    d3.selectAll(".pmCongRoad").transition()
			.delay(function(d) { 
				timecounterpm += (1/d.properties.pm_spd_ix) * d.properties.spd_limit ;
				return timecounterpm;
			})
			.duration(function(d) { return (1/d.properties.pm_spd_ix) * 2400; })
			.style("stroke-width", function(d) { return 1/d.properties.pm_spd_ix * 5; })
			.style("opacity", 1)
	})

}
*/
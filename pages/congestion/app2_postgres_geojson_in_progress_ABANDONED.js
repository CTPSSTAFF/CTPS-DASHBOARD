// JS code for congestion visualization for arterial highways.
// Code written by Beatrice Jin, 2016.
// Contact: beatricezjin@gmail.com
// Modified by Ben Krepp to reflect change to 97-town MPO.
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
	// .defer(d3.json, "../../data/json/CMP_2014_ART_ROUTES.topojson")
	.defer(d3.json, "../../data/json/CTPS_CMP_2014_ART_ROUTES_postgresql.geo.json")
	.defer(d3.csv, "../../data/csv/arterial_route_id_table.csv")
	.awaitAll(function(error, results){ 
		CTPS.demoApp.generateMap(results[0],results[1], results[2]);
		//CTPS.demoApp.generateChart(results[1]);
		//CTPS.demoApp.generateTraveller(results[0], results[1]);
	}); 
	//CTPS.demoApp.generateViz);

////////////////* GENERATE MAP *////////////////////
CTPS.demoApp.generateMap = function(cities, arterials, route_ids) {	
	// Show name of MAPC Sub Region
	// Define Zoom Behavior
	var arterialRoads = arterials.features;

	var projScale = 45000,
		projXPos = 100,
		projYPos = 1720;

	var projection = d3.geoConicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([projScale]) // N.B. The scale and translation vector were determined empirically.
	.translate([projXPos, projYPos]);

	var projectionS = d3.geoConicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([projScale]) // N.B. The scale and translation vector were determined empirically.
	.translate([projXPos + 3, projYPos]);

	var projectionW = d3.geoConicConformal()
	.parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
	.scale([projScale]) // N.B. The scale and translation vector were determined empirically.
	.translate([projXPos, projYPos - 3]);
	
	var geoPath = d3.geoPath().projection(projection);
	var geoPathS = d3.geoPath().projection(projectionS);
	var geoPathW = d3.geoPath().projection(projectionW);

	// SVG Viewport
	var svgContainer = d3.select("#mapNonInterstate").append("svg")
		.attr("width", "100%")
		.attr("height", 800)
		.style("overflow", "visible");

	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([0, 150])
	  .html(function(d) {
	    return "<p><b>" + d.properties.rte_name.substring(0, d.properties.rte_name.lastIndexOf(" ")) + "</b></p><br>Speed Limit: " + d.properties.spd_limit + "<br>Speed Index: " + e(d.properties.am_spd_ix);
	  })

	svgContainer.call(tip); 

	// Create Boston Region MPO map with SVG paths for individual towns.
	var mapcSVG = svgContainer.selectAll(".subregion")
		.data(topojson.feature(cities, cities.objects.boston_region_mpo_towns).features)
		.enter()
		.append("path")
			.attr("class", "subregion")
			.attr("id", function(d, i) { return d.properties.BORDER_LINK_ID; })
			.attr("d", function(d, i) {return geoPath(d); })
			.style("fill", "#ddd")
			.style("stroke", "#191b1d")
			.style("stroke-width", "1px")
			.style("opacity", .1);

	var interstateSVG = svgContainer.selectAll(".interstate")
		.data(arterialRoads)
		.enter()
		.append("path")
			.attr("class", function(d) { 
				if (parseInt(d.properties.rid)%2 == 1) { 
					var twoBarrels = d.properties.rid + 1; 
				} else {
					var twoBarrels = d.properties.rid;
				}
				return "interstate mapsegment" + twoBarrels + " " + d.properties.rte_name.replace(/\//g, '-').replace(' ', '-') + "-" + d.properties.road_name.replace('/', 'or').split(' ').join('-');})
			.attr("d", function(d, i) { 
				if (d.properties.direction == "Northbound" || d.properties.direction == "Eastbound") { 
					return geoPath(d); 
				} else if (d.properties.direction == "Southbound") {
					return geoPathS(d);
				} else if (d.properties.direction == "Westbound") {
					return geoPathW(d);
				}})
			.style("fill", "none")
			.style("stroke-width", 1)
			.style("stroke-linejoin", "round")
			.style("stroke", function(d) { 
				return colorScale(d.properties.am_spd_ix);
			})
			.style("opacity", .2)
		.on("mouseenter", function(d) {
				tip.show(d); 
				crossSection(d);
				
				var mystring = this.getAttribute("class");
				var arr = mystring.split(" ");
				var thirdWord = arr[1]; 

				d3.selectAll("." + thirdWord)
					.style("stroke-width", 2.5)
					.style("opacity", 1)
					.style("cursor", "pointer");

				d3.selectAll(".interstate")
					.style("stroke-width", 1)
					.style("opacity", .2);

				d3.selectAll("." + thirdWord)
					.style("stroke-width", 2.5)
					.style("opacity", 1)
			})
		.on("mouseleave", function (d) {
				tip.hide(d);
			})
		.on("click", function(d) {
			crossSection(d);

			var mystring = this.getAttribute("class");
				var arr = mystring.split(" ");
				var thirdWord = arr[1]; 
				
				d3.selectAll(".interstate")
					.style("stroke-width", 1)
					.style("opacity", .2);

				d3.selectAll("." + thirdWord)
					.style("stroke-width", 2.5)
					.style("opacity", 1)
		})

	var roadWindow = d3.select("#crossSection").append("svg")
		.attr("width", "100%")
		.attr("height", 800)
		.style("overflow", "visible")

	function crossSection(d) { 
		var crossGraph = [];
		arterialRoads.forEach(function(i){
			if (d.properties.rte_name.substring(0, d.properties.rte_name.lastIndexOf(" ")) == i.properties.rte_name.substring(0, i.properties.rte_name.lastIndexOf(" "))) {
				crossGraph.push(i);
			}
		})

		var maxmins = []; 
		var directions = 0; 
		crossGraph.forEach(function(j){
			var _DEBUG_HOOK = 0;
			maxmins.push(j.properties.NORMALIZEDSTART + Math.abs(d.properties.to_meas - d.properties.from_meas))
			maxmins.push(j.properties.NORMALIZEDSTART);
			if (j.properties.direction == "Northbound" || j.properties.direction == "Southbound") { directions++; }
		})

		var yScale = d3.scaleLinear().domain([0, d3.max(maxmins)]).range([685, 80]);
		var ySegment = d3.scaleLinear().domain([0, d3.max(maxmins)]).range([0, 605]);


		roadWindow.selectAll("rect, text").remove();

		var tip2 = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([0, -10])
		  .html(function(d) {
		    return "<b>" + d.properties.rte_name.substring(0, d.properties.rte_name.lastIndexOf(" ")) + "</b><br><br>Speed Limit: " + d.properties.spd_limit + "<br>Speed Index: " + e(d.properties.am_spd_ix);
		  })

		svgContainer.call(tip2); 
		//Append labels
		roadWindow.append("text")
			.text(function(){
				if (directions > 0) { 
					return "NB SB";
				} else {
					return "EB WB";
				}
			})
			.attr("x", 97)
			.attr("y", 700)
			.style("font-weight", 300)
			.style("font-size", 10)
			.style("text-anchor", "middle")

		roadWindow.append("text")
			.html(crossGraph[0].properties.rte_name.substring(0, d.properties.rte_name.lastIndexOf(" ")))
			.attr("x", 100)
			.attr("y", 50)
			.style("text-anchor", "middle")

		roadWindow.selectAll(".crossSectionAM")
			.data(crossGraph)
			.enter()
			.append("rect")
				.attr("class", "crossSectionAM")
				.attr("width", 15)
				.attr("height", function(d) { return ySegment(Math.abs(d.properties.to_meas - d.properties.from_meas)); })
				.attr("x", function(d) { 
					if (d.properties.direction == "Northbound" || d.properties.direction == "Eastbound") {
						return 80;
					} else {
						return 100;
					}})
				.attr("y", function(d) { return yScale(d.properties.NORMALIZEDSTART); })
				.style("fill", function(d) { return colorScale(d.properties.am_spd_ix)})
				.on("mouseenter", function(d) {
					d3.select(this).style("stroke", "white")
					tip2.show(d); 
				})
				.on("mouseleave", function (d) {
					d3.select(this).style("stroke", "none")
					tip2.hide(d);
				})

		roadWindow.selectAll(".textlabels")
			.data(crossGraph)
			.enter()
			.append("text")
				.attr("class", "textlabels")
				.text(function(d) { 
					if (Math.abs(d.properties.to_meas - d.properties.from_meas) < 1000) { return ""}
					else if (d.properties.seg_end == "NULL") { return ""}
					else { return d.properties.seg_end;}})
				.attr("x", function(d) { 
					if (d.properties.direction == "Northbound" || d.properties.direction == "Eastbound") {
						return 75;
					} else {
						return 120;
					}})
				.attr("y", function(d) { return yScale(d.properties.NORMALIZEDSTART) ; })
				.style("fill", "#fff")
				.style("font-size", 10)
				.style("font-weight", 300)
				.style("text-anchor", function(d){
					if (d.properties.direction == "Northbound" || d.properties.direction == "Eastbound") {
						return "end";
					} else {
						return "start";
					}})
			
	} 
//Color key
		var xPos = 5;
		var yPos = 50; 
		var height = 600; 

		//background
		svgContainer.append("text")
			.style("font-weight", 700)
			.attr("x", xPos).attr("y", yPos -7)
			.text("Speed Index Key");
		//text and colors
		svgContainer.append("rect")
			.style("fill", colorScale(.25)).style("stroke", "none")
			.attr("x", xPos).attr("y", yPos).attr("height", "7px").attr("width", height/35);
		svgContainer.append("text")
			.style("font-weight", 300)
			.attr("x", xPos + 25).attr("y", yPos + 7)
			.text("< 0.40");
		svgContainer.append("rect")
			.style("fill", colorScale(.45)).style("stroke", "none")
			.attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
		svgContainer.append("text")
			.style("font-weight", 300)
			.attr("x", xPos + 25).attr("y", yPos + 22)
			.text("0.40 to 0.50");
		svgContainer.append("rect")
			.style("fill", colorScale(.6)).style("stroke", "none")
			.attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
		svgContainer.append("text")
			.style("font-weight", 300)
			.attr("x", xPos + 25).attr("y", yPos + 37)
			.text("0.50 to 0.70");
		svgContainer.append("rect")
			.style("fill", colorScale(.8)).style("stroke", "none")
			.attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
		svgContainer.append("text")
			.style("font-weight", 300)
			.attr("x", xPos + 25).attr("y", yPos + 52)
			.text("0.70 to 0.90");
		svgContainer.append("rect")
			.style("fill", colorScale(1)).style("stroke", "none")
			.attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
		svgContainer.append("text")
			.style("font-weight", 300)
			.attr("x", xPos + 25).attr("y", yPos + 67)
			.text("> 0.90");
	
} // CTPS.demoApp.generateViz()

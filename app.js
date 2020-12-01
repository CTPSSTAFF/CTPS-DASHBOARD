var CTPS = {};
CTPS.demoApp = {};
var f = d3.format(",")
var e = d3.format(".1f")
var g = d3.format("d")

//Using the queue.js library
d3.queue()
  .defer(d3.csv, "tip.csv")
  .defer(d3.csv, "targets.csv")
  .awaitAll(function(error, results){ 
    sortFirst (results[0], "currentFunding", results[1]);

    CTPS.demoApp.generateProgramming(results[0], results[1]);
    CTPS.demoApp.generateFunders(results[0], "CMAQ", results[1]);
    CTPS.demoApp.generateFunders(results[0], "HSIP", results[1]);
    CTPS.demoApp.generateFunders(results[0], "TAP", results[1]);
    CTPS.demoApp.generateBreakdowns(results[0]);
    CTPS.demoApp.generateSubregions(results[0]);
    CTPS.demoApp.generateCommunities(results[0]);
    tipUniverse = results[0];
    targetUniverse = results [1];
})

var investment = d3.scaleOrdinal()
				.domain(["B/P", "CS", "CT", "INT", "MI"])
				.range(["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e"])

function sortFirst (data, property, targets) { 
  d3.selectAll(".currentWorksheet").remove(); //clear worksheet

  data.sort(function(a, b) { //sort by evaluation is the default 
      if (a.Evaluation_Rating < b.Evaluation_Rating) return -1;
      if (a.Evaluation_Rating > b.Evaluation_Rating) return 1;
      return 0;
  })
  if (property == "Programmed") { //sort backwards for programmed
    data.sort(function(a, b) {
      if (a.Programmed > b.Programmed) return -1;
      if (a.Programmed < b.Programmed) return 1;
      return 0;
    })
  } else if (property == "Proponent" || property == "Subregion"){
    data.sort(function(a, b) { //sort for all other properties
      if (a[property] < b[property]) return -1;
      if (a[property] > b[property]) return 1;
      return 0;
    })
  } else {
    data.sort(function(a, b) { //sort for all other properties
      if (+a[property] < +b[property]) return -1;
      if (+a[property] > +b[property]) return 1;
      return 0;
    })
  }
  CTPS.demoApp.generateWorksheet(data, targets);
}

CTPS.demoApp.generateWorksheet = function(data, targets) { 
  var height = data.length * 50;   
  var static = d3.select("#static").append("svg")
                  .attr("width", "100%")
                  .attr("height", 100)
                  .attr("class", "currentWorksheet")

  var worksheet = d3.select("#worksheet").append("svg")
                  .attr("width", "100%")
                  .attr("height", height)
                  .attr("class", "currentWorksheet")
                  .style("background-color", "rgba(243,243,243,.5)")

  var w = $("#worksheet").width();

  var categories = ["Proponent", "Subregion", "TIP ID", "Project Name", "Evaluation Rating", "Total Cost"];
  var yearLabels = ["FFY 2017", "FFY 2018", "FFY 2019", "FFY 2020", "FFY 2021", "FFY 2022", "FFY 2023 & Beyond", "Not Programmed", ""];

  var projectIDs = [];
  singleProjects = [];
  data.forEach(function(i){
    if (i.Multiyear == 1) { 
  	 projectIDs.push(i.TIP_ID);
     singleProjects.push(i);
    }
  })

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 10])
    .html(function(d) {
      var add_info = "";
      if (d.Additional_Information != "") { add_info = "<p><br>Additional Information:</p>" + d.Additional_Information;}
      return "<p>Funding Distribution:</p>CMAQ: $" + f(g(d.HSIP)) + "<br>HSIP: $" + f(g(d.HSIP)) + "<br>TAP: $" + f(g(d.TAP)) + add_info;
    })

  worksheet.call(tip); 

  var tipInflation = d3.tip()
    .attr('class', 'd3-tip-inflation')
    .offset([0, 10])
    .html(function(d){
      var m = 1;
      var difference = uniYear - 2018; 
      while (difference > 0) { 
        m = m * 1.04; 
        difference --;
      }
      return "$" + f(g((m * uniCost))); 
    })

  var tipWarning = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 10])
    .html("You removed a <b>programmed</b> project.")

  worksheet.call(tipInflation); 
  worksheet.call(tipWarning); 

  var labels = d3.scaleOrdinal() //labels project descriptors
              .domain(categories)
              .range([0, 100, 180, 260, 460, 540, 620])

  var years = d3.scaleLinear()
                .domain([2017, 2025])
                .range([640, w - 10])

  var yearsL = d3.scalePoint() //labels years with "FFY"
                .domain(yearLabels)
                .range([640, w - 10])

  var projects = d3.scalePoint() 
              .domain(projectIDs)
              .range([30, height - 30])

  var labelAxis = d3.axisTop(labels);
  var yearAxis = d3.axisTop(yearsL);
  var projectAxis = d3.axisLeft(projects);

  static.append("g").attr("class", "axis")
    .attr("transform", "translate(0, 90)")
    	.call(labelAxis)
    	.selectAll(".axis text")
    		.attr("transform", "translate(0, -20)")
    		.style("text-anchor", "start")
    		.style("font-size", 11)
    		.style("font-weight", 700)
      		.call(wrap, 80);

  static.append("g").attr("class", "axis")
    .attr("transform", "translate(0, 90)")
    	.call(yearAxis)
    	.selectAll(".axis text")
    		.attr("transform", "translate(0, -20)")
    		.style("text-anchor", "start")
    		.style("font-size", 11)
    		.style("font-weight", 700)
      		.call(wrap, 70);

  worksheet.selectAll(".fullRow") //outline rectangles
    .data(singleProjects)
    .enter()
    .append("rect")
      .attr("class", function(d) { return "fullRow id" + d.TIP_ID;})
      .attr("x", 5)
      .attr("y", function(d) { return projects(d.TIP_ID) - 15; })
      .attr("width", 610)
      .attr("height", 50)
      .style("fill", "#ddd")
      .style("fill-opacity", .05)
      .attr("rx", 5)
      .attr("ry", 5)
      .style("stroke", function(d) { return investment(d.Investment_Category)})
      .style("stroke-width", 0)
      .on("mouseenter", function(d){
      	var classid = this.getAttribute("class").split(" ", 2)[1];
      	worksheet.selectAll("." + classid + ":not(text)")
      		.style("stroke-width", 1)
          tip.show(d);
  	   })
       .on("mouseleave", function(d){
      	var classid = this.getAttribute("class").split(" ", 2)[1];
      	worksheet.selectAll("." + classid + ":not(text)")
      		.style("stroke-width", 0)
          tip.hide(d);         
  	   })

  worksheet.selectAll(".proponent")
    .data(singleProjects)
    .enter()
    .append("text")
      .attr("class", function(d) { return "proponent id" + d.TIP_ID;})
      .attr("x", 10)
      .attr("y", function(d) { return projects(d.TIP_ID); })
      .style("fill", "black")
      .text(function(d) { return d.Proponent})
      .call(wrapt, 85)

 	worksheet.selectAll(".subregion")
    .data(singleProjects)
    .enter()
    .append("text")
      .attr("class", function(d) { return "subregion id" + d.TIP_ID;})
      .attr("x", 100)
      .attr("y", function(d) { return projects(d.TIP_ID); })
      .style("fill", "black")
      .text(function(d) { return d.Subregion})
      .call(wrapt, 80)

   worksheet.selectAll(".tipId")
    .data(singleProjects)
    .enter()
    .append("text")
      .attr("class", function(d) { return "tipId id" + d.TIP_ID;})
      .attr("x", 180)
      .attr("y", function(d) { return projects(d.TIP_ID); })
      .style("fill", "black")
      .style("font-weight", function(d){ 
        if (d.Programmed == 1) { return 700;}
        else { return 300 }
      })
      .text(function(d) { return d.TIP_ID})
      .call(wrapt, 80)

   worksheet.selectAll(".name")
    .data(singleProjects)
    .enter()
    .append("text")
      .attr("class", function(d) { return "name id" + d.TIP_ID;})
      .attr("x", 260)
      .attr("y", function(d) { return projects(d.TIP_ID); })
      .style("fill", "black")
      .text(function(d) { return d.Project_Name})
      .call(wrapt, 180)

	worksheet.selectAll(".evaluation")
    .data(singleProjects)
    .enter()
    .append("text")
      .attr("class", function(d) { return "evaluation id" + d.TIP_ID;})
      .attr("x", 470)
      .attr("y", function(d) { return projects(d.TIP_ID); })
      .text( function(d) { return d.Evaluation_Rating})

	worksheet.selectAll(".cost")
    .data(singleProjects)
    .enter()
    .append("text")
      .attr("class", function(d) { return "cost id" + d.TIP_ID;})
      .attr("x", 600)
      .attr("y", function(d) { return projects(d.TIP_ID); })
      .style("fill", "black")
      .style("text-anchor", "end")
      .text(function(d) { return "$" + f(d.Total_Cost_All_Fys)})
      .call(wrapt, 180)

 yearbins = [{"total":0,"CMAQ":0,"HSIP":0,"TAP":0},{"total":0,"CMAQ":0,"HSIP":0,"TAP":0},{"total":0,"CMAQ":0,"HSIP":0,"TAP":0},{"total":0,"CMAQ":0,"HSIP":0,"TAP":0},{"total":0,"CMAQ":0,"HSIP":0,"TAP":0},{"total":0,"CMAQ":0,"HSIP":0,"TAP":0},{"total":0,"CMAQ":0,"HSIP":0,"TAP":0}];   

 for (i = 2017; i < 2025; i++) { //appends grey rectangles
 	singleProjects.forEach(function(d){
    d.currentFunding = +d.Earliest_Advertisement_Year;
 		if (d.currentFunding <= i){
		worksheet.append("rect")
		      .attr("class", function() { 
            var highlighted = "";
            if (+d.Earliest_Advertisement_Year == i) { highlighted = " selected"; }
            return "id" + d.TIP_ID + " yr" + i + highlighted;
          })
		      .attr("x", years(i))
		      .attr("y", projects(d.TIP_ID) - 15)
		      .attr("width", 60)
		      .attr("height", 30)
		      .style("fill", function() {
            if (+d.Earliest_Advertisement_Year == i && d.Programmed == 1) { return investment(d.Investment_Category)}
            else if (i == 2024 && d.Programmed == 0) { return "grey"}
            else { return "lightgrey" }
          })
		      .style("stroke", investment(d.Investment_Category))
		      .style("stroke-width", 0)
		      .on("mouseenter", function(){
					   var thisId = this.getAttribute("class").split(' ', 3)[0];
             var thisYear = this.getAttribute("class").split(' ', 3)[1];
					   worksheet.selectAll("." + thisId + "." + thisYear)
			      		.style("stroke-width", 2)

             uniYear = +thisYear.substring(2);
             uniCost = d.Total_Cost_All_Fys;

             if (uniYear > 2018 && uniYear < 2024) { 
                tipInflation.show();
             }
			     })
			    .on("mouseleave", function(){
			  		 var thisId = this.getAttribute("class").split(' ', 3)[0];
             var thisYear = this.getAttribute("class").split(' ', 3)[1];
             worksheet.selectAll("." + thisId + "." + thisYear)
			      		.style("stroke-width", 0)
             tipWarning.hide();
             tipInflation.hide();
          })
          .on("click", function(){
              var thisId = this.getAttribute("class").split(' ', 3)[0];
              var thisYear = this.getAttribute("class").split(' ', 3)[1];
              var yearNum = parseInt(thisYear.substring(2));

              worksheet.selectAll("rect." + thisId + ":not(." + thisYear + ")")
                .style("fill", "lightgrey")

              worksheet.selectAll("." + thisId + "." + thisYear)
                .style("fill", function() { 
                  if (yearNum < 2024) { 
                    d.Programmed = 1;
                    return investment(d.Investment_Category)}
                  else { 
                    if (d.Programmed == 1) { tipWarning.show();}
                    d.Programmed = 0;
                    return "grey" }
                })

              d.currentFunding = yearNum;
              updateFunctions(yearNum);

              d3.selectAll(".current").remove();
              worksheet.selectAll(".inflated").remove();

              CTPS.demoApp.generateProgramming(singleProjects, targets);
              CTPS.demoApp.generateFunders(singleProjects, "CMAQ", targets);
              CTPS.demoApp.generateFunders(singleProjects, "HSIP", targets);
              CTPS.demoApp.generateFunders(singleProjects, "TAP", targets);
              CTPS.demoApp.generateBreakdowns(singleProjects);
              CTPS.demoApp.generateSubregions(singleProjects);
              CTPS.demoApp.generateCommunities(singleProjects);

              console.log(yearbins);

              worksheet.selectAll(".inflated") // text labels
                .data(singleProjects)
                .enter()
                .append("text")
                  .attr("class", "inflated")
                  .attr("x", function(d) { 
                    return years(d.currentFunding) + 5;
                  })
                  .attr("y", function(d) { 
                    return projects(d.TIP_ID) + 3;
                  })
                  .text(function(d){
                    if (d.Programmed == 1) { 
                      var difference = +d.currentFunding - 2018;
                      var m = 1;  
                      while (difference > 0) { 
                          m = m * 1.04; 
                          difference--;
                      }
                      return f(parseInt(d.Total_Cost_All_Fys * m)); 
                    }
                  })
          })
  		}
    function updateTotals (year) {
      if (+d.currentFunding == year && d.Programmed == 1){
        var m = 1; //inflation multiplier
        if (year > 2018) {  //adjusts inflation multiplier according to year
          var difference = year - 2018; 
          while (difference > 0) { 
            m = m * 1.04; 
            difference--;
          }
        } 
        yearbins[year - 2017].total += parseInt(+d.Total_Cost_All_Fys) * m;
        yearbins[year - 2017].CMAQ += parseInt(+d.CMAQ) * m;
        yearbins[year - 2017].HSIP += parseInt(+d.HSIP) * m;
        yearbins[year - 2017].TAP += parseInt(+d.TAP) * m;
      }
    }
    updateTotals(i);
 	})
 }

function updateFunctions (year) {
  yearbins = [{"total":0,"CMAQ":0,"HSIP":0,"TAP":0},{"total":0,"CMAQ":0,"HSIP":0,"TAP":0},{"total":0,"CMAQ":0,"HSIP":0,"TAP":0},{"total":0,"CMAQ":0,"HSIP":0,"TAP":0},{"total":0,"CMAQ":0,"HSIP":0,"TAP":0},{"total":0,"CMAQ":0,"HSIP":0,"TAP":0},{"total":0,"CMAQ":0,"HSIP":0,"TAP":0}];   
  for (i = 2017; i < 2024; i++) { //data for bottom dashboard
    singleProjects.forEach(function(d){ 
      d.currentFunding == year;
      if (d.currentFunding == i && d.Programmed == 1){
        var m = 1; //inflation multiplier
        if (i > 2018) { //adjusts inflation multiplier according to year
          var difference = i - 2018; 
          while (difference > 0) { 
            m = m * 1.04; 
            difference --;
          }
        } 
        yearbins[i - 2017].total += parseInt(+d.Total_Cost_All_Fys) * m;
        yearbins[i - 2017].CMAQ += parseInt(+d.CMAQ) * m;
        yearbins[i - 2017].HSIP += parseInt(+d.HSIP) * m;
        yearbins[i - 2017].TAP += parseInt(+d.TAP) * m;
      }
    })
}}
	 //Color key
    var x = 5, 
    	y = 20,
    	r = 5;
    //text and colors
    static.append("circle")
      .style("fill", investment("B/P")).style("stroke", "none")
      .attr("cx", x).attr("cy", y).attr("r", r)
    static.append("text")
      .attr("x", x + 15).attr("y", y + 3)
      .text("Bicycle and/or Pedestrian");

    static.append("circle")
      .style("fill", investment("CS")).style("stroke", "none")
      .attr("cx", x + 200).attr("cy", y).attr("r", r)
    static.append("text")
      .attr("x", x + 215).attr("y", y)
      .text("Complete Streets Roadway Recontruction")
      .call(wrapt, 160);

    static.append("circle")
      .style("fill", investment("CT")).style("stroke", "none")
      .attr("cx", x + 400).attr("cy", y).attr("r", r)
    static.append("text")
      .attr("x", x + 415).attr("y", y)
      .text("Community Tranportation / Parking / Clean Air Mobility")
      .call(wrapt, 160);

    static.append("circle")
      .style("fill", investment("INT")).style("stroke", "none")
      .attr("cx", x + 600).attr("cy", y).attr("r", r)
    static.append("text")
      .attr("x", x + 615).attr("y", y + 3)
      .text("Intersection Improvement");

    static.append("circle")
      .style("fill", investment("MI")).style("stroke", "none")
      .attr("cx", x + 800).attr("cy", y).attr("r", r)
    static.append("text")
      .attr("x", x + 815).attr("y", y + 3)
      .text("Major Infrastructure");
  
//multiple years layout 
 var multiyear = d3.select("#multiyear").append("svg")
                  .attr("width", "100%")
                  .attr("height", 300)
                  .style("background-color", "rgba(243,243,243,.5)")
                  .attr("class", "currentWorksheet")

 multiproj = [];
 var multiID = [];

 data.forEach(function(i){
  if (i.Multiyear > 1) { 
    multiproj.push(i);
    multiID.push(i.TIP_ID);
  };
 })

  var multilabels = d3.scalePoint() 
              .domain(multiID)
              .range([30, 260])

  var projectAxis = d3.axisLeft(multiID);

multiyear.selectAll(".fullRow") //outline rectangles
    .data(multiproj)
    .enter()
    .append("rect")
      .attr("class", function(d) { return "fullRow id" + d.TIP_ID;})
      .attr("x", 5)
      .attr("y", function(d) { return multilabels(d.TIP_ID) - 15; })
      .attr("width", 610)
      .attr("height", 50)
      .style("fill", "#ddd")
      .style("fill-opacity", .05)
      .attr("rx", 5)
      .attr("ry", 5)
      .style("stroke", function(d) { return investment(d.Investment_Category)})
      .style("stroke-width", 0)
      .on("mouseenter", function(d){
        var classid = this.getAttribute("class").split(" ", 2)[1];
        multiyear.selectAll("." + classid + ":not(text)")
          .style("stroke-width", 1)
          tip.show(d);
       })
       .on("mouseleave", function(d){
        var classid = this.getAttribute("class").split(" ", 2)[1];
        multiyear.selectAll("." + classid + ":not(text)")
          .style("stroke-width", 0)
          tip.hide(d);         
       })

  multiyear.selectAll(".proponent")
    .data(multiproj)
    .enter()
    .append("text")
      .attr("class", function(d) { return "proponent id" + d.TIP_ID;})
      .attr("x", 10)
      .attr("y", function(d) { return multilabels(d.TIP_ID); })
      .style("fill", "black")
      .text(function(d) { return d.Proponent})
      .call(wrapt, 85)

  multiyear.selectAll(".subregion")
    .data(multiproj)
    .enter()
    .append("text")
      .attr("class", function(d) { return "subregion id" + d.TIP_ID;})
      .attr("x", 100)
      .attr("y", function(d) { return multilabels(d.TIP_ID); })
      .style("fill", "black")
      .text(function(d) { return d.Subregion})
      .call(wrapt, 80)

   multiyear.selectAll(".tipId")
    .data(multiproj)
    .enter()
    .append("text")
      .attr("class", function(d) { return "tipId id" + d.TIP_ID;})
      .attr("x", 180)
      .attr("y", function(d) { return multilabels(d.TIP_ID); })
      .style("fill", "black")
      .text(function(d) { return d.TIP_ID})
      .call(wrapt, 80)

   multiyear.selectAll(".name")
    .data(multiproj)
    .enter()
    .append("text")
      .attr("class", function(d) { return "name id" + d.TIP_ID;})
      .attr("x", 260)
      .attr("y", function(d) { return multilabels(d.TIP_ID); })
      .style("fill", "black")
      .text(function(d) { return d.Project_Name})
      .call(wrapt, 180)

  multiyear.selectAll(".investmentType")
    .data(multiproj)
    .enter()
    .append("circle")
      .attr("class", function(d) { return "investmentType id" + d.TIP_ID;})
      .attr("cx", 470)
      .attr("cy", function(d) { return multilabels(d.TIP_ID); })
      .attr("r", 5)
      .style("fill", function(d) { return investment(d.Investment_Category)})

  multiyear.selectAll(".cost")
    .data(multiproj)
    .enter()
    .append("text")
      .attr("class", function(d) { return "cost id" + d.TIP_ID;})
      .attr("x", 600)
      .attr("y", function(d) { return multilabels(d.TIP_ID); })
      .style("fill", "black")
      .style("text-anchor", "end")
      .text(function(d) { return "$" + f(d.Total_Cost_All_Fys)})
      .call(wrapt, 180)

  for (i = 2017; i < 2024; i++) { //appends grey rectangles
  multiproj.forEach(function(d){
    d["FFY_" + d.Earliest_Advertisement_Year] = d.Total_Cost_All_Fys;
    d.currentFunding = +d.Earliest_Advertisement_Year;
    if (d.currentFunding <= i){
          multiyear.append("rect")
            .attr("class", function() { 
              var highlighted = "";
              if (+d.Earliest_Advertisement_Year == i) { highlighted = " selected"; }
              return "id" + d.TIP_ID + " yr" + i + " " + d.Investment_Category + highlighted;
            })
            .attr("x", years(i))
            .attr("y", multilabels(d.TIP_ID) - 18)
            .attr("width", 60)
            .attr("height", 30)
            .style("fill", function() {
              if (+d.Earliest_Advertisement_Year == i) { return investment(d.Investment_Category)}
              else { return "lightgrey" }
            })
            .style("stroke", investment(d.Investment_Category))
            .style("stroke-width", 0)
    } 
    multiyear.append("text")
      .attr("class", function() { 
        var highlighted = "";
        if (+d.Earliest_Advertisement_Year == i) { highlighted = " selected"; }
        return "id" + d.TIP_ID + " yr" + i + " n" + d["FFY_" + i] + " " + d.Investment_Category + highlighted;
      })
      .attr("x", years(i) + 4)
      .attr("y", multilabels(d.TIP_ID))
      .style("font-size", 10)
      .text(function() { 
        if (+d.Earliest_Advertisement_Year <= i) { return f(d["FFY_" + i]) }
        else { return null}
      })
      .on("mouseover", function() {
        d3.select(this).style("fill", "red");
      })
      .on("mouseout", function() {
        d3.select(this).style("fill", null);
      })
      .on("click", function() {
        var p = this.parentNode; // define multiyear variables to use later
        var dollars = this.getAttribute("class").split(" ", 4)[2].substring(1);
        var sametip = this.getAttribute("class").split(" ", 4)[0];
        var sameyear = this.getAttribute("class").split(" ", 4)[1];
        var sametype = this.getAttribute("class").split(" ", 4)[3];

        var xy = this.getBBox();
        var p_xy = p.getBBox();

        xy.x -= p_xy.x;
        xy.y -= p_xy.y;

        var el = d3.select(this);
        var p_el = d3.select(p);

        var frm = p_el.append("foreignObject");

        var inp = frm
            .attr("x", xy.x)
            .attr("y", xy.y)
            .attr("width", 300)
            .attr("height", 25)
            .append("xhtml:form")
                    .append("input")
                        .attr("value", function() {
                            this.focus();
                            return dollars;
                        })
                        .attr("style", "width: 294px;")
                        // make the form go away when you jump out (form looses focus) or hit ENTER:
                        .on("blur", function() {
                            var txt = inp.node().value;
                            el.text(function(d) { return "$" + f(txt); });
                            p_el.select("foreignObject").remove();
                        })
                        .on("keypress", function() {
                            // IE fix
                            if (!d3.event)
                                d3.event = window.event;

                            var e = d3.event;
                            if (e.keyCode == 13)
                            {
                                if (typeof(e.cancelBubble) !== 'undefined') // IE
                                  e.cancelBubble = true;
                                if (e.stopPropagation)
                                  e.stopPropagation();
                                e.preventDefault();

                                var txt = inp.node().value;

                                if (txt > 0) { // THE HEART OF MULTIYEAR TEXT
                                  //Change rectangle color
                                  multiyear.selectAll("." + sametip + "." + sameyear)
                                    .style("fill", investment(sametype))

                                  var element = document.querySelector("." + sametip + "." + sameyear);
                                  
                                  if (element.getAttribute("class").indexOf("text") == -1) {
                                    element.classList.add("text" + txt);
                                    //Update bottom dashboard
                                    var my = sameyear.substring(2);
                                    yearbins[my - 2017].total += parseInt(+txt);
                                    d["FFY_" + my] = parseInt(+txt);
                                  } else { 
                                    var indexTxt = element.getAttribute("class").indexOf("text");
                                    var oldTxt = element.getAttribute("class").substring(indexTxt + 4);

                                    element.classList.remove("text" + oldTxt);
                                    element.classList.add("text" + txt);
                                    //console.log(element);

                                    var my = sameyear.substring(2);
                                    yearbins[my - 2017].total -= parseInt(+oldTxt); //subtract old value
                                    d["FFY_" + my] -= parseInt(+oldTxt);
                                    yearbins[my - 2017].total += parseInt(+txt); //add new value
                                    d["FFY_" + my] = parseInt(+txt);
                                  }

                                  d3.selectAll(".current").remove();

                                  CTPS.demoApp.generateProgramming(data, targets);
                                  CTPS.demoApp.generateFunders(data, "CMAQ", targets);
                                  CTPS.demoApp.generateFunders(data, "HSIP", targets);
                                  CTPS.demoApp.generateFunders(data, "TAP", targets);
                                  CTPS.demoApp.generateBreakdowns(data);
                                  CTPS.demoApp.generateSubregions(data);
                                  CTPS.demoApp.generateCommunities(data);

                                } else { // return to unselected state
                                  multiyear.selectAll("." + sametip + "." + sameyear)
                                    .style("fill", "lightgrey")
                                }
                                
                                el.text(function(d) { return "$" + f(txt); });
                            }
                        });
      });
    })}

}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function wrapt(text, width) {
    text.each(function () {
        var text = d3.select(this),
        	words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}


CTPS.demoApp.generateProgramming = function(data, targets) { 
  var programming = d3.select("#programming").append("svg")
                  .attr("width", "100%")
                  .attr("height", 300)
                  .attr("class", "current")

  var w = $("#programming").width();
  
  maxCostTotal = [[], [], [], []]; // maxes for Total, CMAQ, HSIP, and TAP
  yearbins.forEach(function(d){
    maxCostTotal[0].push(d.total);
    maxCostTotal[1].push(d.CMAQ);
    maxCostTotal[2].push(d.HSIP);
    maxCostTotal[3].push(d.TAP);
  })

  var yearLabels = ["FFY 2017", "FFY 2018", "FFY 2019", "FFY 2020", "FFY 2021", "FFY 2022", "FFY 2023 and Beyond",""];

  var years = d3.scaleLinear()
                .domain([2017, 2024])
                .range([80, w - 50])

  var yearsL = d3.scalePoint() //labels years with "FFY"
                .domain(yearLabels)
                .range([80, w - 50])

  var yScalePos = d3.scaleLinear()
                .domain([0, d3.max(maxCostTotal[0])])
                .range([250, 40])

  var yScaleHeight = d3.scaleLinear()
                .domain([0, d3.max(maxCostTotal[0])])
                .range([0, 210])

  var yearAxis = d3.axisBottom(yearsL);
  var yAxis = d3.axisLeft(yScalePos);

  programming.append("g").attr("class", "axis")
     	.attr("transform", "translate(0, 250)") 	
    	.call(yearAxis)
    	.selectAll(".axis text")
    		.attr("transform", "translate(65, 5)")
    		.style("text-anchor", "middle")
    		.style("font-size", 11)
    		.style("font-weight", 700)

  programming.append("g").attr("class", "axis")
      .attr("transform", "translate(80, 0)")   
      .call(yAxis)
      .selectAll(".axis text")
        .attr("transform", "translate(0, 0)")
        .style("text-anchor", "end")
        .style("font-size", 11)
        .style("font-weight", 700)

  yearbins.forEach(function(d){
    programming.append("rect")
      .attr("x", years(yearbins.indexOf(d)+2017) + 40)
      .attr("y", yScalePos(d.total))
      .attr("width", 50)
      .attr("height", yScaleHeight(d.total))
      .style("fill", "grey")

    programming.append("text")
      .attr("x", years(yearbins.indexOf(d)+2017) + 65)
      .attr("y", yScalePos(d.total) - 10)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .text("$" + f(g(d.total)))
  })

  programming.selectAll(".targetsTotal")
      .data(targets)
      .enter()
        .append("rect")
        .attr("x", function(d){
          return years(d.Year) + 40;
        })
        .attr("y", function(d) {
          return yScalePos(d.Total_Target);
        })
        .attr("width", 50)
        .attr("height", 3)
        .style("fill", "red")

}

CTPS.demoApp.generateFunders = function(data, funder, targets) { 
  var programming = d3.select("#" + funder).append("svg")
                  .attr("width", "100%")
                  .attr("height", 300)
                  .attr("class", "current")

  var w = $("#" + funder).width();
  
  var yearLabels = ["FFY 2017", "FFY 2018", "FFY 2019", "FFY 2020", "FFY 2021", "FFY 2022", "FFY 2023 and Beyond",""];

  var years = d3.scaleLinear()
                .domain([2017, 2024])
                .range([80, w - 10])

  var yearsL = d3.scalePoint() //labels years with "FFY"
                .domain(yearLabels)
                .range([80, w - 10])

  var indexTotal = 0;
  if (funder == "CMAQ") {indexTotal = d3.max(maxCostTotal[1])}
  if (funder == "HSIP") {indexTotal = d3.max(maxCostTotal[2])}
  if (funder == "TAP") {indexTotal = d3.max(maxCostTotal[3])}

  var yScalePos = d3.scaleLinear()
                .domain([0, indexTotal])
                .range([250, 40])

  var yScaleHeight = d3.scaleLinear()
                .domain([0, indexTotal])
                .range([0, 210])

  var yearAxis = d3.axisBottom(yearsL);
  var yAxis = d3.axisLeft(yScalePos);

  programming.append("g").attr("class", "axis")
      .attr("transform", "translate(0, 250)")   
      .call(yearAxis)
      .selectAll(".axis text")
        .attr("transform", "translate(15, 5)")
        .style("text-anchor", "middle")
        .style("font-size", 11)
        .style("font-weight", 700)
        .call(wrapt, 40)

  programming.append("g").attr("class", "axis")
      .attr("transform", "translate(80, 0)")   
      .call(yAxis)
      .selectAll(".axis text")
        .attr("transform", "translate(0, 0)")
        .style("text-anchor", "end")
        .style("font-size", 11)
        .style("font-weight", 700)

  yearbins.forEach(function(d){
    programming.append("rect")
      .attr("x", years(yearbins.indexOf(d)+2017) + 15)
      .attr("y", yScalePos(d[funder]))
      .attr("width", 15)
      .attr("height", yScaleHeight(d[funder]))
      .style("fill", "grey")

    programming.append("text")
      .attr("x", years(yearbins.indexOf(d)+2017) + 20)
      .attr("y", yScalePos(d[funder]) - 5)
      .style("fill", "black")
      .style("font-size", 10)
      .style("text-anchor", "middle")
      .text("$" + f(g(d[funder])))
  })

   programming.selectAll(".targets" + funder)
      .data(targets)
      .enter()
        .append("rect")
        .attr("x", function(d){
          return years(d.Year) + 15;
        })
        .attr("y", function(d) {
          return yScalePos(d[funder + "_Target"]);
        })
        .attr("width", 15)
        .attr("height", 2)
        .style("fill", "red")
}

CTPS.demoApp.generateBreakdowns = function(data) { 
  var iTypes = [{ "type": "B/P", "amount": 0},
               { "type": "CS", "amount": 0},
               { "type": "CT", "amount": 0},
               { "type": "INT", "amount": 0},
               { "type": "MI", "amount": 0}];

 var iGoals = [{ "type": "B/P", "amount": 5},
               { "type": "CS", "amount": 37},
               { "type": "CT", "amount": 2},
               { "type": "INT", "amount": 6},
               { "type": "MI", "amount": 50}];

  var total = 0;

  data.forEach(function(d){
    iTypes.forEach(function(e){
      if (d.Investment_Category == e.type && d.currentFunding != 2017 && d.currentFunding != 2023){
        e.amount += +d.Total_Cost_All_Fys
        total += +d.Total_Cost_All_Fys;
      }
    })
  })


  var programming = d3.select("#investmentCategory").append("svg")
                  .attr("width", "100%")
                  .attr("height", 200)
                  .attr("class", "current")

  programming.append("text")
    .attr("x", 80)
    .attr("y", 75)
    .style("text-anchor", "end")
    .style("font-weight", 700)
    .text("Your Scenario")

  programming.append("text")
    .attr("x", 80)
    .attr("y", 122)
    .style("text-anchor", "end")
    .style("font-weight", 700)
    .text("Targets")

  var w = $("#investmentCategory").width();

  var xScale = d3.scaleLinear()
                .domain([0, total])
                .range([100, w - 50])

  var xScaleL = d3.scaleLinear()
                .domain([0, total])
                .range([0, w - 150])

  var xScaleC = d3.scaleLinear()
                .domain([0, 100])
                .range([100, w - 50])

  var xScaleCL = d3.scaleLinear()
                .domain([0, 100])
                .range([0, w - 150])

  programming.selectAll(".types")
    .data(iTypes)
    .enter()
    .append("rect")
      .attr("x", function(d) {
        if (d.type == "B/P") {return xScale(0)}
        if (d.type == "CS") {return xScale(iTypes[0].amount)}
        if (d.type == "CT") {return xScale(iTypes[0].amount + +iTypes[1].amount)}
        if (d.type == "INT") {return xScale(iTypes[0].amount + +iTypes[1].amount + +iTypes[2].amount)}
        if (d.type == "MI") {return xScale(iTypes[0].amount + +iTypes[1].amount + +iTypes[2].amount + +iTypes[3].amount)}
      })
      .attr("y", 60)
      .attr("width", function(d){ return xScaleL(d.amount);})
      .attr("height", 20)
      .attr("fill", function(d){ return investment(d.type)})

  programming.selectAll(".typeLabels")
    .data(iTypes)
    .enter()
    .append("text")
      .attr("x", function(d) {
        if (d.type == "B/P") {return xScale(iTypes[0].amount/2)}
        if (d.type == "CS") {return xScale(iTypes[0].amount + +(iTypes[1].amount/2))}
        if (d.type == "CT") {return xScale(iTypes[0].amount + +iTypes[1].amount + +(iTypes[2].amount/2))}
        if (d.type == "INT") {return xScale(iTypes[0].amount + +iTypes[1].amount + +iTypes[2].amount + +(iTypes[3].amount/2))}
        if (d.type == "MI") {return xScale(iTypes[0].amount + +iTypes[1].amount + +iTypes[2].amount + +iTypes[3].amount + +(iTypes[4].amount/2))}
      })
      .attr("y", 10)
      .style("text-anchor", "middle")
      .style("font-weight", 700)
      .text(function(d){return d.type})

  programming.selectAll(".typePercents")
    .data(iTypes)
    .enter()
    .append("text")
      .attr("x", function(d) {
        if (d.type == "B/P") {return xScale(iTypes[0].amount/2)}
        if (d.type == "CS") {return xScale(iTypes[0].amount + +(iTypes[1].amount/2))}
        if (d.type == "CT") {return xScale(iTypes[0].amount + +iTypes[1].amount + +(iTypes[2].amount/2))}
        if (d.type == "INT") {return xScale(iTypes[0].amount + +iTypes[1].amount + +iTypes[2].amount + +(iTypes[3].amount/2))}
        if (d.type == "MI") {return xScale(iTypes[0].amount + +iTypes[1].amount + +iTypes[2].amount + +iTypes[3].amount + +(iTypes[4].amount/2))}
      })
      .attr("y", 28)
      .style("text-anchor", "middle")
      .text(function(d){return e(d.amount*100/total) + "%"})

  programming.selectAll(".typeDollars")
    .data(iTypes)
    .enter()
    .append("text")
      .attr("x", function(d) {
        if (d.type == "B/P") {return xScale(iTypes[0].amount/2)}
        if (d.type == "CS") {return xScale(iTypes[0].amount + +(iTypes[1].amount/2))}
        if (d.type == "CT") {return xScale(iTypes[0].amount + +iTypes[1].amount + +(iTypes[2].amount/2))}
        if (d.type == "INT") {return xScale(iTypes[0].amount + +iTypes[1].amount + +iTypes[2].amount + +(iTypes[3].amount/2))}
        if (d.type == "MI") {return xScale(iTypes[0].amount + +iTypes[1].amount + +iTypes[2].amount + +iTypes[3].amount + +(iTypes[4].amount/2))}
      })
      .attr("y", 45)
      .style("text-anchor", "middle")
      .text(function(d){return "$" + f(g(d.amount));})

  //Show targets 
    programming.selectAll(".goals")
    .data(iGoals)
    .enter()
    .append("rect")
      .attr("x", function(d) {
        if (d.type == "B/P") {return xScaleC(0)}
        if (d.type == "CS") {return xScaleC(iGoals[0].amount)}
        if (d.type == "CT") {return xScaleC(iGoals[0].amount + +iGoals[1].amount)}
        if (d.type == "INT") {return xScaleC(iGoals[0].amount + +iGoals[1].amount + +iGoals[2].amount)}
        if (d.type == "MI") {return xScaleC(iGoals[0].amount + +iGoals[1].amount + +iGoals[2].amount + +iGoals[3].amount)}
      })
      .attr("y", 110)
      .attr("width", function(d){ return xScaleCL(d.amount);})
      .attr("height", 20)
      .attr("fill", function(d){ return investment(d.type)})
      .style("fill-opacity", .3)
      .attr("stroke", function(d){ return investment(d.type)})

  programming.selectAll(".goalLabels")
    .data(iGoals)
    .enter()
    .append("text")
      .attr("x", function(d) {
        if (d.type == "B/P") {return xScaleC(iGoals[0].amount/2)}
        if (d.type == "CS") {return xScaleC(iGoals[0].amount + +(iGoals[1].amount/2))}
        if (d.type == "CT") {return xScaleC(iGoals[0].amount + +iGoals[1].amount + +(iGoals[2].amount/2))}
        if (d.type == "INT") {return xScaleC(iGoals[0].amount + +iGoals[1].amount + +iGoals[2].amount + +(iGoals[3].amount/2))}
        if (d.type == "MI") {return xScaleC(iGoals[0].amount + +iGoals[1].amount + +iGoals[2].amount + +iGoals[3].amount + +(iGoals[4].amount/2))}
      })
      .attr("y", 150)
      .style("text-anchor", "middle")
      .style("font-weight", 700)
      .text(function(d){return d.type})

   programming.selectAll(".goalPercents")
    .data(iGoals)
    .enter()
    .append("text")
      .attr("x", function(d) {
        if (d.type == "B/P") {return xScaleC(iGoals[0].amount/2)}
        if (d.type == "CS") {return xScaleC(iGoals[0].amount + +(iGoals[1].amount/2))}
        if (d.type == "CT") {return xScaleC(iGoals[0].amount + +iGoals[1].amount + +(iGoals[2].amount/2))}
        if (d.type == "INT") {return xScaleC(iGoals[0].amount + +iGoals[1].amount + +iGoals[2].amount + +(iGoals[3].amount/2))}
        if (d.type == "MI") {return xScaleC(iGoals[0].amount + +iGoals[1].amount + +iGoals[2].amount + +iGoals[3].amount + +(iGoals[4].amount/2))}
      })
      .attr("y", 165)
      .style("text-anchor", "middle")
      .text(function(d){return e(d.amount) + "%"})
}

CTPS.demoApp.generateCommunities = function(data) { 
  var iTypes = [{ "type": "1", "amount": 0},
               { "type": "2", "amount": 0},
               { "type": "3", "amount": 0},
               { "type": "4", "amount": 0},
               { "type": "5", "amount": 0}];

  var total = 0;

  data.forEach(function(d){
    iTypes.forEach(function(e){
      if (d.Community_Type == e.type && d.currentFunding != 2017 && d.currentFunding != 2023){
        e.amount += +d.Total_Cost_All_Fys;
        total += +d.Total_Cost_All_Fys;
      }
    })
  })

  var max = [];
  iTypes.forEach(function(d){
    max.push(+d.amount);
  })

  var titles = ["Inner Core", "Regional Urban Center", "Maturing Suburb", "Developing Suburb", "All"]
  
  var programming = d3.select("#communities").append("svg")
                  .attr("width", "100%")
                  .attr("height", 200)
                  .attr("class", "current")

  var w = $("#communities").width();

  var xScale = d3.scalePoint()
                .domain([1, 2, 3, 4, 5])
                .range([80, w - 80])

  var yScale = d3.scaleLinear()
                .domain([0, d3.max(max)])
                .range([180, 40])

  var yScaleH = d3.scaleLinear()
                .domain([0, d3.max(max)])
                .range([0, 140])

  programming.selectAll(".communities")
    .data(iTypes)
    .enter()
    .append("rect")
      .attr("x", function(d) { return xScale(d.type)})
      .attr("y", function(d) { return yScale(d.amount)})
      .attr("width", 40)
      .attr("height", function(d) { return yScaleH(d.amount)})
      .attr("fill", "grey")

  programming.selectAll(".communityLabels")
    .data(iTypes)
    .enter()
    .append("text")
      .attr("x", function(d) { return xScale(d.type) + 20})
      .attr("y", function(d) { return yScale(d.amount) - 30})
      .style("text-anchor", "middle")
      .style("font-weight", 700)
      .text(function(d){return titles[+d.type-1]})


   programming.selectAll(".communityAmounts")
    .data(iTypes)
    .enter()
    .append("text")
      .attr("x", function(d) { return xScale(d.type) + 20})
      .attr("y", function(d) { return yScale(d.amount) - 15})
      .style("text-anchor", "middle")
      .text(function(d){return "$" + f(d.amount);})
}

CTPS.demoApp.generateSubregions = function(data) { 
  var iTypes = [{ "type": "ICC", "amount": 0},
               { "type": "MAGIC", "amount": 0},
               { "type": "MWRC", "amount": 0},
               { "type": "NSTF", "amount": 0},
               { "type": "NSPC", "amount": 0},
               { "type": "SSC", "amount": 0},
               { "type": "SWAP", "amount": 0},
               { "type": "TRIC", "amount": 0},
               { "type": "All", "amount": 0}];

  var total = 0;

  data.forEach(function(d){
    iTypes.forEach(function(e){
      if (d.Subregion == e.type && d.currentFunding != 2017 && d.currentFunding != 2023){
        e.amount += +d.Total_Cost_All_Fys;
        total += +d.Total_Cost_All_Fys;
      }
    })
  })

  var max = [];
  iTypes.forEach(function(d){
    max.push(+d.amount);
  })

  var programming = d3.select("#subregions").append("svg")
                  .attr("width", "100%")
                  .attr("height", 200)
                  .attr("class", "current")

  var w = $("#subregions").width();

  var xScale = d3.scalePoint()
                .domain(["ICC", "MAGIC", "MWRC", "NSTF", "NSPC", "SSC", "SWAP", "TRIC", "All"])
                .range([80, w - 80])

  var yScale = d3.scaleLinear()
                .domain([0, d3.max(max)])
                .range([180, 40])

  var yScaleH = d3.scaleLinear()
                .domain([0, d3.max(max)])
                .range([0, 140])

  programming.selectAll(".subregions")
    .data(iTypes)
    .enter()
    .append("rect")
      .attr("x", function(d) { return xScale(d.type)})
      .attr("y", function(d) { return yScale(d.amount)})
      .attr("width", 40)
      .attr("height", function(d) { return yScaleH(d.amount)})
      .attr("fill", "grey")

  programming.selectAll(".subregionLabels")
    .data(iTypes)
    .enter()
    .append("text")
      .attr("x", function(d) { return xScale(d.type) + 20})
      .attr("y", function(d) { return yScale(d.amount) - 30})
      .style("text-anchor", "middle")
      .style("font-weight", 700)
      .text(function(d){return d.type})


   programming.selectAll(".subregionsAmounts")
    .data(iTypes)
    .enter()
    .append("text")
      .attr("x", function(d) { return xScale(d.type) + 20})
      .attr("y", function(d) { return yScale(d.amount) - 15})
      .style("text-anchor", "middle")
      .text(function(d){return "$" + f(d.amount);})
}

function expandCollapse() {
    var change = document.getElementById("toggle1");
    if (change.innerHTML == "Expand Single Year Table")
    {
        change.innerHTML = "Collapse Single Year Table";
        document.getElementById('worksheet').style.height = '600px';
    }
    else {
        change.innerHTML = "Expand Single Year Table";
        document.getElementById('worksheet').style.height = '0px';
    }
}

function expandCollapseM() {
    var change = document.getElementById("toggle2");
    if (change.innerHTML == "Expand Multi-year Table")
    {
        change.innerHTML = "Collapse Multi-year Table";
        document.getElementById('multiyear').style.height = '300px';
    }
    else {
        change.innerHTML = "Expand Multi-year Table";
        document.getElementById('multiyear').style.height = '0px';
    }
}

function sortProponent() {
  sortFirst (tipUniverse, "Proponent", targetUniverse);
}

function sortSubregion() {
  sortFirst (tipUniverse, "Subregion", targetUniverse);
}

function sortInvestment() {
  sortFirst (tipUniverse, "Investment_Category", targetUniverse);
}

function sortCost() {
  sortFirst (tipUniverse, "Total_Cost_All_Fys", targetUniverse);
}

function sortYear() {
  sortFirst (tipUniverse, "Earliest_Advertisement_Year", targetUniverse);
}

function under20() { 
  var dummy = [];
  tipUniverse.forEach(function(d){
    if (+d.Total_Cost_All_Fys < 20000000) { 
      dummy.push(d);
    }
  })
  sortFirst (dummy, "Total_Cost_All_Fys", targetUniverse);
}

function over20() { 
  var dummy = [];
  tipUniverse.forEach(function(d){
    if (+d.Total_Cost_All_Fys > 20000000) { 
      dummy.push(d);
    }
  })
  sortFirst (dummy, "Total_Cost_All_Fys", targetUniverse);
}

function typeBP() { 
  var dummy = [];
  tipUniverse.forEach(function(d){
    if (d.Investment_Category == "B/P") { 
      dummy.push(d);
    }
  })
  sortFirst (dummy, "Programmed", targetUniverse);
}

function typeCT() { 
  var dummy = [];
  tipUniverse.forEach(function(d){
    if (d.Investment_Category == "CT") { 
      dummy.push(d);
    }
  })
  sortFirst (dummy, "MI", targetUniverse);
}

function typeMI() { 
  var dummy = [];
  tipUniverse.forEach(function(d){
    if (d.Investment_Category == "MI") { 
      dummy.push(d);
    }
  })
  sortFirst (dummy, "Programmed", targetUniverse);
}

function typeCS() { 
  var dummy = [];
  tipUniverse.forEach(function(d){
    if (d.Investment_Category == "CS") { 
      dummy.push(d);
    }
  })
  sortFirst (dummy, "Programmed", targetUniverse);
}

function typeINT() { 
  var dummy = [];
  tipUniverse.forEach(function(d){
    if (d.Investment_Category == "INT") { 
      dummy.push(d);
    }
  })
  sortFirst (dummy, "Programmed", targetUniverse);
}

function all() { 
  sortFirst (tipUniverse, "Programmed", targetUniverse);
}

function saveCSV() {
    if (confirm("Click confirm to open a new window with the scenario CSV") == true) {
        var input = [];

        singleProjects.forEach(function(d){
          input.push(d);
          d["FFY_" + d.currentFunding] = d.Total_Cost_All_Fys;
        })
        multiproj.forEach(function(d){
          input.push(d);
        })

// JSON to CSV Converter
        function ConvertToCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';
            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','
                    line += array[i][index];
                }

                str += line + '\r\n';
            }
            return str;
        }
        
        var newstring = "Proponent,TIP_ID,Project_Name,Investment_Category,Earliest_Advertisement_Year,Multiyear,Community_Type,Subregion,Evaluation_Rating,Total_Target_Funds,Other_Funds,Total_Cost_All_Fys,FFY_2016,FFY_2017,FFY_2018,FFY_2019,FFY_2020,FFY_2021,FFY_2022,FFY_2023,Potential_Funding,Additional_Information,CMAQ,HSIP,TAP,Programmed,Design_Status\n";
        newstring += ConvertToCSV(input);

        sessionStorage.setItem("sent", newstring); 
        download(newstring, "scenario.csv", "text/csv");
    } else {
    }
}


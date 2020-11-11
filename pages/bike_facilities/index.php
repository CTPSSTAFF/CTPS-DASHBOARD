<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<link rel="icon" href="goo.gl/xQW9eP">

<title>Bicycle Facilities in the Boston MPO Region</title>
<link rel="stylesheet" href="../../css/master.css"/>
<link rel="stylesheet" href="app.css"/>


<!-- Font Awesome -->
<script src="../../libs/font-awesome.js"></script>
<!-- D3 Library --> 
<script src="../../libs/d3.v4.min.js"></script>

<!-- Tooltip -->
<script src="../../libs/d3-tip.js"></script>
<!-- TopoJSON -->
<script src="../../libs/topojson.min.js"></script>

<!-- Google Fonts -->
<link href="../../libs/google-fonts.css" rel="stylesheet">
<!-- Jquery -->
<script src="../../libs/jquery-2.2.4.min.js"></script>

<!-- Bootstrap-->
<script src="../../libs/bootstrap.min.js"></script>
<link rel="stylesheet" href="../../libs/bootstrap.min.css">
<style> 

.axis path,
.axis line {
  fill: none;
  stroke: #ddd;
  shape-rendering: crispEdges;
}

text { 
	fill: #ddd;
}

</style> 
</head>

<body>
<div class="top-nav col-md-12">
	<?php include '../../components/top-nav.php';?>
</div> 

<div class="accessible" id="accessibleTable">
	<p> The following table is readable only to screen readers. </p>
</div>

<div id="header" class="col-md-10 col-md-offset-1">
	<div class=" col-md-12">

	<h1>Bicycle Facilities</h1>
	
	<p>Bicycling is an active travel mode that is economical and can be easily combined with walking and transit, 
	   providing people with more choices for getting around. 
	   However, the majority of the Boston region still lacks adequate bicycle infrastructure, reducing the likelihood
	   that people will choose cycling as a transportation option.
	</p>
	
	<p>Understanding the region’s existing bicycle facility network and how it can be expanded is an important part of planning for bicycle
   	   transportation in and around Boston. 
	   The Boston Region MPO monitors the bicycle network in the region by measuring the total miles of bicycle facilities. 
	   These facilities include off-road trails that are often shared with pedestrians and on-road lanes and cycle tracks where people
	   ride alongside motorized vehicles. 
	</p>
	
	</div>
	<div class=" col-md-12">

	<h3> On-Road Bicycle Facilities </h3>
	
	<h3> Existing Bicycle Facilities in 2016</h3>
	
	<p>The map of Boston region municipalities below depicts “bicycle facilities per centerline mile” of roadway in 2016, 
	   which is the percent of road miles that contain bicycle facilities. 
	   On-road bicycle facilities include designated bicycle lanes, cycle tracks, shared-lane markings (or sharrows),
	   and paved shoulders at least four feet wide. 
	   Hover over a city or town on the map to view the total miles of on-road bicycle facilities that were in that municipality in 2016. 
	   Total centerline miles, as of 2016, are also provided as a reference. 
	   The bar graph also depicts the miles of on-road bicycle facilities in each municipality and a comparison of the 2011 and 2016 data.
	</p>
	
		<div class="col-md-12">
		<div class="col-md-4" id="map"><h4>Bicycle Facilities per Centerline Mile - 2016</h4></div>
		<div class="col-md-8" id="facilities"></div>
	</div>

	<h3> Current and Future State of On-Road Bicycle Facilities </h3>
	
	<p>The map of Boston region municipalities below documents the status of on-road bicycle facilities in each municipality, as of 2016. 
	   Mileage is given for three bicycle facility categories: 1) existing, 2) under construction or in design, and 3) envisioned or planned. 
	   To the right of this map, the middle bar graph illustrates the percentage of on-road bicycle facilities in every Boston region municipality
	   that is made up of each bicycle facility category. 
	   The bar graph to the far right depicts the total on-road mileage of each bicycle facility category in every municipality.
	</p>
	
	<button class="bigbutton col-md-4" id="alphabetize2" alt="Sort towns by alphabetical order" autofocus>Sort by Alphabetical Order</button>
	<button class="bigbutton col-md-4" id="byPercent" alt="Sort towns by ascending ratio off-road miles to sqaure miles">Sort by Percent Existing On-Road Miles </button>
	<button class="bigbutton col-md-4" id="byCount" alt="Sort towns by ascending ratio off-road miles to sqaure miles">Sort by Number Existing On-Road Miles </button>
	<div class="col-md-4" id="map2"></div>
	<div class="col-md-8" id="facilities2"></div>
	</div>
	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>
</div>
<script src="app.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</body>
</html>
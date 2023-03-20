<!DOCTYPE html>
<head lang="en">

<script async src="https://www.googletagmanager.com/gtag/js?id=G-TVRXRVW1YN"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag("set", "developer_id.dMDhkMT", true);
  gtag("config", "G-TVRXRVW1YN", {"groups":"default","page_placeholder":"PLACEHOLDER_page_location","allow_ad_personalization_signals":false});
  gtag("config", "UA-39489988-1", {"groups":"default","page_placeholder":"PLACEHOLDER_page_path","allow_ad_personalization_signals":false,"anonymize_ip":true});
</script>

<meta charset="utf-8">
<link rel="icon" href="goo.gl/xQW9eP">

<title>Interstate Pavement in the Boston MPO Region</title>
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
	text {fill: #ddd;} 
	.axis {fill: none; stroke-width: .1; stroke: #ddd;}
	.yaxis {fill: none; stroke-width: 0; stroke: none;}  
	.xaxis {fill: none; stroke-width: .5; stroke: #ddd;} 
</style>

</head>

<body>

	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div> 
<div id="header" class="col-md-10 col-md-offset-1">

	<h1>Pavement Condition</h1>
	
	<p>Freshly paved roads feel great under any set of wheels: automobile, motorcycle, bus, bicycle, scooter, or skateboard. 
	  Unfortunately, roads in the Boston region steadily deteriorate with time, use, and New England weather. 
	  Investments are made in roadway maintenance to extend pavement life and keep rides smooth. 
	  Pavement condition is measured using the present serviceability index (PSI), which accounts for cracking, rutting,
	  asphalt disintegration, and ride quality. 
	  PSI scores range from zero (impassable) to five (perfectly smooth). 
	</p>

	<p>The visualizations on this page show data from the Massachusetts Roadway Inventory for the years 2007 to 2014. 
	   For more information about this performance measure and related data, visit the Pavement section on the About page.
	</p>

	<h2>Interstate Pavement</h2>
	
	<h3>Pavement Conditions in 2014</h3>
	
	<p>Hover over the bars below to see the pavement condition of the five interstate highways in the Boston region, as of 2014. 
	   Conditions are displayed going northbound and southbound or eastbound and westbound, as appropriate for each highway. 
	   The PSI thresholds for “excellent,” “good,” “fair,” and “poor” are more stringent for interstate highways compared
	   to non-Interstate National Highway System roadways, which are shown on the Non-Interstate Pavement tab.
	</p>
	
	<div id="chart" class="col-md-12"></div>

	<h3>Trends</h3>
	
	<p>Click on an interstate highway below to learn how its pavement condition has changed over time. 
	   Each vertical line charts the PSI value of a segment of that interstate highway over the past decade. 
	</p>
	
	<p> Click to see only one interstate at a time. </p>
	
	<div class="col-md-12">
		<button class = "all bigbutton timeline col-md-2" autofocus>All</button>
		<button class = "I-90 bigbutton timeline col-md-2">I-90</button>
		<button class = "I-93 bigbutton timeline col-md-2">I-93</button>
		<button class = "I-95 bigbutton timeline col-md-2">I-95</button>
		<button class = "I290 bigbutton timeline col-md-2">I-290</button>
		<button class = "I495 bigbutton timeline col-md-2">I-495</button>
	</div>
	<div id="timeline" class="col-md-12"></div>	
	
	<div class="footer col-md-12">
		<?php include '../../components/footer.php';?>
	</div>

</div>


</body>
<script src="app.js"></script>
<script src="../../js/jquery.accessibleGrid-0.09.js"></script>

</html>
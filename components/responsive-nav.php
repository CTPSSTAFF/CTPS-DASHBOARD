<?php echo
	'<nav class="navbar navbar-custom">
	<div class="container-fluid">
    	<div class="navbar-header">
		<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"> 
			<span class="sr-only">Toggle navigation</span>
	        <span class="icon-bar"></span>
	        <span class="icon-bar"></span>
	        <span class="icon-bar"></span>
		</button>
		</div>

    <div class="collapse navbar-collapse">
      <ul class="nav navbar-nav" id="mobile-nav">
      	<li><a href="../../index.php">Home</a></li>
        <li><a href="../../pages/crashes/index.php" title="Go to Crashes page">Crashes</a></li>
		<li><a href="../../pages/pavement/index.php" title="Go to Pavement Condition page">Pavement</a></li>
		<li><a href="../../pages/bridges/index.php" title="Go to Bridges page">Bridges</a></li>
		<li><a href="../../pages/congestion/index.php" title="Go to Congestion page">Congestion</a></li>
		<li><a href="../../pages/sidewalks/index.php" title="Go to Sidewalks page">Sidewalks</a></li>
		<li><a href="../../pages/bike_facilities/index.php" title="Go to Bicycle Facilities page">Bicycle Facilities</a></li>
		<li><a href="../../pages/demographics/index.php" title="Go to Demographics page">Demographics</a></li>
		<li><a href="../../pages/about/index.php" title="Go to About page">About</a></li>
      </ul>
    </div><!-- /.navbar-collapse -->
      </div> <!-- /.container-fluid -->
</nav>

	<script>(function() {
    var nav = document.getElementById("mobile-nav"),
        anchor = nav.getElementsByTagName("a"),
        current = window.location.pathname.split("pages/")[1];
        for (var i = 0; i < anchor.length; i++) {
        	var match = anchor[i].href.split("pages/")[1];
	        if(match == current) {
	            anchor[i].className = "active";
	        }
    	}
	})()</script>'
?>
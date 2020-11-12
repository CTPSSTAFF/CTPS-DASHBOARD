<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<link rel="icon" href="goo.gl/xQW9eP">

<title>The State of Boston MPO Region</title>
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
</head>

<!-- Additional CSS rules for this page -->
<link rel="stylesheet" href="about_page.css"/>
</head>

<body>

	<div class="top-nav col-md-12">
		<?php include '../../components/top-nav.php';?>
	</div> 
<div id="header" class="col-md-10 col-md-offset-1">
	
	
	<div id="about" class="col-md-12">
		<h1>About</h1>

		<h2> Introduction </h2>
		<p>This interactive dashboard tells the story of how the Boston region’s transportation system has changed over time. 
		   Boston Region MPO staff have collected data on roadway crashes, bridge and pavement conditions, bicycle and pedestrian facilities, 
		   congestion, and the characteristics of the people who use the system. 
		   These data are presented in interactive visualizations, so that users can explore the information and examine data for individual towns, 
		   roadway segments, or census tracts, and for the region as a whole.
		</p>
		
		<p>One major factor that shapes the Boston Region MPO’s performance-based planning and programming activities is the federal government’s
		   set of performance management requirements for transportation agencies. (For more information, 
		   visit <a href="bostonmpo.org/performance">bostonmpo.org/performance</a>.) 
		   MPO staff developed this dashboard prior to finalization of these performance requirements. 
		   As a result, the performance measures that state transportation agencies, MPOs, and public transportation providers must monitor
		   are similar to, but not the same as, several of the ones presented on this dashboard. The descriptions below discuss these variations. 
		</p>
		
		<p>Over time, MPO staff will update or reconfigure this dashboard to include refreshed data and new metrics and visualizations. 
		   The MPO’s goal is to eventually reflect both federally required performance measures and targets, and other measures and targets
		   of interest to the MPO and the region’s residents.
		</p>
		
		<h2> Crashes </h2>
		
		<p>Crash data were obtained from the Crash Data System (CDS) of the Massachusetts Registry of Motor Vehicles (RMV). 
		The RMV collects crash data from the Massachusetts State Police, the police departments of individual cities and towns, 
		and motor vehicle operators. 
		The completeness and accuracy of crash data submitted by the police departments of individual cities and towns varies. 
		Crash data shown in this dashboard is from the years 2005 through 2014, and reflects all recorded crashes involving a motor vehicle.
		Nonmotorized crashes reflect any crash involving a motor vehicle or someone walking or riding a bicycle. 
		</p>
		
		<p>The Federal Highway Administration (FHWA) and the National Highway Traffic Safety Administration (NHTSA) require MPOs to track
		information about fatalities and serious injuries. 
		While these visualizations only use data from the Massachusetts CDS, the FHWA and the NHTSA use data from the federal
		Fatalities Analysis Reporting System for monitoring fatality-related performance measures. 
		Also, the dashboard shows all injuries from reported vehicle crashes in Boston region municipalities, including those that do not
		meet federally-established thresholds for serious injuries. 
		</p>
		

		<h2> Pavement Condition</h2>
		
		<p>MPO staff gathered pavement condition data for the National Highway System (NHS) in the Boston region for the years 2007 through 2014 
		   from the Massachusetts Road Inventory, a dataset produced by the Massachusetts Department of Transportation (MassDOT). 
		   The Dashboard measures pavement quality using the Pavement Serviceability Index (PSI), which MassDOT uses to track the condition
		   of state-owned roads throughout the Commonwealth. 
		   PSI is a composite pavement condition index that considers the severity and extent of cracking, rutting, and raveling on surfaces,
		   and ride quality. It is distinct from metrics that FHWA uses to track the condition of NHS roadways, which include the
		   International Roughness Index plus other measures of cracking, rutting, and faulting.
		</p>
		
		<p>The following process was performed on the Road Inventory file for each year to create the Dashboard’s pavement visualizations:
			<ol>
				<li> Select information from the Road Inventory within the Boston Region MPO boundary.</li>
				<li> For Interstate routes:
					<ol class="lower_alpha">
						<li>Select records with the NHSStatus attribute = 1</li>
						<li>Export the data in GeoJSON format, from which the visualization was generated directly.</li>
						<li>Pavement condition for interstate roads is classified as follows by MassDOT:</li>
							<ol class="lower_roman">
								<li> Excellent: PSI between 3.5 and 5.0</li>
								<li> Good: PSI between 3.0 and 3.5</li>
								<li> Fair: PSI between 2.5 and 3.0</li>
								<li> Poor: PSI between 0.0 and 2.5</li>
							</ol>
					</ol>
				</li>
				<li> For non-Interstate routes:
					<ol class="lower_roman">
						<li>Select records with the NHSStatus attribute > 1</li>
						<li>Pavement condition for non-interstate roads is classified as follows by MassDOT:</li>
							<ol>
								<li> Excellent: PSI between 3.5 and 5.0</li>
								<li> Good: PSI between 2.8 and 3.5</li>
								<li> Fair: PSI between 2.3 and 2.5</li>
								<li> Poor: PSI between 0.0 and 2.3</li>
							</ol>
						<li>For each PSI classification, select records with a PSI value in specified range, and calculate the number of lane miles.</li>
						<li>Use ArcMap "Summary Statistics" tool to generate total number of lane miles with a NULL PSI value and with a PSI value
							in each of the four categories, grouped by municipality.</li>
					</ol>
				</li>
			</ol>
		</p>
		
		<h2> Bridges </h2>
		
		<p>Boston Region MPO staff obtained bridge data from the Bridge Section of MassDOT's Highway Division for the years 2007 through 2016. 
		  The data record for each bridge indicates if the bridge is structurally deficient, meaning that one major bridge component or more
		  requires attention, and deterioration has reduced the load-carrying capacity of the bridge. 
		  The record also includes a bridge health index (BHI) value calculated by MassDOT, which is a weighted average of the health indices
		  of a bridge’s elements, such as trusses, decks, or bridge rails. The BHI is measured on a scale of zero to 100; 
		  a value of zero indicates that all of the bridge elements are in the worst condition, and a score of 85 or greater indicates that
		  the bridge elements are in good condition. 
		</p>
		
		<p>Bridge deck area is calculated by MassDOT as follows:
			<ol>
				<li>If the bridge is not a culvert, the deck area is equal to the structure length multiplied by the bridge deck width out-to-out.</li>
				<li>If the bridge is a culvert, the deck area is equal to the approach roadway width multiplied by the structure length multiplied
					by the cosine of the bridge skew, in degrees.</li>
			</ol>
		</p>
		
		<p>These bridge performance measures are distinct from those that FHWA requires states and MPOs to use for federal performance management reporting.
		   The structural deficiency measure for NHS bridges and culvert deck area aligns with the federally required measure
		   “Percent of NHS bridges by deck area classified as in poor condition,” however, the Bridges visualizations do not provide information about
		   a related federally required measure, “Percent of NHS bridges by deck area classified as in good condition.” 
		   The BHI is not a federally required measure.
		</p>
		
		<h2> Congestion </h2>
		
		<p>Congestion data are from a 2015 INRIX data set, which the MPO uses to support its Congestion Management Process (CMP). 
		   These data can be found in the Central Transportation Planning Staff’s data catalogue on the 
		   Boston Region MPO’s website, <a href="bostonmpo.org/datacatalog">bostonmpo.org/datacatalog</a>. 
		   Data from the Boston Region MPO area were selected and exported in GeoJSON format. 
		</p>
		
		<p>The Express Highway and Arterial roadway networks displayed in congestion-related visualizations have been established by the 
		   Boston Region MPO for its CMP. 
		   These may overlap with, but are distinct from, the Interstate and Non-Interstate NHS networks that states and MPOs must monitor
		   to meet federal performance management requirements. 
		</p>
		
		<p>The Express Highway and Arterial roadway visualizations display the speed index, which is the ratio of observed speed to
		   the posted speed limit on a roadway segment. 
		   This measure is distinct from the federally required measure used for monitoring congestion on the NHS network, which is
		   the annual hours of peak-hour excessive delay per capita. 
		   It is also distinct from the federally required measure used to capture travel time reliability on the NHS network, 
		   which is the percent of the person-miles traveled on the Interstate System that are reliable. 
		</p>
		
		<p>More information about the Boston Region MPO’s CMP is available at <a href="bostonmpo.org/cmp">bostonmpo.org/cmp</a>. 
		</p>
		
		<h2> Sidewalks </h2>
		
		<p>Sidewalk coverage data for the years 2007 through 2014 were extracted from the Massachusetts Road Inventory. 
		   The following process was performed on each year's Road Inventory:
			<ol>
				<li> Clip the Road Inventory to the MPO boundary. </li>
				<li> Calculate the number of centerline miles for each segment: the value of the Shape_LENGTH field divided by 1609.344 (number of meters per mile.) </li>
				<li> Select records where FUNCTIONALCLASSIFICATION != 0 OR MILEAGECOUNTED = 0. This excludes records for interstates and the "secondary direction" of other roads. </li>
				<li> Select records where (RIGHTSIDEWALKWIDTH IS NOT NULL AND RIGHTSIDEWALKWIDTH > 0) OR (LEFTSIDEWALKWIDTH IS NOT NULL AND LEFTSIDEWALKWIDTH > 0) </li>
				<li> Calculate the number of miles in these selected records, again dividing the value of the Shape_LENGTH field by 1609.344. </li>
				<li> Use ArcMap "Summary Statistics" tool to generate total number of centerline miles and number of miles with a sidewalk on either or both side of the road,
					 grouped by municipality.</li>
			</ol>
		</p>
		
		<p>The Boston Region MPO is not federally required to track this sidewalk-oriented metric—it monitors these for its own planning purposes. 
		</p>

		<h2> Bicycle Facilities </h2>
		
		<p>The 2011 bicycle facility data are from the 2011 MassDOT Road Inventory and 2011 MassDOT Bicycle Accommodation Inventory. 
		   The 2016 bicycle facility data are from the Metropolitan Area Planning Council's Bicycle and Pedestrian Mapping Index as of October 2016. 
		</p>
		
		<p>The 2016 bicycle facility data were taken from the Metropolitan Area Planning Council's Bicycle and Pedestrian Mapping Index, as of October 2016. 
		   These data were processed as follows:
		   	<ol>
				<li>Select information within the Boston Region MPO boundary.</li>
				<li>Select records for existing on-road facilities, 
				    i.e., those with fac_stat = 1 and (fac_type = 1 or fac_type = 2 or fac_type =3 or fac_type = 4 or fac_type = 7 or fac_type = 9),
                    and calculate the total number of miles per town.</li>
				<li>Select records for on-road facilities under contruction, 
				    i.e., those with fac_stat = 2 and (fac_type = 1 or fac_type = 2 or fac_type =3 or fac_type = 4 or fac_type = 7 or fac_type = 9),
                    and calculate the total number of miles per town.</li>
				<li>Select records for planned/envisioned on-road facilities, 
				    i.e., those with fac_stat = 3 and (fac_type = 1 or fac_type = 2 or fac_type =3 or fac_type = 4 or fac_type = 7 or fac_type = 9),
                    and calculate the total number of miles per town.</li>
				<li>Select records for existing off-road facilities, i.e., those with fac_stat = 1 and fac_type = 5,
                    and calculate the total number of miles per town.</li>
				<li>Select records for off-road facilities under construction, i.e., those with fac_stat = 2 and fac_type = 5,
                    and calculate the total number of miles per town.</li>
				<li>Select records for planned/envisioned off-road facilities, i.e., those with fac_stat = 3 and fac_type = 5,
                    and calculate the total number of miles per town.</li>
			</ol>
		</p>
		
		<p>The Boston Region MPO is not federally required to track these bicycle-oriented metrics—it monitors these for its own planning purposes. 
		</p>


		<h2> Demographics</h2>
		
		<p>All demographic data are reported at the US Census Bureau tract level. 
		   Data used in the dashboard were obtained from the 2010 decennial census when available. 
		   Data that were not available from that source were gathered from the 2010-14 American Community Survey (ACS).
		   Data sources for each demographic are as follows:
			<ul>
				<li>Over age 75: 2010 Decennial Census</li>
				<li>Unemployment: 2010-2014 ACS</li>
				<li>Race/ethnicity: 2010 Decennial Census</li>
				<li>Limited English Proficiency (LEP): 2010-2014 ACS</li>
				<li>Disability: 2010-2014 ACS</li>
				<li>Low-income: 2010-2014 ACS</li>
				<li>Female headed household with children: 2010 Decennial Census</li>
				<li>Zero vehicle household: 2010-2014 ACS</li>
			</ul>
		</p>
		
		<p>There are no federal performance management rules that require the Boston Region MPO to monitor this demographic information. 
		   However, the MPO tracks and incorporates these data into its transportation equity activities and reporting, which includes 
		   federal Title VI and environmental justice requirements.
		</p>
		
		<p>Note that data from the American Community Survey are population estimates only, 
		   while data from the U.S. Census are actual population counts.
		</p>

		<h3> A Note on Spatial Data </h3>
		<p> 
		The spatial data used in this dashboard was exported from ESRI ArcSDE, file geodatabase, or personal geodatabase
		feature classes to <a href="http://geojson.org/">GeoJSON</a> format. 
		Most GeoJSON data was then converted to <a href="https://github.com/topojson/topojson">TopoJSON</a> format, 
		a compressed, topology-preserving spatial data format, to improve performance.
		</p>

	</div>
		
	<div class="footer col-md-12">
			<?php include '../../components/footer.php';?>
	</div>
</div>

</body>
</html>
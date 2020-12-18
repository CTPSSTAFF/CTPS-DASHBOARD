# Contents of data/json directory

File name | Description | Notes
----------|-------------|------
boston_region_mpo_towns.topo.json | Geometry of towns in 101-town MPO, in TopoJSON format | 
boston_region_mpo_towns_97.geo.json | Geometry and attributes of towns in 97-town MPO, in GeoJSON format | 
boston_region_mpo_towns_97.topo.json | Geometry and attributes of towns in 97-town MPO, in TopoJSON fomrat | 
city_lane_avgs.JSON | __Unknown__ | Probably unused. |
CMP_2014_ART_ROUTES.topojson | Geometry and 2014 performance attributes of arterial routes in MPO region, in TopoJSON format. | This data was extracted from an ArcGIS feature class backed by an Oracle database, and attribute (property) names in __UPPERCASE__.  In addition to the attributes in the Oracle database, it includes an attribute named __NORMALIZEDSTART__ that was added after-the-fact;  the means used to compute the value of this field are __unknown__ as of the time of writing. It also includes an attribute named __RTE_NAME_ID__ which was apparently derived from joining the underlying attribute table with the arterial_route_id_table.csv (found in the directory ../csv) on the "RID" field, and copying the value of the "ROUTE" attribute in the joined table as the value of the newly-created "RTE_NAME_ID" attribute. The RTE_NAME_ATTRIBUTE is __not__ in the underlying Oracle database. 
CMP_2014_ART_ROUTES_EXT_MPO.geo.json | Geometry and 2014 performance attributes of arterial routes in MPO region in GeoJSON format. | This __appears__ to be the result of a direct conversion of CMP_2014_ART_ROUTES.topojson into GeoJSON format. |
CMP_2014_EXP_ROUTES.topojson | geometry and 2014 performance attributes of express routes in MPO region, in TopoJSON format; this data was extracted from an ArcGIS feature class backed by an Oracle database, and has attribute (property) names in __UPPERCASE__. |
cmp_2015_exp_routes_ext.geo.json | Geometry and 2015 performance attributes of express routes in MPO region in GeoJSON format; this data was extracted from an ArcGIS feature class backed by an Oracle database, and has attribute (property) names in __lowercase__. |
CTPS_CMP_2014_ART_ROUTES_postgresql.geo.json | Geometry and 2014 performance attributes of arterial routes in MPO region, in GeoJSON format; this data was extracted from an ArcGIS feature class backed by an PostgreSQL database, and attribute (property) names in __lowercase__. It currently does __ not__ includes an attribute named __NORMALIZEDSTART__. |
CTPS_CMP_2014_ART_ROUTES_postgresql.topo.json | Geometry and 2014 performance attributes of arterial routes in MPO region, in TopoJSON format; this data was extracted from an ArcGIS feature class backed by an PostgreSQL database, and attribute (property) names in __lowercase__. It currently does __not__ includes an attribute named __NORMALIZEDSTART__. |
CTPS_CMP_2019_EXP_ROUTES_postgresql.geo.json | Geometry and 2019 performance attributes of express routes in MPO region in GeoJSON format; this data was extracted from an ArcGIS feature class backed by an PostgreSQL database, and has attribute (property) names in __lowercase__. |
demographics_households.json | Household demographic data for 101-town MPO | 
demographics_households_97.geo.json | Household demographic data for 97-town MPO in GeoJSON format | 
demographics_households_97.topo.json | Household demographic data for 97-town MPO in TopoJSON format | 
demographics_population.json | Population demogratic data for 101-town MPO | 
demographics_population_97.geo.json | Population demographic data for 97-town MPO in GeoJSON format | 
demographics_population_97.topo.json | Population demographic data for 97-town MPO in TopoJSON format | 
equity.json | __Unknown__ | Probably unused. Can be deleted if unused.
Existing_Bicycle_Facilities.json | __Unknown__|  Can be deleted if unused.
exit_measures_in_MPO.json | __TBD__ |  Can be deleted if unused.
interstate_pavement_2015.topojson | 2015 interstate pavement condition data in TopoJSON format | Can be deleted if unused.
mpo_towns_stripped.topojson | __Unknown__ | Can be deleted if unused.
mpo_tracts_2012_with_2014_demographics_2_PCT.topojson | __Unknown__ | Can be deleted if unused.
PLAN_2035_DISTRICTS_EXTENDED.topojson | __Unknown__ | Can be deleted if unused.
psi_timeline.JSON | PSI "timeline" data in JSON format |  |
README.md | this file |  | 
road_inv_mpo_nhs_interstate_2015.geojson | __Unknown__| Can be deleted if unused.
town_census.topojson | __Unknown__ | Apparently unused. Can be deleted if unused. 
townregion.json | __Unknown__ | Can be deleted if unused.
tract_census.topojson | Census tract geometry, in TopoJSON format | Can be deleted if unused.
traffic_signals.topojson | Location and attributes of traffic signals in CTPS database. | __Unused. Can be deleted.__ 
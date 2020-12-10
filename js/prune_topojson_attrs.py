# prune_topojson_attrs.py
#
# For all 'geometries' in the input TopoJSON, prune all 'properties'
# *except* the HISPANIC_PCT_2010 property, and write out the resulting 
# TopoJSON object.
# Having done this, the result must be geometrically simplified 
# (a.k.a. 'compressed). The mechanism to do this wasn't documented
# by Beatrice, but I've more-or-less figured out what she did.
# The process is as follows:
# 1. Visit https://mapshaper.org
# 2. Load the TopoJSON output of running this Python script
# 3. Select "simplify", and specify (approximately) 75% simplification
# 5. Save the generated TopoJSON file, and rename it appropriately.
#
# -- Ben Krepp, attending metaphysician
#    10 December 2020

import json
# Set home_dir per your directory organization:
home_dir = r'c:/Users/ben_k/work_stuff/dashboard/prune_topojson_attrs/'
in_fn = 'demographics_population_97.topo.json'
full_in_fn = home_dir + in_fn

out_fn = 'tractmap_97towns_pruned.topojson'
full_out_fn = home_dir + out_fn

in_fp = open(full_in_fn)
out_fp = open(full_out_fn, 'w')

j = json.load(in_fp)

i = 0
# Delete all properties *except* HISPANIC_PCT_2010 from each geometry (i.e., tract).
for tract in j['objects']['tract_census_2']['geometries']:
	s = 'Deleting properties from tract ' + str(i)
	print(s)
	i = i + 1
	p = tract['properties']
	if 'AFRICAN_AMERICAN_POP_2010' in p:
		del p['AFRICAN_AMERICAN_POP_2010']
		
	if 'LEP_HH' in p:
		del p['LEP_HH']
		
	if 'VISION_DISABILITY_POP' in p:
		del p['VISION_DISABILITY_POP']
		
	if 'WHITE_PCT_2010' in p:
		del tract['properties']['WHITE_PCT_2010']
		
	if 'POP2010_5_PLUS' in p:
		del p['POP2010_5_PLUS']
		
	if 'MEDIAN_HH_INC' in p:
		del p['MEDIAN_HH_INC']
		
	if 'PACIFIC_ISLANDER_POP_2010' in p:
		del p['PACIFIC_ISLANDER_POP_2010']
	
	if 'AFRICAN_AMERICAN_PCT_2010' in p:
		del p['AFRICAN_AMERICAN_PCT_2010']
		
	if 'VIETNAMESE_LEP_POP' in p:
		del p['VIETNAMESE_LEP_POP']
		
	if 'POP_BELOW_2X_POVERTY_LVL' in p:
		del p['POP_BELOW_2X_POVERTY_LVL']
		
	if 'TOTAL_HH_2010' in p:
		del p['TOTAL_HH_2010']
	
	if 'MINORITY_PCT' in p:
		del p['MINORITY_PCT']
		
	if 'PCT_BELOW_2X_POVERTY_LEVEL' in p:
		del p['PCT_BELOW_2X_POVERTY_LEVEL']
		
	if 'CHINESE_LEP_POP' in p:
		del p['CHINESE_LEP_POP']
		
	if 'PACIFIC_ISLANDER_PCT_2010' in p:
		del p['PACIFIC_ISLANDER_PCT_2010']
		
	if 'MULTIPLE_RACE_PCT_2010' in p:
		del p['MULTIPLE_RACE_PCT_2010']
		
	if 'TOTAL_POP_2010' in p:
		del p['TOTAL_POP_2010']
		
	if 'PCT_75_PLUS' in p:
		del p['PCT_75_PLUS']
		
	if 'PCT_IN_LABOR_FORCE' in p:
		del p['PCT_IN_LABOR_FORCE']
		
	if 'VIETNAMESE_LEP_PCT' in p:
		del p['VIETNAMESE_LEP_PCT']
		
	if 'TOWN_ID' in p:
		del p['TOWN_ID']
		
	if 'COGNITIVE_DISABILITY_PCT' in p:
		del p['COGNITIVE_DISABILITY_PCT']
		
	if 'OTHER_RACE_POP_2010' in p:
		del p['OTHER_RACE_POP_2010']
		
	if 'HISPANIC_POP_2010' in p:
		del p['HISPANIC_POP_2010']
		
	if 'NATIVE_AMERICAN_PCT_2010' in p:
		del p['NATIVE_AMERICAN_PCT_2010']
	
	if 'OTHER_RACE_PCT_2010' in p:
		del p['OTHER_RACE_PCT_2010']
	
	if 'SELF_CARE_DISABILITY_POP' in p:
		del p['SELF_CARE_DISABILITY_POP']

	if 'ASIAN_PCT_2010' in p:
		del p['ASIAN_PCT_2010']
		
	if 'INDEP_LIVING_DISABILITY_PCT' in p:
		del p['INDEP_LIVING_DISABILITY_PCT']
		
	if 'HEARING_DISABILITY_PCT' in p:
		del p['HEARING_DISABILITY_PCT']
		
	if 'POP_75_PLUS' in p:
		del p['POP_75_PLUS']
		
	if 'FRENCH_CREOLE_LEP_POP' in p:
		del p['FRENCH_CREOLE_LEP_POP']
		
	if 'TRACT' in p:
		del p['TRACT']
		
	if 'LEP_POP' in p:
		del p['LEP_POP']
		
	if 'SPANISH_LEP_PCT' in p:
		del p['SPANISH_LEP_PCT']
		
	if 'PORTUGUESE_LEP_PCT' in p:
		del p['PORTUGUESE_LEP_PCT']
		
	if 'COUNTY' in p:
		del p['COUNTY']
		
	if 'COUSUB' in p:
		del p['COUSUB']
		
	if 'STATE' in p:
		del p['STATE']
		
	if 'SELF_CARE_DISABILITY_PCT' in p:
		del p['SELF_CARE_DISABILITY_PCT']
		
	if 'NATIVE_AMERICAN_POP_2010' in p:
		del p['NATIVE_AMERICAN_POP_2010']
	
	if 'COGNITIVE_DISABILITY_POP' in p:
		del p['COGNITIVE_DISABILITY_POP']
		
	if 'HEARING_DISABILITY_POP' in p:
		del p['HEARING_DISABILITY_POP']
		
	if 'AMBULATORY_DISABILITY_PCT' in p:
		del p['AMBULATORY_DISABILITY_PCT']
		
	if 'FRENCH_CREOLE_LEP_PCT' in p:
		del p['FRENCH_CREOLE_LEP_PCT']
		
	if 'GEOID' in p:
		del p['GEOID']
		
	if 'ALAND' in p:
		del p['ALAND']
		
	if 'TOWN' in p:
		del p['TOWN']
		
	if 'LAND_AREA' in p:
		del p['LAND_AREA']
		
	if 'POP2010_POVERTY_BASE' in p:
		del p['POP2010_POVERTY_BASE']
		
	if 'ASIAN_POP_2010' in p:
		del p['ASIAN_POP_2010']
		
	if 'SPANISH_LEP_POP' in p:
		del p['SPANISH_LEP_POP']
		
	if 'INDEP_LIVING_DISABILITY_POP' in p:
		del p['INDEP_LIVING_DISABILITY_POP']
		
	if 'LABOR_FORCE' in p:
		del p['LABOR_FORCE']
		
	if 'AMBULATORY_DISABILITY_POP' in p:
		del p['AMBULATORY_DISABILITY_POP']
		
	if 'MINORITY_POP' in p:
		del p['MINORITY_POP']
		
	if 'LEP_HH_PCT' in p:
		del p['LEP_HH_PCT']
		
	if 'ANY_DISABILITY_POP' in p:
		del p['ANY_DISABILITY_POP']
		
	if 'PORTUGUESE_LEP_POP' in p:
		del p['PORTUGUESE_LEP_POP']
		
	if 'LEP_POP_PCT' in p:
		del p['LEP_POP_PCT']
		
	if 'VISION_DISABILITY_PCT' in p:
		del p['VISION_DISABILITY_PCT']
		
	if 'POP_65_PLUS' in p:
		del p['POP_65_PLUS']
		
	if 'MULTIPLE_RACE_POP_2010' in p:
		del p['MULTIPLE_RACE_POP_2010']
		
	if 'WHITE_POP_2010' in p:
		del p['WHITE_POP_2010']
		
	if 'CHINESE_LEP_PCT' in p:
		del p['CHINESE_LEP_PCT']
	
	if 'AWATER' in p:
		del p['AWATER']
		
	if 'ANY_DISABILITY_PCT' in p:
		del p['ANY_DISABILITY_PCT']
		
	if 'PCT_65_PLUS' in p:
		del p['PCT_65_PLUS']
# end_for

json.dump(j, out_fp)
out_fp.close()
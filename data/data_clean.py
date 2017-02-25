import pandas as pd 
from pprint import pprint
import json

df = pd.DataFrame.from_csv('ph.csv')
index_p = {}
ignore = {"Pothole Patched": 0, " No Problem Found": 0, "No Potholes Found": 0, "Completed": 0, "Complete Upon Arrival": 0}



for index, row in df.iterrows():

	if ignore.get(row['MOST RECENT ACTION']) == None:
		
		try:
			street = row['STREET ADDRESS'].split()[1:]
			street = " ".join(street)
			location = row['LOCATION']
			if isinstance(location, float):
				continue
			if index_p.get(street) == None:
				index_p[street] = {}
				index_p[street]['num'] = 1
				index_p[street]['locations'] = {}
				index_p[street]['locations'][1] = location
			else:
				index_p[street]['num'] += 1
				index_p[street]['locations'][index_p[street]['num']] = location
		except AttributeError:
			pass

with open('street_ph.json', 'w') as datafile:
	json.dump(index_p, datafile, indent = 2)


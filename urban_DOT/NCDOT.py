#!/usr/bin/env python
# coding: utf-8

# In[2]:


import geopandas as gpd
import matplotlib.pyplot as plt
import folium


# In[3]:


counties = gpd.read_file(r'C:\Users\kenny\Documents\Python Scripts\NCDOT_County_Boundaries\NCDOT_County_Boundaries.shp')
urban = gpd.read_file(r'C:\Users\kenny\Documents\Python Scripts\2010_Census_Urban_Areas\2010_Census_Urban_Areas.shp')
pop = gpd.read_file(r'C:\Users\kenny\Documents\Python Scripts\2010_Census\2010_Census_Tracts.shp')


# In[57]:


counties.plot(column = 'DOTDivisio',edgecolor = 'black')
urban.plot()
pop.plot()


# In[5]:


counties.crs


# In[6]:


pop.crs


# In[7]:


urban.crs


# In[8]:


counties = counties.to_crs("EPSG:32119")
counties.crs


# In[59]:


pop_7 = gpd.overlay(urban,pop,how='intersection')
pop_7


# In[61]:


county_7 = counties[counties['DOTDivisio'] == 7]
urbanpop = gpd.clip(pop_7,county_7)


# In[54]:


column_name = {'name10': 'City', 'total_pop': 'Population'}
urbanpop = urbanpop.rename(columns = column_name)


# In[55]:


m = county_7.explore(
    tooltip='NAME')
urbanpop.explore(
   m=m,
   color='purple',
   tooltip={'City','Population'},
   tooltip_kwds=dict(labels=False)) 



# In[ ]:





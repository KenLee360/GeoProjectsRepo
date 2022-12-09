#!/usr/bin/env python
# coding: utf-8

# In[1]:


#The Goal of this notebook is to Predict Future Flight Delays. This is done using an Airline dataset that was found online. 


# In[2]:


#Import Libraries and convert CSV to Dataframe
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv(r'C:\Users\kenny\Downloads\archive\Airlines.csv')


# In[3]:


#Check null values
df.isnull().values.any()


# In[4]:


df.drop(columns=['id'], inplace=True)


# In[5]:


cols = df.columns
for i in range(0,len(cols)):
    print(df[cols[i]].value_counts(),'\n')
    print('********************************************\n')


# In[6]:


#Cleaning Up Days of Week Values
df["DayOfWeek"] = df["DayOfWeek"].replace([1,2,3,4,5,6,7],['Mon','Tues', 'Wed','Thurs','Fri','Sat','Sun'])


# In[7]:


#Fixing Time to Hours
df['Time_Hours'] = df['Time'] / 60


# In[8]:


#Creating a General range for Time field
departure_period = []
for i in range(0,len(df)):
    if ((df['Time_Hours'][i] >= 5) & (df['Time_Hours'][i] < 12)):      
        departure_period.append('Morning')
    elif ((df['Time_Hours'][i] >= 12) & (df['Time_Hours'][i] < 17)):    
        departure_period.append('Afternoon')
    elif ((df['Time_Hours'][i] >= 17) & (df['Time_Hours'][i] < 21)): 
        departure_period.append('Evening')
    else: 
        departure_period.append('Night')

df['Departure_period'] = departure_period


# In[9]:


df = df.drop(columns=['Time','Time_Hours'])


# In[10]:


df.drop_duplicates()


# In[11]:


#So We're checking for Delayed flights to see if there's any correlation, let's make a dataframe containing only delayed flights
df_delayed = df[df.Delay == 1]
df_delayed


# In[12]:


#We can delete the Delay Column
df_delayed.drop(columns = ['Delay'])


# In[13]:


#Curious to see which times were most delayed
#Start by checking the departure periods. 

a = df_delayed.loc[df_delayed.Departure_period == 'Morning', 'Departure_period'].count()
b = df_delayed.loc[df_delayed.Departure_period == 'Afternoon', 'Departure_period'].count()
c = df_delayed.loc[df_delayed.Departure_period == 'Evening', 'Departure_period'].count()
d = df_delayed.loc[df_delayed.Departure_period == 'Night', 'Departure_period'].count()

counted_departure = [a,b,c,d]
labels_departure = ['Morning','Afternoon','Evening','Night']

plt.pie(counted_departure, labels = labels_departure)
plt.show


# In[22]:


#In this dataset most flights are delayed in the afternoon time-frame.
df_afternoon = df_delayed[df_delayed.Departure_period =='Afternoon']
df_afternoon.drop(columns = ['Delay','Departure_period'])

#Counts to Show Greatest Day/Time Combo


# In[45]:


num = df_afternoon['DayOfWeek'].value_counts().values
word = df_afternoon['DayOfWeek'].value_counts().index


plt.bar(word,num,0.4,)
plt.show()


# In[46]:


#Looks like Wednesday and Thursday Afternoon according to this dataset are the most likely times where a flight would be delayed


# In[ ]:





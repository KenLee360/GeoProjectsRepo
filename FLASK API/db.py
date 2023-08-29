import pyodbc

server = 'LAPTOP-43TRFT32'
database = 'WebApp'
conn_string = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';Trusted_Connection=yes'

connection = pyodbc.connect(conn_string)
cursor = connection.cursor

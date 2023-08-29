from flask import Flask, render_template, request, redirect
from db import cursor


app = Flask(__name__)
 
@app.route('/')
def get_data():
        query = 'SELECT * FROM WebApp.dbo.Airlines WHERE id <= 100'
        cursor.execute(query)
        data = []
        for row in cursor.fetchall():
            data.append({"id": row[0],"Airline": row[1],"Flight": row[2],"AirportFrom": row[3],"AirportTo": row[4],
                     "DayOfWeek": row[5],"Time": row[6],"Length": row[7],"Delay": row[8]})
        return render_template("airline.html", data = data)


@app.route('/edit/<id>', methods = ['GET','POST'])
def update(id):
    ed = []
    if request.method == 'GET':
        cursor.execute('SELECT * FROM WebApp.dbo.Airlines WHERE id = ?', id)
        for row in cursor.fetchall():
            ed.append({"id": row[0],"Airline": row[1],"Flight": row[2],"AirportFrom": row[3],"AirportTo": row[4],
                     "DayOfWeek": row[5],"Time": row[6],"Length": row[7],"Delay": row[8]})
        return render_template("edit_record.html", data = ed[0])
    if request.method == 'POST':
        air = str(request.form["Airline"])
        fly = int(request.form["Flight"])
        airfrom = str(request.form["AirportFrom"])
        airto = str(request.form["AirportTo"])
        day = int(request.form["DayOfWeek"])
        time = int(request.form["Time"])
        len = int(request.form["Length"])
        delay = bool(request.form["Delay"])
        cursor.execute("UPDATE WebApp.dbo.Airlines SET Airline = ?, Flight = ?, AirportFrom = ?, AirportTo = ?, DayOfWeek = ?, Time = ?, Length = ?, Delay = ? WHERE id = ?"
                       , air, fly, airfrom, airto, day, time, len, delay, id)
        return redirect('/')


if __name__ == '__main__':
    app.run(debug=True)
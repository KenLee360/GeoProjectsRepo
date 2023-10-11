var config = require('./dbconfig');
const sql = require('mssql/msnodesqlv8');


async function getFlights() {
    try {
        let pool = await sql.connect(config);
        let flights = await pool.request().query('SELECT TOP 10 * FROM WebApp.dbo.Airlines');
        return flights.recordsets;
    } 
    catch {
        console.log("Couldn't retrieve all flights");
    }
}


async function getFlight(Id) {
    try {
        let pool = await sql.connect(config);
        let flight = await pool.request()
            .input('Id', sql.Int, Id)
            .query('SELECT * FROM WebApp.dbo.Airlines WHERE id = @Id');
        return flight.recordsets;
    } 
    catch {
        console.log("Couldn't retrieve single flight");
    }
}

async function updateFlight(Airline) {
    try {
        let pool = await sql.connect(config);
        let update = await pool.request()
            .input('Id', sql.Int, Airline.Id)
            .input('Airline', sql.NVarChar, Airline.Airline)
            .input('Flight', sql.SmallInt, Airline.Flight)
            .input('AirFrom', sql.NVarChar, Airline.AirportFrom)
            .input('AirTo', sql.NVarChar, Airline.AirportTo)
            .input('DOW', sql.TinyInt, Airline.DayOfWeek)
            .input('Time', sql.SmallInt, Airline.Time)
            .input('Length', sql.SmallInt, Airline.Length)
            .input('Delay', sql.Bit, Airline.Delay)
            .query("UPDATE WebApp.dbo.Airlines SET Airline=@Airline, Flight=@Flight, AirportFrom=@AirFrom, AirportTo=@AirTo, DayOfWeek=@DOW, Time=@Time, Length=@Length, Delay=@Delay WHERE Id=@Id");
        return update.recordsets;
    }
    catch {
        console.log("Couldn't update flight");
    }
}



module.exports = {
    getFlights : getFlights ,
    getFlight : getFlight,
    updateFlight : updateFlight
}
class Airline{
    constructor(Id,Airline,Flight,AirportFrom,AirportTo,DayOfWeek,Time,Length,Delay){
        this.Id = Id;
        this.Airline = Airline;
        this.Flight = Flight;
        this.AirportFrom = AirportFrom;
        this.AirportTo = AirportTo;
        this.DayOfWeek = DayOfWeek;
        this.Time = Time;
        this.Length = Length;
        this.Delay = Delay;
    }
}

module.exports = Airline;
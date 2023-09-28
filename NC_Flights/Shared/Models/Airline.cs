using System;
using System.Collections.Generic;

namespace NC_Flights.Shared;

public partial class Airline
{
    public int Id { get; set; }

    public string Airline1 { get; set; } = null!;

    public short Flight { get; set; }

    public string AirportFrom { get; set; } = null!;

    public string AirportTo { get; set; } = null!;

    public byte DayOfWeek { get; set; }

    public short Time { get; set; }

    public short Length { get; set; }

    public bool Delay { get; set; }
}

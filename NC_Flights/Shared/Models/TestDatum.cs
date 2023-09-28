using System;
using System.Collections.Generic;

namespace NC_Flights.Shared;

/// <summary>
/// This is a test table for VS Web App .NET
/// </summary>
public partial class TestDatum
{
    public string Name { get; set; } = null!;

    public string? Age { get; set; }

    public DateTime LastChangeDate { get; set; }

    public string Role { get; set; } = null!;
}

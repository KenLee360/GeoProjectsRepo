using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NC_Flights.Shared.Models
{
    public partial class AirportsDTO
    {
        public int Id { get; set; }
        public string AirportTo { get; set; } = null!;

    }
}

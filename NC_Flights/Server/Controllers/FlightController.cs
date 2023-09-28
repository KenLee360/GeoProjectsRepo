using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NC_Flights.Server.Data;
using NC_Flights.Shared;
using System.Linq;

namespace NC_Flights.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FlightController : ControllerBase
    {
        private readonly WebAppContext _context;

        public FlightController(WebAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<AirlinesNc>>> GetFlights()
        {
            var flights = await _context.AirlinesNcs
                .Where(p => p.Id < 40000)
                .ToListAsync();
            return flights;
        }

        [HttpGet("list")]
        public async Task<ActionResult<List<AirlinesNc>>> GetFlightsList()
        {
            var flights = await _context.AirlinesNcs
                .Where(l => l.Id < 40000)
                .GroupBy(l => l.AirportTo)
                .Select(l => l.First())
                .ToListAsync();
            return flights;
        }


        [HttpGet("{id:int}")]
        public async Task<ActionResult<AirlinesNc>> GetById(int id)
        {
            var result = await _context.AirlinesNcs.FindAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return result;
        }


        [HttpGet("{search}")]
        public async Task<ActionResult<IEnumerable<AirlinesNc>>> GetByAirport(string airport)
        {
            IQueryable<AirlinesNc> query = _context.AirlinesNcs;

            if (!string.IsNullOrEmpty(airport))
            {
                query = query.Where(p => p.AirportFrom.Contains(airport) || p.AirportTo.Contains(airport));
            }
            return await query.ToListAsync();
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<AirlinesNc>> UpdateFlight(int id, AirlinesNc flight)
        {
            var record = await _context.AirlinesNcs.FindAsync(id);
            if (record == null)
            {
                return NotFound("No record was found to update");
            } else if (record.Id != flight.Id)
            {
                return BadRequest("Id mismatch");
            }

            record.Id = flight.Id;
            record.Airline = flight.Airline;
            record.Flight = flight.Flight;
            record.AirportFrom = flight.AirportFrom;
            record.AirportTo = flight.AirportTo;
            record.DayOfWeek = flight.DayOfWeek;
            record.Time = flight.Time;
            record.Length = flight.Length;
            record.Delay = flight.Delay;

            await _context.SaveChangesAsync();
            return record;
        }



    }
}

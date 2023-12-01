using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using NC_Flights.Server.Data;
using NC_Flights.Shared;
using NC_Flights.Shared.Models;

namespace NC_Flights.Server.Services.AirlinesNCService
{
    public class AirlinesNCService : IAirlinesNCService
    {
        private readonly WebAppContext _context;
        public AirlinesNCService(WebAppContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AirlinesNc>> GetByAirport(string airport)
        {
            IQueryable<AirlinesNc> query = _context.AirlinesNcs;

            if (!string.IsNullOrEmpty(airport))
            {
                query = query.Where(p => p.AirportFrom.Contains(airport) || p.AirportTo.Contains(airport));
            }
            return await query.ToListAsync();
        }

        public async Task<AirlinesNc?> GetById(int id)
        {
            var result = await _context.AirlinesNcs.FindAsync(id);
            if (result == null)
            {
                return null;
            }
            return result;
        }

        public async Task<List<AirlinesNc>> GetFlights()
        {
            var flights = await _context.AirlinesNcs.ToListAsync();
            return flights;
        }

        public async Task<List<string>> GetFlightsList()
        {
            //var flights = await _context.AirlinesNcs
            //    .Where(l => l.Id < 40000)
            //    .GroupBy(l => l.AirportTo)
            //    .Select(l => l.First())
            //    .ToListAsync();

            var flights = await _context.AirlinesNcs.ToListAsync();
            var values = flights.Select(f => f.AirportTo).ToList();

            return values;

        }

        public async Task<AirlinesNc?> UpdateFlight(int id, AirlinesNc flight)
        {
            var record = await _context.AirlinesNcs.FindAsync(id);
            if (record == null)
            {
                return null;
            }
            else if (record.Id != flight.Id)
            {
                return null;
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

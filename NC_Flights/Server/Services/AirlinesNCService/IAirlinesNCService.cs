using NC_Flights.Shared;
using NC_Flights.Server.Data;

namespace NC_Flights.Server.Services.AirlinesNCService
{
    public interface IAirlinesNCService
    {
        Task<List<AirlinesNc>> GetFlights();
        Task<List<string>> GetFlightsList();
        Task<AirlinesNc?> GetById(int id);
        Task<IEnumerable<AirlinesNc>> GetByAirport(string airport);
        Task<AirlinesNc?> UpdateFlight(int id, AirlinesNc flight);
    }
}

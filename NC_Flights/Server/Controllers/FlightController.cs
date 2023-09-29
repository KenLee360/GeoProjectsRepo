using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NC_Flights.Server.Data;
using NC_Flights.Shared;
using System.Linq;
using NC_Flights.Server.Services.AirlinesNCService;

namespace NC_Flights.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FlightController : ControllerBase
    {
        private readonly IAirlinesNCService _airlinesNCservice;

        public FlightController(IAirlinesNCService airlinesNCService)
        {
            _airlinesNCservice = airlinesNCService;
        }

        [HttpGet]
        public async Task<ActionResult<List<AirlinesNc>>> GetFlights()
        {
            return await _airlinesNCservice.GetFlights();
        }

        [HttpGet("list")]
        public async Task<ActionResult<List<AirlinesNc>>> GetFlightsList()
        {
            return await _airlinesNCservice.GetFlightsList();
        }


        [HttpGet("{id:int}")]
        public async Task<ActionResult<AirlinesNc>> GetById(int id)
        {

            var result = await _airlinesNCservice.GetById(id);
            if (result == null)
            {
                return NotFound("Couldn't find Flight by Id");
            }
            return result;
        }


        [HttpGet("{search}")]
        public async Task<ActionResult<IEnumerable<AirlinesNc>>> GetByAirport(string airport)
        {
            var search = await _airlinesNCservice.GetByAirport(airport);
            if(search.Any())
            {
                return Ok(search);
            }
            return NotFound("Couldn't Find any Airports.");
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<AirlinesNc>> UpdateFlight(int id, AirlinesNc flight)
        {
            var record = await _airlinesNCservice.UpdateFlight(id , flight);
            if (record == null)
            {
                return NotFound("No record was found to update");
            } else if (record.Id != flight.Id)
            {
                return BadRequest("Id mismatch");
            }

            return record;
        }



    }
}

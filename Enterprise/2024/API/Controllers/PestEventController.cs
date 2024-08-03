using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Per.Data.Access;
using Per.Data.Context;
using Per.Data.Models;
using Host = Per.Data.Models.Host;

namespace Per.Application.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PestEventController : ControllerBase
    {
        private PestEventAccess _access;
        
        public PestEventController(PerDBContext context)
        {
            _access = new PestEventAccess(context);
        }

        //Get PestEvents
        [HttpGet]
        [Route("GetPestEvents")]
        public async Task<ActionResult> GetPestEvents()
        {
            var events = await _access.GetAllPestEvents();
            if (!events.Any())
                return NotFound();
            return Ok(events);
        }

        [HttpGet]
        [Route("GetPestEventUpdates")]
        public async Task<ActionResult> GetPestEventUpdates(DateTime update)
        {
            var events = await _access.GetUpdatedPestEvents(update);
            if (events.Any())
                return Ok(new List<PestEvent>());
            return Ok(events);
        }


        [HttpGet]
        [Route("GetPestEvent")]
        public async Task<ActionResult> GetPestEvent(long pestEventId)
        {
            var pests = await _access.GetById(pestEventId);
            if (pests == null)
                return NotFound();
            return Ok(pests);
        }

        // Create
        [HttpPost]
        public async Task<ActionResult> Create(PestEvent pestevent)
        {
            try
            {
                var newevent = await _access.CreatePestEvent(pestevent);
                return Ok(newevent);
            }
            catch(Exception)
            {
                throw;
            }
           
        }

        //Update
        [HttpPut]
        public async Task<ActionResult> Update(PestEvent pestEvent)
        {
            try
            {

                var newevent = await _access.UpdatePestEvent(pestEvent);
                return Ok(newevent);
            }
            catch (Exception)
            {
                throw;
            }
        }


    }
}

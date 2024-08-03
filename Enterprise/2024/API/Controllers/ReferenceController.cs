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
    public class ReferenceController : ControllerBase
    {
        private ReferenceAccess _access;
        
        public ReferenceController(PerDBContext context)
        {
            _access = new ReferenceAccess(context);
        }

        //Get DamageAgents
        [HttpGet]
        [Route("GetDamageAgents")]
        public async Task<ActionResult> GetDamageAgents()
        {
            var agents = await _access.GetAllDamageAgents();
            if (!agents.Any())
                return NotFound();
            return Ok(agents);
        }

        //Get DamageAgent By Id
        [HttpGet]
        [Route("GetDamageAgent")]
        public async Task<ActionResult> GetDamageAgent(int daCode)
        {
            var damageAgent = await _access.GetDamageAgentById(daCode);
            if (damageAgent == null) return NotFound();
            return Ok(damageAgent);
        }

        [HttpGet]
        [Route("GetDamageAgentUpdates")]
        public async Task<ActionResult> GetDamageAgentUpdates(DateTime update)
        {
            var agents = await _access.GetUpdatedDamageAgents(update);
            if (agents.Any())
                return Ok(new List<DamageAgent>());
            return Ok(agents);
        }

        //Get FsRegions
        [HttpGet]
        [Route("GetRegions")]
        public async Task<ActionResult> GetRegions()
        {
            var regions = await _access.GetAllRegions();
            if (!regions.Any())
                return NotFound();
            return Ok(regions);
        }

        [HttpGet]
        [Route("GetRegionUpdates")]
        public async Task<ActionResult> GetRegionUpdates(DateTime update)
        {
            var regions = await _access.GetUpdatedRegions(update);
            if (!regions.Any())
                return Ok(new List<FsRegion>());
            return Ok(regions);
        }

        //Get Hosts
        [HttpGet]
        [Route("GetHosts")]
        public async Task<ActionResult> GetHosts()
        {
            var hosts = await _access.GetAllHosts();
            if (!hosts.Any())
                return NotFound();
            return Ok(hosts);
        }

        [HttpGet]
        [Route("GetHostUpdates")]
        public async Task<ActionResult> GetHostUpdates(DateTime update)
        {
            var hosts = await _access.GetUpdatedHosts(update);
            if (!hosts.Any())
                return Ok(new List<Host>());
            return Ok(hosts);
        }

        //Get Settings
        [HttpGet]
        [Route("GetSettings")]
        public async Task<ActionResult> GetSettings()
        {
            var settings = await _access.GetAllSettings();
            if (!settings.Any())
                return NotFound();
            return Ok(settings);
        }

        //Get Settings
        [HttpGet]
        [Route("GetSettingUpdates")]
        public async Task<ActionResult> GetSettingUpdates(DateTime update)
        {
            var settings = await _access.GetUpdatedSettings(update);
            if (!settings.Any())
                return Ok(new List<Setting>());
            return Ok(settings);
        }

        //Get SurveyMethods
        [HttpGet]
        [Route("GetSurveyMethods")]
        public async Task<ActionResult> GetSurveyMethods()
        {
            var surveys = await _access.GetAllSurveyMethods();
            if (!surveys.Any())
                return NotFound();
            return Ok(surveys);
        }

        [HttpGet]
        [Route("GetSurveyMethodUpdates")]
        public async Task<ActionResult> GetSurveyMethodUpdates(DateTime update)
        {
            var surveys = await _access.GetUpdatedSurveyMethods(update);
            if (!surveys.Any())
                return Ok(new List<SurveyMethod>());
            return Ok(surveys);
        }

        [HttpGet]
        [Route("GetCounties")]
        public async Task<ActionResult> GetCounties()
        {
            var counties = await _access.GetAllCounties();
            if (!counties.Any())
                return NotFound();
            return Ok(counties);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Per.Data.Context;
using Per.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace Per.Data.Access
{
    public class ReferenceAccess : BaseAccess
    {
        public ReferenceAccess(PerDBContext context) : base(context) { }

        public async Task<List<Setting>> GetAllSettings()
        {
            try
            {
                var result = await _context.Settings.ToListAsync();
                return result;
            }
            catch (Exception ex) 
            {
                throw;
            }
        }

        public async Task<List<Setting>> GetUpdatedSettings(DateTime update)
        {
            var result = await _context.Settings.Where(x=>x.LastUpdated>=update).ToListAsync();
            return result;
        }

        public async Task<List<FsRegion>> GetAllRegions()
        {
            try
            {
                var result = await _context.FsRegions.ToListAsync();
                return result;
            }
            catch (Exception ex) 
            { 
                throw;
            }
        }

        public async Task<List<FsRegion>> GetUpdatedRegions(DateTime update)
        {
            var result = await _context.FsRegions.Where(x=>x.LastUpdated >=update).ToListAsync();
            return result;
        }

        public async Task<List<DamageAgent>> GetAllDamageAgents()
        {
            try
            {
                var result = await _context.DamageAgents.ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //Method to get Damagent by DamageAgent_Code
        public async Task<DamageAgent?> GetDamageAgentById(int daCode)
        {
            return await _context.DamageAgents.FindAsync(daCode);
        }

        public async Task<List<DamageAgent>> GetUpdatedDamageAgents(DateTime update)
        {
            try
            {
                var result = await _context.DamageAgents.Where(x=>x.LastUpdated>=update).ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<List<Host>> GetAllHosts()
        {
            try
            {
                var result = await _context.Hosts.ToListAsync();
                return result;
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        public async Task<List<Host>> GetUpdatedHosts(DateTime update)
        {
            var result = await _context.Hosts.Where(x=>x.LastUpdated>=update).ToListAsync();
            return result;
        }

        public async Task<List<SurveyMethod>> GetAllSurveyMethods()
        {
            try
            {
                var result = await _context.SurveyMethods.ToListAsync();
                return result;
            }
            catch(Exception ex) 
            {
                throw;
            }
        }
        public async Task<List<SurveyMethod>> GetUpdatedSurveyMethods(DateTime update)
        {
            var result = await _context.SurveyMethods.Where(x=>x.LastUpdated>=update).ToListAsync();
            return result;
        }


        public async Task<List<County>> GetAllCounties()
        {
            try
            {
                var result = await _context.Counties.ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Per.Data.Context;
using Per.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Per.Data.Access
{
    public class PestEventAccess : BaseAccess
    {
        public PestEventAccess(PerDBContext context) : base(context) { }

        public async Task<List<PestEvent>> GetAllPestEvents()
        {
            try
            {
                var result = await _context.PestEvents.ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<List<PestEvent>> GetUpdatedPestEvents(DateTime update)
        {
            try
            {
                var result = await _context.PestEvents.Where(x => x.LastEditedDate >= update).ToListAsync();
                return result;
            }
            catch(Exception ex)
            { 
                throw;
            }
        }

        public async Task<PestEvent?> GetById(long pestEventid)
        {
            try
            {
                var result = await _context.PestEvents.FindAsync(pestEventid);
                if (result == null)
                {
                    return null;
                }
                
                return result;
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        public async Task<PestEvent> CreatePestEvent(PestEvent pestEvent)
        {
            try
            {
                await _context.PestEvents.AddAsync(pestEvent);

                await _context.SaveChangesAsync();

                return pestEvent;



            }
            catch(Exception)
            {
                throw;
            }
        }

        public async Task<PestEvent> UpdatePestEvent(PestEvent pestEvent)
        {
            try
            {
                var existing = await _context.PestEvents.Where(x => x.PestEventId == pestEvent.PestEventId).FirstOrDefaultAsync();

                if (existing != null)
                {
                    _context.PestEvents.Remove(existing);
                    await _context.AddAsync(pestEvent);
                    await _context.SaveChangesAsync();
                }

                return pestEvent;



            }
            catch (Exception)
            {
                throw;
            }

        }
    }
}

using DvdRental.Server.Data;
using DvdRental.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace DvdRental.Server.Services.Actor
{
    public class ActorService : IActorService
    {
        private readonly DvdRentalDBContext _context;
        public ActorService(DvdRentalDBContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<actor>> GetAllActorsAsync()
        {
            return await _context.actors.ToListAsync();
        }
        public async Task<actor?> GetActorByIdAsync(int id)
        {
            return await _context.actors.FindAsync(id);
        }
        public async Task<actor> CreateActorAsync(actor actor)
        {
            _context.actors.Add(actor);
            await _context.SaveChangesAsync();
            return actor;
        }
        public async Task<actor?> UpdateActorAsync(int id, actor actor)
        {
            if (id != actor.actor_id)
                return null;
            _context.Entry(actor).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return actor;
        }
        public async Task<bool> DeleteActorAsync(int id)
        {
            var actor = await GetActorByIdAsync(id);
            if (actor == null)
                return false;
            _context.actors.Remove(actor);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

using DvdRental.Server.Data;
using DvdRental.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace DvdRental.Server.Services.Film
{
    public class FilmService : IFilmService
    {
        private readonly DvdRentalDBContext _context;
        public FilmService(DvdRentalDBContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<film>> GetAllFilmsAsync()
        {
            return await _context.films.ToListAsync();
        }
        public async Task<film?> GetFilmByIdAsync(int id)
        {
            return await _context.films.FindAsync(id);
        }
        public async Task<film> CreateFilmAsync(film film)
        {
            _context.films.Add(film);
            await _context.SaveChangesAsync();
            return film;
        }
        public async Task<film?> UpdateFilmAsync(int id, film film)
        {
            if (id != film.film_id)
                return null;
            _context.Entry(film).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return film;
        }
        public async Task<bool> DeleteFilmAsync(int id)
        {
            var film = await GetFilmByIdAsync(id);
            if (film == null)
                return false;
            _context.films.Remove(film);
            await _context.SaveChangesAsync();
            return true;

        }
    }
}

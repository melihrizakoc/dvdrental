using DvdRental.Server.Models;

namespace DvdRental.Server.Services.Film
{
    public interface IFilmService
    {
        Task<IEnumerable<film>> GetAllFilmsAsync();
        Task<film?> GetFilmByIdAsync(int id);
        Task<film> CreateFilmAsync(film film);
        Task<film?> UpdateFilmAsync(int id, film film);
        Task<bool> DeleteFilmAsync(int id);
    }
}

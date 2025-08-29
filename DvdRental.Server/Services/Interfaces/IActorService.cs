using DvdRental.Server.Models;

namespace DvdRental.Server.Services.Actor
{
    public interface IActorService
    {
        Task<IEnumerable<actor>> GetAllActorsAsync();
        Task<actor?> GetActorByIdAsync(int id);
        Task<actor> CreateActorAsync(actor actor);
        Task<actor?> UpdateActorAsync(int id, actor actor);
        Task<bool> DeleteActorAsync(int id);
    }
}

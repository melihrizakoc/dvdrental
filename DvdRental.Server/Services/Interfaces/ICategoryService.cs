using DvdRental.Server.Models;

namespace DvdRental.Server.Services.Category
{
    public interface ICategoryService
    {
        Task<IEnumerable<category>> GetAllCategoriesAsync();
        Task<category?> GetCategoryByIdAsync(int id);
        Task<category> CreateCategoryAsync(category category);
        Task<category?> UpdateCategoryAsync(int id, category category);
        Task<bool> DeleteCategoryAsync(int id);

    }
}

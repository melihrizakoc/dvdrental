using DvdRental.Server.Data;
using DvdRental.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace DvdRental.Server.Services.Category
{
    public class CategoryService : ICategoryService
    {
        private readonly DvdRentalDBContext _context;
        public CategoryService(DvdRentalDBContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<category>> GetAllCategoriesAsync()
        {
            return await _context.categories.ToListAsync();
        }
        public async Task<category?> GetCategoryByIdAsync(int id)
        {
            return await _context.categories.FindAsync(id);
        }
        public async Task<category> CreateCategoryAsync(category category)
        {
            _context.categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }
        public async Task<category?> UpdateCategoryAsync(int id, category category)
        {
            if (id != category.category_id)
                return null;
            _context.Entry(category).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return category;
        }
        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await GetCategoryByIdAsync(id);
            if (category == null)
                return false;
            _context.categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}

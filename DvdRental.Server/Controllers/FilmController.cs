using DvdRental.Server.Data;
using DvdRental.Server.Models;
using DvdRental.Server.Services.Film;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DvdRental.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilmController : ControllerBase
    {
        private readonly IFilmService _filmService;

        public FilmController(IFilmService filmService)
        {
            _filmService = filmService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<film>>> GetAllFilms()
        {
            var films = await _filmService.GetAllFilmsAsync();
            return Ok(films);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<film>> GetFilm(int id)
        {
            var film = await _filmService.GetFilmByIdAsync(id);

            if (film == null)
                return NotFound();
            return Ok(film);
        }

        [HttpPost]
        public async Task<ActionResult<film>> CreateFilm(film film)
        {
            var createdFilm = await _filmService.CreateFilmAsync(film);
            return CreatedAtAction(nameof(GetFilm), new { id = createdFilm.film_id }, createdFilm);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFilmAsync(int id, film film)
        {
            if (id != film.film_id)
            {
                return BadRequest("Film ID mismatch.");
            }
            var updatedFilm = await _filmService.UpdateFilmAsync(id, film);
            if (updatedFilm == null)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFilm(int id)
        {
            var result = await _filmService.DeleteFilmAsync(id);
            if (!result)
            {
                return NotFound("Film not found.");
            }
            return NoContent();
        }

    }
}

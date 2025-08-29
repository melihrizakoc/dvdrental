using DvdRental.Server.Data;
using DvdRental.Server.Models;
using DvdRental.Server.Services.Actor;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DvdRental.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActorController : ControllerBase
    {
        private readonly IActorService _actorService;

        public ActorController(IActorService actorService)
        {
            _actorService = actorService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<actor>>> GetAllActors()
        {
            var actors = await _actorService.GetAllActorsAsync();
            return Ok(actors);

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<actor>> GetActor(int id)
        {
            var actor = await _actorService.GetActorByIdAsync(id);

            if (actor == null)
            {
                return NotFound();
            }
            return Ok(actor);
        }

        [HttpPost]
        public async Task<ActionResult<actor>> CreateActor(actor actor)
        {
            var createdActor = await _actorService.CreateActorAsync(actor);
            return CreatedAtAction(nameof(GetActor), new { id = createdActor.actor_id }, createdActor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActor(int id, actor actor)
        {
            if (id != actor.actor_id)
            {
                return BadRequest("Actor ID mismatch.");
            }
            var updatedActor = await _actorService.UpdateActorAsync(id, actor);
            if (updatedActor == null)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActor(int id)
        {
            var result = await _actorService.DeleteActorAsync(id);
            if (!result)
            {
                return NotFound("Actor not found.");
            }
            return NoContent();

        }

    }
}

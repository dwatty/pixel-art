using Microsoft.AspNetCore.Mvc;
using Orleans;
using PixelArt.Grains;

namespace PixelArt.Controllers
{
    public class InputVM
    {
        public string Color { get; set; }
        public string Id { get;set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class PixelController : ControllerBase
    {
        private readonly IGrainFactory _grainFactory;

        public PixelController(IGrainFactory grainFactory) => _grainFactory = grainFactory;

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var pixel = _grainFactory.GetGrain<IPixelGrain>(id);
            var pixelState = await pixel.GetState();
            return Ok(pixelState);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put([FromRoute]string id, [FromBody]InputVM input)
        {
            var pixel = _grainFactory.GetGrain<IPixelGrain>(id);
            await pixel.ChangeColor(input.Color);
            return Ok();
        }

    }
}
using Orleans;

namespace PixelArt.Grains
{
    
    public class PixelGrain : Grain, IPixelGrain
    {
        public PixelState _pixelState;
        private readonly Random _random = new Random();  


        public override Task OnActivateAsync()
        {
            Console.WriteLine("Activating");
            _pixelState = new PixelState();

            var c = _random.Next(0, 5);
            switch(c) {
                case 0: _pixelState.Color = "black"; break;
                case 1: _pixelState.Color ="red"; break;
                case 2: _pixelState.Color = "blue"; break;
                case 3: _pixelState.Color = "yellow"; break;
                case 4: _pixelState.Color = "purple"; break;
                default: _pixelState.Color = "orange"; break;
            }

            return base.OnActivateAsync();
        }

        public override Task OnDeactivateAsync()
        {
            Console.WriteLine("Deactivating");
            return base.OnDeactivateAsync();
        }


        public Task<PixelState> ChangeColor(string color)
        {
            _pixelState.Color = color;            
            return Task.FromResult(_pixelState);
        }

        public Task<PixelState> GetState() => Task.FromResult(_pixelState);
    }
}
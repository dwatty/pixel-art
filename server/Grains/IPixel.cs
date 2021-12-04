using Orleans;

namespace PixelArt.Grains
{
    public interface IPixelGrain : IGrainWithStringKey
    {
        Task<PixelState> GetState();
        Task<PixelState> ChangeColor(string color);
    }

    [Serializable]
    public struct PixelState
    {
        public string Color { get; set; }

    }
}
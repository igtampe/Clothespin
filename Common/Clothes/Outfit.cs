using Igtampe.Clothespin.Common.Clothes.Items;

namespace Igtampe.Clothespin.Common.Clothes {

    /// <summary>Holds an outfit (either a predetermined saved one, or a single use one)</summary>
    public class Outfit : Identifiable, Nameable, Describable {

        /// <summary>Name of this outfit</summary>
        public string Name { get; set; } = "";

        /// <summary>Description of this outfit</summary>
        public string Description { get; set; } = "";

        /// <summary>Shirt worn on this outfit</summary>
        public Shirt? Shirt { get; set; }

        /// <summary>Pants worn on this outfit</summary>
        public Pants? Pants { get; set; }

        /// <summary>Belt worn on this outfit</summary>
        public Belt? Belt { get; set; }

        /// <summary>Shoes worn on this outfit</summary>
        public Shoes? Shoes { get; set; }

        /// <summary>Socks worn on this outfit</summary>
        public Socks? Socks { get; set; }

        /// <summary>List of overshirt items worn on this outfit</summary>
        public List<Overshirt> Overshirts { get; set; } = new();

        /// <summary>List of accessories worn on this outfit</summary>
        public List<Accessory> Accessories { get; set; } = new();

    }
}

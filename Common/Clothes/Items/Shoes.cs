using Igtampe.Clothespin.Common.Clothes.Sizes;
using Igtampe.Clothespin.Common.Clothes.Types;

namespace Igtampe.Clothespin.Common.Clothes.Items {

    /// <summary>Holds a pair of shoes</summary>
    public class Shoes : Wearable<ShoeType>, DistinguishableSizable {

        /// <summary>Distinguisher for these shoes</summary>
        public SizeDistinguisher Distinguisher { get; set; } = SizeDistinguisher.UNIVERSAL;

        /// <summary>Size of this Shoe</summary>
        public string Size { get; set; } = "";

        /// <summary>Region of the size of this overshirt</summary>
        public string Region { get; set; } = "";

    }
}

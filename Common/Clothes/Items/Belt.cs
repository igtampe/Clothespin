using Igtampe.Clothespin.Common.Clothes.Sizes;
using Igtampe.Clothespin.Common.Clothes.Types;

namespace Igtampe.Clothespin.Common.Clothes.Items {

    /// <summary>Holds a Belt</summary>
    public class Belt : Wearable<BeltType>, Sizable {

        /// <summary>Size of this belt (Circumference in Inches if US)</summary>
        public string Size { get; set; } = "";

        /// <summary>Region of the size of this belt</summary>
        public string Region { get; set; } = "";
    }
}

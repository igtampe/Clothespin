using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Igtampe.Clothespin.Common.Clothes.Types;
using Igtampe.Clothespin.Common.Clothes.Sizes;

namespace Igtampe.Clothespin.Common.Clothes.Items {
    /// <summary>Holds a pair of pants</summary>
    public class Pants : Wearable<PantsType>, DistinguishableSizable {

        /// <summary>Distinguisher of the size of these pants</summary>
        public SizeDistinguisher Distinguisher { get; set; } = SizeDistinguisher.UNIVERSAL;

        /// <summary>Size of this pants pair (Usually a number, except with male pants that are two numbers (Waist circumference, and pant length in inches if in the US)</summary>
        public string Size { get; set; } = "";

        /// <summary>Region of this pair of pants' size</summary>
        public string Region { get; set; } = "";
    }
}

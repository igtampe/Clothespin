using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Igtampe.Clothespin.Common.Clothes.Sizes;
using Igtampe.Clothespin.Common.Clothes.Types;

namespace Igtampe.Clothespin.Common.Clothes.Items {

    /// <summary>Holds a shirt</summary>
    public class Shirt : Washable<ShirtType>, DistinguishableSizable {

        /// <summary>Distinguisher for the size of this shirt</summary>
        public SizeDistinguisher Distinguisher { get; set; } = SizeDistinguisher.UNIVERSAL;

        /// <summary>Size of this shirt (Either a letter if its a normal shirt, or a pair of three numbers (Neck, Chest, Sleeve length) for dress shirts in inches if in the US)</summary>
        public string Size { get; set; } = "";

        /// <summary>Region of this size</summary>
        public string Region { get; set; } = "";
    }
}

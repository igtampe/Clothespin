using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Igtampe.Clothespin.Common.Clothes.Sizes;
using Igtampe.Clothespin.Common.Clothes.Types;

namespace Igtampe.Clothespin.Common.Clothes.Items {

    /// <summary>Holds something that goes over a shirt (Like a Jacket, Coat, or Sweater)</summary>
    public class Overshirt : Washable<OvershirtType>, DistinguishableSizeable {

        /// <summary>Distinguisher of the size of this overshirt item</summary>
        public SizeDistinguisher Distinguisher { get; set; }

        /// <summary>Size of this overshirt item (probably a letter!)</summary>
        public string Size { get; set; } = "";

        /// <summary>Region of the size of this overshirt</summary>
        public string Region { get; set; } = "";

    }
}

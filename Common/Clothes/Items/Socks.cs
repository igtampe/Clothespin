using Igtampe.Clothespin.Common.Clothes.Types;
using Igtampe.Clothespin.Common.Clothes.Sizes;

namespace Igtampe.Clothespin.Common.Clothes.Items {

    /// <summary>Holds a pair of socks</summary>
    public class Socks : Washable<SockType>, Sizable {

        /// <summary>Size of these socks</summary>
        public string Size { get; set; } = "";

        /// <summary>Region of the size of this overshirt</summary>
        public string Region { get; set; } = "";

    }
}

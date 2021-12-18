namespace Igtampe.Clothespin.API.Requests {

    /// <summary>Abstract Outfit Request that has all fields</summary>
    public class OutfitRequest {

        /// <summary>ID of the shrit the requested outfits must have</summary>
        public Guid? ShirtID { get; set; } = null;

        /// <summary>ID of the pants the requested outfits must have</summary>
        public Guid? PantID { get; set; } = null;

        /// <summary>ID of the Belt the requested outfits must have</summary>
        public Guid? BeltID { get; set; } = null;

        /// <summary>ID of the shoes the requested outfits must have</summary>
        public Guid? ShoesID { get; set; } = null;

        /// <summary>ID of the socks the requested outfits must have</summary>
        public Guid? SocksID { get; set; } = null;

        /// <summary>IDs of the overshrits the requested outfits must have</summary>
        public Guid[]? OvershirtIDs { get; set; } = null;

        /// <summary>IDs of the accessories the requested outfits must have</summary>
        public Guid[]? AccessoryIDs { get; set; } = null;

    }
}

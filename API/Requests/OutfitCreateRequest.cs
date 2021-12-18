using Igtampe.Clothespin.Common;

namespace Igtampe.Clothespin.API.Requests {

    /// <summary>Request to create an outfit</summary>
    public class OutfitCreateRequest : OutfitRequest, Nameable, Describable {

        /// <summary>Name of the outfit</summary>
        public string Name { get; set; } = "";

        /// <summary>Description of the outfit</summary>
        public string Description { get; set; } = "";

        /// <summary>ID of the person this Outfit will belong to</summary>
        public Guid? PersonID { get; set; }
    }
}

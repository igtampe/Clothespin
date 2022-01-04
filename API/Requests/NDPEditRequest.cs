using Igtampe.Clothespin.Common;

namespace Igtampe.Clothespin.API.Requests {

    /// <summary>Request to modify any item that is Nameable, Describable, and Depictable</summary>
    public class NDPEditRequest : Nameable, Describable, Depictable {

        /// <summary>ID of the object to update</summary>
        public Guid? ID { get; set; }

        /// <summary>Name to update the object to</summary>
        public string Name { get; set; } = "";

        /// <summary>Description to update the object to</summary>
        public string Description { get; set; } = "";

        /// <summary>ImageURL to update the object to</summary>
        public string ImageURL { get; set; } = "";
    }
}

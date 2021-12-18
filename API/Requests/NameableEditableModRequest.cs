using Igtampe.Clothespin.Common;

namespace Igtampe.Clothespin.API.Requests {

    /// <summary>Request to modify an outfit</summary>
    public class NameableEditableModRequest : Nameable, Describable {

        /// <summary>ID of the object to update</summary>
        public Guid? ID { get; set; }

        /// <summary>Name to update the object to</summary>
        public string Name { get; set; } = "";

        /// <summary>Description to update the object to</summary>
        public string Description { get; set; } = "";
    }
}

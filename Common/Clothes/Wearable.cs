using Igtampe.Clothespin.Common.Tracking;
using System.Text.Json.Serialization;

namespace Igtampe.Clothespin.Common.Clothes {

    /// <summary>Abstract class of a wearable item</summary>
    public abstract class Wearable<E> : Identifiable, Nameable, Describable, Depictable where E : Enum {

#pragma warning disable CS8601 // Possible null reference assignment.

        /// <summary>Type of this Wearable</summary>
        public E Type { get; set; } = default;

#pragma warning restore CS8601 // We don't care about this because all of the Wearable Types have a default (0)

        /// <summary>Name of this Wearable</summary>
        public string Name { get; set; } = "";

        /// <summary>Description of this wearable</summary>
        public string Description { get; set; } = "";

        /// <summary>URL to the image</summary>
        public string ImageURL { get; set; } = "";

        /// <summary>Color of this wearable item</summary>
        public string Color { get; set; } = "";

        /// <summary>Person this garmin belongs to</summary>
        [JsonIgnore]
        public Person? Owner { get; set; }

        /// <summary>List of Outfits this Wearable is in</summary>
        [JsonIgnore]
        public List<Outfit> Outfits { get; set; } = new();

        /// <summary>Indicates weather this Wearable is deleted or not</summary>
        public bool Deleted { get; set; } = false;
        
    }
}

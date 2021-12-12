using Igtampe.Clothespin.Common.Clothes.Items;
using Igtampe.Clothespin.Common.Clothes;
using System.Text.Json.Serialization;

namespace Igtampe.Clothespin.Common.Tracking {

    /// <summary>Represents a person who owns multiple clothing items, and outfits</summary>
    public class Person : Identifiable, Nameable, Depictable {

        /// <summary>Name of the person</summary>
        public string Name { get; set; } = "";

        /// <summary>Image URL for this person</summary>
        public string ImageURL { get; set; } = "";

        /// <summary>A person's Tied User account</summary>
        [JsonIgnore] 
        public User? TiedUser { get; set; }

        /// <summary>Outfits this person has</summary>
        [JsonIgnore]
        public List<Outfit> Outfits { get; set; } = new();

        /// <summary>List of log items of Outfits worn</summary>
        [JsonIgnore] 
        public List<LogItem> Log { get; set; } = new();

        /// <summary>Accessories this person has</summary>
        [JsonIgnore] 
        public List<Accessory> Accessories { get; set; } = new();

        /// <summary>Belts this person has</summary>
        [JsonIgnore] 
        public List<Belt> Belts { get; set; } = new();

        /// <summary>Overshirts this person has</summary>
        [JsonIgnore] 
        public List<Overshirt> Overshirts { get; set; } = new();

        /// <summary>Pants this person has</summary>
        [JsonIgnore] 
        public List<Pants> Pants { get; set; } = new();

        /// <summary>Shirts this person has</summary>
        [JsonIgnore] 
        public List<Shirt> Shirts { get; set; } = new();

        /// <summary>Shoes this person has</summary>
        [JsonIgnore] 
        public List<Shoes> Shoes { get; set; } = new();

        /// <summary>Socks this person has</summary>
        [JsonIgnore] 
        public List<Socks> Socks { get; set; } = new();
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Igtampe.Clothespin.Common;
using Igtampe.Clothespin.Common.Tracking;
using Igtampe.Clothespin.Common.Clothes;
using Igtampe.Clothespin.Common.Clothes.Items;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Igtampe.Clothespin.Data {
    /// <summary>Holds the general purpose Clothespin context</summary>
    public class ClothespinContext : FlexibleContext {

        /// <summary>Actual default URL</summary>
        private const string DEFAULT_URL = "Data Source=Localhost;Initial Catalog=Clothespin;Integrated Security=True";

        /// <summary>Gets the overridable default URL</summary>
        /// <returns></returns>
        private static string DefaultURL() => File.Exists("csdb.txt") ? File.ReadAllText("csdb.txt") : DEFAULT_URL;

        public ClothespinContext() : base(DefaultURL()) { }

        public ClothespinContext(ContextMode Mode, string? URL) : base(Mode, URL ?? DefaultURL()) { }

        public DbSet<User>? User { get; set; }

        public DbSet<Person>? Person { get; set; }

        public DbSet<LogItem>? LogItem { get; set; }

        public DbSet<Outfit>? Outfit { get; set; }
        
        public DbSet<Accessory>? Accessory { get; set; }

        public DbSet<Belt>? Belt { get; set; }

        public DbSet<Overshirt>? Overshirt { get; set; }

        public DbSet<Pants>? Pants { get; set; }

        public DbSet<Shirt>? Shirt { get; set; }

        public DbSet<Shoes>? Shoes { get; set; }

        public DbSet<Socks>? Socks { get; set; }
    }
}

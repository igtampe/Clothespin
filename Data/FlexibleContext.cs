using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Igtampe.Clothespin.Data {

    /// <summary>Mode to run the context in</summary>
    public enum ContextMode {

        /// <summary>Have the context decide automatically which database to connect to</summary>
        AUTOMATIC = -1,

        /// <summary>Run the context connecting to a SQL Server DB  (Usually to run it on a Local instance of SQL Server)</summary>
        SQL_SERVER = 0,

        /// <summary>Run the context connecting to a Postgres DB (Usually to run it on Heroku)</summary>
        POSTGRES = 1,
    }

    /// <summary>Abstract class for a flexible context that can connect to either SQL Server or Heroku Postgres</summary>
    public abstract class FlexibleContext : DbContext {

        /// <summary>Indicates what mode to run this context in</summary>
        public ContextMode Mode { get; private set; } = ContextMode.AUTOMATIC;

        /// <summary>URL to the Database this context is connected to</summary>
        private string DBURL = "";

        /// <summary>Default Database URL for SQL Server</summary>
        private readonly string DefaultDBURL = "";

        /// <summary>Protected constructor for a FlexibleContext</summary>
        /// <param name="DefaultDBURL">Default DB URL for SQL Server in case we're not running under Heroku</param>
        protected FlexibleContext(string DefaultDBURL) : base() => this.DefaultDBURL = DefaultDBURL;

        /// <summary>Creates a NecoContext with an overridden NecoContextMode and URL</summary>
        protected FlexibleContext(ContextMode Mode, string URL) : base() {
            this.Mode = Mode;
            DBURL = URL;
        }

        /// <summary>Overrides onConfiguring to use <see cref="Constants.ConnectionString"/></summary>
        /// <param name="optionsBuilder"></param>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {

            if (Mode == ContextMode.AUTOMATIC) {

                //We must determine what mode to run this on

                //Check if we have a de-esta cosa for the Database URL (IE For Postgres)
                DBURL = Environment.GetEnvironmentVariable("DATABASE_URL") ?? "";

                if (!string.IsNullOrWhiteSpace(DBURL)) { Mode = ContextMode.POSTGRES; } else {
                    Mode = ContextMode.SQL_SERVER;
                    DBURL = DefaultDBURL;
                }
            }

            switch (Mode) {
                case ContextMode.POSTGRES:
                    optionsBuilder.UseNpgsql(ConvertPostgresURLToConnectionString(DBURL));
                    break;
                case ContextMode.SQL_SERVER:
                    if (string.IsNullOrWhiteSpace(DBURL)) { DBURL = DefaultDBURL; }
                    optionsBuilder.UseSqlServer(DBURL);
                    break;
                default:
                    throw new InvalidOperationException("Invalid Context Mode was used");
            }
        }
        
        /// <summary>Overrides on model creation to remove the plural convention</summary>
        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            //This will singularize all table names
            foreach (IMutableEntityType entityType in modelBuilder.Model.GetEntityTypes()) {
                entityType.SetTableName(entityType.DisplayName());
            }
        }

        /// <summary>Converts a URI (From Heroku usually) to the expected connection string of npgsql</summary>
        /// <param name="DBURL"></param>
        /// <returns></returns>
        public static string ConvertPostgresURLToConnectionString(string DBURL) {
            //OK so now we have this
            //postgres://user:password@host:port/database

            //Drop the beginning 
            string PURL = DBURL.Replace("postgres://", "");

            //Split the beginning and end into two parts at the @
            string[] PurlSplit = PURL.Split('@');

            //We should now have:
            //user:password
            string Username = PurlSplit[0].Split(':')[0];
            string Password = PurlSplit[0].Split(':')[1];

            //And:
            //host:port/database

            //Split this again by /
            PurlSplit = PurlSplit[1].Split('/');

            //Now we should have
            //host:port
            string Host = PurlSplit[0].Split(':')[0];
            string Port = PurlSplit[0].Split(':')[1];

            //Database
            string Database = PurlSplit[1];

            return @$"
                        Host={Host}; Port={Port}; 
                        Username={Username}; Password={Password};
                        Database={Database};
                        Pooling=true;
                        SSL Mode=Require;
                        TrustServerCertificate=True;
                    ";
        }
    }
}

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Igtampe.Clothespin.Common.Tracking;

namespace Igtampe.Clothespin.Common {

    /// <summary></summary>
    public class User {

        /// <summary>Username of this user</summary>
        [Key]
        public string Username { get; set; } = "";

        /// <summary>Password for this user</summary>
        public string Password { get; set; } = "";

        /// <summary>List of Persons linked to this user</summary>
        [JsonIgnore]
        public List<Person> Persons { get; set; } = new();

        /// <summary>Checks a given password for this user</summary>
        /// <param name="Check"></param>
        /// <returns></returns>
        public bool CheckPassword(string Check) => Check == Password;
    }
}

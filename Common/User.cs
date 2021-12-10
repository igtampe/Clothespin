﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Igtampe.Clothespin.Common {

    /// <summary></summary>
    public class User {

        /// <summary>Username of this user</summary>
        [Key]
        public string Username { get; set; } = "";

        /// <summary>Password for this user</summary>
        public string Password { get; set; } = "";

        /// <summary>Checks a given password for this user</summary>
        /// <param name="Check"></param>
        /// <returns></returns>
        public bool CheckPassword(string Check) => Check == Password;
    }
}

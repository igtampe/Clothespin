﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Igtampe.Clothespin.Common.Clothes.Sizes {

    /// <summary>A Wearable that is also sizeable</summary>
    public interface Sizeable {

        /// <summary>Size of the item</summary>
        public string Size { get; set; }

        /// <summary>Region of the indicated size's measurement</summary>
        public string Region { get; set; }

        //HEYO I had actually made Sizeable a generic class and had a size class for letter sizes, male pant sizes, dress shirts, and...
        
        //I have decided that level of complication is not necessary for this project, especially when it wouldn't even be complete because
        //I'm only doing US sizes. So let's leave this flexible for those who use the app.

    }
}

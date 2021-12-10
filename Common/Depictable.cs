using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Igtampe.Clothespin.Common {

    /// <summary>Interface for an object that's depictable (IE it can be shown in a picture and we hold a URL for </summary>
    public interface Depictable {

        /// <summary>URL to the image</summary>
        public string ImageURL { get; set; }

    }

}

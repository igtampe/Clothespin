using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Igtampe.Clothespin.Common.Clothes.Sizes {

    //This Enum is here essentially because SOME Clothing sizes distinguish by age and gender
    //Because non-binary clothing is relatively new in some spaces and sizing is still somewhat vague and non-standard I will not be putting it here
    //sorry

    /// <summary>Size distinguisher for a size (IE Age or Gender)</summary>
    public enum SizeDistinguisher {

        /// <summary>For sizeable clothing items that do not distinguish *or* are purporsefully not distinguished (IE nonbinary or something)</summary>
        UNIVERSAL = 0, //The presence of this can violate ISP but is here for edge cases of generally distinguished clothing that is not 

        /// <summary>For men's sized clothing</summary>
        MENS = 1,

        /// <summary>For women's sized clothing</summary>
        WOMENS = 2,

        /// <summary>For boy's sized clothing</summary>
        BOYS = 3,

        /// <summary>For girl's sized clothing</summary>
        GIRLS = 4,

    }

    /// <summary>A sizeable item, where the size may depend on a <see cref="SizeDistinguisher"/></summary>
    public interface DistinguishableSizeable : Sizeable {

        /// <summary>Distinguisher for the size of this item</summary>
        public SizeDistinguisher Distinguisher { get; set; }

    }
}

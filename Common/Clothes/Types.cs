namespace Igtampe.Clothespin.Common.Clothes.Types {

    //Hehe this holds all the types. Maybe it should've been a class, but putting this in a namespace makes it easier to import.
    //This might break some convention but oops.

    /// <summary>Types of accessories recognized by Clothespin</summary>
    public enum AccessoryType {

        /// <summary>Some other accessory (that goes somewhere on the body)</summary>
        Other = 0,

        /// <summary>A Watch (That goes on a wrist)</summary>
        Watch = 1,

        /// <summary>A Ring (that goes on a finger)</summary>
        Ring = 2,

        /// <summary>An Earing (that goes on an ear)</summary>
        Earing = 3,

        /// <summary>A Necklace (that goes on the neck)</summary>
        Necklace = 4,

        /// <summary>A Wallet (that goes on a pocket)</summary>
        Wallet = 5,

        /// <summary>A Bracelet (that goes on a wrist)</summary>
        Bracket = 6,

        /// <summary>A Hat (that goes on the head)</summary>
        Hat = 7,

        /// <summary>A pair of glasses (that also go on the head)</summary>
        Glasses = 8,

        /// <summary>A Tie (that goes on the chest)</summary>
        Tie = 9,

        /// <summary>A Scarf (that goes on the neck)</summary>
        Scarf = 10,

        /// <summary>A pair of gloves (That go on both hands)</summary>
        Gloves = 11,

    }

    /// <summary>Types of shoes</summary>
    public enum ShoeType {

        /// <summary>Any other type of shoe</summary>
        Other = 0,

        /// <summary>Sandals</summary>
        Sandals = 1,

        /// <summary>Loafers</summary>
        Loafers = 2,

        /// <summary>Slippers</summary>
        Slippers = 3,

        /// <summary>Formal shoes (like black shoes)</summary>
        Formal = 4,

        /// <summary>Work shoes (rough or protective shoes)</summary>
        Work = 5,

        /// <summary>Boots of any kind</summary>
        Boots = 6,

        /// <summary>Heels of any kind</summary>
        Heels = 7,

        /// <summary>Sneakers</summary>
        Sneakers = 8,

        /// <summary>Tennis or exercise shoes</summary>
        Tennis = 9
    }

    /// <summary>Types of Socks</summary>
    public enum SockType {
        /// <summary>Any other type of socks</summary>
        Other = 0,

        /// <summary>Invisible socks (socks that do not show when wearing a shoe)</summary>
        Invisible = 1,

        /// <summary>Low cut socks (Socks that barely appear when wearing a shoe)</summary>
        Low_Cut = 2,

        /// <summary>Short socks (Socks that show but not a lot when wearing a shoe)</summary>
        Short = 3,

        /// <summary>Crew Cut (The average (to the best of my knowledge) size of socks)</summary>
        Crew = 4,

        /// <summary>Knee high socks (Socks that go up to the knee)</summary>
        Knee_High = 5,

        /// <summary>Over knee socks (Socks that go beyond the knee)</summary>
        Over_Knee = 6,

    }

    /// <summary>Type of something that goes over a shirt</summary>
    public enum OvershirtType {

        /// <summary>Any other type of Overshirt</summary>
        Other = 0,

        /// <summary>Jackets (Like Hoodies)</summary>
        Jacket = 1,

        /// <summary>Coats (Like winter coats)</summary>
        Coat = 2,

        /// <summary>Sweater (Like a Turttleneck)</summary>
        Sweater = 3,

        /// <summary>Suits (A business or formal suit)</summary>
        Suit = 4,

        /// <summary>Vests (Vests that can go under a suit)</summary>
        Vest = 5,

    }

    /// <summary>Type of a Shirt</summary>
    public enum ShirtType { 
    
        /// <summary>Any other type of shirt</summary>
        Other = 0,

        /// <summary>Tank Top (sleeveless) Shirt</summary>
        TankTop = 1,

        /// <summary>A standard Tshirt (Potentially with graphics)</summary>
        TShirt = 2,

        /// <summary>A Polo Shirt</summary>
        Polo = 3,

        /// <summary>A Button up Shirt</summary>
        Shirt = 4,

        /// <summary>A more formal button up Dress Shirt</summary>
        Dress_Shirt = 5,

        /// <summary>A Dress (*usually* (but not exclusively) worn by women)</summary>
        Dress = 6,

        /// <summary>A Sweatshirt</summary>
        Sweatshirt = 7,

    }

    /// <summary>Type of a Belt</summary>
    public enum BeltType { 
 
        /// <summary>Any other type of belt</summary>
        Other = 0,

        /// <summary>Frame buckle belt (the usual)</summary>
        Frame = 1,

        /// <summary>Box buckle belt</summary>
        Box = 2,

        /// <summary>O Ring belt</summary>
        ORing = 3,

        /// <summary>D Ring belt</summary>
        DRing = 4,

        /// <summary>Plate buckle belt</summary>
        Plate = 5,

        /// <summary>Snap buckle belt</summary>
        Snap = 6

    }

    /// <summary>Type of pants</summary>
    public enum PantsType { 
        
        /// <summary>Any other type of pants</summary>
        Other = 0,

        /// <summary>A pair of shorts</summary>
        Shorts = 1,

        /// <summary>A skirt</summary>
        Skirt = 2,

        /// <summary>A Dress skirt (Which is longer)</summary>
        Dress_Skirt = 3,

        /// <summary>A Pair of jeans (Ripped or otherwise)</summary>
        Jeans = 4,

        /// <summary>A pair of khakis</summary>
        Khakis = 5,

        /// <summary>Dress pants (more formal pants)</summary>
        Dress_Pants = 6,

        /// <summary>A pair of sweatpants</summary>
        Sweatpants = 7,

        /// <summary>Exercise Shorts used for Excersising (not just regular shorts)</summary>
        Sport_Shorts = 8,

    }

}

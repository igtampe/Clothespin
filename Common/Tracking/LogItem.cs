using Igtampe.Clothespin.Common.Clothes;

namespace Igtampe.Clothespin.Common.Tracking {

    /// <summary>A log item of an outfit worn at a specific time</summary>
    public class LogItem:Identifiable {

        /// <summary>Outfit worn on this log item</summary>
        public Outfit? Outfit { get; set; }

        /// <summary>Day this outfit was worn</summary>
        public DateOnly? Date { get; set; }

        /// <summary>Owner of this item</summary>
        public Person? Owner { get; set; }

        /// <summary>Note for this log item</summary>
        public string Note { get; set; } = "";

    }
}

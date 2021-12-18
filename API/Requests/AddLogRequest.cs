namespace Igtampe.Clothespin.API.Requests {

    /// <summary>Request to add a log</summary>
    public class AddLogRequest {

        /// <summary>ID of the outfit to log</summary>
        public Guid? OutfitID { get; set; }

        /// <summary>Date of the log to add</summary>
        public DateTime? Date { get; set; }

        /// <summary>ID of the person to log to</summary>
        public Guid? PersonID { get; set; }

        /// <summary>Note attached to the log</summary>
        public string Note { get; set; } = "";

    }
}

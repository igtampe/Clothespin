namespace Igtampe.Clothespin.API.Requests {

    /// <summary>Authenticated request with modifiable person fields (To modify or create)</summary>
    public class PersonRequest {

        /// <summary>ID of the person (Default if create)</summary>
        public Guid PersonID { get; set; }

        /// <summary>Name of the Person</summary>
        public string Name { get; set; } = "";

        /// <summary>Image of the person</summary>
        public string ImageURL { get; set; } = "";

    }
}

namespace Igtampe.Clothespin.API.Requests {

    /// <summary>A request that is Authenticated</summary>
    public abstract class AuthenticatedRequest {

        /// <summary>GUID of the Session that sent this request</summary>
        public Guid SessionID { get; set; }
    }
}

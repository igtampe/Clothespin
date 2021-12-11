namespace Igtampe.Clothespin.API.Requests {

    /// <summary>Authenticated request to change a password</summary>
    public class ChangePasswordRequest : AuthenticatedRequest {

        /// <summary>Current password</summary>
        public string? Current { get; set; }

        /// <summary>New Password</summary>
        public string? New { get; set; }
    }
}

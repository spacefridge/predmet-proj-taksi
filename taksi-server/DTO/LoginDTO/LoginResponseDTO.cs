using taksi_server.Enumerations;

namespace taksi_server.DTO.LoginDTO
{
	public class LoginResponseDTO
	{
		public long Id { get; set; }
		public string Token { get; set; }
		public UserType UserType { get; set; }
		public VerificationState? VerificationStatee { get; set; }
	}
}

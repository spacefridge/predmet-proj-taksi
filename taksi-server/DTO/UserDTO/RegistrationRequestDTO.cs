using taksi_server.Enumerations;

namespace taksi_server.DTO.UserDTO
{
	public class RegistrationRequestDTO
	{
		public string Username { get; set; }
		public string Email { get; set; }
		public string Password { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Birthdate { get; set; }
		public string Address { get; set; }
		public UserType UserType { get; set; }
	}
}

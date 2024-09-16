using taksi_server.DTO.LoginDTO;
using taksi_server.DTO.UserDTO;
using taksi_server.DTO.VerificationDTO;

namespace taksi_server.Interfaces
{
	public interface IUserService
	{
		List<UserResponseDTO> GetAllUsers();
		LoginResponseDTO LoginUser(LoginRequestDTO requestDto);
		UserResponseDTO UpdateUser(long id, UserEditRequestDTO requestDto);
		VerificationResponseDTO VerifyUser(long id, VerificationRequestDTO requestDto);
		UserResponseDTO RegisterUser(RegistrationRequestDTO requestDto);
		UserResponseDTO GetUserById(long id);

	}
}

using taksi_server.DTO.LoginDTO;
using taksi_server.DTO.UserDTO;
using taksi_server.DTO.VerificationDTO;
using taksi_server.Models;

namespace taksi_server.Interfaces.Repositories
{
	public interface IUserRepositories
	{
		List<User> GetAllUsers();
		User GetUserByID(long id);

		User LoginUser(LoginRequestDTO requestDto);

		void RegisterUser(User user);

		void SaveChanges();

		User UpdateUser(long id, UserEditRequestDTO requestDto);

		User VerifyUser(long id, VerificationRequestDTO requestDto);
	}
}

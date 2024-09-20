
using AutoMapper;
using taksi_server.DTO.RideDTO;
using taksi_server.DTO.UserDTO;
using taksi_server.DTO.VerificationDTO;
using taksi_server.Models;

namespace taksi_server.Mapper
{
	public class MapProfiles : Profile
	{

		public MapProfiles()
		{
			CreateMap<User, UserResponseDTO>();
			CreateMap<RegistrationRequestDTO, User>();
			CreateMap<UserEditRequestDTO, User>();
			CreateMap<User, VerificationResponseDTO>();

			CreateMap<VerificationRequestDTO, User>();

			CreateMap<RideRequestDTO,Ride>();
			CreateMap<RideConfirmDTO,Ride>();
			CreateMap<Ride,RideResponseDTO>();
			CreateMap<RideStateChangeDTO, Ride>();
		}
	}
}

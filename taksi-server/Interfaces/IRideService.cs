using taksi_server.DTO.RideDTO;

namespace taksi_server.Interfaces
{
	public interface IRideService
	{

		public List<RideResponseDTO> GetAllRides();
		public List<RideResponseDTO> GetAllRidesUser( int userId);
		public List<RideResponseDTO> GetAllRidesDriver(int driverId);
		public RideResponseDTO GetRideById(int id);
		public RideResponseDTO UpdateRideStatus(int id, int status);

		public RideResponseDTO CreateRide(RideConfirmDTO confirmedRide);
		//RideResponseDTO ConfirmRide(RideConfirmDTO requestDto);
		//RideRequestDTO CreateRideRequest(RideRequestDTO requestDto);


		//createRideRequest
		//confirmRide
		//JUMP: should ride req be in db ?

		//create ride
	}
}

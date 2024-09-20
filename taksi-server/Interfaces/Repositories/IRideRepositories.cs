using taksi_server.DTO.RideDTO;
using taksi_server.Models;

namespace taksi_server.Interfaces.Repositories
{
	public interface IRideRepositories
	{


		public List<Ride> GetAllRides();
		public List<Ride> GetAllRidesUser(int userId);
		public List<Ride> GetAllRidesDriver(int driverId);
		public Ride GetRideById(int id);

		public void CreateRide(Ride confirmedRide);

		public void SaveChanges();
		//JUMP: do i need edit ride to change status ?
	}
}
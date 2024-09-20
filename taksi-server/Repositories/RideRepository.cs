using taksi_server.Context;
using taksi_server.Interfaces.Repositories;
using taksi_server.Models;

namespace taksi_server.Repositories
{
	public class RideRepository : IRideRepositories
	{

		private readonly DatabaseContext _dbContext;

		public RideRepository(DatabaseContext dbContext)
		{
			_dbContext = dbContext;
		}

		public List<Ride> GetAllRides()
		{

			List<Ride> rides = new List<Ride>();

			rides = _dbContext.Rides.ToList();
			

			return rides;
		}

		public List<Ride> GetAllRidesUser(int userId)
		{
			List<Ride> rides = new List<Ride>();
			rides = _dbContext.Rides.Where(x => x.UserId == userId).ToList();

			return rides;
		}

		public List<Ride> GetAllRidesDriver(int driverId)
		{
			List<Ride> rides = new List<Ride>();
			rides = _dbContext.Rides.Where(x => x.DriverId == driverId).ToList();

			return rides;
		}
		public void CreateRide(Ride ride)
		{
			_dbContext.Rides.Add(ride);
		}
		public void SaveChanges()
		{
			_dbContext.SaveChanges();
		}
		public Ride GetRideById(int id)
		{
			return _dbContext.Rides.Find(id);
		}
	}
}

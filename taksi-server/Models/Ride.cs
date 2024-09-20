using taksi_server.Enumerations;

namespace taksi_server.Models
{
	public class Ride
	{
		public int Id { get; set; }

		public string StartAddress { get; set; }
		public string EndAddress { get; set; }

		public long UserId { get; set; }
		public long DriverId { get; set; }

		public long Price { get; set; }
		public long RideDuration { get; set; }
		public long WaitTime { get; set; }
		public RideState RideState { get; set; }



		//DO I NEED OCENU HERE ?
		//DO I NEED A WHOLE USER DETAILS ?
	}
}

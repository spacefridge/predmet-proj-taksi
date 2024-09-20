using taksi_server.Enumerations;

namespace taksi_server.DTO.RideDTO
{
	public class RideRequestDTO
	{
		public string StartAddress { get; set; }
		public string EndAddress { get; set; }

		public long UserId { get; set; }
		public long Price { get; set; }
		public long WaitTime { get; set; }

		public string? ConnectionId {  get; set; }
	}
}

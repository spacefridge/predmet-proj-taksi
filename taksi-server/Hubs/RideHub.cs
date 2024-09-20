using Microsoft.AspNetCore.SignalR;
using taksi_server.DTO.RideDTO;
using taksi_server.Services;

namespace taksi_server.Hubs
{
	public class RideHub : Hub
	{

		//private static Dictionary<int, Timer> rideTimers = new Dictionary<int, Timer>(); // To store ride timers
		//private static Dictionary<int, DateTime> rideStartTimes = new Dictionary<int, DateTime>(); // To store the start time of rides
		//private static int countdownIntervalSeconds = 10; // Adjust interval based on requirement
		private static readonly Dictionary<string, string> DriverConnections = new Dictionary<string, string>();
		private static readonly Dictionary<string, string> UserConnections = new Dictionary<string, string>();

		private readonly RideTimerService _rideTimerService;

		public RideHub(RideTimerService rideTimerService)
		{
			_rideTimerService = rideTimerService;
		}

		public async Task NotifyDrivers(RideRequestDTO ridereq)
		{
			// Send the ride request notification to all connected clients
			await Clients.Group("drivers").SendAsync("ReceiveRideRequest", ridereq);
		}

		public async Task AcceptRide( RideResponseDTO ride,string connectionId)
		{
			// Notify the client (using their connection ID)
			Console.WriteLine(connectionId);
			Console.WriteLine("above");
			await Clients.Client(connectionId).SendAsync("ReceiveRideAccepted", ride);
		}

		public async Task JoinDriverGroup()
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, "drivers");
		}

		public string GetConnectionId()
		{
			Console.WriteLine(Context.ConnectionId);
			return Context.ConnectionId;
		}

		///
		// Method to notify both user and driver to start the ride
		public async Task StartRideCountdown(int rideId, double countdownMinutes,double countdownRide, int countdownIntervalSeconds)
		{
			_rideTimerService.StartRideTimer(rideId, countdownMinutes, countdownRide, countdownIntervalSeconds);
		}

		public async Task JoinRideGroup(int rideId)
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, rideId.ToString());

		}

		public async Task RegisterDriver(string driverName)
		{
			var connectionId = Context.ConnectionId;
			DriverConnections[driverName] = connectionId; // Store the driver's connection ID by their name
			await Clients.All.SendAsync("UpdateDriverList", DriverConnections.Keys);
		}

		public async Task RegisterUser(string userName)
		{
			var connectionId = Context.ConnectionId;
			UserConnections[userName] = connectionId; // Store the user's connection ID by their name
			await Clients.All.SendAsync("UpdateUserList", UserConnections.Keys); // Send updated user list
		}

		public async Task SendMessageToDriver(string driverName, string message)
		{
			if (DriverConnections.TryGetValue(driverName, out var connectionId))
			{
				await Clients.Client(connectionId).SendAsync("ReceiveMessage", Context.ConnectionId, message);
			}
		}
		public async Task SendMessageToUser(string userName, string message)
		{
			if (UserConnections.TryGetValue(userName, out var connectionId))
			{
				await Clients.Client(connectionId).SendAsync("ReceiveMessage", Context.ConnectionId, message);
			}
		}

	}
}

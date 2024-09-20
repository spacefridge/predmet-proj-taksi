


using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using taksi_server.Hubs;
using taksi_server.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;


namespace taksi_server.Services;
public class RideTimerService
{
	private readonly IHubContext<RideHub> _hubContext;
	private ConcurrentDictionary<int, Timer> rideTimers = new ConcurrentDictionary<int, Timer>();
	private ConcurrentDictionary<int, DateTime> rideStartTimes = new ConcurrentDictionary<int, DateTime>();

	public RideTimerService(IHubContext<RideHub> hubContext)
	{
		_hubContext = hubContext;
	}

	public void StartRideTimer(int rideId, double countdownMinutes,double countdownRide, int countdownIntervalSeconds)
	{
		if (!rideStartTimes.ContainsKey(rideId))
		{
			rideStartTimes[rideId] = DateTime.UtcNow;

			int id = rideId;

			// Create a timer that triggers every X seconds
			rideTimers[rideId] = new Timer(async state =>
			{
				var elapsedTime = (DateTime.UtcNow - rideStartTimes[rideId]).TotalMinutes;
				var remainingTime = countdownMinutes + countdownRide - elapsedTime;

				if (remainingTime <= 0)
				{
					remainingTime = 0;

					if (rideTimers.ContainsKey(rideId))
					{
						rideTimers[id].Dispose();
						rideTimers.TryRemove(rideId, out _);
					}
				}
				// Use the HubContext to broadcast the remaining time
				await _hubContext.Clients.Group(rideId.ToString()).SendAsync("ReceiveCountdownUpdate", remainingTime);

			}, null, 0, countdownIntervalSeconds * 1000);
		}
	}

}

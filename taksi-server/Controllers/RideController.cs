using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using taksi_server.DTO.RideDTO;
using taksi_server.ExceptionHandler;
using taksi_server.Hubs;
using taksi_server.Interfaces;
using taksi_server.Models;

namespace taksi_server.Controllers
{
	[Route("api/rides")]
	[ApiController]
	public class RideController : ControllerBase
	{
		private readonly IRideService _rideService;
		private readonly IHubContext<RideHub> _hubContext;

		public RideController(IRideService rideService ,IHubContext<RideHub> hubContext)
		{
			_rideService = rideService;
			_hubContext = hubContext;

		}

		[HttpGet("all")]
		public IActionResult GetAllRides()
		{
			return Ok(_rideService.GetAllRides());
		}

		[HttpGet("alluser/{id}")]
		public IActionResult GetAllRidesUser([FromRoute] int id)
		{
			return Ok(_rideService.GetAllRidesUser(id));
		}

		[HttpGet("alldriver/{id}")]
		public IActionResult GetAllRidesDriver([FromRoute] int id)
		{
			return Ok(_rideService.GetAllRidesDriver(id));
		}

		[HttpGet("{id}")]
		public IActionResult GetRideById(int id)
		{
			RideResponseDTO ride;

			try
			{
				ride = _rideService.GetRideById(id);
			}
			catch (ResourceMissing e)
			{
				return NotFound(e.Message);
			}
			return Ok(ride);
		}

		[HttpPost]
		[Authorize(Roles = "Driver", Policy = "IsVerifiedDriver")]
		public IActionResult CreateRide([FromBody] RideConfirmDTO confirmedRide)
		{

			RideResponseDTO ride;

			try
			{
				ride = _rideService.CreateRide(confirmedRide);
			}
			catch (InvalidField e)
			{
				return BadRequest(e.Message);
			}
			return Ok(ride);
		}

		[HttpPut("{id}/{status}")]
		public IActionResult UpdateRideStatus([FromRoute] int id , [FromRoute] int status)
		{
			RideResponseDTO ride;

			try
			{
				ride = _rideService.UpdateRideStatus(id,status);
			}
			catch (ResourceMissing e)
			{
				return NotFound(e.Message);
			}
			catch (InvalidField e)
			{
				return BadRequest(e.Message);
			}

			return Ok(ride);
		}

		[HttpPost("request")]
		public async Task<IActionResult> CreateRideRequest([FromBody] RideRequestDTO request)
		{
			// Notify all drivers about the new ride request
			await _hubContext.Clients.All.SendAsync("ReceiveRideRequest", request);

			return Ok(new { message = "Ride request sent to drivers." });
		}

	}
}

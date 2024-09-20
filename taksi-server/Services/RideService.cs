using AutoMapper;
using taksi_server.DTO.UserDTO;
using taksi_server.Enumerations;
using taksi_server.ExceptionHandler;
using taksi_server.Interfaces;
using taksi_server.Interfaces.Repositories;
using taksi_server.Models;
using System.Security.Claims;
using System.Text;
using taksi_server.DTO.LoginDTO;
using taksi_server.DTO.VerificationDTO;
using Microsoft.AspNetCore.Routing.Matching;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using taksi_server.DTO.RideDTO;

namespace taksi_server.Services
{
	public class RideService : IRideService
	{
		private readonly IMapper _mapper;
		private readonly IRideRepositories _rideRepositories;
		private readonly IConfigurationSection _secretKey;

		public RideService(IMapper mapper, IRideRepositories rideRepositories, IConfiguration config)
		{

			_mapper = mapper;
			_rideRepositories = rideRepositories;
			_secretKey = config.GetSection("SecretKey");
		}

		public List<RideResponseDTO> GetAllRides()
		{
			List<Ride> rides = new List<Ride>();
			rides = _rideRepositories.GetAllRides();
			return _mapper.Map<List<RideResponseDTO>>(rides);
		}
		public List<RideResponseDTO> GetAllRidesUser(int userId)
		{
			List<Ride> rides = new List<Ride>();
			rides = _rideRepositories.GetAllRidesUser(userId);
			return _mapper.Map<List<RideResponseDTO>>(rides);
		}
		public List<RideResponseDTO> GetAllRidesDriver(int driverId)
		{
			List<Ride> rides = new List<Ride>();
			rides = _rideRepositories.GetAllRidesDriver(driverId);
			return _mapper.Map<List<RideResponseDTO>>(rides);
		}
		public RideResponseDTO GetRideById(int id)
		{
			RideResponseDTO ride = _mapper.Map<RideResponseDTO>(_rideRepositories.GetRideById(id));
			if (ride == null)
			{
				throw new ResourceMissing("No ride with given id ." + id);
			}
			return ride;
		}
		public RideResponseDTO UpdateRideStatus(int id, int status)
		{
			var ride = _rideRepositories.GetRideById(id);

			if (ride == null)
			{
				throw new ResourceMissing("No ride with given id." + id);
			}
			ride.RideState = (RideState)status;
			try
			{
				_rideRepositories.SaveChanges();
			}
			catch (Exception)
			{
				throw;
			}
			return _mapper.Map<RideResponseDTO>(ride);
		}

		public RideResponseDTO CreateRide(RideConfirmDTO confirmedRide)
		{
			Ride ride = _mapper.Map<Ride>(confirmedRide);
			Console.WriteLine(ride);
			_rideRepositories.CreateRide(ride);
			try
			{
				_rideRepositories.SaveChanges();
			}
			catch (Exception)
			{
				throw;
			}
			return _mapper.Map<RideResponseDTO>(ride);
		}



	}
		
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using taksi_server.DTO.LoginDTO;
using taksi_server.DTO.UserDTO;
using taksi_server.DTO.VerificationDTO;
using taksi_server.Interfaces;
using taksi_server.ExceptionHandler;

namespace taksi_server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UserController : ControllerBase
	{
		private readonly IUserService _userService;

		public UserController(IUserService userService)
		{
			_userService = userService;
		}

		[HttpGet]
		public IActionResult GetAllUsers()
		{
			return Ok(_userService.GetAllUsers());
		}

		[HttpGet("{id}")]
		public IActionResult GetUserById(long id)
		{
			UserResponseDTO user;

			try
			{
				user = _userService.GetUserById(id);
			}
			catch (ResourceMissing e)
			{
				return NotFound(e.Message);
			}

			return Ok(user);
		}

		[HttpPost]
		public IActionResult RegisterUser([FromBody] RegistrationRequestDTO requestDto)
		{
			UserResponseDTO user;

			try
			{
				user = _userService.RegisterUser(requestDto);
			}
			catch (InvalidCredentials e)
			{
				return Conflict(e.Message);
			}
			catch (InvalidField e)
			{
				return BadRequest(e.Message);
			}

			return Ok(user);
		}

		[HttpPut("{id}")]
		public IActionResult UpdateUser(long id, [FromBody] UserEditRequestDTO requestDto)
		{
			//coment for api test // needs token cba
			//if (!User.HasClaim("Id", id.ToString()))
			//{
			//    return Forbid();
			//}

			UserResponseDTO user;

			try
			{
				user = _userService.UpdateUser(id, requestDto);
			}
			catch (ResourceMissing e)
			{
				return NotFound(e.Message);
			}
			catch (InvalidField e)
			{
				return BadRequest(e.Message);
			}

			return Ok(user);
		}

		[HttpPost("login")]
		public IActionResult LoginUser([FromBody] LoginRequestDTO requestDto)
		{
			LoginResponseDTO responseDto;

			try
			{
				responseDto = _userService.LoginUser(requestDto);
			}
			catch (InvalidCredentials e)
			{
				return Unauthorized(e.Message);
			}
			catch (InvalidField e)
			{
				return BadRequest(e.Message);
			}

			return Ok(responseDto);
		}

		[HttpPost("verify/{id}")]
		[Authorize(Roles = "Admin")]
		public IActionResult VerifyUser(long id, [FromBody] VerificationRequestDTO requestDto)
		{
			VerificationResponseDTO user;

			try
			{
				user = _userService.VerifyUser(id, requestDto);
			}
			catch (ResourceMissing e)
			{
				return NotFound(e.Message);
			}
			catch (InvalidField e)
			{
				return BadRequest(e.Message);
			}

			return Ok(user);
		}
	}
}

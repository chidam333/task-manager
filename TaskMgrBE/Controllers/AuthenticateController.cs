using TaskMgrBE.Dtos;
using TaskMgrBE.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace TaskMgrBE.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthenticateController : ControllerBase
{
    private readonly AuthService _authService;
    
    public AuthenticateController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] CredentialsDTO cred)
    {
        var result = await _authService.LoginAsync(cred);
        
        if (!result.Success)
        {
            if (result.Message == "User not found.")
                return NotFound(result.Message);
            if (result.Message == "Invalid password.")
                return Unauthorized(result.Message);
            return BadRequest(result.Message);
        }

        return Ok(new { Token = result.Token, Message = result.Message });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserDto user)
    {
        Console.WriteLine("Registering user: " + user.Email);
        var result = await _authService.RegisterAsync(user);
        
        if (!result.Success)
        {
            if (result.Message == "User with this email already exists.")
                return Conflict(result.Message);
            return BadRequest(result.Message);
        }

        return Ok(user);
    }
    [HttpPost("aboutme")]
    [Authorize]
    public IActionResult AboutMe()
    {
        var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var name = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
        
        return Ok(new { Email = email, Name = name});
    }
}
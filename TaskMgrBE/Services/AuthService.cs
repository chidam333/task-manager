using TaskMgrBE.Dtos;
using TaskMgrBE.Models;
using TaskMgrBE.Contexts;
using Microsoft.EntityFrameworkCore;

namespace TaskMgrBE.Services;

public class AuthService
{
    private readonly TokenService _tokenService;
    private readonly TaskMgrContext _context;
    public AuthService(TokenService tokenService, TaskMgrContext context)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<(bool Success, string? Token, string? Message)> LoginAsync(CredentialsDTO credentials)
    {
        if (credentials == null || string.IsNullOrEmpty(credentials.Email) || string.IsNullOrEmpty(credentials.Password))
        {
            return (false, null, "Invalid credentials.");
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == credentials.Email);
        if (user == null)
        {
            return (false, null, "User not found.");
        }

        if (!BCrypt.Net.BCrypt.Verify(credentials.Password, user.PasswordHash))
        {
            return (false, null, "Invalid password.");
        }

        var token = _tokenService.GenerateToken(user);
        return (true, token, "Login Successful ! ");
    }

    public async Task<(bool Success, User? User, string? Message)> RegisterAsync(UserDto userDto)
    {
        if (userDto == null || string.IsNullOrEmpty(userDto.Email) || string.IsNullOrEmpty(userDto.Password))
        {
            return (false, null, "Invalid user data.");
        }

        if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
        {
            return (false, null, "User with this email already exists.");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
        var user = new User
        {
            Email = userDto.Email,
            Name = userDto.Name,
            PasswordHash = passwordHash
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return (true, user, null);
    }
}

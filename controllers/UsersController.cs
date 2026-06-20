using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using track_tasks;
using track_tasks.Models;

namespace track_tasks.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController(AppDbContext context, IConfiguration configuration) : ControllerBase
{
    private AppDbContext _context = context;
    private IConfiguration _configuration = configuration;

    [HttpPost("register")] 
    //POST == ADD
    public IActionResult RegisterUser([FromBody] User user)
    {
        var existingUser = _context.Users.FirstOrDefault(u => u.Email == user.Email);
        if(existingUser != null) return Conflict("Email already in use!");
        //HASH USER PASSWORD
        user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
        //SAVE DATE
        user.DateCreated = DateTime.UtcNow;
        //ADDS TO DB
        _context.Users.Add(user);
        //SAVE CHANGES
        _context.SaveChanges();
        return StatusCode(201, user);
    }

    [HttpPost("login")] 
    //POST == ADD
    public IActionResult LoginUser([FromBody] User user)
    {
        var searchResult = _context.Users.FirstOrDefault(u => u.Username == user.Username);
        if(searchResult == null) return NotFound();
        bool isPasswordCorrect = BCrypt.Net.BCrypt.Verify(user.Password, searchResult.Password);        
        if(!isPasswordCorrect) return Unauthorized();
        var token = GenerateJwtToken(searchResult);
        return Ok(new { token });
    }

    //GENERATES JWT TOKEN
    private string GenerateJwtToken(User user)
    {
        // 1. Create security key and credentials
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // 2. Define payload claims info
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("userId", user.Id.ToString()),
        };

        // 3. Configure token descriptor
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(2), // Set expiration time
            Issuer = "JustTasks",
            Audience = "JustTasksUser",
            SigningCredentials = credentials
        };

        // 4. Create and serialize token
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        
        return tokenHandler.WriteToken(token);
    }
}


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

    [HttpGet("searchUsername")]
    public IActionResult SearchUserName([FromQuery] string username)
    {
        var searchUsernames = _context.Users
            .Where(u => u.Username.ToLower().StartsWith(username.ToLower()))
            .Select(u => new { u.Username })
            .Take(10)
            .ToList();
        return Ok(searchUsernames);
    }

    [HttpGet("checkEmail")]
    public IActionResult GetUserEmail([FromQuery] string email)
    {
        var checkUser = _context.Users.FirstOrDefault(u => u.Email == email);
        if (checkUser == null) return Ok();
        return Conflict("Email already exists!");
    }

    [HttpGet("check")]
    public IActionResult GetUsername([FromQuery] string username)
    {
        var checkUser = _context.Users.FirstOrDefault(u => u.Username == username);
        if (checkUser == null) return Ok();
        return Conflict("Username already exists!");
    }

    [HttpPost("register")]
    //POST == ADD
    public IActionResult RegisterUser([FromBody] User user)
    {
        var existingUser = _context.Users.FirstOrDefault(u => u.Email == user.Email);
        if (existingUser != null) return Conflict("Email already in use!");
        //HASH USER PASSWORD
        user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
        //SAVE DATE
        user.DateCreated = DateTime.UtcNow;
        //ADDS TO DB
        _context.Users.Add(user);
        //SAVE CHANGES
        _context.SaveChanges();
        //CREATING STARTER PROJECT FOR USER
        var starterProject = new Project
        {
            Title = "Starter Project!",
            Description = "Your starter project!",
            Owner = user.Username,
            UserId = user.Id
        };
        _context.Projects.Add(starterProject);
        _context.SaveChanges();

        var userToProject = new UsersToProjects
        {
            ProjectId = starterProject.Id,
            UserId = user.Id
        };

        var starterTask = new TaskItem
        {
            TaskNumber = 1,
            Title = "Starter Task!",
            Summary = "This task consist of steps to get you use to the UI of the app!",
            Description = "~~~~~~~~~~~~ CREATING TASKS ~~~~~~~~~~~~ \n" +
            "1. Create a new task by pressing the new task button \n" +
            "2. Drag the task into the In Progress column, or assign it manually by click on the tasks and editing the section \n" +
            "3. Delete the task by hovering over it and pressing the 'X' button and clicking confirm on the pop-up \n \n" +
            "~~~~~~~~~~~~ CREATING PROJECTS ~~~~~~~~~~~~ \n" +
            "1. Create a task by pressing the 3 arrows on the left hand side of your screen!\n" +
            "2. Press the create project button. \n" +
            "3. Fill in the requested fields. \n" +
            "4. Press the create button. \n" +
            "5. The project is now on your left side menu! \n \n" +
            "~~~~~~~~~~~~ USING THE KEBAB MENU ~~~~~~~~~~~~ \n" +
            "1. Hover over the project you just created. \n" +
            "2. Press the 3 dots to open the Kebab menu. \n" +
            "3. This allows you to view members part of your project, add members, and delete the project!",
            Assignee = user.Username,
            Parent = "",
            Owner = user.Username,
            Status = "TO DO",
            Urgency = "LOW",
            StartDate = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(7),
            ProjectId = starterProject.Id,
            ProjectName = starterProject.Title
        };
        _context.Tasks.Add(starterTask);
        _context.UsersToProjects.Add(userToProject);
        _context.SaveChanges();

        return StatusCode(201, user);
    }

    [HttpPost("login")]
    //POST == ADD
    public IActionResult LoginUser([FromBody] User user)
    {
        var searchResult = _context.Users.FirstOrDefault(u => u.Username == user.Username);
        if (searchResult == null) return NotFound();
        bool isPasswordCorrect = BCrypt.Net.BCrypt.Verify(user.Password, searchResult.Password);
        if (!isPasswordCorrect) return Unauthorized();
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


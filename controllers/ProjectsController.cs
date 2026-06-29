using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using track_tasks;
using track_tasks.Models;

namespace track_tasks.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class ProjectsController(AppDbContext context) : ControllerBase
{
    private AppDbContext _context = context;

    [HttpGet]
    public IActionResult GetAll()
    {        
        var userIdClaim = User.FindFirst("userId")?.Value;
        var userIdClaimInt = int.Parse(userIdClaim);
        var searchResult = _context.Projects.Where(
            project => project.UserId == userIdClaimInt || 
            _context.UsersToProjects.Any(
                p => p.UserId == userIdClaimInt && 
                p.ProjectId == project.Id
                )
            ).ToList();

        return Ok(searchResult);
    }

    [HttpGet("{id}")]
    public IActionResult GetProject([FromRoute] int id)
    {
        var searchResult = _context.Projects.FirstOrDefault(project => project.Id == id);
        if(searchResult == null) return NotFound() ; return Ok(searchResult);
    }

    [HttpPost] 
    //POST == ADD
    public IActionResult CreateProject([FromBody] Project project)
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        project.UserId = int.Parse(userIdClaim);
        //SET DATE TO CURRENT DATE
        project.DateCreated = DateTime.UtcNow;
        //ADDS TO DB
        _context.Projects.Add(project);
        //SAVE CHANGES
        _context.SaveChanges();

        var newMembership = new UsersToProjects
        {
            UserId = project.UserId,
            ProjectId = project.Id
        };

        _context.UsersToProjects.Add(newMembership);
        _context.SaveChanges();
        return StatusCode(201, project);
    }

    [HttpPost("{projectId}/members")]
    public IActionResult AddUserToProject([FromBody] AddMemberRequest request, [FromRoute] int projectId)
    {
        //CHECKS BEFORE MAKING USER TABLES
        //CHECKS IF USERNAME EXISTS
        var searchResult = _context.Users.FirstOrDefault(u => u.Username == request.Username);
        if(searchResult == null) return NotFound("User not found.");

        //CHECKS IF PROJECT EXIST
        var searchProject = _context.Projects.FirstOrDefault(p => p.Id == projectId);
        if(searchProject == null) return NotFound("Project not found.");

        //CHECK IF THE PERSON BEING ADDED IS PART OF THIS PROEJCT
        var searchUser = _context.UsersToProjects.FirstOrDefault(p => p.UserId == searchResult.Id && p.ProjectId == projectId);
        if(searchUser != null) return Conflict("User already part of this project.");

        //IF USER ID ISN'T FOUND RETURN ERROR MSG
        var userIdClaim = User.FindFirst("userId")?.Value;
        if(userIdClaim == null) return Unauthorized("Unauthorized directory");

        var callerId = int.Parse(userIdClaim);
        //CHECKS IF THE PERSON MAKING THE REQUEST IS ALREADY A MEMEBER OF THE PROEJCT
        var callerMembership = _context.UsersToProjects.FirstOrDefault(p => p.UserId == callerId && p.ProjectId == projectId);
        if(callerMembership == null) return StatusCode(403, "You are not a member of this proejct!");


        var newMembership = new UsersToProjects
        {
            UserId = searchResult.Id,
            ProjectId = projectId
        };

        _context.UsersToProjects.Add(newMembership);
        _context.SaveChanges();


        return StatusCode(201, $"Successfully added user {request.Username}");
    }

    [HttpPut("{id}")] 
    //PUT == UPDATE 
    //("{id}") is used to get the ID in the URL
    public IActionResult UpdateProject([FromRoute] int id, [FromBody] Project updatedProject)
    {
        var searchResult = _context.Projects.FirstOrDefault(project => project.Id == id);
        if(searchResult == null)
        {
            return NotFound();
        }

        searchResult.Title = updatedProject.Title;
        searchResult.Description = updatedProject.Description;
        searchResult.DateCreated = updatedProject.DateCreated;
        searchResult.Owner = updatedProject.Owner;

        _context.SaveChanges();

        return Ok(searchResult);
    }

    [HttpDelete("{id}")]
    //DELTE the ID in the URL
    public IActionResult DeleteProject([FromRoute] int id)
    {
        var searchResult = _context.Projects.FirstOrDefault(project => project.Id == id);
        if(searchResult == null)
        {
            return NotFound();
        }
        _context.Projects.Remove(searchResult);
        _context.SaveChanges();
        return Ok();
    }
}

//DTO (DATA TRANSFER OBJECT): 
//CLASS WHOSE ONLY JOB IS TO CARRY DATA BETWEEN TWO PLACES
//USED IN ADD USER FUNCTION
public class AddMemberRequest
{
    public string Username { get; set; }
}
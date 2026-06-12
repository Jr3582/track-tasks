using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using track_tasks;
using track_tasks.Models;

namespace track_tasks.Controllers;

[ApiController]
[Route("[controller]")]
public class ProjectsController(AppDbContext context) : ControllerBase
{
    private AppDbContext _context = context;

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_context.Projects.ToList());
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
        //SET DATE TO CURRENT DATE
        project.DateCreated = DateTime.UtcNow;
        //ADDS TO DB
        _context.Projects.Add(project);
        //SAVE CHANGES
        _context.SaveChanges();
        return StatusCode(201, project);
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
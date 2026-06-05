using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using track_tasks;
using track_tasks.Models;

namespace MyFirstApp.Controllers;

[ApiController]
[Route("[controller]")]
public class TasksController(AppDbContext context) : ControllerBase
{
    //Variables need to be static because everytime a new request comes in
    //a new instance of the controller is created
    //so none of the varaibale info carries over
    //without static each variable would be a new instance, (_newId starting at 1, and empty list)
    private AppDbContext _context = context;

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_context.Tasks.ToList());
    }

    [HttpGet("{id}")]
    public IActionResult GetTask([FromRoute] int id)
    {
        var searchResult = _context.Tasks.FirstOrDefault(task => task.Id == id);
        if(searchResult == null) return NotFound() ; return Ok(searchResult);
    }

    [HttpPost] 
    //POST == ADD
    public IActionResult Create([FromBody] TaskItem task)
    {
        //ADDS TO DB
        _context.Tasks.Add(task);
        //SAVE CHANGES
        _context.SaveChanges();
        return StatusCode(201, task);
    }

    [HttpPut("{id}")] 
    //PUT == UPDATE 
    //("{id}") is used to get the ID in the URL
    public IActionResult Update([FromRoute] int id, [FromBody] TaskItem updatedTask)
    {
        var searchResult = _context.Tasks.FirstOrDefault(task => task.Id == id);
        if(searchResult == null)
        {
            return NotFound();
        }

        searchResult.Title = updatedTask.Title;
        searchResult.Summary = updatedTask.Summary;
        searchResult.Description = updatedTask.Description;
        searchResult.Assignee = updatedTask.Assignee;
        searchResult.Parent = updatedTask.Parent;
        searchResult.StartDate = updatedTask.StartDate;
        searchResult.DueDate = updatedTask.DueDate;
        searchResult.Owner = updatedTask.Owner;
        searchResult.Status = updatedTask.Status;
        searchResult.Urgency = updatedTask.Urgency;

        _context.SaveChanges();

        return Ok(searchResult);
    }

    [HttpDelete("{id}")]
    //DELTE the ID in the URL
    public IActionResult Delete([FromRoute] int id)
    {
        var searchResult = _context.Tasks.FirstOrDefault(task => task.Id == id);
        if(searchResult == null)
        {
            return NotFound();
        }
        _context.Tasks.Remove(searchResult);
        _context.SaveChanges();
        return Ok();
    }
}
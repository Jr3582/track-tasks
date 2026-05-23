using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;

namespace MyFirstApp.Controllers;

[ApiController]
[Route("[controller]")]
public class TasksController : ControllerBase
{
    //Variables need to be static because everytime a new request comes in
    //a new instance of the controller is created
    //so none of the varaibale info carries over
    //without static each variable would be a new instance, (_newId starting at 1, and empty list)
    private static int _newId = 1;
    private static List<TaskItem> _tasks = new()
    { 
        new TaskItem {Id = 1, Title = "Test 1", Summary = "Test Summary", Description = "Test Description", Assignee = "John", Owner = "Jimmy", Status = "TO DO", Urgency = "LOW", IsComplete = false},
        new TaskItem {Id = 2, Title = "Test 2", Summary = "Test Summary 2", Description = "Test Description 2", Assignee = "John", Owner = "Johnny", Status = "IN PROGRESS", Urgency = "PRIORITY", IsComplete = false}
    }
    ;

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_tasks);
    }
    [HttpPost] 
    //POST == ADD
    public IActionResult Create([FromBody] TaskItem task)
    {
        task.Id = _newId;
        _newId++;
        _tasks.Add(task);
        return StatusCode(201, task);
    }

    [HttpPut("{id}")] 
    //PUT == UPDATE 
    //("{id}") is used to get the ID in the URL
    public IActionResult Update([FromRoute] int id, [FromBody] TaskItem updatedTask)
    {
        var searchResult = _tasks.FirstOrDefault(task => task.Id == id);
        if(searchResult == null)
        {
            return NotFound();
        }
        searchResult.Title = updatedTask.Title;
        searchResult.IsComplete = updatedTask.IsComplete;
        return Ok(searchResult);
    }

    [HttpDelete("{id}")]
    //DELTE the ID in the URL
    public IActionResult Delete([FromRoute] int id)
    {
        var searchResult = _tasks.FirstOrDefault(task => task.Id == id);
        if(searchResult == null)
        {
            return NotFound();
        }
        _tasks.Remove(searchResult);
        return Ok();
    }
}

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string? Summary { get; set; } = "";
    public string? Description { get; set; } = "";
    public string? Assignee { get; set; } = "";
    public string? Parent { get; set; } = "";
    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }
    public string Owner { get; set; } = "";
    public string Status { get; set; } = "";
    public string Urgency { get; set; } = "";
    public bool IsComplete { get; set; }
}
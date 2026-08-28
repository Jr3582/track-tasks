using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using track_tasks;
using track_tasks.Models;

namespace track_tasks.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class TasksController(AppDbContext context, IHubContext<TaskHub> hubContext) : ControllerBase
{
    private AppDbContext _context = context;
    private IHubContext<TaskHub> _hubContext = hubContext;

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_context.Tasks.ToList());
    }

    [HttpGet("project/{projectId}")]
    public IActionResult GetAllFromProject([FromRoute] int projectId)
    {
        var searchResult = _context.Tasks.Where(task => task.ProjectId == projectId).ToList();
        return Ok(searchResult);
    }

    [HttpGet("{id}")]
    public IActionResult GetTask([FromRoute] int id)
    {
        var searchResult = _context.Tasks.FirstOrDefault(task => task.Id == id);
        if(searchResult == null) return NotFound() ; return Ok(searchResult);
    }

    [HttpPost] 
    //POST == ADD
    public async Task<IActionResult> CreateAsync([FromBody] TaskItem task)
    {
        var projectTasks = _context.Tasks.Where(t => t.ProjectId == task.ProjectId).ToList();
        task.TaskNumber = projectTasks.Any() ? projectTasks.Max(t => t.TaskNumber) + 1 : 1;
        
        //ADDS TO DB
        _context.Tasks.Add(task);
        //SAVE CHANGES
        _context.SaveChanges();
        await _hubContext.Clients.Group($"project-{task.ProjectId}").SendAsync("TaskCreated", task);
        return StatusCode(201, task);
    }

    [HttpPut("{id}")] 
    //PUT == UPDATE 
    //("{id}") is used to get the ID in the URL
    public async Task<IActionResult> UpdateAsync([FromRoute] int id, [FromBody] TaskItem updatedTask)
    {
        //DEBUG STATEMENTS
        //Console.WriteLine($"Incoming task ProjectId: {updatedTask.ProjectId}");
        //Console.WriteLine($"Incoming task-id: {id}");
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
        //DEBUG STATEMENTS
        //Console.WriteLine($"Broadcasting to project-{updatedTask.ProjectId}");
        //Console.WriteLine($"Broadcasting to task-{updatedTask.Id}");
        await _hubContext.Clients.Group($"project-{updatedTask.ProjectId}").SendAsync("TaskUpdated", updatedTask);

        return Ok(searchResult);
    }

    [HttpDelete("{id}")]
    //DELTE the ID in the URL
    public async Task<IActionResult> DeleteAsync([FromRoute] int id)
    {
        var searchResult = _context.Tasks.FirstOrDefault(task => task.Id == id);
        if(searchResult == null) return NotFound();
        _context.Tasks.Remove(searchResult);
        _context.SaveChanges();
        // Console.WriteLine($"Broadcasting to search-result:{searchResult.ProjectId}");
        // Console.WriteLine($"Broadcasting to search-result:{searchResult}");
        await _hubContext.Clients.Group($"project-{searchResult.ProjectId}").SendAsync("TaskDeleted", searchResult.Id);
        return Ok();
    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using track_tasks;
using track_tasks.Models;

namespace track_tasks.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class CommentsController(AppDbContext context, IHubContext<TaskHub> hubContext) : ControllerBase
{
    private AppDbContext _context = context;
    private IHubContext<TaskHub> _hubContext = hubContext;

    [HttpGet("{taskId}")]
    public IActionResult GetComments(int taskId)
    {
        var comments = _context.Comment
            .Where(c => c.TaskId == taskId)
            .OrderBy(c => c.CreatedAt)
            .Join(_context.Users, c => c.UserId, u => u.Id, (c, u) => new
            {
                c.Id,
                c.Content,
                c.CreatedAt,
                c.TaskId,
                c.UserId,
                u.Username
            })
            .ToList();

        return Ok(comments);
    }

    [HttpPost("{taskId}")]
    public async Task<IActionResult> CreateComment(int taskId, [FromBody] Comment comment)
    {
        var task = _context.Tasks.FirstOrDefault(t => t.Id == taskId);
        if(task == null) return NotFound();

        var userIdClaim = User.FindFirst("userId")?.Value;
        if(userIdClaim == null) return Unauthorized();

        comment.UserId = int.Parse(userIdClaim);
        comment.CreatedAt = DateTime.UtcNow;
        comment.TaskId = taskId;

        _context.Comment.Add(comment);
        _context.SaveChanges();

        var username = _context.Users.FirstOrDefault(u => u.Id == comment.UserId)?.Username;
        var commentResponse = new
        {
            comment.Id,
            comment.Content,
            comment.CreatedAt,
            comment.TaskId,
            comment.UserId,
            Username = username
        };

        await _hubContext.Clients.Group($"project-{task.ProjectId}").SendAsync("CommentAdded", commentResponse);
        return StatusCode(201, commentResponse);
    }

    [HttpDelete("{commentId}")]
    public async Task<IActionResult> DeleteComment(int commentId)
    {
        var comment = _context.Comment.FirstOrDefault(c => c.Id == commentId);
        if(comment == null) return NotFound();

        var task = _context.Tasks.FirstOrDefault(t => t.Id == comment.TaskId);
        if(task == null) return NotFound();

        _context.Comment.Remove(comment);
        _context.SaveChanges();
        await _hubContext.Clients.Group($"project-{task.ProjectId}").SendAsync("CommentRemoved", comment.Id);

        return Ok();
    }
}
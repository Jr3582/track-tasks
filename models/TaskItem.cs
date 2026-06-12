namespace track_tasks.Models;
public class TaskItem
{
    public int Id { get; set; }
    public int TaskNumber { get; set; }
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
    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = "";
    public Project? Project { get; set; }
}
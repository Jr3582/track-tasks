namespace track_tasks.Models;

public class Project
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string? Description { get; set; } = "";
    public string Owner { get; set; } = "";
    public DateTime DateCreated { get; set; }
}
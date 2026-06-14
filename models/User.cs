namespace track_tasks.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = "";
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
}
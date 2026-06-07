using Microsoft.EntityFrameworkCore;
using track_tasks.Models;

namespace track_tasks;

public class AppDbContext : DbContext
{
    public DbSet<TaskItem> Tasks { get; set; }
    public DbSet<Project> Projects { get; set; }
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }
}
//RUN:
//dotnet ef migrations add <name>
//dotnet ef database update
//THIS MAKES .NET AUTO CREATE THE SCHEMA'S FOR OUR DB

//APPDBCONTEXT.CS
//ESSENTIALLY THE BRDIGE BETWEEN C# CODE AND POSTGRES DB.
//BASICALLY SAYING "THERE'S A TABLE CALLED TASKS AND EACH ROW MAPS TO A TASKITEM OBJECT"
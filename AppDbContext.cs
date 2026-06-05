using Microsoft.EntityFrameworkCore;
using track_tasks.Models;

namespace track_tasks;

public class AppDbContext : DbContext
{
    public DbSet<TaskItem> Tasks { get; set; }
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }
}
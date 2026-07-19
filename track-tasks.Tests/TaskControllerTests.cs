using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using track_tasks;
using track_tasks.Controllers;
using track_tasks.Models;

public class TasksControllerTests
{
    private AppDbContext GetFakeDb()
    {
        //DbContextOptionsBuilder -> BUILDS A SETTINGS OBJECT FOR DB CONNECTION
        //.UseInMemoryDatabase(...) -> USES RAM INSTEAD OF POSTGRES
        //Guid.NewGuid().ToString() -> GENERATES RANDOM UNIQUE NAME, SO EVERY TESTS GES ITS OWN ISOLATED FRESH DB
        //new AppDbContext(options) -> MY ACTUAL CONTEXT CLASS
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public void GetTask_ReturnsNotFound_WhenTaskDoesNotExist()
    {
        var context = GetFakeDb();
        var controller = new TasksController(context);
        var result = controller.GetTask(999);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void GetTask_ReturnOk_WhenTaskExist()
    {
        var context = GetFakeDb();
        var controller = new TasksController(context);
        var task = new TaskItem{ Title = "Task 1"};
        context.Tasks.Add(task);
        context.SaveChanges();
        var result = controller.GetTask(1);
        Assert.IsType<OkObjectResult>(result);
    }
}
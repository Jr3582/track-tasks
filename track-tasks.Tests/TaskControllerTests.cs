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
    public void GetAll_ReturnsOk_WhenCalled()
    {
        
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
    public void GetTask_ReturnsOk_WhenTaskExist()
    {
        var context = GetFakeDb();
        var controller = new TasksController(context);
        var task = new TaskItem { Title = "Task 1" };
        context.Tasks.Add(task);
        context.SaveChanges();
        var result = controller.GetTask(1);
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public void Create_ReturnsCreated_WhenRequestIsValid()
    {
        var context = GetFakeDb();
        var task = new TaskItem { Title = "Task1", ProjectId = 1 };
        var controller = new TasksController(context);
        var result = controller.Create(task);
        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(201, objectResult.StatusCode);
    }

    [Fact]
    public void Create_IncrementsTaskNumber_WhenTaskExistsInSameProject()
    {
        var context = GetFakeDb();
        var controller = new TasksController(context);

        var task1 = new TaskItem { Title = "Task1", ProjectId = 1 };
        controller.Create(task1);

        var task2 = new TaskItem { Title = "Task2", ProjectId = 1 };
        controller.Create(task2);

        Assert.Equal(task1.TaskNumber + 1, task2.TaskNumber);
    }

    [Fact]
    public void Update_ReturnsNotFound_WhenTaskDoesNotExist()
    {
        var context = GetFakeDb();
        var controller = new TasksController(context);
        var updatedTask = new TaskItem { Title = "Updated Task" };
        var result = controller.Update(999, updatedTask);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void Update_ReturnsOk_WhenTaskExists()
    {
        var context = GetFakeDb();
        var oldTask = new TaskItem { Title = "Old Task" };
        context.Add(oldTask);
        context.SaveChanges();
        var controller = new TasksController(context);
        var updatedTask = new TaskItem { Title = "Updated Task" };
        var result = controller.Update(oldTask.Id, updatedTask);
        Assert.IsType<OkObjectResult>(result);
        Assert.Equal(updatedTask.Title, oldTask.Title);
    }

    [Fact]
    public void Delete_ReturnsNotFound_WhenTaskDoesNotExist()
    {
        var context = GetFakeDb();
        var controller = new TasksController(context);
        var result = controller.Delete(999);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void Delete_ReturnsOk_WhenTaskExists()
    {
        var context = GetFakeDb();
        var task = new TaskItem { Title = "Task1" };
        context.Tasks.Add(task);
        context.SaveChanges();
        var controller = new TasksController(context);
        var result = controller.Delete(task.Id);
        Assert.IsType<OkResult>(result);
        Assert.Null(context.Tasks.FirstOrDefault(t => t.Id == task.Id));
    }
}
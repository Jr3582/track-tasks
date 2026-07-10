using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using track_tasks;
using track_tasks.Controllers;
using track_tasks.Models;

public class ProjectsControllerTests
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
    public void GetProject_ReturnsNotFound_WhenProjectDoesNotExist()
    {
        var context = GetFakeDb();
        //INITIALIZE FAKE DB FOR PROJECT CONTROLLER
        var controller = new ProjectsController(context);
        //FEED IN A RESULT THAT WILL 100% RETURN NOT FOUND
        var result = controller.GetProject(999);
        //FEED IN EXPECTED RESULT IN THIS CASE WE WANT NOT FOUND
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void GetProject_ReturnsOk_WhenProjectExists()
    {
        var context = GetFakeDb();
        var project = new Project { Title = "Test"};
        context.Projects.Add(project);
        context.SaveChanges();
        var controller = new ProjectsController(context);
        var result = controller.GetProject(project.Id);
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public void DeleteProject_ReturnsNotFound_WhenProjectDoesNotExist()
    {
        var context = GetFakeDb();
        var controller = new ProjectsController(context);
        var result = controller.DeleteProject(999);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void DeleteProject_ReturnsOk_WhenProjectExists()
    {
        var context = GetFakeDb();
        var project = new Project { Title = "Test" };
        context.Projects.Add(project);
        context.SaveChanges();
        var controller = new ProjectsController(context);
        var result = controller.DeleteProject(project.Id);
        Assert.IsType<OkResult>(result);
    }
}
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
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
    private void FakeLogin(ProjectsController controller, int userId)
    {
        var claims = new List<Claim> { new Claim("userId", userId.ToString()) };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var user = new ClaimsPrincipal(identity);

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = user }
        };
    }
    [Fact]
    public void GetAll_ReturnsOnlyCallersProjects_WhenMultipleUsersExist()
    {
        var context = GetFakeDb();

        var user1 = new User { Username = "John Doe", Password = "test123" };
        var user2 = new User { Username = "Jane Doe", Password = "test123" };
        context.Users.AddRange(user1, user2);
        context.SaveChanges();

        var myProject = new Project { Title = "My Project" };
        var otherProject = new Project { Title = "Not Mine" };
        context.Projects.AddRange(myProject, otherProject);
        context.SaveChanges();

        context.UsersToProjects.Add(new UsersToProjects { UserId = user1.Id, ProjectId = myProject.Id });
        context.UsersToProjects.Add(new UsersToProjects { UserId = user2.Id, ProjectId = otherProject.Id });
        context.SaveChanges();

        var controller = new ProjectsController(context);
        FakeLogin(controller, user1.Id);

        var result = controller.GetAll();

        var objectResult = Assert.IsType<OkObjectResult>(result);
        var projects = Assert.IsAssignableFrom<IEnumerable<Project>>(objectResult.Value);

        Assert.Contains(projects, p => p.Id == myProject.Id);
        Assert.DoesNotContain(projects, p => p.Id == otherProject.Id);
    }

    [Fact]
    public void GetProject_ReturnsNotFound_WhenProjectDoesNotExist()
    {
        //INITIALIZE FAKE DB FOR PROJECT CONTROLLER
        var context = GetFakeDb();
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
        var project = new Project { Title = "Test" };
        context.Projects.Add(project);
        context.SaveChanges();
        var controller = new ProjectsController(context);
        var result = controller.GetProject(project.Id);
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public void CreateProject_Returns201_WhenRequestIsValid()
    {
        var context = GetFakeDb();
        var user = new User { Username = "John Doe", Password = "test123" };
        context.Users.Add(user);
        context.SaveChanges();
        //FAKE LOGIN WITH FAKE USER
        var project = new Project { Title = "Test" };
        var controller = new ProjectsController(context);
        FakeLogin(controller, user.Id);
        var result = controller.CreateProject(project);
        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(201, objectResult.StatusCode);
        Assert.NotNull(context.UsersToProjects.FirstOrDefault(
            p => p.UserId == user.Id && p.ProjectId == project.Id));
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

    [Fact]
    public void AddUserToProject_ReturnsNotFound_WhenUserDoesNotExist()
    {
        var context = GetFakeDb();
        var controller = new ProjectsController(context);
        FakeLogin(controller, 1);
        var request = new AddMemberRequest { Username = "John Doe" };
        var result = controller.AddUserToProject(request, 1);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public void AddUserToProject_ReturnsNotFound_WhenProjectDoesNotExist()
    {
        var context = GetFakeDb();
        //ADD FAKE USER INTO DB
        var user = new User { Username = "John Doe", Password = "test123" };
        context.Users.Add(user);
        context.SaveChanges();
        var controller = new ProjectsController(context);
        //FAKE LOGIN WITH FAKE USER
        FakeLogin(controller, user.Id);
        //INITIALIZE REQUEST TO ADD FAKE USER
        var request = new AddMemberRequest { Username = "John Doe" };
        var result = controller.AddUserToProject(request, 999);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public void AddUserToProject_ReturnsConflict_WhenUserAlreadyMember()
    {
        var context = GetFakeDb();
        //SEED FAKE USER
        var user = new User { Username = "John Doe", Password = "test123" };
        context.Users.Add(user);
        context.SaveChanges();
        //SEED FAKE PROJECT
        var project = new Project { Title = "Test Title" };
        context.Projects.Add(project);
        context.SaveChanges();
        //SEED FAKE USER TO PROJECT RELATIONSHIP
        var userToProject = new UsersToProjects { UserId = user.Id, ProjectId = project.Id };
        context.UsersToProjects.Add(userToProject);
        context.SaveChanges();
        var controller = new ProjectsController(context);
        FakeLogin(controller, user.Id);
        var request = new AddMemberRequest { Username = "John Doe" };
        //TRY AND ADD THE SAME USER TO THE PROJECT
        var result = controller.AddUserToProject(request, project.Id);
        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public void AddUserToProject_ReturnsForbidden_WhenCallerNotMember()
    {
        var context = GetFakeDb();
        var user = new User { Username = "John Doe", Password = "test123" };
        context.Users.Add(user);
        context.SaveChanges();
        var project = new Project { Title = "Test Title" };
        context.Projects.Add(project);
        context.SaveChanges();
        var controller = new ProjectsController(context);
        FakeLogin(controller, 999);
        var request = new AddMemberRequest { Username = "John Doe" };
        var result = controller.AddUserToProject(request, project.Id);
        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(403, objectResult.StatusCode);
    }

    [Fact]
    public void AddUserToProject_Returns201_WhenRequestIsValid()
    {
        var context = GetFakeDb();
        var target = new User { Username = "John Doe", Password = "test123" };
        context.Users.Add(target);
        context.SaveChanges();
        var caller = new User { Username = "Jimmy Ren", Password = "test1234" };
        context.Users.Add(caller);
        context.SaveChanges();
        var project = new Project { Title = "Test Title" };
        context.Projects.Add(project);
        context.SaveChanges();
        var userToProject = new UsersToProjects { UserId = caller.Id, ProjectId = project.Id };
        context.UsersToProjects.Add(userToProject);
        context.SaveChanges();
        var controller = new ProjectsController(context);
        FakeLogin(controller, caller.Id);
        var request = new AddMemberRequest { Username = "John Doe" };
        var result = controller.AddUserToProject(request, project.Id);
        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(201, objectResult.StatusCode);
        Assert.NotNull(context.UsersToProjects.FirstOrDefault(
            p => p.UserId == target.Id && p.ProjectId == project.Id));
    }
}
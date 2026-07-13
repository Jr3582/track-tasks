using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace track_tasks.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class AiController(IConfiguration configuration) : ControllerBase
{
    [HttpPost("generateDescription")]
    public async Task<IActionResult> GenerateDescription([FromBody] GenerateDescriptionRequest request)
    {
        var payload = new
        {
            model = "claude-sonnet-4-6",
            max_tokens = 1024,
            messages = new[] {
                new
                {
                    role = "user",
                    content = $"Write a description for a task titled '{request.Title}'. " +
                          "Include a one-sentence goal and 3-5 acceptance criteria as plain-text dashes, " +
                          "each criterion on its own line. Under 100 words. " +
                          "Respond with ƒnly the description itself — no preamble, no markdown."
                }
            }
        };

        //SEND API CALL TO CLAUDE
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("x-api-key", configuration["Anthropic:ApiKey"]);
        client.DefaultRequestHeaders.Add("anthropic-version", "2023-06-01");
        
        var response = await client.PostAsJsonAsync("https://api.anthropic.com/v1/messages", payload);
        if (!response.IsSuccessStatusCode)
            return StatusCode(502, "AI service unavailable.");

        //GET THE REPLY
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        var description = json.GetProperty("content")[0].GetProperty("text").GetString();

        return Ok(new { description });
    }

}

public class GenerateDescriptionRequest
{
    public string Title { get; set; }
}
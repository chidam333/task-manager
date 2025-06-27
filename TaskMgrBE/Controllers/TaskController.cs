namespace TaskMgrBE.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using TaskMgrBE.Contexts;
using TaskMgrBE.Models;
using TaskMgrBE.Dtos;

[ApiController]
[Route("api/v1/task")]
public class TaskController : ControllerBase
{
    private readonly TaskMgrContext _context;

    public TaskController(TaskMgrContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetTasks()
    {
        var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var tasks = _context.UTasks.Where(t => t.UserId == user.Id).ToList();
        var taskResponseDtos = tasks.Select(t => new TaskResponseDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            DueDate = t.DueDate == default(DateTime) ? null : t.DueDate,
            Status = t.Status,
            Priority = t.Priority,
            CreatedAt = t.CreatedAt,
            UserId = t.UserId
        }).ToList();

        return Ok(taskResponseDtos);
    }

    [HttpPost]
    [Authorize]
    public IActionResult CreateTask([FromBody] CreateTaskDto createTaskDto)
    {
        if (createTaskDto == null || string.IsNullOrEmpty(createTaskDto.Title))
        {
            return BadRequest("Invalid task data.");
        }
        var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);
        if (user == null)
        {
            return NotFound("User not found.");
        }
        var task = new UTask
        {
            Title = createTaskDto.Title,
            Description = createTaskDto.Description ?? string.Empty,
            DueDate = createTaskDto.DueDate ?? default(DateTime),
            Status = createTaskDto.Status ?? string.Empty,
            Priority = createTaskDto.Priority ?? string.Empty,
            CreatedAt = DateTime.UtcNow,
            UserId = user.Id
        };

        _context.UTasks.Add(task);
        _context.SaveChanges();

        var responseDto = new TaskResponseDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate == default(DateTime) ? null : task.DueDate,
            Status = task.Status,
            Priority = task.Priority,
            CreatedAt = task.CreatedAt,
            UserId = task.UserId
        };

        return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, responseDto);
    }

    [HttpPut("{id}")]
    [Authorize]
    public IActionResult UpdateTask(int id, [FromBody] UpdateTaskDto updateTaskDto)
    {
        var TitleUpdated = false;
        var DescriptionUpdated = false;
        var DueDateUpdated = false;
        var StatusUpdated = false;
        var PriorityUpdated = false;

        if (updateTaskDto == null || string.IsNullOrEmpty(updateTaskDto.Title))
        {
            return BadRequest("Invalid task data.");
        }

        var task = _context.UTasks.Find(id);
        if (task == null)
        {
            return NotFound("Task not found.");
        }

        var newStatus = updateTaskDto.Status ?? string.Empty;
        var newPriority = updateTaskDto.Priority ?? string.Empty;

        if (!String.Equals(task.Status, newStatus) && !String.Equals(task.Priority, newPriority))
        {
            _context.UTaskHistories.Add(new UTaskHistory
            {
                UTaskId = task.Id,
                Status = task.Status,
                Priority = task.Priority,
                ChangedAt = DateTime.UtcNow
            });
            StatusUpdated = true;
            PriorityUpdated = true;
        }
        else if (!String.Equals(task.Priority, newPriority))
        {
            _context.UTaskHistories.Add(new UTaskHistory
            {
                UTaskId = task.Id,
                Priority = task.Priority,
                ChangedAt = DateTime.UtcNow
            });
            PriorityUpdated = true;
        }
        else if (!String.Equals(task.Status, newStatus))
        {
            _context.UTaskHistories.Add(new UTaskHistory
            {
                UTaskId = task.Id,
                Status = task.Status,
                ChangedAt = DateTime.UtcNow
            });
            StatusUpdated = true;
        }

        if (!String.Equals(task.Title, updateTaskDto.Title))
        {
            task.Title = updateTaskDto.Title;
            TitleUpdated = true;
        }
        if (!String.Equals(task.Description, updateTaskDto.Description))
        {
            task.Description = updateTaskDto.Description ?? string.Empty;
            DescriptionUpdated = true;
        }
        if (task.DueDate != (updateTaskDto.DueDate ?? default(DateTime)))
        {
            task.DueDate = updateTaskDto.DueDate ?? default(DateTime);
            DueDateUpdated = true;
        }
        if (!String.Equals(task.Status, newStatus))
        {
            task.Status = newStatus;
        }
        if (!String.Equals(task.Priority, newPriority))
        {
            task.Priority = newPriority;
        }
        _context.UTasks.Update(task);
        _context.SaveChanges();
        var responseDto = new TaskUpdateResponseDto
        {
            Message = "Task updated successfully.",
            Task = new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                DueDate = task.DueDate == default(DateTime) ? null : task.DueDate,
                Status = task.Status,
                Priority = task.Priority,
                CreatedAt = task.CreatedAt,
                UserId = task.UserId
            },
            TitleUpdated = TitleUpdated,
            DescriptionUpdated = DescriptionUpdated,
            DueDateUpdated = DueDateUpdated,
            StatusUpdated = StatusUpdated,
            PriorityUpdated = PriorityUpdated
        };

        return Ok(responseDto);
    }
}
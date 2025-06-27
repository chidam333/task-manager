namespace TaskMgrBE.Dtos;

public class TaskUpdateResponseDto
{
    public string Message { get; set; } = string.Empty;
    public TaskResponseDto Task { get; set; } = null!;
    public bool TitleUpdated { get; set; }
    public bool DescriptionUpdated { get; set; }
    public bool DueDateUpdated { get; set; }
    public bool StatusUpdated { get; set; }
    public bool PriorityUpdated { get; set; }
}

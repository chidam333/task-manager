namespace TaskMgrBE.Models;

public class UTaskHistory
{
    public int Id { get; set; }
    public int UTaskId { get; set; }
    public UTask UTask { get; set; } = null!;
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
}

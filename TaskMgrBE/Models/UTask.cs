namespace TaskMgrBE.Models;

public class UTask
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = "";
    public DateTime DueDate { get; set; }
    public string Status { get; set; } = "";
    public string Priority { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public ICollection<UTaskHistory> Histories { get; set; } = new List<UTaskHistory>();
}
namespace TaskMgrBE.Contexts;
using Microsoft.EntityFrameworkCore;
using TaskMgrBE.Models;

public class TaskMgrContext : DbContext
{
    public TaskMgrContext(DbContextOptions<TaskMgrContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<UTask> UTasks { get; set; } = null!;
    public DbSet<UTaskHistory> UTaskHistories { get; set; } = null!;
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired();
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.HasMany(e => e.Tasks)
                .WithOne(t => t.User)
                .HasForeignKey(t => t.UserId);
        });
        modelBuilder.Entity<UTask>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
        });
        modelBuilder.Entity<UTaskHistory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ChangedAt).IsRequired();
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.Priority).IsRequired();
            entity.HasOne(e => e.UTask)
                .WithMany(t => t.Histories)
                .HasForeignKey(e => e.UTaskId);
        });
    }
}

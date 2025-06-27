using Scalar.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TaskMgrBE.Contexts;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi(
options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        document.Components ??= new();
        document.Components.SecuritySchemes ??= new Dictionary<string, Microsoft.OpenApi.Models.OpenApiSecurityScheme>();

        document.Components.SecuritySchemes["BearerAuth"] = new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            Description = "Enter JWT Bearer token"
        };

        // Add security requirement to all operations
        var securityRequirement = new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
        {
            {
                new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Reference = new Microsoft.OpenApi.Models.OpenApiReference
                    {
                        Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                        Id = "BearerAuth"
                    }
                },
                new string[] {}
            }
        };

        // Apply security requirement to all operations
        foreach (var path in document.Paths.Values)
        {
            foreach (var operation in path.Operations.Values)
            {
                operation.Security ??= new List<Microsoft.OpenApi.Models.OpenApiSecurityRequirement>();
                operation.Security.Add(securityRequirement);
            }
        }

        return Task.CompletedTask;
    });
}


);
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://127.0.0.1:5500", "http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
    options.JsonSerializerOptions.WriteIndented = true;
});

builder.Services.AddDbContext<TaskMgrContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options => options
        .AddPreferredSecuritySchemes("BearerAuth")
        .AddHttpAuthentication("BearerAuth", auth =>
        {
            auth.Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImkxIiwiZW1haWwiOiJpMUBnbWFpbC5jb20iLCJyb2xlIjoiaW5zdHJ1Y3RvciIsIm5iZiI6MTc0OTY2NDI2NywiZXhwIjoxNzQ5NzUwNjY3LCJpYXQiOjE3NDk2NjQyNjd9.4DunWj9Mq5oYuNl6RDEmIGbwDgTxN7ZnzKXYIcdI7Zs";
        })
    );

}

app.UseHttpsRedirection();

app.Run();
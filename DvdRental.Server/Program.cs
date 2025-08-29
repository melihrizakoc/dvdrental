using DvdRental.Server.Data;
using DvdRental.Server.Services.Actor;
using DvdRental.Server.Services.Category;
using DvdRental.Server.Services.Film;
using Microsoft.EntityFrameworkCore;

namespace DvdRental.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy
                        .WithOrigins("http://localhost:5260")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });


            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Register the DvdRentalDBContext with DI and configure its SQL Server provider.
            builder.Services.AddDbContext<DvdRentalDBContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));            

            // Register Services
            builder.Services.AddScoped<IActorService, ActorService>();
            builder.Services.AddScoped<IFilmService, FilmService>();
            builder.Services.AddScoped<ICategoryService, CategoryService>();

            // Swagger servislerini tanımla
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            app.UseCors("AllowFrontend");

            app.UseDefaultFiles();
            app.MapStaticAssets();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();        // JSON endpoint oluşturur
                app.UseSwaggerUI();      // Swagger arayüzünü açar
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}

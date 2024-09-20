using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.OpenApi.Models;
using taksi_server.Context;
using taksi_server.Interfaces.Repositories;
using taksi_server.Interfaces;
using taksi_server.Repositories;
using taksi_server.Services;
using Microsoft.EntityFrameworkCore;
using taksi_server.Mapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using taksi_server.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSignalR();
builder.Services.AddSingleton<RideTimerService>();
builder.Services.AddControllers();

builder.Services.AddSwaggerGen(c =>
{
	c.SwaggerDoc("v1", new OpenApiInfo { Title = "PuSGSProjekat", Version = "v1" });


	c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
	{
		In = ParameterLocation.Header,
		Description = "Please enter token",
		Name = "Authorization",
		Type = SecuritySchemeType.Http,
		BearerFormat = "JWT",
		Scheme = "bearer"
	});

	c.AddSecurityRequirement(new OpenApiSecurityRequirement()
				{
					{
						new OpenApiSecurityScheme()
						{
							Reference = new OpenApiReference()
							{
								Type = ReferenceType.SecurityScheme,
								Id = "Bearer"
							}
						},
						new string[] {}
					}
				});
});

builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
	options.TokenValidationParameters = new TokenValidationParameters()
	{
		ValidateIssuer = true,
		ValidateAudience = false,
		ValidateLifetime = true,
		ValidateIssuerSigningKey = true,
		ValidIssuer = "http://localhost:44379",
		IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["SecretKey"]))
	};
});

builder.Services.AddAuthorization(options =>
{
	options.AddPolicy("IsVerifiedDriver", policy => policy.RequireClaim("VerificationState", "Accepted"));
});
builder.Services.AddCors(options =>
{
	options.AddPolicy(name: "cors", builder =>
	{
		builder
		.WithOrigins("http://localhost:4200")
		.AllowAnyHeader()
		.AllowAnyMethod()
		.AllowCredentials();
	});
});


builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepositories, UserRepository>();

builder.Services.AddScoped<IRideService, RideService>();
builder.Services.AddScoped<IRideRepositories, RideRepository>();

builder.Services.AddDbContext<DatabaseContext>(options =>
{
	options.UseSqlServer(builder.Configuration.GetConnectionString("DatabaseConnectionString"));
	//options.UseExceptionProcessor();
	//JUMP:
});

MapperConfiguration mapperConfig = new MapperConfiguration(mc =>
{
	mc.AddProfile(new MapProfiles());
});

IMapper mapper = mapperConfig.CreateMapper();
builder.Services.AddSingleton(mapper);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("cors");
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();


//JUMP: huh ?
app.MapHub<RideHub>("/rideHub");

app.MapControllers();

app.Run();

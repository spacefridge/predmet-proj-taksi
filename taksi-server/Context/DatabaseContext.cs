using Microsoft.EntityFrameworkCore;
using taksi_server.Models;

namespace taksi_server.Context
{
	public class DatabaseContext : DbContext
	{
		public DbSet<User> Users { get; set; }

		public DatabaseContext(DbContextOptions options) : base(options)
		{
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.ApplyConfigurationsFromAssembly(typeof(DatabaseContext).Assembly);
		}
	}
}

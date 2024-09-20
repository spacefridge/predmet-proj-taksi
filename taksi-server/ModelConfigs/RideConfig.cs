using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using taksi_server.Enumerations;
using taksi_server.Models;

namespace taksi_server.ModelConfigs
{
	public class RideConfig  : IEntityTypeConfiguration<Ride>
	{
		public void Configure(EntityTypeBuilder<Ride> builder)
		{
			builder.HasKey(x => x.Id);

			builder.Property(x => x.Id).ValueGeneratedOnAdd();

			builder.Property(x => x.StartAddress).IsRequired();
			builder.Property(x => x.EndAddress).IsRequired();

			builder.Property(x => x.UserId).IsRequired();
			builder.Property(x => x.DriverId);

			builder.Property(x => x.Price);
			builder.Property(x => x.RideDuration);
			builder.Property(x => x.WaitTime);
			builder.Property(x => x.RideState).HasConversion<string>();

			//builder.Property(x => x.Comment).HasMaxLength(100);

			//builder.Property(x => x.Address).IsRequired().HasMaxLength(20);

			//builder
			//	.HasOne(x => x.Article)
			//	.WithMany(x => x.Orders)
			//	.HasForeignKey(x => x.ArticleId);

			//builder
			//	.HasOne(x => x.Buyer)
			//	.WithMany(x => x.Orders)
			//	.HasForeignKey(x => x.BuyerId)
			//	.OnDelete(DeleteBehavior.Restrict);

			
		}
	}
}


//public long Id { get; set; }

//public string StartAddress { get; set; }
//public string EndAddress { get; set; }

//public long UserId { get; set; }
//public long DriverId { get; set; }

//public long Price { get; set; }
//public long RideDuration { get; set; }
//public long WaitTime { get; set; }
//public RideState RideState { get; set; }
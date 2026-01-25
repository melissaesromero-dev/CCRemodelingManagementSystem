using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Configurations
{
    public class QuoteConfiguration : IEntityTypeConfiguration<Quote>
    {
        public void Configure(EntityTypeBuilder<Quote> builder)
        {
            // Computed total cost estimate column
            builder.Property(q => q.TotalCostEstimate)
                .HasComputedColumnSql("[MaterialCostEstimate] + [LaborCostEstimate]", stored: true);

            
        }
    }
}

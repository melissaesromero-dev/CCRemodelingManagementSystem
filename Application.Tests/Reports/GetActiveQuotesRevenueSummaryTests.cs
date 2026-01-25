using Application.Reports.Queries;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain;
using Xunit;

namespace Application.Tests.Reports
{
    public class GetActiveQuotesRevenueSummaryTests
    {
        [Fact]
        public async Task Returns_correct_totals_for_active_quotes()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<CCRemodelDbContext>()
                .UseInMemoryDatabase(databaseName: $"QuotesReportDb_{Guid.NewGuid()}")
                .Options;

            await using var context = new CCRemodelDbContext(options);

            context.Quotes.AddRange(
                new Quote
                {
                    Id = "1",
                    ServiceRequestId = "SR1",
                    StatusId = 1,
                    LaborCostEstimate = 600m,
                    MaterialCostEstimate = 400m
                },
                new Quote
                {
                    Id = "2",
                    ServiceRequestId = "SR2",
                    StatusId = 1,
                    LaborCostEstimate = 1500m,
                    MaterialCostEstimate = 1000m
                },
                new Quote
                {
                    Id = "3",
                    ServiceRequestId = "SR3",
                    StatusId = 2, // not active
                    LaborCostEstimate = 3000m,
                    MaterialCostEstimate = 2000m
                }
            );

            await context.SaveChangesAsync();

            var handler = new GetActiveQuotesRevenueSummary.Handler(context);

            // Act
            var result = await handler.Handle(
                new GetActiveQuotesRevenueSummary.Query(),
                CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Value);
            Assert.Equal(2, result.Value.ActiveQuoteCount);
            Assert.Equal(3500m, result.Value.TotalPotentialIncome);
        }

        [Fact]
        public async Task Returns_zero_when_there_are_no_active_quotes()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<CCRemodelDbContext>()
                .UseInMemoryDatabase(databaseName: $"QuotesReportDb_{Guid.NewGuid()}")
                .Options;

            await using var context = new CCRemodelDbContext(options);

            // Only inactive quotes
            context.Quotes.AddRange(
                new Quote { ServiceRequestId = "SR10", StatusId = 2, LaborCostEstimate = 1000m, MaterialCostEstimate = 500m },
                new Quote { ServiceRequestId = "SR11", StatusId = 3, LaborCostEstimate = 2000m, MaterialCostEstimate = 750m }
            );

            await context.SaveChangesAsync();

            var handler = new GetActiveQuotesRevenueSummary.Handler(context);

            // Act
            var result = await handler.Handle(new GetActiveQuotesRevenueSummary.Query(), CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Value);
            Assert.Equal(0, result.Value.ActiveQuoteCount);
            Assert.Equal(0m, result.Value.TotalPotentialIncome);
        }
    }
}

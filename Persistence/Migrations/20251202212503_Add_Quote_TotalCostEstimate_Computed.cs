using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Add_Quote_TotalCostEstimate_Computed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "TotalCostEstimate",
                table: "Quotes",
                type: "TEXT",
                nullable: false,
                computedColumnSql: "[MaterialCostEstimate] + [LaborCostEstimate]",
                stored: true,
                oldClrType: typeof(decimal),
                oldType: "TEXT");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "TotalCostEstimate",
                table: "Quotes",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "TEXT",
                oldComputedColumnSql: "[MaterialCostEstimate] + [LaborCostEstimate]");
        }
    }
}

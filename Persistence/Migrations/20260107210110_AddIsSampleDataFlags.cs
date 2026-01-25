using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIsSampleDataFlags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsSampleData",
                table: "ServiceRequests",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsSampleData",
                table: "Quotes",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsSampleData",
                table: "EstimateAppointments",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsSampleData",
                table: "Customers",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSampleData",
                table: "ServiceRequests");

            migrationBuilder.DropColumn(
                name: "IsSampleData",
                table: "Quotes");

            migrationBuilder.DropColumn(
                name: "IsSampleData",
                table: "EstimateAppointments");

            migrationBuilder.DropColumn(
                name: "IsSampleData",
                table: "Customers");
        }
    }
}

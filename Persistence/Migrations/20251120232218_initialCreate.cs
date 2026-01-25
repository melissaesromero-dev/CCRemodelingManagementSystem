using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class initialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BudgetRanges",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Description = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BudgetRanges", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    CustNum = table.Column<int>(type: "INTEGER", nullable: false),
                    FirstName = table.Column<string>(type: "TEXT", nullable: false),
                    LastName = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Phone = table.Column<string>(type: "TEXT", nullable: false),
                    Address = table.Column<string>(type: "TEXT", nullable: true),
                    City = table.Column<string>(type: "TEXT", nullable: false),
                    StateId = table.Column<int>(type: "INTEGER", nullable: false),
                    Zip = table.Column<string>(type: "TEXT", nullable: true),
                    ContactMethod = table.Column<int>(type: "INTEGER", nullable: false),
                    StatusId = table.Column<int>(type: "INTEGER", nullable: false),
                    BestTime = table.Column<int>(type: "INTEGER", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EstimateAppointments",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    EstApptNum = table.Column<int>(type: "INTEGER", nullable: false),
                    ServiceRequestId = table.Column<string>(type: "TEXT", nullable: false),
                    StatusId = table.Column<int>(type: "INTEGER", nullable: false),
                    ScheduledDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ScheduledTime = table.Column<TimeSpan>(type: "TEXT", nullable: true),
                    Notes = table.Column<string>(type: "TEXT", nullable: true),
                    CreationDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EstimateAppointments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EstimateApptStatuses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Description = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EstimateApptStatuses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Quotes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    QuoteNum = table.Column<int>(type: "INTEGER", nullable: false),
                    ServiceRequestId = table.Column<string>(type: "TEXT", nullable: false),
                    StatusId = table.Column<int>(type: "INTEGER", nullable: false),
                    MaterialDetails = table.Column<string>(type: "TEXT", nullable: true),
                    MaterialCostEstimate = table.Column<decimal>(type: "TEXT", nullable: false),
                    LaborDetails = table.Column<string>(type: "TEXT", nullable: true),
                    LaborCostEstimate = table.Column<decimal>(type: "TEXT", nullable: false),
                    TotalCostEstimate = table.Column<decimal>(type: "TEXT", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quotes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "QuoteStatuses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Description = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuoteStatuses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServiceMainTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Description = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceMainTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServiceRequests",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    ReqNum = table.Column<int>(type: "INTEGER", nullable: false),
                    CustomerId = table.Column<string>(type: "TEXT", nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    MainServiceTypeId = table.Column<int>(type: "INTEGER", nullable: false),
                    SubServiceTypeId = table.Column<int>(type: "INTEGER", nullable: false),
                    ServiceDesc = table.Column<string>(type: "TEXT", maxLength: 4000, nullable: false),
                    ServiceAddress = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    ServiceCity = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    ServiceStateId = table.Column<int>(type: "INTEGER", nullable: false),
                    ServiceZip = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    BudgetRangeId = table.Column<int>(type: "INTEGER", nullable: false),
                    DesiredStartDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    StatusId = table.Column<int>(type: "INTEGER", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceRequests", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServiceRequestStatuses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Description = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceRequestStatuses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServiceSubTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MainTypeId = table.Column<int>(type: "INTEGER", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceSubTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "States",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ShortName = table.Column<string>(type: "TEXT", nullable: false),
                    LongName = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_States", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    FirstName = table.Column<string>(type: "TEXT", nullable: false),
                    LastName = table.Column<string>(type: "TEXT", nullable: false),
                    UserTypeId = table.Column<int>(type: "INTEGER", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTypes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BudgetRanges_Description",
                table: "BudgetRanges",
                column: "Description",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Customers_CustNum",
                table: "Customers",
                column: "CustNum",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EstimateAppointments_EstApptNum",
                table: "EstimateAppointments",
                column: "EstApptNum",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EstimateAppointments_ServiceRequestId",
                table: "EstimateAppointments",
                column: "ServiceRequestId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EstimateApptStatuses_Description",
                table: "EstimateApptStatuses",
                column: "Description",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Quotes_QuoteNum",
                table: "Quotes",
                column: "QuoteNum",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuoteStatuses_Description",
                table: "QuoteStatuses",
                column: "Description",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceMainTypes_Description",
                table: "ServiceMainTypes",
                column: "Description",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequests_ReqNum",
                table: "ServiceRequests",
                column: "ReqNum",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequestStatuses_Description",
                table: "ServiceRequestStatuses",
                column: "Description",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceSubTypes_Description",
                table: "ServiceSubTypes",
                column: "Description",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_States_ShortName",
                table: "States",
                column: "ShortName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserTypes_Name",
                table: "UserTypes",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BudgetRanges");

            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropTable(
                name: "EstimateAppointments");

            migrationBuilder.DropTable(
                name: "EstimateApptStatuses");

            migrationBuilder.DropTable(
                name: "Quotes");

            migrationBuilder.DropTable(
                name: "QuoteStatuses");

            migrationBuilder.DropTable(
                name: "ServiceMainTypes");

            migrationBuilder.DropTable(
                name: "ServiceRequests");

            migrationBuilder.DropTable(
                name: "ServiceRequestStatuses");

            migrationBuilder.DropTable(
                name: "ServiceSubTypes");

            migrationBuilder.DropTable(
                name: "States");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "UserTypes");
        }
    }
}

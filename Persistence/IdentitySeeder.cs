using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence
{
    public static class IdentitySeeder
    {
        public static async Task SeedUsersAsync(
            UserManager<User> userManager,
            CCRemodelDbContext context)
        {

            // Required baseline users:
            var seedUsers = new[]
            {
                new { UserName = "admin1",     FirstName = "Alex",   LastName = "Admin",   UserTypeId = 1 },
                new { UserName = "admin2",     FirstName = "Avery",  LastName = "Admin",   UserTypeId = 1 },
                new { UserName = "staff1",     FirstName = "Sam",    LastName = "Staff",   UserTypeId = 2 },
                new { UserName = "staff2",     FirstName = "Skyler", LastName = "Staff",   UserTypeId = 2 },
                new { UserName = "superadmin", FirstName = "Sage",   LastName = "Super",   UserTypeId = 4 },
            };

            var defaultPassword = Environment.GetEnvironmentVariable("SEED_DEFAULT_PASSWORD") ?? "Pa$$w0rd1";


            foreach (var u in seedUsers)
            {
                string email = $"{u.UserName}@example.com";

                // Check if user exists already
                var existing = await userManager.Users.AnyAsync(x => x.UserName == email || x.Email == email);

                if (existing) continue;

                var user = new User
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    UserTypeId = u.UserTypeId,
                    CreationDate = DateTime.UtcNow,
                };

                var result = await userManager.CreateAsync(user, defaultPassword);

                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new Exception($"Failed to create seed user '{u.UserName}': {errors}.");
                }
            }
        }
    }
}

using System;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Domain;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace Persistence;

public class DbInit
{
    //Add all look-up tables and users
    public static async Task AddRequiredDataAsync(CCRemodelDbContext db)
    {
        #region Add Required Look Up Table Data (States, UserTypes, ServiceMainTypes, ServiceSubTypes, ServiceRequestStatuses, EstimateAppiontmentStatuses, QuoteStatuses, BudgetRanges)

        await using var requiredLoadTx = await db.Database.BeginTransactionAsync();

        //User Types
        await db.Database.ExecuteSqlRawAsync("""
        INSERT OR IGNORE INTO "UserTypes" ("Id", "Name") 
        VALUES (1,'admin'), (2, 'staff'), (3, 'customer'), (4, 'superAdmin');
        """);

        //State
        await db.Database.ExecuteSqlRawAsync("""
        INSERT OR IGNORE INTO "States" ("Id","ShortName","LongName") 
        VALUES (1,'AL','Alabama'), (2,'AK','Alaska'), (3,'AZ','Arizona'), (4,'AR','Arkansas'), (5,'CA','California'), (6,'CO','Colorado'), (7,'CT','Connecticut'), (8,'DE','Delaware'), (9,'FL','Florida'), (10,'GA','Georgia'), (11,'HI','Hawaii'), (12,'ID','Idaho'), (13,'IL','Illinois'), (14,'IN','Indiana'), (15,'IA','Iowa'), (16,'KS','Kansas'), (17,'KY','Kentucky'), (18,'LA','Louisiana'), (19,'ME','Maine'), (20,'MD','Maryland'), (21,'MA','Massachusetts'), (22,'MI','Michigan'), (23,'MN','Minnesota'), (24,'MS','Mississippi'), (25,'MO','Missouri'), (26,'MT','Montana'), (27,'NE','Nebraska'), (28,'NV','Nevada'), (29,'NH','New Hampshire'), (30,'NJ','New Jersey'), (31,'NM','New Mexico'), (32,'NY','New York'), (33,'NC','North Carolina'), (34,'ND','North Dakota'), (35,'OH','Ohio'), (36,'OK','Oklahoma'), (37,'OR','Oregon'), (38,'PA','Pennsylvania'), (39,'RI','Rhode Island'), (40,'SC','South Carolina'), (41,'SD','South Dakota'), (42,'TN','Tennessee'), (43,'TX','Texas'), (44,'UT','Utah'), (45,'VT','Vermont'), (46,'VA','Virginia'), (47,'WA','Washington'), (48,'WV','West Virginia'), (49,'WI','Wisconsin'), (50,'WY','Wyoming'), (51,'DC','District of Columbia'); 
        """);

        // ServiceMainTypes
        await db.Database.ExecuteSqlRawAsync("""
        INSERT OR IGNORE INTO "ServiceMainTypes" ("Id", "Description") 
        VALUES (1, 'Remodel'), (2, 'Exterior / Outdoor'), (3, 'Custom'), (4, 'Repair'), (5, 'Other');
        """);

        // ServiceSubTypes
        await db.Database.ExecuteSqlRawAsync("""
        INSERT OR IGNORE INTO "ServiceSubTypes" ("Id", "MainTypeId", "Description") 
        VALUES (1, 1, 'Kitchen'), (2, 1, 'Bathroom'), (3, 1, 'Basement'), (4, 2, 'Deck'), (5, 2, 'Patio'), (6, 2, 'Porch'), (7, 3, 'Built In & Storage'), (8, 3, 'Trim & Millwork'), (9, 3, 'Laundry Mudrooms'), (10, 3, 'Home Office'), (11, 4, 'General Repairs'), (12, 4, 'Insurance Repairs'), (13, 4, 'Flooring & Tile'), (14, 4, 'Drywall & Paint'), (15, 5,'Other');
        """);

        // ServiceRequestStatuses
        await db.Database.ExecuteSqlRawAsync("""
        INSERT OR IGNORE INTO "ServiceRequestStatuses" ("Id", "Description") 
        VALUES (1,'submitted'), (2,'estimate sent'), (3,'customer accepted/approved'), (4,'in progress'), (5,'completed'), (6,'closed/cancelled');
        """);

        // EstimateAppointmentStatuses
        await db.Database.ExecuteSqlRawAsync("""
        INSERT OR IGNORE INTO "EstimateApptStatuses" ("Id", "Description") 
        VALUES (1,'scheduled'), (2,'completed'), (3,'cancelled'), (4,'missed'), (5, 'closed');
        """);

        // QuoteStatuses
        await db.Database.ExecuteSqlRawAsync("""
        INSERT OR IGNORE INTO "QuoteStatuses" ("Id", "Description") 
        VALUES (1,'draft'), (2,'sent'), (3,'accepted'), (4,'declined');
        """);

        // BudgetRanges
        await db.Database.ExecuteSqlRawAsync("""
        INSERT OR IGNORE INTO "BudgetRanges" ("Id", "Description") 
        VALUES (1,'$100 - $500'), (2,'$500 - $1,000'), (3,'$1,000 - $2,500'), (4,'$2,500 - $5,000'), (5,'$5,000 - $10,000'), (6,'$10,000 - $20,000'), (7,'$20,000 - $35,000'), (8,'$35,000 - $50,000'), (9,'$50,000 - $75,000'), (10,'$75,000 - $100,000'), (11,'$100,000 - $150,000'), (12,'$150,000 - $250,000'), (13,'$250,000+');
        """);

        await requiredLoadTx.CommitAsync();

        #endregion
    }
}

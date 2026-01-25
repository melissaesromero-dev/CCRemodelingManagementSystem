using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.SampleData.Queries
{
    public class HasSampleData
        {
            public class Query : IRequest<Result<bool>> { }

            public class Handler : IRequestHandler<Query, Result<bool>>
            {
                private readonly CCRemodelDbContext _context;

                public Handler(CCRemodelDbContext context)
                {
                    _context = context;
                }

                public async Task<Result<bool>> Handle(Query request, CancellationToken cancellationToken)
                {
                    var exists = await _context.Customers
                        .AsNoTracking()
                        .AnyAsync(c => c.IsSampleData, cancellationToken);

                    return Result<bool>.Success(exists);
                }
            }
        }
}

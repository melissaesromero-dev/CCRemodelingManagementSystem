using Application.Common.Extensions;
using MediatR;
using Domain;

namespace Application.Lookups.Queries;

public static class GetBestTimes
{
    public record Query : IRequest<IReadOnlyList<BestTimeDto>>;

    public record BestTimeDto(int Id, string Name);

    public class Handler : IRequestHandler<Query, IReadOnlyList<BestTimeDto>>
    {
        public Task<IReadOnlyList<BestTimeDto>> Handle(Query request, CancellationToken ct)
        {
            var items = Enum.GetValues<BestTime>()
                .Select(e => new BestTimeDto((int)e, e.GetDisplayName()))
                .OrderBy(x => x.Id)
                .ToList()
                .AsReadOnly();

            return Task.FromResult<IReadOnlyList<BestTimeDto>>(items);
        }
    }
}
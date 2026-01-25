using Application.Common.Extensions;
using MediatR;
using Domain;

namespace Application.Lookups.Queries;

public static class GetContactMethods
{
    public record Query : IRequest<IReadOnlyList<ContactMethodsDto>>;

    public record ContactMethodsDto(int Id, string Name);

    public class Handler : IRequestHandler<Query, IReadOnlyList<ContactMethodsDto>>
    {
        public Task<IReadOnlyList<ContactMethodsDto>> Handle(Query request, CancellationToken ct)
        {
            var items = Enum.GetValues<PreferredContactMethod>()
                .Select(e => new ContactMethodsDto((int)e, e.GetDisplayName()))
                .OrderBy(x => x.Id)
                .ToList()
                .AsReadOnly();

            return Task.FromResult<IReadOnlyList<ContactMethodsDto>>(items);
        }
    }
}
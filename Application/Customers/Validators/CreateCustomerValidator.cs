using Application.Customers.Commands;
using Application.Customers.CustomerDTOs;

namespace Application.Customers.Validators
{
    public class CreateCustomerValidator : BaseCustomerValidator<CreateCustomer.Command, CreateCustomerDto>
    {
        public CreateCustomerValidator() : base(x => x.CustomerDto)
        {
            
        }
    }
}

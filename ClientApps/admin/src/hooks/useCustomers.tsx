import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../lib/api/agent";

export const useCustomers = (id?: string) => {
    
  const queryClient = useQueryClient();
  
  //Get Customers List
      const {data: customers, isPending : isCustPending} = useQuery({
        queryKey: ['customers'],
        queryFn: async () => {
          const response = await agent.get<Customer[]>('/customer');
          return response.data;
        }
      });

  //Get Customer
      const {data: customer, isLoading : isCustLoading} = useQuery({
        queryKey: ['customers', id],
        queryFn: async () => {
          const response = await agent.get<Customer>(`/customer/${id}`);
          return response.data;
        },
        enabled: !!id
      });

  //Get Service Request count by Customer
   const {
    data: requestAndApptsCountByCustomer, isPending: isRACPending} = useQuery({
        queryKey: ['requestsByCustomer', id],
        queryFn: async () => {
         const response = await agent.get<CustomerServiceRequestsAndApptsDTO>(`/customer/serviceRequestsAndApptsByCustomer/${id}`);
         return response.data;
        },
        enabled: !!id,
   });



  //Update Customer
      const updateCustomer = useMutation({
        mutationFn: async (customer: Customer) => {
          await agent.put('/customer', customer)
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['customers']
          })
        }
      })

  //Add New Customer
      const addNewCustomer = useMutation({
        mutationFn: async (customer: Customer) => {
          await agent.post('/customer', customer)
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['customers']
          })
        }
      })


      return {
        customers,
        isCustPending,
        updateCustomer,
        addNewCustomer,
        customer,
        isCustLoading,
        requestAndApptsCountByCustomer,
        isRACPending,
      }
}
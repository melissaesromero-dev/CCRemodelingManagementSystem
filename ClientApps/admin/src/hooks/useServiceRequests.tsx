import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../lib/api/agent";

export const useServiceRequests = (id?: string) => {
    
  const queryClient = useQueryClient();
  
  //Get Service Requests List
    const {data: serviceRequests, isPending: isSRPending} = useQuery({
        queryKey: ['serviceRequests'],
        queryFn: async () => {
          const response = await agent.get<ServiceRequest[]>('/servicerequest');
          return response.data;
        }
      });

  //Get Service Request
    const {data: serviceRequest, isLoading : isServiceReqLoading} = useQuery({
        queryKey: ['serviceRequest', id],
        queryFn: async () => {
          const response = await agent.get<ServiceRequest>(`/servicerequest/${id}`);
          return response.data;
        },
        enabled: !!id
    });

  //Update ServiceRequest
      const updateServiceRequest = useMutation({
        mutationFn: async (serviceRequest: ServiceRequest) => {
          await agent.put('/servicerequest', serviceRequest)
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['serviceRequests']
          })
        }
      })

  //Add New ServiceRequest
      const addNewServiceRequest = useMutation({
        mutationFn: async (serviceRequest: ServiceRequest) => {
          await agent.post('/servicerequest', serviceRequest)
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['serviceRequests']
          })
        }
      })


      return {
        serviceRequests,
        isSRPending,
        isServiceReqLoading,
        serviceRequest,

        updateServiceRequest,
        addNewServiceRequest,
        
      }
}
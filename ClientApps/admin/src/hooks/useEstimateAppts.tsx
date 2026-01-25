import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../lib/api/agent";

export const useEstimateAppts = (params?: 
  { userId?: string; 
    reqId?: 
    string, 
    Id?: string,
    disableQueries?: boolean; }) =>{
  //const userId = params?.userId;
  const reqId = params?.reqId;
  const Id = params?.Id;
  const disableQueries = params?.disableQueries ?? false;
  
    
  const queryClient = useQueryClient();
  
    //Is this an edit estimate appt or add new based on url
    
    const hasReqId = !!reqId;
    const isNewForSpecificRequest = Id === 'new'
    const isEdit = !!Id && !isNewForSpecificRequest;
    const isPureNew = !isEdit && !hasReqId && !isNewForSpecificRequest;
    
    //Get Estimate Appointments List
    const {data: estimateAppts, isPending: isEstApptsPending} = useQuery({
        queryKey: ['estimateAppts'],
        queryFn: async () => {
          const response = await agent.get<EstimateAppt[]>('/estimateappointment');
          return response.data;
        },
        enabled: !disableQueries,
      });

    //Get Estimate Appt
      const {data: estimateAppt, isLoading : isEstApptLoading} = useQuery({
        queryKey: ['estimateAppt', Id],
        queryFn: async () => {
          const response = await agent.get<EstimateAppt>(`/estimateappointment/${Id}`);
          return response.data;
        },
        enabled: !disableQueries && !!Id && Id !== 'new'
      });

    //Get Estimate Appt By ReqId
      const {data: estimateApptByReqId, isLoading : isEstApptByReqIdLoading} = useQuery({
        queryKey: ['estimateApptByReqId', reqId],
        queryFn: async () => {
          const response = await agent.get<EstimateAppt>(`/estimateappointment/byReqId/${reqId}`);
          return response.data;
        },
        enabled: !disableQueries && !!reqId && Id !== 'new',
      });      

   //Update Estimate Appointment
   const updateEstimateAppt = useMutation({
        mutationFn: async (estimateAppt: EstimateAppt) => {
          await agent.put('/estimateappointment', estimateAppt)
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['estimateAppts']
          })
        }
      })

    //Get Estimate Appointments By User (assigned staff)
    //const {data: estimateApptsByUser, isPending: isEstApptsByUserPending} = useQuery({
    //    queryKey: ['estimateApptsByUser', userId],
    //    enabled: !!userId,
    //    queryFn: async () => {
    //      const response = await agent.get<EstimateAppt[]>(`/estimateappointment/byUser/${userId}`);
    //      return response.data;
    //    }
    //  });
    

    //Delete Estimate Appointment By ID
    const deleteEstimateAppt = useMutation({
        mutationFn: async (id: string) => {
          await agent.delete(`/estimateappointment/${id}`)
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['estimateAppts']
          })
        },
      })

    //Delete Estimate Appointment By Service Request ID
    const deleteEstimateApptByReqId = useMutation({
        mutationFn: async (reqid: string) => {
          await agent.delete(`/estimateappointment/byReqId/${reqid}`)
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['estimateAppts']
          })
        },
      })

    //Add New Estimate Appointment
      const addNewEstimateAppt = useMutation({
        mutationFn: async (estimateAppt: EstimateAppt) => {
          await agent.post('/estimateappointment', estimateAppt)
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['estimateAppts']
          })
        }
      })

                               


   return {
        estimateAppts,
        isEstApptsPending,

        estimateAppt,
        isEstApptLoading,

        estimateApptByReqId,
        isEstApptByReqIdLoading,

        //estimateApptsByUser,
        //isEstApptsByUserPending,

        deleteEstimateAppt,
        deleteEstimateApptByReqId,

        updateEstimateAppt,

        addNewEstimateAppt,

        isEdit,isNewForSpecificRequest,isPureNew
   }
}
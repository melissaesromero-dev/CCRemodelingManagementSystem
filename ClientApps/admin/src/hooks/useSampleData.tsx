import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../lib/api/agent";

export const useSampleData = () => {
  const queryClient = useQueryClient();
  
      //Sample data already exists?
      const sampleExists = useQuery({
        queryKey: ["sampleData", "exists"],
        queryFn: async () => {
            const { data } = await agent.get<boolean>("/sampledata/exists");
            return data;
        },
      })

      //Refresh all queries
      const refreshAll = async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["sampleData", "exists"] }),

            queryClient.invalidateQueries({ queryKey: ["customers"] }),
            queryClient.invalidateQueries({ queryKey: ["serviceRequests"] }),
            queryClient.invalidateQueries({ queryKey: ["estimateAppts"] }),
            queryClient.invalidateQueries({ queryKey: ["quotes"] }),

            queryClient.invalidateQueries({ queryKey: ["serviceRequest"] }),
            queryClient.invalidateQueries({ queryKey: ["estimateAppt"] }),
            queryClient.invalidateQueries({ queryKey: ["estimateApptByReqId"] }),
            queryClient.invalidateQueries({ queryKey: ["requestsByCustomer"] }),
            ]);
        };

      //Delete Sample Data
        const deleteSampleData = useMutation({
        mutationFn: async () => {
          await agent.delete('/sampledata/delete')
        },
        onSuccess: refreshAll,
      });

      //Load Sample Data
      const loadSampleData = useMutation({
        mutationFn: async () => {
          await agent.post('/sampledata/load')
        },
        onSuccess: refreshAll,
      });



      return {
        sampleExists,
        deleteSampleData,
        loadSampleData
      }
}
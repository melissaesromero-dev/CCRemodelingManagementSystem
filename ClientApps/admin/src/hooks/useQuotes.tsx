import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../lib/api/agent";
import { useCallback } from "react";

export const useQuotes = (params?: { id?: string }) => {
  const id = params?.id;  
  const queryClient = useQueryClient();
  
  //Get Quotes List
      const {data: quotes, isPending: isQuotesPending} = useQuery({
        queryKey: ['quotes'],
        queryFn: async () => {
          const response = await agent.get<Quote[]>('/quote');
          return response.data;
        }
      });

  //Get Quote
      const {data: quote, isLoading : isQuoteLoading} = useQuery({
        queryKey: ['quotes', id],
        queryFn: async () => {
          const response = await agent.get<Quote>(`/quote/${id}`);
          return response.data;
        },
        enabled: !!id
      });

  //Get Quote By ReqId
    const quoteByReqId = useCallback(
    (serviceRequestId: string): Quote | undefined => {
      return (quotes ?? []).find(
        (q) => q.serviceRequestId === serviceRequestId
      );
    },
      [quotes]
    ); 

  //Update Quote
      const updateQuote = useMutation({
        mutationFn: async (quote: Quote) => {
          await agent.put('/quote', quote)
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['quotes']
          })
        }
      })

  //Add New Quote
      const addNewQuote = useMutation({
        mutationFn: async (quote: Quote) => {
          await agent.post('/quote', quote)
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['quotes']
          })
        }
      })

      //Delete Quote
    const deleteQuote = useMutation({
        mutationFn: async (id: string) => {
          await agent.delete(`/quote/${id}`)
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['quotes']
          })
        },
      })


      return {
        quotes,
        isQuotesPending,
        
        quote,
        isQuoteLoading,

        quoteByReqId,

        updateQuote,
        addNewQuote,
        deleteQuote,
      }
}

import { useMutation } from "@tanstack/react-query";
import { publicAgent } from "../lib/api/agent";
import type { QuoteRequestFormOutput } from "../lib/schemas/quoteRequestSchema";

export const useQuoteRequest = () => {
    
  //Submit Quote Request
      const submitQuoteRequest = useMutation({
        mutationFn: async (quoteRequest: QuoteRequestFormOutput) => {
          const {data} = await publicAgent.post<string>('/public/publicQuote/requestQuote', quoteRequest);
          return data;
        }
      });


      return {
        submitQuoteRequest
      }
}

// src/hooks/useLookups.ts
import { useQueries, type UseQueryResult } from "@tanstack/react-query";
import { publicAgent} from "../lib/api/agent";

export type Lookup = { id: number; name: string };
export type LookupDesc = { id: number; description: string };
export type AllStaff = { id: number; fullName: string };
export type SubType = { id: number; mainTypeId: number; description: string };
export type State = { id: number; shortName: string; longName: string };

export function useLookups() {
  const queries = useQueries({
    queries: [
      {
        queryKey: ["lookups", "states"],
        queryFn: async (): Promise<State[]> => {
          const { data } = await publicAgent.get<State[]>("/public/lookups/states");
          return data.slice().sort((a, b) => a.shortName.localeCompare(b.shortName));
        },     
      },
      {
        queryKey: ["lookups", "budgetRanges"],
        queryFn: async (): Promise<LookupDesc[]> => {
          const { data } = await publicAgent.get<LookupDesc[]>("/public/lookups/budgetRanges");
          return data;
        },     
      },
      {
        queryKey: ["lookups", "contactMethods"],
        queryFn: async (): Promise<Lookup[]> => {
          const { data } = await publicAgent.get<Lookup[]>("/public/lookups/contactMethods");
          return data;
        },
      },
      {
        queryKey: ["lookups", "bestTimes"],
        queryFn: async (): Promise<Lookup[]> => {
          const { data } = await publicAgent.get<Lookup[]>("/public/lookups/bestTimes");
          return data;
        },        
      },
      {
        queryKey: ["lookups", "mainTypes"],
        queryFn: async (): Promise<LookupDesc[]> => {
          const { data } = await publicAgent.get<LookupDesc[]>("/public/lookups/mainTypes");
          return data;
        },     
      },
    ],
  }) as [
    UseQueryResult<State[]>,  //states
    UseQueryResult<LookupDesc[]>, //budgetRanges
    UseQueryResult<Lookup[]>, //contactMethods
    UseQueryResult<Lookup[]>, //bestTimes
    UseQueryResult<LookupDesc[]>, //mainTypes
    //UseQueryResult<SubType[]>, //subTypes
    //UseQueryResult<LookupDesc[]>, //estApptStatuses
    //UseQueryResult<LookupDesc[]>, //quoteStatuses
  ];

  const [statesQ, budgetRangesQ, methodsQ, bestTimesQ, mainTypesQ, 
    //subTypesQ, estApptStatusesQ, quoteStatusesQ 
    ] = queries;

  // arrays (always defined for easy consumption)
  const states                = statesQ.data ?? [];
  const budgetRanges          = budgetRangesQ.data ?? [];
  const contactMethods        = methodsQ.data ?? [];
  const bestTimes             = bestTimesQ.data ?? [];
  const mainTypes             = mainTypesQ.data ?? [];
  //const subTypes              = subTypesQ.data ?? [];
  //const estApptStatuses       = estApptStatusesQ.data ?? [];
  //const quoteStatuses         = quoteStatusesQ.data ?? [];
  
  // maps for O(1) label lookup
  const statesById          = new Map(states.map(s => [s.id, s]));
  const budgetRangesById    = new Map(budgetRanges.map(l => [l.id, l]));
  const contactMethodsById  = new Map(contactMethods.map(l => [l.id, l]));
  const bestTimesById       = new Map(bestTimes.map(l => [l.id, l]));
  const mainTypesById       = new Map(mainTypes.map(l => [l.id, l]));
  //const subTypesById        = new Map(subTypes.map(l => [l.id, l]));
  //const estApptStatusesById = new Map(estApptStatuses.map(l => [l.id, l]));
  //const quoteStatusesById   = new Map(quoteStatuses.map(l => [l.id, l]));
  
  const isPending = queries.some(q => q.isPending);
  const isError   = queries.some(q => q.isError);
  const error     = (queries.find(q => q.isError)?.error as Error) || undefined;

  return {
    // data
    states, budgetRanges, contactMethods, bestTimes, mainTypes,
    // subTypes, estApptStatuses, quoteStatuses,

    statesById, budgetRangesById, 
    contactMethodsById, 
    bestTimesById, 
    mainTypesById,
    // subTypesById, estApptStatusesById, quoteStatusesById, 
    
    // status
    isPending, isError, error,
  };
}

// src/hooks/useLookups.ts
import { useQueries, type UseQueryResult } from "@tanstack/react-query";
import agent from "../lib/api/agent";

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
          const { data } = await agent.get<State[]>("/lookups/states");
          return data.slice().sort((a, b) => a.shortName.localeCompare(b.shortName));
        },     
      },
      {
        queryKey: ["lookups", "budgetRanges"],
        queryFn: async (): Promise<LookupDesc[]> => {
          const { data } = await agent.get<LookupDesc[]>("/lookups/budgetRanges");
          return data;
        },     
      },
      {
        queryKey: ["lookups", "serviceReqStatuses"],
        queryFn: async (): Promise<LookupDesc[]> => {
          const { data } = await agent.get<LookupDesc[]>("/lookups/serviceReqStatuses");
          return data;
        },     
      },
      {
        queryKey: ["lookups", "contactMethods"],
        queryFn: async (): Promise<Lookup[]> => {
          const { data } = await agent.get<Lookup[]>("/lookups/contactMethods");
          return data;
        },
      },
      {
        queryKey: ["lookups", "bestTimes"],
        queryFn: async (): Promise<Lookup[]> => {
          const { data } = await agent.get<Lookup[]>("/lookups/bestTimes");
          return data;
        },        
      },
      {
        queryKey: ["lookups", "assignedStaff"],
        queryFn: async (): Promise<AllStaff[]> => {
          const { data } = await agent.get<AllStaff[]>("/lookups/allCRSUsers");
          return data;
        },     
      },
      {
        queryKey: ["lookups", "mainTypes"],
        queryFn: async (): Promise<LookupDesc[]> => {
          const { data } = await agent.get<LookupDesc[]>("/lookups/mainTypes");
          return data;
        },     
      },
      {
        queryKey: ["lookups", "subTypes"],
        queryFn: async (): Promise<SubType[]> => {
          const { data } = await agent.get<SubType[]>("/lookups/subTypes");
          return data;
        },     
      }, 
      {
        queryKey: ["lookups", "estApptStatuses"],
        queryFn: async (): Promise<LookupDesc[]> => {
          const { data } = await agent.get<LookupDesc[]>("/lookups/estApptStatuses");
          return data;
        },        
      },    
      {
        queryKey: ["lookups", "quoteStatuses"],
        queryFn: async (): Promise<LookupDesc[]> => {
          const { data } = await agent.get<LookupDesc[]>("/lookups/quoteStatuses");
          return data;
        },        
      },
    ],
  }) as [
    UseQueryResult<State[]>,  //states
    UseQueryResult<LookupDesc[]>, //budgetRanges
    UseQueryResult<LookupDesc[]>, //serviceReqStatuses
    UseQueryResult<Lookup[]>, //contactMethods
    UseQueryResult<Lookup[]>, //bestTimes
    UseQueryResult<AllStaff[]>, //allStaff
    UseQueryResult<LookupDesc[]>, //mainTypes
    UseQueryResult<SubType[]>, //subTypes
    UseQueryResult<LookupDesc[]>, //estApptStatuses
    UseQueryResult<LookupDesc[]>, //quoteStatuses
  ];

  const [statesQ, budgetRangesQ, serviceReqStatusesQ, methodsQ, bestTimesQ, allStaffQ, mainTypesQ, subTypesQ, estApptStatusesQ, quoteStatusesQ ] = queries;

  // arrays (always defined for easy consumption)
  const states                = statesQ.data ?? [];
  const budgetRanges          = budgetRangesQ.data ?? [];
  const serviceReqStatuses    = serviceReqStatusesQ.data ?? [];
  const contactMethods        = methodsQ.data ?? [];
  const bestTimes             = bestTimesQ.data ?? [];
  const allStaff              = allStaffQ.data ?? [];
  const mainTypes             = mainTypesQ.data ?? [];
  const subTypes              = subTypesQ.data ?? [];
  const estApptStatuses       = estApptStatusesQ.data ?? [];
  const quoteStatuses         = quoteStatusesQ.data ?? [];
  
  // maps for O(1) label lookup
  const statesById          = new Map(states.map(s => [s.id, s]));
  const budgetRangesById    = new Map(budgetRanges.map(l => [l.id, l]));
  const serviceReqStatusesById    = new Map(serviceReqStatuses.map(l => [l.id, l]));
  const contactMethodsById  = new Map(contactMethods.map(l => [l.id, l]));
  const bestTimesById       = new Map(bestTimes.map(l => [l.id, l]));
  const allStaffById        = new Map(allStaff.map(a => [a.id, a]));
  const mainTypesById       = new Map(mainTypes.map(l => [l.id, l]));
  const subTypesById        = new Map(subTypes.map(l => [l.id, l]));
  const estApptStatusesById = new Map(estApptStatuses.map(l => [l.id, l]));
  const quoteStatusesById   = new Map(quoteStatuses.map(l => [l.id, l]));
  
  const isPending = queries.some(q => q.isPending);
  const isError   = queries.some(q => q.isError);
  const error     = (queries.find(q => q.isError)?.error as Error) || undefined;

  return {
    // data
    states, budgetRanges, serviceReqStatuses, 
    contactMethods, bestTimes, allStaff, mainTypes, subTypes, estApptStatuses, quoteStatuses,

    statesById, budgetRangesById, 
    serviceReqStatusesById, contactMethodsById, 
    bestTimesById, allStaffById, mainTypesById, subTypesById, estApptStatusesById, quoteStatusesById, 
    
    // status
    isPending, isError, error,
  };
}

import { apiClient } from "@/src/lib/api/client";

export interface ConfigurationOption { id:string; category:string; label:string; value:string; active:boolean; sortOrder:number }
export type ConfigurationGroups = Record<string,{label:string;value:string}[]>;

export const configurationService={
  list:(includeInactive=false)=>apiClient<ConfigurationOption[]>(`/configuration-options?includeInactive=${includeInactive}`),
  create:(data:Omit<ConfigurationOption,"id">)=>apiClient<ConfigurationOption>("/configuration-options",{method:"POST",body:JSON.stringify(data)}),
  update:(id:string,data:Omit<ConfigurationOption,"id">)=>apiClient(`/configuration-options/${id}`,{method:"PATCH",body:JSON.stringify(data)}),
  remove:(id:string)=>apiClient(`/configuration-options/${id}`,{method:"DELETE"}),
};

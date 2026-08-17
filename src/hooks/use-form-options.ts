import { useEffect,useState } from "react";
import { configurationService,type ConfigurationGroups } from "@/src/services/configuration.service";
import { vehiclesService } from "@/src/services/vehicles.service";

export function useFormOptions(){const [groups,setGroups]=useState<ConfigurationGroups>({});useEffect(()=>{let active=true;Promise.all([configurationService.list(),vehiclesService.list()]).then(([options,vehicles])=>{if(!active)return;const next:ConfigurationGroups={vehicle:vehicles.map(v=>({label:`${v.plateNumber??v.name} — ${v.name}`,value:v.id}))};for(const option of options)(next[option.category]??=[]).push({label:option.label,value:option.value});setGroups(next)}).catch(()=>undefined);return()=>{active=false}},[]);return groups;}

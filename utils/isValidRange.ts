import { Hour } from "../constants/hours";

export const isValidRange = (hourStart: Hour, hourEnd: Hour) => { //format 24hrs
    if(hourStart==null || hourEnd==null) return true
    if (hourStart.hour >= hourEnd.hour) return false
    return true
}


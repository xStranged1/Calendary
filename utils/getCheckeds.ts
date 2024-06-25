import { DayOfWeek, defaultChecks } from '../constants/hours'
export const getCheckeds = (avaiable) => {
    
    let checkeds = {}
    if(avaiable){
      DayOfWeek.forEach((day) => {
        const avaiableDay =  avaiable[day]
        if(avaiableDay.length>0){
          checkeds[day] = true
        }else{
          checkeds[day] = false
        }
      })
      if (!checkeds) checkeds = defaultChecks
      return checkeds
    }
    return defaultChecks
  }
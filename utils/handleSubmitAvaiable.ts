import { DayOfWeek } from '../constants/hours';
import { supabase } from './supabase'

const filteredIntervals = (allIntervals) => {
  let filteredAllIntervals = {}
  DayOfWeek.forEach(day => {
    const intervals = allIntervals[day]
    const filteredintervals = intervals.filter(interval => (interval.hourStart && interval.hourEnd));
    filteredAllIntervals[day] = filteredintervals
  });
  return filteredAllIntervals
}

export const handleSubmitAvaiable = async (user, allIntervals, showSuccessAvaiable) => {
    const filteredAllIntervals = filteredIntervals(allIntervals)
    const { data, error } = await supabase
      .from('user')
      .update({avaiable: filteredAllIntervals})
      .eq('id', user.id)
      .select()
      if (!error){
        showSuccessAvaiable(user.username)
      }
    return error
  }
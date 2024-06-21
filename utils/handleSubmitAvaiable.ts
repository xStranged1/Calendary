import { supabase } from './supabase'

export const handleSubmitAvaiable = async (allIntervals) => {
    console.log('handleSubmit');
    console.log(allIntervals);
    const { data, error } = await supabase
      .from('user')
      .insert([
        {avaiable: allIntervals},
      ])
      
      if (!error){
        showSuccessAvaiable()
      }
    return error
  }
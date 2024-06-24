import { supabase } from './supabase'

export const handleSubmitAvaiable = async (user, allIntervals, showSuccessAvaiable) => {
    console.log('handleSubmit');
    console.log(allIntervals);
    const { data, error } = await supabase
      .from('user')
      .update({avaiable: allIntervals})
      .eq('id', user.id)
      .select()
      console.log(data);
      
      if (!error){
        showSuccessAvaiable(user.username)
      }
    return error
  }
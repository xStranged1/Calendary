import { useEffect, useState } from "react";
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";
import { getFiltered, getIntersection, getnParticipantsAvaiables } from '../utils/getIntersection'

export default function Coordination ( {participants} ) {
    const [dates, setDates] = useState<Nullable<Date>>(null);
    const [intersections, setIntersections] = useState(null);

    useEffect(() => {
        if (participants.length == 0) return
        console.log('participants');
        console.log(participants);
        
        const intersections = getIntersection(participants)
       
        setIntersections(intersections)
        const n = getnParticipantsAvaiables(participants)
        const { intervals, nMaxIntersection } = getFiltered(intersections, n)
        
    }, [participants])

    const Intersections = () => {
      
      return( <div>
        <h2>algna</h2>
      </div> )
    }
    return(
      <div>
        <h2>Intersección de  todas las disponibilidades</h2>
        <h4>tect</h4>
        {(intersections) && (<Intersections />)}

        {/* <Calendar value={dates} 
              onChange={(e) => setDates(e.value)}
              selectionMode='multiple' inline /> */}
      </div>
    )
  }
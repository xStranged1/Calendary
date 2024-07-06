import { useEffect, useState } from "react";
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";
import { getFiltered, getIntersection, getnParticipantsAvaiables } from '../utils/getIntersection'
import { DayOfWeek, Hour, Interval, hours } from "../constants/hours";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";

export default function Coordination ( {participants} ) {
    const [dates, setDates] = useState<Nullable<Date>>(null);
    const [intersections, setIntersections] = useState(null);
    const [filteredIntervals, setFilteredIntervals] = useState(null);

    useEffect(() => {
        if (participants.length == 0) return
        console.log('participants');
        console.log(participants);
        
        const intersections = getIntersection(participants)
       
        setIntersections(intersections)
        const n = getnParticipantsAvaiables(participants)
        const { intervals, nMaxIntersection } = getFiltered(intersections, n)
        setFilteredIntervals(intervals)
        console.log(filteredIntervals);
        

    }, [participants])










    const Day = ( {day} ) => {

  
      let getIntervals = (filteredIntervals) ? filteredIntervals[day] : []
  
      let firstInterval =null
      console.log("getIntervals dia: "+day);
      console.log(getIntervals);
      
      if(getIntervals.length>0) firstInterval = getIntervals[0]
  
      
      let hourStart, hourEnd
      if(firstInterval){
        hourStart=firstInterval.hourStart.hour
        hourEnd=firstInterval.hourEnd.hour
      }
      const [selectedStartHour, setSelectedStartHour] = useState<Hour | null>(hourStart);
      const [selectedEndHour, setSelectedEndHour] = useState<Hour | null>(hourEnd);
  
      getIntervals = getIntervals.slice(1, getIntervals.length)
      const [intervals, setIntervals] = useState<Interval[]>(getIntervals);
      const checked = (firstInterval) ? true : false
      console.log('rendeDay');
      console.log("intervals");
      console.log(intervals);
  
      const Interval = ({data, indexInterval}) => {
        
        const [selectedIntervalStartHour, setSelectedIntervalStartHour] = useState<Hour | null>(data.hourStart.hour);
        const [selectedIntervalEndHour, setSelectedIntervalEndHour] = useState<Hour | null>(data.hourEnd.hour);
  
        return(
          <div key={indexInterval} className="box-day ml-5">
            <div>
              <Dropdown placeholder={(selectedIntervalStartHour) ? selectedIntervalStartHour : "Desde"} value={selectedIntervalStartHour}  
                className="w-full md:w-8rem dropdown-hour"
                 />
            </div>
              <p style={{ marginLeft: 5, marginRight: 5, fontSize: 15, fontWeight: 'bold' }}>-</p>
            <div>
              <Dropdown placeholder={(selectedIntervalEndHour) ? selectedIntervalEndHour : "Hasta"} value={selectedIntervalEndHour}  
              className="w-full md:w-8rem dropdown-hour" 
              />
            </div>
          </div>
        )
      }

        return(
          <>
          <div className='box-day'>
              <Checkbox checked={checked}></Checkbox>
              <button style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexDirection: 'row', margin: 5, marginRight: 7}}>
                <p className='p-day'>{day}</p>
              </button>
              {(selectedStartHour) ? (
                <>
                  <div>
                    <Dropdown placeholder={selectedStartHour} value={selectedStartHour} options={hours} optionLabel="hour" 
                    className="w-full md:w-8rem dropdown-hour"
                    disabled={!checked} />
                  </div> 
                  <p style={{ marginLeft: 5, marginRight: 5, fontSize: 15, fontWeight: 'bold' }}>-</p>
                  <div>
                    <Dropdown placeholder={selectedEndHour} value={selectedEndHour} options={hours} optionLabel="hour" 
                    className="w-full md:w-8rem dropdown-hour" 
                    disabled={!checked}/>
                  </div>
                </>
              ) : (
                <div style={{marginLeft: 5}}>
                  <h4>No hay coincidencias en este día</h4>
                </div>
              )}
          </div>
  
              <div>
                  {intervals.map((interval: Interval, indexInterval) => (   /*testear aca*/ 
                        <Interval key={indexInterval} data={interval} indexInterval={indexInterval} /> 
                    )
                  )}
              </div> 
            
          </>
          
        )
      }










    
    const Intersections = () => {
      
      return(
        <div className="card flex justify-content-center align-items-center card-week">
          <div className="mt-4">
            <h2>Intersección de  todas las disponibilidades</h2>
            <div className="mt-6"/>
            {DayOfWeek.map((day) => (
              <div key={day}>
                <Day day={day} />
              </div>
            ))}
          </div>
        </div>
      )
    }


    return(
      <div>
        {(filteredIntervals) && (<Intersections />)}
        {/* <Calendar value={dates} 
              onChange={(e) => setDates(e.value)}
              selectionMode='multiple' inline /> */}
      </div>
    )
  }
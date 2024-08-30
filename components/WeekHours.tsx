import { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex
import '../src/App.css';
import { handleSubmitAvaiable } from '../utils/handleSubmitAvaiable'
import { getCheckeds } from '../utils/getCheckeds'

import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { DayOfWeek, defaultChecks, Hour, hours, Interval, Intervals, Mode } from '../constants/hours'
import BtnAdd from '../components/buttons/BtnAdd'
import BtnDelete from '../components/buttons/BtnDelete'
import BtnSubmit from '../components/buttons/BtnSubmit'
import { Checkbox } from "primereact/checkbox";
import { isValidRange } from '../utils/isValidRange'
import { useMountEffect } from 'primereact/hooks';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';

const WeekHours = ({ user, codeEvent, showSuccessAvaiable }) => {

  const checks = getCheckeds(user.avaiable)
  const [checkeds, setCheckeds] = useState(checks);
  const [allIntervals, setAllIntervals] = useState<Intervals | null>(null);

  useEffect(() => {
    if (user.avaiable) {
      setAllIntervals(user.avaiable);
    } else {
      const initialIntervals = {
        'Lun': [],
        'Mar': [],
        'Mie': [],
        'Jue': [],
        'Vie': [],
        'Sab': [],
        'Dom': []
      }
      setAllIntervals(initialIntervals);
    }
  }, [user]);

  window.scrollTo(0, 0)

  const Day = ({ day }) => {

    const [invalidRange, setInvalidRange] = useState<boolean>(false);
    const initialCheck = (checkeds) ? checkeds[day] : false
    const [checked, setChecked] = useState<boolean>(initialCheck);
    const [change, setChange] = useState<boolean>(false);

    let getIntervals = (allIntervals) ? allIntervals[day] : []

    let firstInterval = null
    if (getIntervals.length > 0) firstInterval = getIntervals[0]


    let hourStart, hourEnd
    if (firstInterval) {
      hourStart = firstInterval.hourStart
      hourEnd = firstInterval.hourEnd
    }
    const [selectedStartHour, setSelectedStartHour] = useState<Hour | null>(hourStart);
    const [selectedEndHour, setSelectedEndHour] = useState<Hour | null>(hourEnd);


    getIntervals = getIntervals.slice(1, getIntervals.length)
    const [intervals, setIntervals] = useState<Interval[]>(getIntervals);

    const handleChecked = () => {
      let newChecks = checkeds
      newChecks[day] = !newChecks[day]
      setCheckeds(newChecks)
      setChecked(checked => !checked)
      if (checked) {
        setIntervals([])
      }
    }

    const handleChangeSelectedHour = (hour: Hour, isStart) => {
      let validRange;
      if (isStart) {
        validRange = isValidRange(hour, selectedEndHour)
        setSelectedStartHour(hour)
      } else {
        validRange = isValidRange(selectedStartHour, hour)
        setSelectedEndHour(hour)
      }

      if (!validRange) setInvalidRange(true)

      let objNewInterval: Interval = {
        hourStart: (isStart) ? hour : selectedStartHour,
        hourEnd: (isStart) ? selectedEndHour : hour
      }

      let newAllIntervals = allIntervals
      let newInterval = newAllIntervals[day]
      newInterval[0] = objNewInterval
      setAllIntervals(newAllIntervals)


    }

    const handleAdd = () => {
      if (!checked) {
        handleChecked()
      }
      let newInterval = intervals
      let objNewInterval: Interval = {
        hourStart: null,
        hourEnd: null
      }

      newInterval.push(objNewInterval)
      setIntervals(newInterval)

      let newAllIntervals = allIntervals
      let updateInterval = newAllIntervals[day]
      updateInterval = updateInterval.push(objNewInterval)
      setAllIntervals(newAllIntervals)

      setChange(prev => !prev)
    }
    const handleDelete = () => {
      setIntervals([])
      let newAllIntervals = allIntervals
      newAllIntervals[day] = []
      setAllIntervals(newAllIntervals)
      setSelectedStartHour(null)
      setSelectedEndHour(null)
    }

    const Interval = ({ data, indexInterval }) => {

      const [selectedIntervalStartHour, setSelectedIntervalStartHour] = useState<Hour | null>(data.hourStart);
      const [selectedIntervalEndHour, setSelectedIntervalEndHour] = useState<Hour | null>(data.hourEnd);
      const [visible, setVisible] = useState<boolean>(true)

      const handleDeleteInterval = () => {
        let newIntervals = intervals
        newIntervals.splice(indexInterval, 1)
        setIntervals(newIntervals)
        setVisible(false)
      }

      const handleChangeInterval = (hour: Hour, isStart: boolean) => {
        let isValid: boolean;
        if (isStart) {
          isValid = isValidRange(hour, selectedIntervalEndHour);
          setSelectedIntervalStartHour(hour)
        } else {
          isValid = isValidRange(selectedIntervalStartHour, hour);
          setSelectedIntervalEndHour(hour)
        }
        if (!isValid) setInvalidRange(true)
        let newInterval = intervals


        let objNewInterval: Interval = {
          hourStart: (isStart) ? hour : selectedIntervalStartHour,
          hourEnd: (isStart) ? selectedIntervalEndHour : hour
        }

        newInterval[indexInterval] = objNewInterval
        setIntervals(newInterval)
        let newAllIntervals = allIntervals
        let firstInterval = newAllIntervals[day]
        firstInterval = firstInterval[0]
        let cloneInt = structuredClone(newInterval)
        cloneInt.unshift(firstInterval)

        newAllIntervals[day] = cloneInt
        setAllIntervals(newAllIntervals)

      }


      const start = (selectedIntervalStartHour) ? selectedIntervalStartHour.toString() : "Desde"
      const end = (selectedIntervalEndHour) ? selectedIntervalEndHour.toString() : "Hasta"
      return (
        <div className={`box-day ${(!visible ? 'ds-none' : '')}`}>
          <div><Dropdown placeholder={start} value={selectedIntervalStartHour} onChange={(e: DropdownChangeEvent) => handleChangeInterval(e.value, true)} options={hours} optionLabel="hour"
            className="w-full md:w-[8rem] sm:min-w-[6rem] dropdown-hour"
          /></div>
          <p style={{ marginLeft: 5, marginRight: 5, fontSize: 15, fontWeight: 'bold' }}>-</p>
          <div><Dropdown placeholder={end} value={selectedIntervalEndHour} onChange={(e: DropdownChangeEvent) => handleChangeInterval(e.value, false)} options={hours} optionLabel="hour"
            className="w-full md:w-[8rem] sm:min-w-[6rem] dropdown-hour"
          /></div>
          <BtnDelete handleDelete={handleDeleteInterval} />
        </div>
      )
    }

    return (
      <>
        <div className='box-day'>
          {/*
          {(invalidRange && (<div className="card flex"><Message severity='error' text="La hora de inicio debería ser menor a la hora de fín" /><p>alg</p></div>))}
          }
          */}
          <Checkbox onChange={handleChecked} checked={checked}></Checkbox>
          <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexDirection: 'row', margin: 5, marginRight: 7 }} onClick={() => handleChecked()}>
            <p className='p-day'>{day}</p>
          </button>
          <div><Dropdown placeholder="Desde" value={selectedStartHour} onChange={(e: DropdownChangeEvent) => handleChangeSelectedHour(e.value, true)} options={hours} optionLabel="hour"
            className="w-full md:w-[8rem] sm:min-w-[6rem] dropdown-hour"
            disabled={!checked} /></div>
          <p style={{ marginLeft: 5, marginRight: 5, fontSize: 15, fontWeight: 'bold' }}>-</p>
          <div><Dropdown placeholder="Hasta" value={selectedEndHour} onChange={(e: DropdownChangeEvent) => handleChangeSelectedHour(e.value, false)} options={hours} optionLabel="hour"
            className="w-full md:w-[8rem] sm:min-w-[6rem] dropdown-hour"
            disabled={!checked} /></div>
          <Button style={{ marginLeft: 10, height: "2rem", width: "2rem" }}
            onClick={handleAdd} severity='success' size='small' icon="pi pi-plus" />
          <BtnDelete handleDelete={handleDelete} />
        </div>

        <div>
          {intervals.map((interval: Interval, indexInterval) => (   /*testear aca*/
            <div key={indexInterval}>
              <Interval data={interval} indexInterval={indexInterval} />
            </div>
          )
          )}
        </div>

      </>

    )
  }

  return (
    <aside style={{ flex: 1, marginBottom: "4rem" }}>

      <div style={{ marginBottom: 70 }} />
      <div className="card justify-content-center align-items-center card-week">
        <h2>Disponibilidad de {user.username}</h2>
        <div style={{ marginTop: 40, marginBottom: 30 }}>
          {DayOfWeek.map((day) => (
            <div key={day} style={{ marginBottom: 25 }}>
              <Day day={day} />
            </div>
          ))}
          <div style={{ marginTop: 30 }}></div>
          <BtnSubmit handleSubmit={() => handleSubmitAvaiable(user, allIntervals, showSuccessAvaiable)} />
        </div>
      </div>
    </aside>
  )
}
export default WeekHours
export interface Hour {
    hour: string | null;
}
export const DayOfWeek = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
export const checks = { Lun: false, Mar: false, Mie: false, Jue: false, Vie: false, Sab: false, Dom: false }
export const initialIntervals = {
  'Lun': [],
  'Mar': [],
  'Mie': [],
  'Jue': [],
  'Vie': [],
  'Sab': [],
  'Dom': []
}
export const hours: Hour[] = [
    { hour: '00:00' }, { hour: '00:15' }, { hour: '00:30' }, { hour: '00:45' },
    { hour: '01:00' }, { hour: '01:15' }, { hour: '01:30' }, { hour: '01:45' },
    { hour: '02:00' }, { hour: '02:15' }, { hour: '02:30' }, { hour: '02:45' },
    { hour: '03:00' }, { hour: '03:15' }, { hour: '03:30' }, { hour: '03:45' },
    { hour: '04:00' }, { hour: '04:15' }, { hour: '04:30' }, { hour: '04:45' },
    { hour: '05:00' }, { hour: '05:15' }, { hour: '05:30' }, { hour: '05:45' },
    { hour: '06:00' }, { hour: '06:15' }, { hour: '06:30' }, { hour: '06:45' },
    { hour: '07:00' }, { hour: '07:15' }, { hour: '07:30' }, { hour: '07:45' },
    { hour: '08:00' }, { hour: '08:15' }, { hour: '08:30' }, { hour: '08:45' },
    { hour: '09:00' }, { hour: '09:15' }, { hour: '09:30' }, { hour: '09:45' },
    { hour: '10:00' }, { hour: '10:15' }, { hour: '10:30' }, { hour: '10:45' },
    { hour: '11:00' }, { hour: '11:15' }, { hour: '11:30' }, { hour: '11:45' },
    { hour: '12:00' }, { hour: '12:15' }, { hour: '12:30' }, { hour: '12:45' },
    { hour: '13:00' }, { hour: '13:15' }, { hour: '13:30' }, { hour: '13:45' },
    { hour: '14:00' }, { hour: '14:15' }, { hour: '14:30' }, { hour: '14:45' },
    { hour: '15:00' }, { hour: '15:15' }, { hour: '15:30' }, { hour: '15:45' },
    { hour: '16:00' }, { hour: '16:15' }, { hour: '16:30' }, { hour: '16:45' },
    { hour: '17:00' }, { hour: '17:15' }, { hour: '17:30' }, { hour: '17:45' },
    { hour: '18:00' }, { hour: '18:15' }, { hour: '18:30' }, { hour: '18:45' },
    { hour: '19:00' }, { hour: '19:15' }, { hour: '19:30' }, { hour: '19:45' },
    { hour: '20:00' }, { hour: '20:15' }, { hour: '20:30' }, { hour: '20:45' },
    { hour: '21:00' }, { hour: '21:15' }, { hour: '21:30' }, { hour: '21:45' },
    { hour: '22:00' }, { hour: '22:15' }, { hour: '22:30' }, { hour: '22:45' },
    { hour: '23:00' }, { hour: '23:15' }, { hour: '23:30' }, { hour: '23:45' },
  ];
  
export interface Interval {
  hourStart: Hour,
  hourEnd: Hour,
}

export interface Intervals {
'Lun': Interval[],
'Mar': Interval[],
'Mie': Interval[],
'Jue': Interval[],
'Vie': Interval[],
'Sab': Interval[],
'Dom': Interval[]
}

export type Mode = 'multiple' | 'range' | 'single';

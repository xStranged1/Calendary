import { DayOfWeek, Intervals, initialIntervals } from "../constants/hours";

export const getIntersection = (participants) => {

    /*
    quiero

    user1Lunes = {
       id: 1,
       avaiable:  {hourStart: 14:00, hourEnd: 15:10}
    }

    user2Lunes = {
       id: 2,
       avaiable:  {hourStart: 16:00, hourEnd: 17:10}
    }

    intersections = {
        'Lun': [user1Lunes, user2Lunes],
        'Mar': [],
        'Mie': [],
        'Jue': [],
        'Vie': [],
        'Sab': [],
        'Dom': []
    }

    */
    let intersections = {}

    DayOfWeek.forEach(day => {  

        participants.forEach(userP => {
            const avaiable = userP.avaiable
            let UserAvaiableDay = []
            if(avaiable){
                UserAvaiableDay = avaiable[day]
            }
            // console.log("UserDay");
            // console.log(UserAvaiableDay);
            
            if(UserAvaiableDay.length > 0){
                let objUser = {}
                objUser.id = userP.id
                objUser.username = userP.username
                objUser.avaiable = UserAvaiableDay
                // console.log("objUser");
                // console.log(objUser);
                
                let newIntersection = intersections[day]
                if(!newIntersection){
                    intersections[day] = []
                    intersections[day].push(objUser)
                }else{
                    intersections[day].push(objUser)
                }
            }
        });
    });
    return intersections
}

export const getnParticipantsAvaiables = (participants) => {
    let nParticipants = 0
    for (let i = 0; i < participants.length; i++) {
        const user = participants[i];
        if(user.avaiable){
            nParticipants++
        }
    }
    return nParticipants
}

function stringHourToMinute(hour) {
    const [hours, minutes] = hour.split(':').map(Number);
    return hours * 60 + minutes;
}

function minuteToStringHour(minutes) {
    const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
}

const getCruce = (intervalA, intervalB) => {
    // Convertir las horas de inicio y fin a minutos
    const startA = stringHourToMinute(intervalA.hourStart.hour);
    const endA = stringHourToMinute(intervalA.hourEnd.hour);
    const startB = stringHourToMinute(intervalB.hourStart.hour);
    const endB = stringHourToMinute(intervalB.hourEnd.hour);

    // Encontrar la intersección
    const startCruce = Math.max(startA, startB);
    const endCruce = Math.min(endA, endB);

    // Verificar si hay intersección
    if (startCruce >= endCruce) {
        return null;
    }

    // Convertir la intersección de vuelta a formato de horas
    return {
        hourStart: { hour: minuteToStringHour(startCruce) },
        hourEnd: { hour: minuteToStringHour(endCruce) }
    };
};

    // precond: intervalA, intervalB valids
    // return intersection between 2 interval. ej
    // intervalA = {hourStart: 14:00, hourEnd: 18:00}
    // intervalB = {hourStart: 16:00, hourEnd: 19:30}
    // expected output: {hourStart: 16:00, hourEnd: 18:00}
    // 
    // if no intersection
    // expected output: null

const getIntervalsDay = (intersection) => {
    let intervalsDay = []
    console.log('getIntervalsDay');


    /*

    {
        id: 4,
        username: brian,
        avaiable: [{
            hourStart: 11:30,
            hourEnd: 18:30
        },{
            hourStart: 6:30,
            hourEnd: 8:30
        }]
    }

    {
        id: 1,
        username: Fede,
        avaiable: [{
            hourStart: 8:30,
            hourEnd: 9:20
        },{
            hourStart: 17:20,
            hourEnd: 22:00
        }]
    }

    {
        id: 2,
        username: Wanda,
        avaiable: [{
            hourStart: 17:45,
            hourEnd: 18:50
        }}]
    }

     */
    intersectionClone = structuredClone(intersection)
    
    for (let i = 0; i < intersection.length; i++) { // intervalos de los usuarios
        const interval = intersection[i]
        const intervalAvaiable = interval.avaiable
        if(i == 1){
            console.log('solo esta 2');
            console.log(intervalAvaiable);
            const A = intervalAvaiable[0]
            const B = intervalAvaiable[1]
        }
        let newMinRange, newMaxRange

        for (let j = 0; j < intervalAvaiable.length; j++) { // intervalos de un usuario
            const range = intervalAvaiable[j];
            const minRange = range.hourStart
            const maxRange = range.hourEnd

            if(!newMinRange){
                newMinRange = minRange
                newMaxRange = maxRange
                continue
            }

        }
    }
    return intervalsDay
}


export const getFiltered = (intersections, nMax) => {

    
    console.log("getFiltered");
    console.log("getFiltered");
    console.log("getFiltered");
    
    let intervals: Intervals = initialIntervals
   
    for (const day in intersections) {
        if (Object.prototype.hasOwnProperty.call(intersections, day)) {
            const intersection = intersections[day];
            
            let find = false
            let findWithMax = false
            while (!find) {
                for (let tryN = nMax; tryN > 0; tryN--) {
                    console.log("intersection["+day+"] = ");
                    console.log(intersection);

                    if (intersection.length == nMax){
                        find = true
                        findWithMax = true
                        intervals[day] = getIntervalsDay(intersection) //suma intervals ese dia
                        break
                    }
                    if(intersection.length < tryN){
                        console.log('es menor a '+nMax);
                        continue
                    }

                }
                find=true;
            }
            
            
        }
    }
    const nMaxIntersection = 4
    return ( {nMaxIntersection, intervals} )
}
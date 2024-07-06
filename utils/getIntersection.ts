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



const remRepIntervals = (intervals) => {
    let i = 0
    let prevHourStart, prevHourEnd
    while (i < intervals.length) {
        const hourStart = intervals[i].hourStart.hour
        const hourEnd = intervals[i].hourEnd.hour
        if (prevHourStart == hourStart && prevHourEnd == hourEnd) {
            intervals.splice(i, 1)
        }else{
            prevHourStart = hourStart
            prevHourEnd = hourEnd
        }
        i++
    }
    
    return intervals
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
    let checkpoints = []
    let checkpoint = null
    let i = 0
    let prevInterval = null
    let continueCheckpoints = false
    let totalCount = 0
    while (i < intersection.length || continueCheckpoints) { // users
        let canSave = true
        if(totalCount > 2000) {
            console.log('exceded limit 2000');
            break
        }
        let j = 0
        if(checkpoint){ //load checkpoint
            console.log('load checkpoint ', checkpoint);
            i = checkpoint.i
            j = checkpoint.j
            prevInterval = checkpoint.prevInterval
            checkpoint = null
        }
        const user = intersection[i]
        const username = user.username
        const avaiable = user.avaiable
        console.log('check user: '+username);
        console.log("i: "+i);
        
        while (j < avaiable.length) { // check interval in a user
            canSave = true
            totalCount++
            const currentInterval = avaiable[j]
            console.log("j: "+j);
            console.log('check interval: ',currentInterval);
            const copyPrevInterval = structuredClone(prevInterval)
            console.log("copyPrevInterval: ",copyPrevInterval);
            
            if (!prevInterval && j < avaiable.length-1){
                let objCheckpoint = {}
                objCheckpoint.i = i
                objCheckpoint.j = j+1
                objCheckpoint.prevInterval = null
                console.log('guarda checkpoint');
                checkpoints.push(objCheckpoint)
            }

            let cruce
            if (prevInterval) {
                cruce = getCruce(prevInterval, currentInterval)
            }
            if (cruce) {
                console.log('cruce: ',cruce);
                prevInterval = cruce;
                if (j < avaiable.length-1){ //hay cruce pero faltan intervalos por checkear, capaz que pueden coincidir mas
                    let objCheckpoint = {}
                    objCheckpoint.i = i
                    objCheckpoint.j = j+1
                    objCheckpoint.prevInterval = copyPrevInterval
                    console.log('guarda checkpoint');
                    checkpoints.push(objCheckpoint)
                    break
                }
            } 
            
            if (!cruce) {
                console.log('no coincide con anterior: ',prevInterval);
                canSave = false
            }
            if (!prevInterval) prevInterval = currentInterval
            if (!cruce && j == avaiable.length-1){
                continueCheckpoints = true
            }
            j++
        }//end while intervals
        
        if (i == intersection.length-1){ //lastUser
            console.log('ultimo usu: '+username);
            
            if(prevInterval && canSave) {
                console.log('se guarda en intervalsDay ',prevInterval)
                intervalsDay.push(prevInterval)
            }


            console.log("checkpoints");
            console.log(checkpoints);
            if(checkpoints.length > 0){
                if(checkpoints.length == 1){
                    checkpoint = checkpoints[0]
                    checkpoints = []
                }else{
                    checkpoint = checkpoints.slice(0, 1)
                    checkpoint = checkpoint[0]
                    checkpoints = checkpoints.slice(1, checkpoints.length)
                }
                continueCheckpoints = true
            }else{
                continueCheckpoints = false
            }
            
            }

        i++
    }// end while users
    
    console.log("intervalsDay");
    console.log(intervalsDay);
    

    

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
                    console.log("intersection["+day+"] = ");
                    console.log("intersection["+day+"] = ");
                    console.log("intersection["+day+"] = ");
                    console.log("intersection["+day+"] = ");
                    console.log("intersection["+day+"] = ");
                    console.log(intersection);

                    if (intersection.length == nMax){
                        find = true
                        findWithMax = true
                        let intervalsDay = getIntervalsDay(intersection)
                        const nonRepIntervals = remRepIntervals(intervalsDay)
                        intervals[day] = nonRepIntervals //interseccion de intervalos ese dia
                        break
                    }
                    if(intersection.length < tryN){
                        //console.log('es menor a '+nMax);
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
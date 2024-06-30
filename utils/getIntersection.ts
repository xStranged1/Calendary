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
    
    for (let i = 0; i < intersection.length; i++) {
        const interval = intersection[i];
        const intervalAvaiable = interval.avaiable
        let newMinRange, newMaxRange

        for (let j = 0; j < intervalAvaiable.length; j++) {
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
                        intervals[day] = getIntervalsDay(intersection)//suma intervals ese dia
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
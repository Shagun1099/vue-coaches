export default {
    async registerCoach(ctx,data){
        const userId = ctx.rootGetters.userId;
        const coachData = {
            firstName:data.first,
            lastName:data.last,
            description:data.desc,
            hourlyRate:data.rate,
            areas:data.areas
        };

        const token = ctx.rootGetters.token;

        const response = await fetch(`https://vue-courses-808c2-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=${token}`,{
            method:'PUT',
            body:JSON.stringify(coachData)
        });

        // const resData = await response.json();
        if(!response.ok){
            //error
        }
        ctx.commit('registerCoach',{
            ...coachData,
            id:userId
        });
    },
    async loadCoaches(ctx,payload){
        if(!payload.forceRefresh && !ctx.getters.shouldUpdate) return;
        const response = await fetch(`https://vue-courses-808c2-default-rtdb.firebaseio.com/coaches.json`);
        const resData = await response.json();
        if(!response.ok){
           const error = new Error(resData.message || 'Failed to fetch!');
           throw error;
        }

        const coaches = [];

        for(const key in resData){
            const coach = {
                id:key,
                firstName:resData[key].firstName,
                lastName:resData[key].lastName,
                description:resData[key].description,
                hourlyRate:resData[key].hourlyRate,
                areas:resData[key].areas   
            }
            coaches.push(coach);
        }
        ctx.commit('setCoaches',coaches);
        ctx.commit('setFetchTimeStamp');

    }
};
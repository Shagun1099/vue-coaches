export default{
    async contactCoach(ctx,payload){
        const newReq = {
            userEmail:payload.email,
            message:payload.message
        };
        const response = await fetch(`https://vue-courses-808c2-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`,{
            method:"POST",
            body:JSON.stringify(newReq)
        });

        if(!response.ok){
            const err = new Error(resData.message || "failed to send request!");
            throw err;
        }

        const resData = await response.json();

        newReq.id = resData.name;
        newReq.coachId = payload.coachId;

        ctx.commit('addRequest',newReq);
    },
    async fetchRequests(ctx){
        const coachId = ctx.rootGetters.userId;
        const token = ctx.rootGetters.token;
        const response = await fetch(`https://vue-courses-808c2-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=${token}`);
        
        const resData = await response.json();

        if(!response.ok){
            const err = new Error(resData.message || "failed to fetch!");
            throw err; 
        }


        const requests = [];
        for (const key in resData){
            const request = {
                id:key,
                coachId:coachId,
                userEmail:resData[key].userEmail,
                message:resData[key].message
            };
            requests.push(request);
        }

        ctx.commit('setRequests',requests);
    }
}
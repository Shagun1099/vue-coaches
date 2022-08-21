export default {
    setUser(state,payload){
        state.token = payload.token;
        state.user = payload.userId;
        state.didAutoLogout = false;
    },
    setAuthLogout(state){
       state.didAutoLogout = true;  
    }
};
export default {
  coaches(state){
    return state.coaches;
  },
  hasCoaches(state){
    return state.coaches && state.coaches.length > 0;
  },
  isCoach(_state,getters,_rootState,rootGetters){
   const coaches = getters.coaches;
   const userId = rootGetters.userId;
   return coaches.some(d=>d?.id === userId);
  },
  shouldUpdate(state){
    const lastFetch = state.lastFetch;
    if(!lastFetch){
      return true;
    }
    const currTimeStamp = new Date().getTime();
    return (currTimeStamp -lastFetch)/1000 > 60;
  }
};
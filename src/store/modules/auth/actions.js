import { API_KEY } from '../../../constants.js';

let timer;

export default {
  async login(ctx, payload) {
    return ctx.dispatch('auth', { ...payload, mode: 'login' });
  },
  async signup(ctx, payload) {
    return ctx.dispatch('auth', { ...payload, mode: 'signup' });
  },
  logout(ctx) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');

    clearTimeout(timer);

    ctx.commit('setUser', {
      token: null,
      userId: null,
      tokenExpiration: null,
    });
  },

  async auth(ctx, payload) {
    const mode = payload.mode;
    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    if (mode === 'signup') {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
    }
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      }),
    });

    const resData = await response.json();

    if (!response.ok) {
      const err = new Error(resData.message || 'Failed to authenticate!');
      throw err;
    }

    const expiresIn = +resData.expiresIn*1000;
    const expirationDate = new Date().getTime() + expiresIn;

    localStorage.setItem('token',resData.idToken);
    localStorage.setItem('userId',resData.localId);
    localStorage.setItem('tokenExpiration',expirationDate);

    timer = setTimeout(()=>{
      ctx.dispatch('autoLogout');
    },expiresIn);

    ctx.commit('setUser', {
      token: resData.idToken,
      userId: resData.localId,
    });
  },

  tryLogin(ctx){
   const token = localStorage.getItem('token');
   const userId = localStorage.getItem('userId');
   const tokenExpiration = localStorage.getItem('tokenExpiration');

   const expiresIn = +tokenExpiration - new Date().getTime();

   if(expiresIn < 0){
    return;
   }

   timer = setTimeout(()=>{
     ctx.dispatch('autoLogout');
   },expiresIn);

   if(token && userId){
    ctx.commit('setUser',{
      token:token,
      userId:userId,
    });
   }
  },
  autoLogout(ctx){
    ctx.dispatch('logout');
    ctx.commit('setAutoLogout');
  }
};

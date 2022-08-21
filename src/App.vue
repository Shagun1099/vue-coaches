<template>
<router-view></router-view>
</template>

<script>

export default{
  created(){
    this.$store.dispatch('tryLogin');
  },
  computed:{
    didAutoLogout(){
      return this.$store.getters.didAutoLogout;
    }
  },
  watch:{
    didAutoLogout(curr,old){
      if(curr && curr !== old){
        this.$router.replace('/coaches');
      }
    }
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
}

</style>
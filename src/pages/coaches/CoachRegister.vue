<template>
<Header/>
<base-card>
<section>
    <h2>Register as a coach now!</h2>
    <CoachForm @save-data="saveData"/>
</section>
</base-card>
</template>

<script>
import CoachForm from '../../components/coaches/CoachForm.vue';
import Header from '../../components/layouts/Header.vue';
export default {
    data(){
        return{

        }
    },
    components:{ CoachForm, Header },
    methods:{
        saveData(data){
           this.$store.dispatch('coaches/registerCoach',data);
           this.$router.replace('/coaches');
        }
    }
}

</script>
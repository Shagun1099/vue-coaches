<template>
    <base-dialog :show="!!error" title="An Error Occurred!" @close="handelError">
    <p>{{error}}</p>
    </base-dialog>
    <Header></Header>
    <section>
    <CoachesFilter @change-filter="setFilters"/>
    </section>
    <section>
        <base-card>
            <div class="controls">
                <base-button @click="loadCoaches(true)" mode="outline">Refresh</base-button>
                <base-button v-if="!isLoggedIn" to="/auth?redirect=register" link>Login to Register as coach</base-button>
                <base-button v-if="!isCoach && !loading && isLoggedIn" to="/register" link>Register as Coach</base-button>
            </div>
            <div v-if="loading">
              <base-spinner></base-spinner>
            </div>
            <ul v-else-if="hasCoaches">
                <CoachItem v-for="coach in filteredCoaches" :key="coach.id" :id="coach.id" :firstName="coach.firstName"
                    :lastName="coach.lastName" :rate="coach.hourlyRate" :areas="coach.areas" />
            </ul>
            <h3 v-else>No Coaches found</h3>
        </base-card>
    </section>
</template>

<script>

import Header from '../../components/layouts/Header.vue';
import CoachItem from '../../components/coaches/CoachItem.vue';
import CoachesFilter from './CoachesFilter.vue';

export default {
    data(){
      return{
        loading:false,
        error:null,
        activeFilters:{
         frontend:true,
         backend:true,
         career:true,
        }
      }
    },
    computed: {
        isLoggedIn(){
           return this.$store.getters.isAuthenticated; 
        },
        isCoach(){
          return this.$store.getters['coaches/isCoach'];  
        },
        filteredCoaches() {
            const coaches = this.$store.getters['coaches/coaches'];
            return coaches.filter(c=>{
                if(this.activeFilters.frontend && c.areas.includes('frontend')){
                    return true
                }
                 if(this.activeFilters.backend && c.areas.includes('backend')){
                    return true
                }
                 if(this.activeFilters.career && c.areas.includes('career')){
                    return true
                }
                return false;
            })
        },
        hasCoaches() {
            return !this.loading && this.$store.getters['coaches/hasCoaches'];
        }
    },
    created(){
      this.loadCoaches();
    },
    components: { Header, CoachItem, CoachesFilter },
    methods:{
        setFilters(updatedFilters){
        this.activeFilters=updatedFilters;
        },
        async loadCoaches(refresh=false){
            this.loading=true;
            try{
            await this.$store.dispatch('coaches/loadCoaches',{forceRefresh:refresh});
            }catch(err){
                this.error = err.message || "Something went wrong!";
            }
            this.loading=false;
        },
        handelError(){
            this.error=null;
        }
    }
}


</script>

<style scoped>
ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.controls {
    display: flex;
    justify-content: space-between;
}
</style>
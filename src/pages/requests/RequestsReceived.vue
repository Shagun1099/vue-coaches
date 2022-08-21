<template>
  <base-dialog :show="!!error" title="An Error Occurred!" @close="handelError">
    <p>{{error}}</p>
    </base-dialog>
  <Header></Header>
  <section>
    <base-card>
      <header>
        <h2>Requests Received</h2>
      </header>
      <base-spinner v-if="loading"></base-spinner>
      <ul v-else-if="hasRequests && !loading">
        <RequestItem v-for='req of receivedRequests' :email="req.userEmail" :message="req.message" :key="req.id" />
      </ul>
      <h3 v-else> You haven't received any requests yet!</h3>
    </base-card>
  </section>
</template>

<script>
import RequestItem from '../../components/requests/RequestItem.vue';
import Header from '../../components/layouts/Header.vue';
export default {
  data() {
    return {
      loading: false,
      error: null,
    }
  },
  computed: {
    receivedRequests() {
      return this.$store.getters["requests/requests"];
    },
    hasRequests() {
      return this.$store.getters["requests/hasRequests"];
    }
  },
  components: { RequestItem, Header },
  created(){
     this.loadRequests();
  },
  methods: {
    async loadRequests() {
      this.loading = true;
      try {
        await this.$store.dispatch('requests/fetchRequests');
      } catch (err) {
        this.error = err.message || "Somehting failed!";
      }
      this.loading = false;
    },
    handelError(){
      this.error = null;
    }
  }
}
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>
<template>
    <Header></Header>
    <base-dialog fixed :show="loading" title="Authenticating...">
        <base-spinner></base-spinner>
    </base-dialog>
    <base-dialog :show="!!error" title="An Error Occured!" @close="handleError">
        <p>{{ error }}</p>
    </base-dialog>
    <base-card>
        <form @submit.prevent="submitFrom">
            <div class="form-control">
                <label for="email">E-Mail</label>
                <input type="email" id="email" v-model.trim="email" />
            </div>
            <div class="form-control">
                <label for="password">Password</label>
                <input type="password" id="password" v-model.trim="password" />
            </div>
            <p v-if="!formIsValid">Please enter a valid email and password (must be atleast 6 characters long)</p>
            <base-button>{{ submitBtnCaption }}</base-button>
            <base-button @click="switchAuthMode" type="button" mode="flat">{{ switchModeBtnCaption }}</base-button>
        </form>
    </base-card>
</template>

<script>
import Header from '../../components/layouts/Header.vue';
export default {
    components: { Header },
    data() {
        return {
            email: '',
            password: '',
            formIsValid: true,
            mode: 'login',
            loading: false,
            error: null
        }
    },
    computed: {
        submitBtnCaption() {
            if (this.mode === 'login') {
                return 'Login';
            } else {
                return 'Sign Up'
            }
        },
        switchModeBtnCaption() {
            if (this.mode === 'login') {
                return 'Sign Up Instead';
            } else {
                return 'Login Instead'
            }
        }
    },
    methods: {
        handleError(){
          this.error=null;
        }, 
        async submitFrom() {
            if (this.email === '' || !this.email.includes('@') || this.password === '' || this.password.length < 6) {
                this.formIsValid = false;
                return;
            }
            this.loading = true;

            const payload={
                        email: this.email,
                        password: this.password
                    };
            try {
                if (this.mode === 'login') {
                   await this.$store.dispatch('login',payload);
                } else if (this.mode === 'signup') {
                   await this.$store.dispatch('signup',payload);
                }
                const redirectUrl = '/'+ (this.$route.query.redirect || 'coaches');
                this.$router.replace(redirectUrl);
            } catch (err) {
                this.error = err.message || "Failed to authticate!";
            }
            this.loading = false;
        },
        switchAuthMode() {
            if (this.mode === 'login') {
                this.mode = 'signup'
            } else {
                this.mode = 'login'
            }
        }
    }
}
</script>

<style scoped>
form {
    margin: 1rem;
    padding: 1rem;
}

.form-control {
    margin: 0.5rem 0;
}

label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
}

input,
textarea {
    display: block;
    width: 100%;
    font: inherit;
    border: 1px solid #ccc;
    padding: 0.15rem;
}

input:focus,
textarea:focus {
    border-color: #3d008d;
    background-color: #faf6ff;
    outline: none;
}
</style>
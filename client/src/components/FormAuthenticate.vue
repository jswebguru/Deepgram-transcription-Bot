<template>
    <div :class="formBehaviour">
        <b-col class="Form__background"></b-col>
        <b-col class="Form__formFill">
            <Icon class="Form__iconClose" icon="fe:close" title="Close form"></Icon>
            <span class="Form__titleForm" v-if="loginForm" >Log In</span>
            <span class="Form__titleForm" v-if="!loginForm" >Sign Up</span>
            <b-form class="Form__FormInput" @submit.prevent="submitForm">
                <b-form-group 
                    class="Form__inputName"
                    id="name"
                    label="Name"
                    label-for="input_name"
                    v-if="!loginForm"
                >
                    <b-form-input
                        id="input_name"
                        type="text"
                        v-model="signUp.name"
                        placeholder="Enter your name"
                        required
                    >
                    </b-form-input>
                </b-form-group>

                <b-form-group 
                    class="Form__inputEmail"
                    id="email"
                    label="Email"
                    label-for="input_email"
                    v-if="loginForm"
                >
                    <b-form-input
                        id="input_email"
                        type="email"
                        v-model="login.email"
                        placeholder="Enter your email"
                        required
                    >
                    </b-form-input>
                </b-form-group>

                <b-form-group 
                    class="Form__inputEmail"
                    id="email"
                    label="Email"
                    label-for="input_email"
                    v-if="!loginForm"
                >
                    <b-form-input
                        id="input_email"
                        type="email"
                        v-model="signUp.email"
                        placeholder="Enter your email"
                        required
                    >
                    </b-form-input>
                </b-form-group>

                <b-form-group 
                    class="Form__inputPassword"
                    id="password"
                    label="Password"
                    label-for="input_password"
                    v-if="loginForm"
                >
                    <b-form-input
                        id="input_password"
                        type="password"
                        v-model="login.password"
                        placeholder="Enter your password"
                        required
                    >
                    </b-form-input>
                </b-form-group>

                <b-form-group 
                    class="Form__inputPassword"
                    id="password"
                    label="Password"
                    label-for="input_password"
                    v-if="!loginForm"
                >
                    <b-form-input
                        id="input_password"
                        type="password"
                        v-model="signUp.password"
                        placeholder="Enter your password"
                        required
                    >
                    </b-form-input>
                </b-form-group>

                <b-button class="Form__formSubmit" type="submit" v-if="!loginForm">Sign Up</b-button>
                <b-button class="Form__formSubmit" type="submit" v-if="loginForm">Log In</b-button>
            </b-form>
        </b-col>
    </div>
</template>

<script>
import {Icon} from '@iconify/vue2';
import axios from 'axios';
import Toastify from 'toastify-js';

export default {
    name: 'FormAuthenticate',
    props: {
        openForm: {
            type: Boolean,
            default: false
        },
        loginForm: {
            type: Boolean,
            default: false
        }
    },
    emit:['isOpenForm','isOpenLoginForm'],
    data() {
        return {
            formBehaviour: 'Form Form--close Form--moveback',
            signUp: {
                name: '',
                email: '',
                password: ''
            },
            login: {
                email: '',
                password: ''   
            }
        }
    },
    components:{
        // eslint-disable-next-line vue/no-unused-components
        Icon
    },
    methods: {
        async submitForm(){
            try {
                
                let isSignUpForm = false;
                let isLoginForm = false;

                for(let key of Object.keys(this.signUp)){
                    if(this.signUp[key] !== ''){
                        isSignUpForm = true;
                        break; 
                    }
                }

                for(let key of Object.keys(this.login)){
                    if(this.login[key] !== ''){
                        isLoginForm = true;
                        break; 
                    }
                }


                if(isSignUpForm){
                    const requestSignUp = await axios.post('/signup', {
                        name: this.signUp.name,
                        email: this.signUp.email,
                        password: this.signUp.password,
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
        
                    console.log(requestSignUp.data);
        
                    this.signUp.name = '';
                    this.signUp.email = '';
                    this.signUp.password = '';
    
                    this.alertToastify(`Sign up successful`, 'var(--flatUI-green)');
                    return;
                }

                if(isLoginForm){
                    const requestLogin = await axios.post('/signin', {
                        email: this.login.email,
                        password: this.login.password,
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
        
                    console.log(requestLogin.data);
        
                    this.login.email = '';
                    this.login.password = '';
    
                    this.alertToastify(`Log in successful`, 'var(--flatUI-green)');

                    setTimeout(()=>{
                        // location.assign('/userhome');
                        this.$router.push({path: '/userhome'});
                    }, 1000);

                    return;
                }

                
            } catch (error) {
                // const errorStatus = error.request.status;
                const errorMessage = error.response.data.message;
                // this.alertToastify(`Error ${errorStatus}`, 'var(--flatUI-red)');
                this.alertToastify(`${errorMessage}`, 'var(--flatUI-red)');
            }


        },
        closeForm(){
            const SECONDS = 500;
            this.formBehaviour = 'Form Form--close'
            setTimeout(()=>{
                this.formBehaviour = 'Form Form--close Form--moveback'
                this.$emit('isOpenForm', false);
                this.$emit('isOpenLoginForm', false);
            }, SECONDS) 
        },
        alertToastify(message, color){
            Toastify({
                text: message,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: color,
                },
            }).showToast();
        }
    },
    watch: {
        openForm(value){
            console.log(value);
            if(value){
                this.formBehaviour = 'Form Form--active Form--moveforward'
            }else{
                this.formBehaviour = 'Form Form--close Form--moveback'
            }
        }
    },
    mounted() {

        const btnClose = document.querySelector('.Form__iconClose');

        btnClose.addEventListener('click', ()=>{
            this.closeForm();
        });
    },
}
</script>

<style lang="scss">
    @import "toastify-js/src/toastify.css"; 
    .Form{
        z-index: 3;
        position: fixed;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        padding: 5rem 14rem 5rem 14rem;

        .Form__background,
        .Form__formFill{
            transform: translateY(-20%);
        }

        .Form__background{
            // background-color: red;
            margin: 0;
            border-radius: 12px 0 0 12px;
            background-color:hsla(0,100%,50%,1);
            background-image:
            radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%),
            radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),
            radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%),
            radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%),
            radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%),
            radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%),
            radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%);
        }

        .Form__formFill{
            background-color: #fff;
            margin: 0;
            border-radius: 0 12px 12px 0;
            display: grid;
            grid-template-rows: 20% 80%;
            padding: 0 4rem 0 4rem;
            position: relative;

            .Form__iconClose{
                position: absolute;
                cursor: pointer;
                width: 1.2rem;
                height: 1.2rem;
                top: 2%;
                left: 95%;
            }

            .Form__titleForm{
                // background-color: red;
                margin-top: auto;
                margin-bottom: auto;
                text-align: center;
                font-size: 1.7rem;
                font-weight: 700;
            }

            .Form__FormInput{
                // background-color: yellow;
                margin-top: 1rem;

                .Form__formSubmit{
                    margin-top: 2rem;
                    width: 100%;
                    font-weight: 600;
                    background-color: var(--btn-color);
                    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
                }
            }
        }

    }

    .Form--active{
        transition: 0.5s ease-in-out;
        opacity: 100;
        .Form__background,
        .Form__formFill{
            transition: 0.5s ease-in-out; 
            transform: translateY(0);
        }
    }

    .Form--close{
        transition: 0.5s ease-in-out;
        opacity: 0;
        .Form__background,
        .Form__formFill{
            transition: 0.5s ease-in-out; 
            transform: translateY(-20%);
        }
    }

    .Form--moveforward{
        z-index: 3;
    }

    .Form--moveback{
        z-index: -3;
    }
</style>
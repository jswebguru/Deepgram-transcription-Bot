<template>
  <div>
    <form-authenticate :openForm="isFormOpen" :loginForm="loginForm" @isOpenForm="isOpenForm" @isOpenLoginForm="isOpenLoginForm"></form-authenticate>
    <div class="HomePage">
      <b-row class="HomePage__header">
        <!-- <b-col class="HomePage__title">
          <a href="/userhome" @click="LogInAndMove($event)"> SpeechParser</a>
        </b-col> -->
        <b-col class="HomePage__title">SpeechParser</b-col>
        <b-col class="HomePage__holderList">
          <ul class="HomePage__listButton">
            <li class="HomePage__btnSignUp" title="Sign Up" @click="openSignUpForm">Sign Up</li>
            <li class="HomePage__btnLogIn" title="Log In" @click="openLoginForm">Log In</li>
          </ul>
        </b-col>
      </b-row>
      <b-row class="HomePage__main">
        <b-col class="HomePage__mainOne" cols="7">
          <span class="HomePage__titleMain">Explore the power of Machine Learning through video transcription</span>
          <div class="HomePage__holderBtnAndPowered">
            <button class="HomePage__btnSignUpMain" title="Sign Up" @click="openSignUpForm">Sign Up</button>
            <span class="HomePage__powered" >Powered by DeepGram</span>
          </div>
          <span class="HomePage__quote">“People worry that computers will get too smart and take over the world, but the real problem is that they're too stupid and they've already taken over the world.” ― Pedro Domingos</span>
        </b-col>
        <b-col class="HomePage__mainTwo">
          <div class="HomePage__mainImage"></div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import FormAuthenticate from '../components/FormAuthenticate.vue';
export default {
  data() {
    return {
      isFormOpen: false,
      loginForm: false
    }
  },
  components: {
    FormAuthenticate
  },
  methods: {
    openSignUpForm(){
      console.log('Im clicked');
      this.isFormOpen = true;
    },
    isOpenForm(value){
      this.isFormOpen = value;
    },
    openLoginForm(){  
      this.openSignUpForm();
      this.loginForm = true;
    },
    isOpenLoginForm(value){
      this.loginForm = value
    },
    // LogInAndMove(){
    //   location.assign('/userhome');
    // }
  },
  mounted() {
    axios.get('/home')
    .then(res=>{
      console.log(res);
      if(res.data.isLogin){
        location.assign('/userhome');
      }
    })
    .catch(err=>{
      console.log(err);
    });
  },
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

  :root{
    --font-color: #2C3E50;
    --btn-color: #E67E22;
    --dark-btn-color: #CF6D17;
    --flatUI-red: #E74C3C;
    --flatUI-green: #2ecc71;
  }
  
  *{
    font-family: 'Roboto', sans-serif;
    color: var(--font-color);
    font-size: 1rem;
  }

  .HomePage{
    background-image: url('../assets/Images/1540-layered-waves-haikei.svg');
    background-repeat: no-repeat;
    background-size: cover;

    .row{
      margin-right: 0;
      margin-left: 0;
    }
  }

  .HomePage__header{
    // background-color: yellow;
    width: 100vw;
    height: 10vh;
    box-shadow: rgba(17, 12, 46, 0.07) 0px 48px 100px 0px;

    .HomePage__title {
      // background-color: red;
      font-size: 1.5rem;
      display: grid;
      align-content: center;
      margin-left: 5rem;
      font-weight: 700;
    }

    .HomePage__holderList{
      // background-color: aqua;
    }

    .HomePage__listButton{
      list-style: none;
      display: flex;
      font-weight: 600;
      height: 100%;
      justify-content: flex-end;
      align-items: center;
      // background-color: wheat;
      gap: 5rem;
      margin-right: 4rem;

      li{
        cursor: pointer;
        // background-color: yellow;
        border-radius: 10px;
        text-align: center;
        width: 6rem;
        padding: 0.4rem;
        height: 2.5rem;
        transition: 0.2s ease-in;

        &:hover{
          background-color: var(--flatUI-red);
          color: #fff;
        }
      }
    }
  }

  .HomePage__main{
    // background-color: purple;
    // background-repeat: no-repeat;
    height: 90vh;

    .HomePage__mainOne{
      // background-color: red;
      display: grid;
      grid-template-rows: 35% 15% 30%;
      padding: 4rem 6rem 4rem 6rem;
      // justify-items: center;

      .HomePage__titleMain{
        // background-color: red;
        font-size: 2rem;
        font-weight: 700;
        padding-top: 4rem;
      }

      .HomePage__holderBtnAndPowered{
        // background-color: greenyellow;
        width: 100%;
        display: flex;
        gap: 3rem;
        justify-content: center;
        align-items: center;

        .HomePage__btnSignUpMain{
          width: 10rem;
          height: 3rem;
          border-radius: 10px;
          color: #fff;
          background-color: var(--btn-color);
          border: 1px solid var(--btn-color);
          transition: 0.5s ease-in-out;

          &:hover{
            background-color: var(--dark-btn-color);
          }
        }

        .HomePage__powered{
          // background-color: wheat;
          color: var(--flatUI-red);
        }
      }

      .HomePage__quote{
        // background-color: aqua;
        padding-top: 1rem;
      }
    }

    .HomePage__mainTwo{
      // background-color: aqua;

    .HomePage__mainImage{
      // background-color: purple;
      width: 100%;
      height: 100%;
      background-image: url('../assets/Images/AI_image.png');
      background-size: 60% 60%;
      background-position: 50% 20%;
      background-repeat: no-repeat;
    }

    }

  }

</style>
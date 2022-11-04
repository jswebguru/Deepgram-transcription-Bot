<template>
  <div>
    <div class="UserHome">
      <b-row class="UserHome__header">
        <b-col class="UserHome__title">SpeechParser</b-col>
        <b-col class="UserHome__holderList">
          <ul class="UserHome__listButton">
            <li class="UserHome__btnSignUp" title="Username">{{username}}</li>
            <li class="UserHome__btnLogIn" title="Log out" @click="logout">Log Out</li>
          </ul>
        </b-col>
      </b-row>
      <b-row class="UserHome__main">
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      username: '',
    }
  },
  methods: {
    async logout(){
        try {
            const response = await axios.get('/logout');
            console.log(response.data);
            location.assign('/');
        } catch (error) {
            console.log(error);
        }

    }
  },
  mounted() {
    axios.get('/home')
    .then(res=>{
      if(!res){
        return;
      }
      this.username = res.data.name;
    })
    .catch(err=>{
      console.log(err);
      location.assign('/');
    })
    
  },
}
</script>

<style lang="scss">

  .UserHome{
    background-image: url('../assets/Images/1540-layered-waves-haikei.svg');
    background-repeat: no-repeat;
    background-size: cover;
    position: fixed;
    z-index: 4;

    .row{
      margin-right: 0;
      margin-left: 0;
    }
  }

  .UserHome__header{
    width: 100vw;
    height: 10vh;
    box-shadow: rgba(17, 12, 46, 0.07) 0px 48px 100px 0px;

    .UserHome__title{
      // background-color: red;
      font-size: 1.5rem;
      display: grid;
      align-content: center;
      margin-left: 5rem;
      font-weight: 700;
    }

    .UserHome__holderList{
      // background-color: aqua;
    }

    .UserHome__listButton{
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

  .UserHome__main{
    height: 90vh;
  }

</style>
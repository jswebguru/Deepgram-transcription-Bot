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
        <div class="UserHome__uploadHolder">
          <span class="UserHome__titleOne">Upload the Video for Transcription</span>
          <span class="UserHome__titleTwo">Click on the button or drag & drop files here</span>
          <button class="UserHome__buttonUpload" @click="uploadFiles">Upload</button>
        </div>
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Toastify from 'toastify-js';

export default {
  data() {
    return {
      username: '',
      videoFile: []
    }
  },
  methods: {
    async logout(){
        try {
            const response = await axios.get('/logout');
            console.log(response.data);

            this.alertToastify(`Log out successful`, 'var(--flatUI-green)');
            setTimeout(()=>{
              location.assign('/');
            }, 1000);
        } catch (error) {
            console.log(error);
        }

    },
    async uploadFiles(){
      const input = document.createElement('input');
      input.type = 'file';
      // input.name = 'video';
      input.click();

      input.onchange = async ()=>{
        const fileSelected = input.files[0];
        console.log(fileSelected);

        const form = new FormData();
        form.append('video', fileSelected);

        try {
          await axios.post('/upload', form, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });

          // console.log(postData.data.message);
          this.alertToastify('Upload Successful!', 'var(--flatUI-green)');

        } catch (error) {
         console.log(error); 
        }
      }
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
    justify-content: center;
    align-content: center;

    .UserHome__uploadHolder{
      width: 60%;
      height: 60%;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
      display: grid;
      grid-template-rows: 25% 25% 50%;
      justify-content: center;
      border: 1px solid #eee;

      .UserHome__titleOne{
        font-weight: 700;
        font-size: 1.3rem;
        text-align: center;
        padding-top: 4rem;
        // background-color: aqua;
      }

      .UserHome__titleTwo{
        text-align: center;
        padding-top: 1rem;
        font-size: 1.3rem;
        // background-color: yellow;
      }

      .UserHome__buttonUpload{
        margin-top: 2rem;
        justify-self: center;
        // align-self: center;
        width: 20rem;
        height: 3rem;
        border: 0;
        color: #fff;
        border-radius: 10px;
        background-color: var(--btn-color);
        box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
        transition: 0.3s ease-in-out;

        &:hover{
          background-color: var(--dark-btn-color);
        }
      }
    }
  }

</style>
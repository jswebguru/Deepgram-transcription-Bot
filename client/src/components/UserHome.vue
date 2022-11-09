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
        <div :class="classUpload">
          <span class="UserHome__titleOne">Upload the Video for Transcription</span>
          <span class="UserHome__titleTwo">Click on the button or drag & drop files here</span>
          <button class="UserHome__buttonUpload" @click="uploadFiles">
              Upload 
            <letter-cube :class="classBtnUploadLoading"></letter-cube>
          </button>

          <div class="UserHome__fileDescriptionHolder">
            <div class="UserHome__IconAndDescription">
              <div class="UserHome__holderIconFile">
                <object class="UserHome__mainFileIcon" :data="fileIcon" type="image/svg+xml"></object>
              </div>
              <div class="UserHome__detailsFile">
                <span class="UserHome__nameFileTitle">File Name</span>
                <span class="UserHome__nameFile">{{videoData.filename}}</span>
                <span class="UserHome__sizeTitle">Size</span>
                <span class="UserHome__sizeFile">{{videoData.filesize}}</span>
              </div>
            </div>
            <div class="UserHome__btnHolder">
              <b-button class="UserHome__btnUploadAgain" title="Upload Again" @click="uploadAgain">Upload Again</b-button>
              <b-button class="UserHome__btnSaveTranscript" title="Save Transcript" @click="saveTranscript">Save Transcript</b-button>
            </div>
          </div>
          <div class="UserHome__transcriptionHolder">
            <span class="UserHome__transcriptionTitle">Transcription</span>
            <div class="UserHome__mainTranscription">
              <p class="UserHome__wordTranscription">
                {{videoData.transcription}}
              </p>
            </div>
          </div>
        </div>
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Toastify from 'toastify-js';
import {LetterCube} from 'vue-loading-spinner';

const fileIcon = require('@/assets/Icons/files-icon.svg');

export default {
  data() {
    return {
      fileIcon,
      classUpload: 'UserHome__uploadHolder',
      classBtnUploadLoading: 'UserHome__loadingIcon',
      username: '',
      videoData: {
        fileId: '',
        filename: '',
        filesize: '',
        transcription: ''
      }
    }
  },
  components: {
    LetterCube
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

        if(fileSelected.type !== 'video/mp4'){
          input.value = '';
          this.alertToastify('Only .mp4 video will be accepted', 'var(--flatUI-red)');
          return;
        }

        const form = new FormData();
        form.append('video', fileSelected);

        try {

          this.classLoadingBtnUploadManipulator(true);

          const postData = await axios.post('/upload', form, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });

          this.classLoadingBtnUploadManipulator(false);

          const {fileId, filename, size, transcription} = postData.data;
          this.videoData.fileId = fileId;
          this.videoData.filename = filename;
          this.videoData.filesize = size;
          this.videoData.transcription = transcription;

          // console.log(postData.data.message);
          this.alertToastify('Upload Successful!', 'var(--flatUI-green)');
          this.classActivateManipulator(true);

        } catch (error) {
          this.alertToastify('Upload Fail!', 'var(--flatUI-red)');
          this.classLoadingBtnUploadManipulator(false);
          console.log(error); 
        }
      }
      
    },
    classActivateManipulator(isActive){
      const classDeactivate = 'UserHome__uploadHolder';
      const classActivate = 'UserHome__uploadHolder UserHome__uploadHolder--loadingToActive UserHome__uploadHolder--activeTranscript';

      if(isActive){
        this.classUpload = classActivate;
      }else{
        this.classUpload = classDeactivate;
      }
    },
    classLoadingBtnUploadManipulator(isActive){
      const active = 'UserHome__loadingIcon UserHome__loadingIcon--active';
      const deactivate = 'UserHome__loadingIcon';

      isActive ? this.classBtnUploadLoading = active : this.classBtnUploadLoading = deactivate;

    },
    async saveTranscript(){
      
      const fileId = this.videoData.fileId;
      const a = document.createElement('a');
      a.href = `/downloadTranscript/${fileId}`;
      a.click();

      this.alertToastify('Downloading in progress', 'var(--flatUI-green)');

    },
    uploadAgain(){
      this.classActivateManipulator(false);
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
      transition: 0.3s ease-in-out;
      width: 60%;
      height: 60%;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
      border: 1px solid #eee;
      display: grid;
      grid-template-rows: 25% 25% 50%;
      justify-content: center;

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
        width: 20rem;
        height: 3rem;
        border: 0;
        color: #fff;
        border-radius: 10px;
        position: relative;
        background-color: var(--btn-color);
        box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
        transition: 0.3s ease-in-out;

        .UserHome__loadingIcon{
          display: none;
          position: absolute;
          left: 70%;
          top: 10%;
        }

        .UserHome__loadingIcon--active{
          display: flex;
          position: absolute;
          left: 70%;
          top: 10%;
        }

        &:hover{
          background-color: var(--dark-btn-color);
        }
      }

      .UserHome__buttonUpload,
      .UserHome__titleOne,
      .UserHome__titleTwo{
        display: block;
      }

      .UserHome__fileDescriptionHolder,
      .UserHome__transcriptionHolder{
        display: none;
      }
    }


  // loading animation
    .UserHome__uploadHolder--loadingToActive{
      transition: 0.5s ease-in-out;
      .UserHome__buttonUpload,
      .UserHome__titleOne,
      .UserHome__titleTwo{
        opacity: 0;
      }

      .UserHome__fileDescriptionHolder,
      .UserHome__transcriptionHolder{
        display: block;
        opacity: 0;
      }
    }
  // loading animation



    .UserHome__uploadHolder--activeTranscript{
      transition: 0.5s ease-in-out;
      height: 80%;
      display: grid;
      grid-template-columns: 40% 60%;
      grid-template-rows: 100%;

      .UserHome__buttonUpload,
      .UserHome__titleOne,
      .UserHome__titleTwo{
        display: none;
        // opacity: 0;
      }

      .UserHome__fileDescriptionHolder,
      .UserHome__transcriptionHolder{
        display: block;
        opacity: 100%;
      }


      .UserHome__fileDescriptionHolder{
        // background-color: aqua;
        border-right: 1px solid #ddd;
        display: grid;
        grid-template-rows: 70% 30%;
        
        .UserHome__IconAndDescription{
          // background-color: greenyellow;
          padding: 0 1rem 0 1rem;
          display: grid;
          grid-template-columns: 45% 55%;
          grid-template-rows: 100%;

          .UserHome__holderIconFile{
            // background-color: red;
            align-self: center;
          }

          .UserHome__detailsFile{
            display: grid;
            grid-template-rows: 10% 20% 10% 20%;
            grid-template-columns: 100%;
            align-content: center;
            padding: 0 1rem 0 1rem;

            .UserHome__nameFileTitle,
            .UserHome__sizeTitle{
              font-size: 1.3rem;
              font-weight: 700;
            }

            .UserHome__nameFile,
            .UserHome__sizeFile{
              // width: 100%;
              // max-width: 100%;
              word-wrap: break-word;
              overflow: hidden;
            }
          }
        }

        .UserHome__btnHolder{
          // background-color: violet;
          display: grid;
          grid-template-columns: 40% 40%;
          align-content: center;
          justify-content: center;
          gap: 2rem;

          .UserHome__btnUploadAgain,
          .UserHome__btnSaveTranscript{
            background-color: var(--btn-color);
            border: var(--btn-color);
            box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
            transition: 0.3s ease-in-out;
            &:hover{
              background-color: var(--dark-btn-color);
            }
          }

        }
      }

      .UserHome__transcriptionHolder{
        // background-color: yellow;
        display: grid;
        grid-template-rows: 20% 80%;

        .UserHome__transcriptionTitle{
          // background-color: aquamarine;
          align-self: center;
          justify-self: center;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .UserHome__mainTranscription{
          // background-color: azure;
          padding: 1rem;
          max-width: 100%;
          overflow: auto;
          &::-webkit-scrollbar{
            width: 8px;
            height: 8px;
          }
          &::-webkit-scrollbar-track {
            border-radius: 10px;
            background: rgba(0,0,0,0.1);
          }
          .UserHome__wordTranscription{
          }
          &::-webkit-scrollbar-thumb{
            border-radius: 10px;
            background: rgba(0,0,0,0.2);
          }
          &::-webkit-scrollbar-thumb:hover{
            background: rgba(0,0,0,0.4);
          }
          &::-webkit-scrollbar-thumb:active{
            background: rgba(0,0,0,.9);
          }
        }
      }


    }
  }

</style>
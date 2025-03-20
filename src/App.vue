<template>
  <header>
    <div><img src="./assets/images/lecture.png" alt="logo" class="logo"><i class="fa-solid" style="font-size: 14px;">Enseignants</i></div>
  </header>
  <main>
    <RouterView />
  </main>
  <p class="small">Kely loatra<br>width > 790px</p>
</template>

<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import "./assets/fontawesome-6.6.0-web/css/all.min.css"
</script>

<style scoped>
  *{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  header{
    width: 100%;
    padding: 8px 16px;
    background: #0084BB;
    color: #ffffff;
    position: fixed;
    top: 0%;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo{
    width: 70px;
  }
  .nav{
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .small{
    margin-top: 200px;
    color: #0084BB;
    text-align: center;
    display: none;
    font-size: 20px;
  }
  main{
    display: block;
    /*
    margin-top: -15px; 
    background-image: url('./assets/images/cubes.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed; 
    */
  }
  @media screen and (max-width: 790px){
    main{
      display: none;
    }
    .small{
      display: block;
      font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    }
  }
</style>

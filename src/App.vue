<template>
  <header>
    <div><img src="./assets/images/lecture.png" alt="logo" class="logo"><i class="fa-solid" style="font-size: 18px;">Enseignants</i></div>
  </header>
  <RouterView />
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
</style>

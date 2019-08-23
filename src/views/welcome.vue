<template>
    <div id="welcome">
      <div style="width: 100%;height: 100%;display: flex;justify-content: center">
        <img src="../assets/img/welcome.png" style="height: 100%;margin-top: 100px" alt="">
      </div>

      <router-view />
    </div>
</template>

<script>
    export default {
        name: "welcome"
    }
</script>

<style scoped>

</style>

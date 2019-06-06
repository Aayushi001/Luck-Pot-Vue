<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/">About</router-link>
    </div>-->
    <router-view/>
  </div>
</template>

<script>
let pots = localStorage.getItem("pots");
console.log(pots);
if (!pots) {
  pots = [];
  for (let i = 0; i < 20; i++) {
    pots.push({ id: i + 1, players: [] });
  }
  localStorage.setItem("pots", JSON.stringify(pots));
}
console.log(pots[1]);
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

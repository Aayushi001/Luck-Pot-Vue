<template>
  <div class="home">
    <div class="container">
      <div v-if="!playersSet">
        <div class="row">
          <div class="offset-md-2 col-md-6">
            <label for="playersCount">No. of players:</label>
            <input
              id="playersCount"
              name="playersCount"
              type="number"
              v-model.number="playersCount"
            >
          </div>
        </div>

        <div class="row">
          <div class="offset-md-5 col-md-2">
            <button class="btn btn-primary" @click="submit">Submit</button>
          </div>
        </div>
      </div>
      <div v-else class="row">
        <h3>Enter the player names-</h3>
        <div class="offset-md-2 col-md-8">
          <div class="row mt-10" v-for="player in players" :key="player.id">
            <label>Player {{player.id}}:</label>
            <input type="text" v-model.trim="player.name" placeholder="Enter Name">
          </div>
          <div class="row mt-10">
            <div class="offset-md-3 col-md-6">
              <button class="btn btn-danger" @click="startGame()">Begin the game</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      playersCount: 0,
      playersSet: false,
      players: []
    };
  },
  methods: {
    submit() {
      let players = [];
      for (let i = 0; i < this.playersCount; i++) {
        players.push({ id: i + 1, name: "", amount: 1000 });
      }
      console.log(players);
      localStorage.setItem("players", JSON.stringify(players));
      this.players = players;
      this.playersSet = true;
    },
    startGame() {
      localStorage.setItem("players", JSON.stringify(this.players));
      this.$router.push("game-screen");
    }
  }
};
</script>

<style scoped>
.home {
  margin: 20px;
}
#playersCount {
  margin-left: 15px;
}
.mt-10 {
  margin-top: 10px;
}
</style>


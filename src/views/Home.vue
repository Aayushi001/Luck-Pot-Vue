<template>
  <div class="home">
    <div class="container">
      <h1 id="heading">Luck Pot Game</h1>
      <div v-if="!playersSet">
        <div class="row playerCountRow">
          <div class="offset-md-3 col-md-6">
            <label for="playersCount">Enter No. Of Players:</label> &nbsp;
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
            <button
              class="btn btn-primary full-width"
              :disabled="playersCount <= 0"
              @click="submit"
            >Submit</button>
          </div>
        </div>
      </div>
      <div v-else class="row">
        <div class="offset-md-4 col-md-4">
          <div class="mt-10" v-for="player in players" :key="player.id">
            <label>Player {{player.id}}:</label> &nbsp;
            <input type="text" v-model.trim="player.name" placeholder="Enter Name">
          </div>
          <div class="row mt-10">
            <div v-if="!isOngoing" class="offset-md-3 col-md-6">
              <button class="btn btn-danger" @click="startGame()">Begin the game</button>
            </div>
            <div v-else class="offset-md-1 col-md-10">
              <div class="row">
                <div class="col-md-6">
                  <button class="btn btn-outline-primary full-width" @click="startGame()">Continue</button>
                </div>
                <div class="col-md-6">
                  <button class="btn btn-outline-danger full-width" @click="restartGame()">Restart</button>
                </div>
              </div>
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
      players: [],
      pots: [],
      isOngoing: false
    };
  },
  methods: {
    submit() {
      let players = [];
      for (let i = 0; i < this.playersCount; i++) {
        players.push({ id: i + 1, name: "", amount: 1000 });
      }
      this.players = players;
      this.playersSet = true;
      this.setPlayers();

      // get pots, to check if there's an ongoing game
      let pots = localStorage.getItem("pots");
      if (!pots) {
        pots = [];
        for (let i = 0; i < 20; i++) {
          pots.push({ id: i + 1, players: [], totalAmount: 0 });
        }
        this.pots = pots;
        this.setPots();
      } else {
        this.pots = pots;
        this.isOngoing = true;
        alert(
          "There's already an ongoing game. You can continue the same game or restart."
        );
      }
    },
    startGame() {
      this.setPlayers();
      this.$router.push("game-screen");
    },
    restartGame() {
      this.setPlayers();
      this.pots = this.pots.filter(pot => {
        pot.players = [];
      });
      this.setPots();
      this.$router.push("game-screen");
    },
    setPlayers() {
      localStorage.setItem("players", JSON.stringify(this.players));
    },
    setPots() {
      localStorage.setItem("pots", JSON.stringify(this.pots));
    }
  },
  created() {}
};
</script>

<style scoped>
.home {
  margin: 120px 0px;
}
input {
  padding: 5px;
}
.full-width {
  width: 100%;
}
.center {
  text-align: center;
}
#heading {
  text-shadow: 2px 2px 4px #000000;
  font-size: 65px;
  margin-bottom: 40px;
}
#playersCount {
  height: 36px;
  padding: 5px;
}
.mt-10 {
  margin-top: 10px;
}
.playerCountRow {
  min-height: 36px;
  line-height: 36px;
  margin-bottom: 20px;
}
.row {
  height: 25px;
  line-height: 25px;
  margin-bottom: 20px;
}
</style>


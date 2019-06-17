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
        <div class="offset-md-3 col-md-6">
          <div class="mt-10" v-for="(player,i) in players" :key="player.id">
            <label>Player {{player.id}}:</label>
            &nbsp;
            <template v-if="isPlayerNew[i]">
              <input v-model.trim="player.name" placeholder="Enter Name">
              &nbsp;
              <button
                @click="toggle(i)"
                class="btn btn-md btn-outline-success"
              >Old</button>
            </template>
            <template v-else>
              <select v-model.trim="player.name" placeholder="Enter Name">
                <option
                  v-for="individualPlayer in allPlayers"
                  :key="individualPlayer.id"
                  :value="individualPlayer.name"
                >{{individualPlayer.name}}</option>
              </select>
              &nbsp;
              <button
                @click="toggle(i)"
                class="btn btn-md btn-outline-success"
              >New</button>
            </template>
          </div>
          <div class="row mt-10">
            <div v-if="!isOngoing" class="offset-md-3 col-md-6">
              <button class="btn btn-danger" @click="startGame()">Begin the game</button>
            </div>
            <div v-else class="offset-md-2 col-md-8">
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
import Service from "@/service.js";
const service = new Service();

export default {
  data() {
    return {
      playersCount: 0,
      playersSet: false,
      players: [],
      allPlayers: [],
      pots: [],
      isOngoing: false,
      isPlayerNew: []
    };
  },
  methods: {
    submit() {
      this.playersSet = true;
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
      // this.setPlayers();

      //get all the players
      service.methods.getPlayers().then(data => {
        this.allPlayers = data.data;
        let players = [];
        if (this.allPlayers.length > 0) {
          for (let i = 0; i < this.playersCount; i++) {
            this.isPlayerNew[i] = false;
            players.push({ name: "", amount: 1000, isActive: true });
          }
        } else {
          for (let i = 0; i < this.playersCount; i++) {
            this.isPlayerNew[i] = true;
            players.push({ name: "", amount: 1000, isActive: true });
          }
        }
        this.players = players;
        console.log(this.players);
      });
    },
    toggle(i) {
      this.isPlayerNew[i] = !this.isPlayerNew[i];
      this.isPlayerNew = JSON.parse(JSON.stringify(this.isPlayerNew));
    },
    startGame() {
      this.setPlayers();
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
      // localStorage.setItem("players", JSON.stringify(this.players));
      let newPlayers = JSON.parse(JSON.stringify(this.players));
      let isPlayerNewClone = JSON.parse(JSON.stringify(this.isPlayerNew));
      for (let i = 0; i < newPlayers.length; i++) {
        if (!isPlayerNewClone[i]) {
          newPlayers.splice(i, 1);
          isPlayerNewClone.splice(i, 1);
          i--;
        }
      }
      console.log(newPlayers);
      service.methods.activatePlayers(this.players).then(data => {
        console.log(data);
        service.methods.addPlayers(newPlayers).then(result => {
          this.$router.push("game-screen");
        });
      });
    },
    setPots() {
      localStorage.setItem("pots", JSON.stringify(this.pots));
    }
  }
};
</script>

<style scoped>
.home {
  margin: 120px 0px;
}
input,
select {
  padding: 5px;
  min-width: 50%;
  min-height: 36px;
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


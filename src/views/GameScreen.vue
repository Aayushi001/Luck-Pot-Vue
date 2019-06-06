<template>
  <div>
    <div class="jumbotron">
      <p>
        Every player has initial balance of Rs 1000.
        <br>Each player is expected to deposit atmost their balance amount in any 1 or more of the below pots.
      </p>
      <h3>{{ currentPlayerName}}'s turn.</h3>
    </div>
    <div class="container">
      <div class="row">
        <div class="offset-md-3 col-md-3">
          <button class="btn btn-outline-danger full-width" disabled>
            <b>Balance: Rs. {{players[currentPlayerIndex]['amount'].toLocaleString()}}</b>
          </button>
        </div>
        <div class="col-md-3">
          <button
            class="btn btn-outline-primary full-width"
            @click="finishedTurn()"
          >Finish this turn</button>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3" v-for="pot in pots" :key="pot.id">
          <PotComponent :pot="pot" @add-to-pot="updatePot($event)"></PotComponent>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
console.log("GAMESCREEN");
import PotComponent from "@/components/PotComponent.vue";
import { setInterval } from "timers";

setInterval(this.recurringFunction(), 60 * 60 * 1000);

export default {
  components: { PotComponent },
  data() {
    return {
      players: [],
      currentPlayerIndex: 0,
      pots: []
    };
  },
  computed: {
    currentPlayerName() {
      return this.players[this.currentPlayerIndex]["name"];
    }
  },
  created() {
    console.log("created");

    let players = JSON.parse(localStorage.getItem("players"));
    let pots = JSON.parse(localStorage.getItem("pots"));

    this.players = players;
    console.log(this.players);
    this.pots = pots;
  },
  methods: {
    updatePot(parameterObject) {
      console.log(parameterObject.id);
      console.log(parameterObject.deposit);
      if (
        parameterObject.deposit <=
        this.players[this.currentPlayerIndex]["amount"]
      ) {
        this.players[this.currentPlayerIndex]["amount"] -=
          parameterObject.deposit;
        let updatedPotIndex = this.pots.findIndex(pot => {
          return pot.id === parameterObject.id;
        });
        console.log(updatedPotIndex);
        //updatedPotIndex = index of pot that needs to be updated.
        // currentPlayerIndex = index of current player in players array.
        // existingPlayerIndex = index of current player in the pot's players array.
        let existingPlayerIndex = this.pots[updatedPotIndex][
          "players"
        ].findIndex(player => {
          return (
            player.playerId === this.players[this.currentPlayerIndex]["id"]
          );
        });
        console.log(existingPlayerIndex);
        if (existingPlayerIndex != -1) {
          // if the player had already deposited some amount in the same pot,
          // then the new amount must get added to the previous amount.
          this.pots[updatedPotIndex]["players"][existingPlayerIndex][
            "deposit"
          ] += parameterObject.deposit;
        } else {
          //else, push new player object to the players property of pot
          this.pots[updatedPotIndex]["players"].push({
            playerId: this.players[this.currentPlayerIndex]["id"],
            deposit: parameterObject.deposit
          });
        }
        localStorage.setItem("pots", JSON.stringify(this.pots));
        localStorage.setItem("players", JSON.stringify(this.players));
      } else {
        alert(
          `Oops! You can not deposit more than Rs. ${
            this.players[this.currentPlayerIndex]["amount"]
          }. `
        );
      }
    },
    finishedTurn() {
      if (this.currentPlayerIndex === this.players.length - 1) {
        this.currentPlayerIndex = 0;
      } else {
        this.currentPlayerIndex++;
      }
      console.log(this.currentPlayerIndex);
    },

    recurringFunction() {
      let medianPotIndex = this.findMedianPot();
    },
    findMedianPot() {}
  }
};
</script>

<style scoped>
.jumbotron {
  padding: 30px 10px 10px 10px;
}
.full-width {
  width: 100%;
}
</style>
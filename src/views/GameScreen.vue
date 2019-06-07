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
        <div class="col-md-3">
          <button class="btn btn-outline-danger full-width no-border" disabled>
            <b>Balance: Rs. {{players[currentPlayerIndex]['amount'].toLocaleString()}}</b>
          </button>
        </div>
        <div class="offset-md-5 col-md-2">
          <button
            class="btn btn-outline-primary full-width"
            @click="finishedTurn()"
          >Finish this turn</button>
        </div>
        <div class="col-md-2">
          <button
            class="btn btn-outline-danger full-width"
            @click="recurringFunction()"
          >Get lucky pot</button>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3" v-for="pot in pots" :key="pot.id">
          <PotComponent
            :pot="pot"
            :totalSum="totalSum"
            :luckyPotId="luckyPotId"
            @add-to-pot="updatePot($event)"
          ></PotComponent>
        </div>
      </div>
    </div>

    <div class="container" v-if="winners.length > 0" style="margin-top: 40px;">
      <h3 class="center">Recent Lucky Pot Winners</h3>
      <table class="table table-striped">
        <tr>
          <th>Player Id</th>
          <th>Player Name</th>
          <th>Deposited</th>
          <th>Multiplication Factor</th>
          <th>Won</th>
        </tr>
        <tr v-for="winner in winners" :key="winner.id">
          <td>{{winner.playerId}}</td>
          <td>{{winner.playerName}}</td>
          <td>{{winner.depositedAmount}}</td>
          <td>{{winner.factor}}</td>
          <td>{{winner.wonAmount}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
console.log("GAMESCREEN");
import PotComponent from "@/components/PotComponent.vue";
import { setInterval } from "timers";
import * as $ from "jquery";

export default {
  components: { PotComponent },
  data() {
    return {
      players: [],
      currentPlayerIndex: 0,
      pots: [],
      luckyPotId: 0,
      winners: []
    };
  },
  computed: {
    currentPlayerName() {
      return this.players[this.currentPlayerIndex]["name"];
    },
    totalSum() {
      let total = 0;
      for (let i = 0; i < this.pots.length; i++) {
        total += this.pots[i]["totalAmount"];
      }
      console.log("calculated total");
      return total;
    }
  },
  created() {
    console.log("created");

    let players = JSON.parse(localStorage.getItem("players"));
    let pots = JSON.parse(localStorage.getItem("pots"));

    this.players = players;
    this.pots = pots;
    setInterval(() => {
      this.recurringFunction();
    }, 60 * 60 * 1000);
  },
  methods: {
    updatePot(parameterObject) {
      if (
        parameterObject.deposit <=
        this.players[this.currentPlayerIndex]["amount"]
      ) {
        this.players[this.currentPlayerIndex]["amount"] -=
          parameterObject.deposit;
        let updatedPotIndex = this.pots.findIndex(pot => {
          return pot.id === parameterObject.id;
        });

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
        this.pots[updatedPotIndex]["totalAmount"] += parameterObject.deposit;
        this.updatePots();
        this.updatePlayers();
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
    },

    recurringFunction() {
      console.log("recurringFunction");
      let luckyPotIndex = Math.floor(Math.random() * 20);
      this.luckyPotId = this.pots[luckyPotIndex]["id"];
      console.log("id : " + this.luckyPotId);

      if (this.pots[luckyPotIndex]["totalAmount"] > 0) {
        this.winners = [];
        console.log(this.pots[luckyPotIndex]["totalAmount"]);

        let medianPotTotal = this.findMedianPot();
        console.log(medianPotTotal);
        let multiplicationFactor = Math.abs(
          this.pots[luckyPotIndex]["totalAmount"] - medianPotTotal
        );
        for (let i = 0; i < this.pots[luckyPotIndex]["players"].length; i++) {
          let wonAmount =
            this.pots[luckyPotIndex]["players"][i]["deposit"] *
            multiplicationFactor;
          let playerName;
          for (let j = 0; j < this.players.length; j++) {
            if (
              this.players[j]["id"] ===
              this.pots[luckyPotIndex]["players"][i]["playerId"]
            ) {
              // amount gets added to the player's total balance
              this.players[j]["amount"] += wonAmount;
              playerName = this.players[j]["name"];
              break;
            }
          }
          this.winners.push({
            playerId: this.pots[luckyPotIndex]["players"][i]["playerId"],
            playerName: playerName,
            depositedAmount: this.pots[luckyPotIndex]["players"][i]["deposit"],
            factor: multiplicationFactor,
            wonAmount: wonAmount
          });
        }

        // empty the pot, i.e. totalAmount of the pot becomes 0
        this.pots[luckyPotIndex]["players"] = [];
        this.pots[luckyPotIndex]["totalAmount"] = 0;
        this.updatePots();
        this.updatePlayers();
      } else {
        alert(`Bad Luck! The pot no. ${luckyPotIndex + 1} has no money in it.`);
      }
    },
    findMedianPot() {
      let unsortedPots = JSON.parse(JSON.stringify(this.pots));

      let sortedPots = unsortedPots.sort(function(a, b) {
        return b.totalAmount - a.totalAmount;
      });

      let length = this.pots.length;
      if (length % 2) {
        //odd
        // median = (n + 1)/2 th pot's totalAmount
        return sortedPots[(length + 1) / 2]["totalAmount"];
      } else {
        //even
        //median = ((n/2)th pot's totalAmount + (n/2 + 1)th pot's totalAmount)/2
        let value1 = sortedPots[length / 2]["totalAmount"];
        let value2 = sortedPots[length / 2 + 1]["totalAmount"];

        return (value1 + value2) / 2;
      }
    },
    updatePots() {
      localStorage.setItem("pots", JSON.stringify(this.pots));
    },
    updatePlayers() {
      localStorage.setItem("players", JSON.stringify(this.players));
    }
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
.no-border {
  border: none;
}
</style>
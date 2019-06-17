<template>
  <div>
    <div class="jumbotron">
      <p>
        Every player has initial balance of Rs 1000.
        <br>Each player is expected to deposit atmost their balance amount in any 1 or more of the below pots.
      </p>
      <h3>{{ currentPlayerName}}'s turn.</h3>
    </div>
    <div class="container" v-if="players.length>0">
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
          <th>Player Name</th>
          <th>Deposited</th>
          <th>Multiplication Factor</th>
          <th>Won</th>
        </tr>
        <tr v-for="winner in winners" :key="winner.id">
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
import Service from "@/service.js";
import { setInterval } from "timers";
const service = new Service();

export default {
  components: { PotComponent },
  data() {
    return {
      players: [],
      currentPlayerIndex: -1,
      pots: [],
      luckyPotId: 0,
      winners: []
    };
  },
  created() {
    console.log("created");
    let pots = JSON.parse(localStorage.getItem("pots"));
    service.methods.getActivePlayers().then(data => {
      console.log(data);
      console.log(data.data);
      let players = data.data;
      this.currentPlayerIndex = 0;
      console.log("players : ");

      this.players = players;
      this.pots = pots;
      console.log(this.players);
      setInterval(() => {
        this.recurringFunction();
      }, 60 * 60 * 1000);
    });
  },
  computed: {
    currentPlayerName() {
      if (this.players[this.currentPlayerIndex]) {
        return this.players[this.currentPlayerIndex]["name"];
      }
      return null;
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

  methods: {
    updatePot(parameterObject) {
      // This fn is called while depositing some amount to a specific pot.
      // current player's amount gets reduced by the deposited amount
      // The chosen pot gets updated by increasing its totalAmount and adding player's details.
      if (
        parameterObject.deposit <=
        this.players[this.currentPlayerIndex]["amount"]
      ) {
        this.players[this.currentPlayerIndex]["amount"] -=
          parameterObject.deposit;
        let playersToBeUpdated = [
          {
            name: this.players[this.currentPlayerIndex]["name"],
            amount: this.players[this.currentPlayerIndex]["amount"]
          }
        ];
        let updatedPotIndex = this.pots.findIndex(pot => {
          return pot.id === parameterObject.id;
        });

        //updatedPotIndex = index of pot that needs to be updated.
        // currentPlayerIndex = index of current player in players array.
        // existingPlayerIndex = index of current player in the pot's players array.
        let existingPlayerIndex = this.pots[updatedPotIndex][
          "players"
        ].findIndex(player => {
          return player.name === this.players[this.currentPlayerIndex]["name"];
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
            name: this.players[this.currentPlayerIndex]["name"],
            deposit: parameterObject.deposit
          });
        }
        this.pots[updatedPotIndex]["totalAmount"] += parameterObject.deposit;
        this.updatePots();
        this.updatePlayers(playersToBeUpdated);
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
      console.log(this.players);
      let luckyPotIndex = Math.floor(Math.random() * 20);
      this.luckyPotId = this.pots[luckyPotIndex]["id"];
      console.log("id : " + this.luckyPotId);

      if (this.pots[luckyPotIndex]["totalAmount"] > 0) {
        this.winners = [];
        let medianPotTotal = this.findMedianPot();
        let multiplicationFactor = Math.abs(
          this.pots[luckyPotIndex]["totalAmount"] - medianPotTotal
        );
        let playersToBeUpdated = [];
        for (let i = 0; i < this.pots[luckyPotIndex]["players"].length; i++) {
          let wonAmount =
            this.pots[luckyPotIndex]["players"][i]["deposit"] *
            multiplicationFactor;
          let playerName;
          for (let j = 0; j < this.players.length; j++) {
            if (
              this.players[j]["name"] ===
              this.pots[luckyPotIndex]["players"][i]["name"]
            ) {
              // amount gets added to the player's total balance
              this.players[j]["amount"] += wonAmount;
              playerName = this.players[j]["name"];
              playersToBeUpdated.push({
                name: playerName,
                amount: this.players[j]["amount"]
              });
              break;
            }
          }
          this.winners.push({
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
        this.updatePlayers(playersToBeUpdated);
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
    updatePlayers(playersToBeUpdated) {
      // localStorage.setItem("players", JSON.stringify(this.players));
      service.methods.updatePlayers(playersToBeUpdated).then(data => {
        console.log(data);
      });
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
<template>
  <div class="outer-container">
    <div class="pot-card">
      <div class="card-face card-face-front">
        <img height="60px" width="50px" src="@/assets/pot.png">
        &nbsp; Pot {{pot.id}}
      </div>
      <div class="card-face card-face-back">
        <p>
          <b>Total: Rs. {{totalAmount.toLocaleString()}}</b>
        </p>
        <div class="flex-div">
          <label for="deposit">Amount: &nbsp;</label>
          <input id="deposit" type="number" v-model.number="deposit" name="deposit">

          <div class="btn-div">
            <button class="btn btn-sm btn-danger" :disabled="deposit <= 0" @click="addDeposit()">
              <i class="fa fa-check"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pot: Object
  },
  data() {
    return {
      deposit: 0
    };
  },
  computed: {
    totalAmount() {
      let total = 0;
      console.log(this.deposit);
      for (let i = 0; i < this.pot.players.length; i++) {
        total += this.pot.players[i]["deposit"];
      }
      return total;
    }
  },
  methods: {
    addDeposit() {
      this.$emit("add-to-pot", { id: this.pot.id, deposit: this.deposit });
      this.deposit = 0;
    }
  }
};
</script>

<style scoped>
.outer-container {
  margin-top: 15px;
  perspective: 600px;
  height: 100px;
}
.outer-container:hover .pot-card {
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
}

.pot-card {
  border: 1px solid rgba(0, 0, 0, 0.125);
  padding: 10px;
  background-color: lightcyan;
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 1.2s;
  transform-style: preserve-3d;
  cursor: pointer;
}
.card-face {
  position: absolute;
  left: 30%;
  top: 20%;
  backface-visibility: hidden;
}
/* Style the back side */
.card-face-back {
  transform: rotateY(180deg);

  top: 10%;
  left: 0%;
}
.flex-div {
  display: flex;
  flex-direction: row;
  height: 25px;
}
.flex-div > label {
  flex: 1 1 auto;
  overflow: hidden;
  font-size: 14px;
}
.flex-div > input {
  height: 25px;
  width: 45%;
  vertical-align: middle;
  flex: 1 1 auto;
  overflow: hidden;
}
.btn-div {
  margin: 0px 7px;
  height: 25px;
}
.btn {
  padding-top: 2px;
}
</style>
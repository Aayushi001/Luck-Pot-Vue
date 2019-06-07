<template>
  <div class="outer-container">
    <div
      class="pot-card"
      :class="pot.id === luckyPotId ? 'lucky-animated bounce lucky-border' : ''"
      :style="styleObject"
    >
      <div class="card-face card-face-front">
        <img height="60px" width="50px" src="@/assets/pot.png">
        &nbsp;
        Pot {{pot.id}}
      </div>
      <div class="card-face card-face-back">
        <p>
          <b>Total: Rs. {{pot.totalAmount.toLocaleString()}}</b>
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
  props: ["pot", "luckyPotId", "totalSum"],
  data() {
    return {
      deposit: 0,
      styleObject: { "background-color": "#fff" }
    };
  },
  methods: {
    addDeposit() {
      this.$emit("add-to-pot", { id: this.pot.id, deposit: this.deposit });
      this.deposit = 0;
    },
    setBackgroundColor() {
      let colorFactor;
      if (this.totalSum > 0) {
        colorFactor = this.pot["totalAmount"] / this.totalSum;
      } else {
        colorFactor = 0;
      }

      let bgColorValue;
      if (colorFactor === 0) {
        bgColorValue = "#fff";
      } else if (colorFactor >= 0 && colorFactor < 0.2) {
        bgColorValue = "#F9F96D";
      } else if (colorFactor >= 0.2 && colorFactor < 0.4) {
        bgColorValue = "#fab039";
      } else if (colorFactor >= 0.4 && colorFactor < 0.6) {
        bgColorValue = "#f9a533";
      } else if (colorFactor >= 0.6 && colorFactor < 0.8) {
        bgColorValue = "#f48c31";
      } else {
        bgColorValue = "#E14A33";
      }
      this.styleObject = { "background-color": bgColorValue };
    }
  },
  created() {
    this.setBackgroundColor();
  },
  watch: {
    totalSum() {
      this.setBackgroundColor();
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
  border: 1px solid rgba(244, 248, 4, 0.125);
  padding: 10px;
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 1.2s;
  transform-style: preserve-3d;
  cursor: pointer;
  -webkit-transition: background-color 0.4s ease-in; /* Safari */
  transition: background-color 0.4s ease-in;
  -webkit-transition-delay: 0.4s; /* Safari */
  transition-delay: 0.4s;
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
.btn-div > .btn {
  padding-top: 2px;
  height: 25px;
}
.lucky-animated {
  background-image: url(/css/images/logo.png);
  background-repeat: no-repeat;
  background-position: left top;
  padding-top: 95px;
  margin-bottom: 60px;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    -webkit-transform: translateY(0);
  }
  40% {
    -webkit-transform: translateY(-30px);
  }
  60% {
    -webkit-transform: translateY(-15px);
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

.bounce {
  -webkit-animation-name: bounce;
  animation-name: bounce;
}
.lucky-border {
  border: solid 4px #39ff14;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  -webkit-transition: border 0.5s ease-in; /* Safari */
  transition: border 0.5s ease-in;
  -webkit-transition-delay: 0.5s; /* Safari */
  transition-delay: 0.5s;
}
</style>
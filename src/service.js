import axios from "axios";
import urls from "./urls";

const baseURL = `${urls.local}`;
console.log("baseurl");
console.log(baseURL);

let Service = function() {
  this.methods = {
    getPots: function() {
      return axios.get(`${baseURL}/getTested`);
    },
    getPlayers: function() {
      return axios.get(`${baseURL}/player/getAll`);
    },
    getActivePlayers: function() {
      return axios.get(`${baseURL}/player/getActive`);
    },
    deactivatePlayers: function() {
      return axios.get(`${baseURL}/player/deactivate`);
    },
    activatePlayers: function(players) {
      return axios.post(`${baseURL}/player/activate`, { players: players });
    },
    addPlayers: function(players) {
      return axios.post(`${baseURL}/player/add`, { players: players });
    },
    updatePlayers: function(players) {
      return axios.post(`${baseURL}/player/update`, { players: players });
    }
  };
};

export default Service;

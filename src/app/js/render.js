const ipcRenderer = require("electron").ipcRenderer;

function load() {
  render.onLoad();
}

const render = {
  onLoad() {
    const buttonClick = document.getElementById("exit-button");
    if (!buttonClick) {
      console.log("could not find exit button.");
    }
    buttonClick.onclick = function() {
      console.log("clicked");
      ipcRenderer.send("exit-button", true);
    };

    const searchBar = document.getElementsByClassName("search-bar")[0];
    if (!searchBar) {
      console.log("could not find search bar.");
    }
    searchBar.onchange = function(event) {
      console.log(event);
    };
  }
};

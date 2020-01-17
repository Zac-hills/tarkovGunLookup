const ipcRenderer = require("electron").ipcRenderer;
let json = require("../../resources/output.json");

function load() {
  render.onLoad();
}

const render = {
  nameToURL: {},
  onLoad() {
    const buttonClick = document.getElementById("exit-button");
    if (!buttonClick) {
      console.log("could not find exit button.");
    }
    buttonClick.onclick = function() {
      console.log("clicked");
      ipcRenderer.send("exit-button", true);
    };
    const minimizeButton = document.getElementById("minimize-button");
    if (!minimizeButton) {
      console.log("could not find minimize button.");
    }
    minimizeButton.onclick = function() {
      console.log("clicked");
      ipcRenderer.send("minimize-button", true);
    };
    const maximizeButton = document.getElementById("maximize-button");
    if (!maximizeButton) {
      console.log("could not find maximize button.");
    }
    maximizeButton.onclick = function() {
      console.log("clicked");
      ipcRenderer.send("maximize-button", true);
    };
    const searchBar = document.getElementsByClassName("search-bar")[0];
    if (!searchBar) {
      console.log("could not find search bar.");
    }
    searchBar.onchange = this.onSubmit.bind(this);

    let dataList = document.createElement("datalist");
    if (!dataList) {
      console.log("could not create datalist");
    }
    searchBar.appendChild(dataList);
    dataList.id = "components";
    for (const prop in json) {
      if (!json[prop].children.length && !json[prop].parents.length) {
        continue;
      }
      let option = document.createElement("option");
      let val = json[prop].key;
      val = val.replace(/\//g, "");
      val = val.replace(/_/g, " ");
      let index = val.lastIndexOf("%");
      if (index != -1) {
        val = val.substr(index + 1);
      }
      option.value = val;
      dataList.appendChild(option);
      this.nameToURL[val] = json[prop].key;
    }
    searchBar.setAttribute("list", "components");
  },

  onSubmit(event) {
    console.log(event);
    const searchBar = document.getElementsByClassName("search-bar")[0];
    let val = searchBar.nodeValue;
    if (!(val in this.nameToURL)) {
      //TODO should have some sort of feedback ui element
      return;
    }
  }
};

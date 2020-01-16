const { app, BrowserWindow } = require("electron");
const getResults = require("./scraper");
const fs = require('fs');

async function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile("src/app/html/index.html");
  win.webContents.openDevTools();
  
  const result = await getResults();
  //let jsonString = JSON.stringify(result, null, "\t"); // if you want to beautify it
  let jsonString = JSON.stringify(result);
  console.log("Outputting to ./ScraperOutput/Output.json");
  fs.writeFileSync('./ScraperOutput/output.json', jsonString, 'utf-8');
}

app.on("ready", createWindow);

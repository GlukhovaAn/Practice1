const express = require("express");
const fs = require("fs");
const hbs = require("hbs");

const app = express();
app.use(express.json());
app.set("view engine", "hbs");

app.use(express.static(__dirname + "/public"));

hbs.registerHelper("createList", function (array) {
  let result = "";
  for (let i = 0; i < array.length; i++) {
    result += "<li>" + array[i] + "</li>";
  }
  return new hbs.SafeString("<ul>" + result + "</ul>");
});

app.get("/", function (request, response) {
  const content = fs.readFileSync("data.json", "utf8");
  const data = JSON.parse(content);
  response.render("index.hbs", {
    categories: data.map((item) => {
      return item.category;
    }),
  });
});
app.get("/api/data/:id", function (req, res) {
    const id = req.params.id; // получаем id
    const content = fs.readFileSync("data.json", "utf8");
    const data = JSON.parse(content);
    let links = null;
    for (let i = 0; i < data.length; i++) {
        console.log(data[i].category)
      if (data[i].category == id) {
        links = data[i].links;
        break;
      }
    }
    console.log(links)
    if (links) {
      res.send(links);
    } else {
      res.status(404).send();
    }
  });
  app.post("/api/info", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const link = req.body.link;
    fetch(link)
      .then((res) => res.json())
      .then((data) => {
        return res.send(data);
      })
      .catch((err) => {
        return res.status(404).send(err);
      });
    });

app.listen(3000, ()=>{console.log("Server started");});

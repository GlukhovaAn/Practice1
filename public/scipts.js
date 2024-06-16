

const linksContener = document.querySelector("#links")
const category = document.querySelectorAll("#category li" )
const parsedContener = document.querySelector("#parsed");
category.forEach(element => { 
  element.addEventListener("click", async (e) => {
    await Getdata(e.target.textContent)
  })
})
async function Getdata(id) {
  if (localStorage.getItem(id)) {
    let string = localStorage.getItem(id);
    let links = string.split(",")
    const childLinks = document.querySelectorAll("#links li");
    if (childLinks) {
      childLinks.forEach((link) => {
        linksContener.removeChild(link);
      });
    }
    for (let i = 0; i < links.length; i++) {
      const li = document.createElement("li");
      li.textContent = links[i];
      linksContener.append(li);
      li.addEventListener("click", async (e) => {
        await Getinfo(e.target.textContent);
      });
    }
  }
  else { 
    const response = await fetch("/api/data/" + id, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (response.ok === true) {
      const links = await response.json();
      const childLinks = document.querySelectorAll("#links li");
      if (childLinks) {
        childLinks.forEach((link) => {
          linksContener.removeChild(link);
        });
      }
      localStorage.setItem(id, links);
      for (let i = 0; i < links.length; i++) {
        const li = document.createElement("li");
        li.textContent = links[i];
        linksContener.append(li);
        li.addEventListener("click", async (e) => {
          await Getinfo(e.target.textContent);
        });
      }
    }
  }
  
}
async function Getinfo(link){
  parsedContener.textContent = "Загрузка...";
  const response = await fetch("/api/info/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      link: link,
    }),
  }); 
  if (response.ok === true) {
    const data = await response.json();
    const arr = Object.entries(data);
    const str = arr.join("; ");
    parsedContener.textContent = str;
  }
}


function myDisplayer(some) {
  document.getElementbyId("demo").innerHTML=some;
  }
  async function loadData() {
    let response = await fetch("data.json");
    let data = await response.json();
    myDisplayer(data);
  }

loadData();
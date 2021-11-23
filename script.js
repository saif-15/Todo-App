function addItemToDb(event) {
  event.preventDefault();
  let text = document.getElementById("text");
  db.collection("todo-items").add({
    status: "active",
    content: text.value,
  });

  text.value = "";
  getAllItems();
}


function getAllItems() {
  db.collection("todo-items").onSnapshot((snapshot) => {
      var items = [];
      snapshot.docs.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      renderItems(items);
    });
  }

  function getAllItemsByParams(status) {
    db.collection("todo-items").where("status","==",status).onSnapshot((snapshot) => {
        var items = [];
        snapshot.docs.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        renderItems(items);
      });
    }
  

function clearCompleted() {
    let items=db.collection("todo-items").where("status","==","completed");
    items.get().then((querySnapshot)=> {
      querySnapshot.forEach((doc)=> {
        doc.ref.delete();
      });
});

}

function renderItems(items) {
  let itemHTML = "";

  items.forEach((item) => {
    itemHTML += `
        <div class="list-item">
              <div class="check-space">
                <div class="check">
                    <div data-id="${item.id}" class="mark ${item.status=="completed"?"checked":""}">
                         <img src="./assets/icon-check.svg" alt="">
                    </div>
                </div>
              </div>
              <div class="data-feild">
                <div class="text">${item.content}</div>
              </div>
            </div>
        `
  });

  itemHTML+=`
      <div class="statuses">
      <div class="count">
        <span>${items.length} items left</span>
      </div>
      <div class="options">
        <span id="all">All</span>
        <span id="active">Active</span>
        <span id="completed">Completed</span>
      </div>
      <div class="clear">
        <span>Clear Completed</span>
      </div>
    </div>
  `

  document.querySelector(".list-items").innerHTML = itemHTML;
  createListeners();

}


function createListeners(){

   let checkMarks= document.querySelectorAll(".check .mark");
   checkMarks.forEach((checkmark)=>{
       checkmark.addEventListener("click",function(){
        markCompleted(checkmark.dataset.id);
       });
   })

   document.querySelector(".clear").addEventListener("click",()=>{
       clearCompleted();
   });

   document.querySelector("#active").addEventListener("click",()=>{
   getAllItemsByParams("active");
});

document.querySelector("#completed").addEventListener("click",()=>{
  getAllItemsByParams("completed");
});

document.querySelector("#all").addEventListener("click",()=>{
  getAllItems();
});
}

function markCompleted(id){

    let item=db.collection("todo-items").doc(id);
    item.get().then((doc)=>{
        if(doc.exists){
            let status=doc.data().status;
           if(status=='active'){
               item.update({
                   status:"completed"
               })
           }else if(status=='completed'){
            item.update({
                status:"active"
            })
           }
        }
    });
}

getAllItems();

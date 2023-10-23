import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://appz-702d9-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")
const saveList = ref(database, "savelist")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const saveListEl = document.getElementById("save-list")
const getListEl = document.getElementById("get-list") 




addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})
let list = []
saveListEl.addEventListener("click", function (){
    
    remove(ref(database,"savelist"))
    onValue(shoppingListInDB,function(a){
         list = Object.values(a.val())
        
       
        
        
    })
  
    for (let i = 0 ; i<list.length; i++){
        push(saveList,list[i])

    } 
       
    


})

let savedList= [] 
getListEl.addEventListener("click", function(){
   
   
   
   onValue(saveList , function(a){
   savedList = Object.values(a.val())
   clearShoppingListEl()
   remove(ref(database,"shoppingList"))
  
   
  
    
   

   })
   for (let i= 0; i<savedList.length ; i++){
    push(shoppingListInDB,savedList[i])

}
})


onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}


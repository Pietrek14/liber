const button = document.getElementById('borrow');
const retDate = document.getElementById('returnDate');
const bookId = "3"; // dałem to tak o 

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
 if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 

today = yyyy+'-'+mm+'-'+dd;
retDate.setAttribute("min", today);

if (user.borrows.includes(bookId)){
    button.disabled = true;
} else {
    button.disabled = false;
}

function borrow(bookId){
    document.getElementById('confirmation').innerHTML = "WYPOŻCZYŁEŚ KSIONŻKĘ KOXIE";
}
button.addEventListener("click", function(){
    borrow(bookId);
})
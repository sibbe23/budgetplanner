const email=document.getElementById('email');
const password=document.getElementById('password');
const msg=document.getElementById('msg');
const form=document.getElementById('form');
const btn=document.getElementById('btn');



btn.addEventListener('click',login)

async function login(e){
 try{
 e.preventDefault();
    if(email.value==='' ||password.value=='')
    {
        msg.innerHTML="Please Enter All Details";
        setTimeout(()=>{
            msg.innerHTML="";
        },3000)
    }
    else{
        const userdetails={
            email:email.value,
            password:password.value
        }
        const response=await axios.post('http://localhost:3000/user/login',userdetails)
        form.reset();
        localStorage.setItem('token',response.data.token);
         window.location='./addExpense.html';
    }
}
catch(err){
    console.log(err);
  msg.innerHTML=msg.innerHTML+`<div>${err.response.data.message}</div>`;
  setTimeout(()=>{
    msg.innerHTML="";
},3000)
}

}
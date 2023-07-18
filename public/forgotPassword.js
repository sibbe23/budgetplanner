const submit=document.getElementById('btn');
const email=document.getElementById('email');
const back = document.getElementById('back')
submit.addEventListener('click',reset);

async function reset(e){
    e.preventDefault();
    try{
        if(email.value==='')
        {
            msg.innerHTML="Please Enter Your Email";
            setTimeout(()=>{
                msg.innerHTML="";
            },3000)
        }else{
            const emaildetails={
                email:email.value
            }
            const response=await axios.post('http://localhost:3000/password/forgotpassword',emaildetails)
                console.log(response);
            email.value='';
        }
       
    }catch(err){
            console.log("this is err",err);
    }


}

back.addEventListener('click',()=>{
    window.location='./loginPage.html'
})
const Expenselist =document.getElementById('expenseslist');
const add=document.querySelector('#add');
const amount=document.querySelector('#amount');
const date=document.querySelector('#date');
const reason=document.querySelector('#reason');
const category=document.querySelector('#category');
const msg=document.querySelector('#msg');

const totalexpense=document.getElementById('totalexpense');
let total=0;

add.addEventListener('click',addexpense);
const premiumbtn=document.querySelector('#premiumbtn');
premiumbtn.addEventListener('click',premiumuser);

const leaderboardbtn=document.querySelector('#leaderboardbtn');
leaderboardbtn.addEventListener('click',showleaderboard);

const downloadbtn=document.getElementById('downloadbtn');

downloadbtn.addEventListener('click',downloadexpenses);


const downloadedfilesbtn=document.getElementById('downloadedfilesbtn');
downloadedfilesbtn.addEventListener('click',downloadedfiles);

const limitselect=document.getElementById('limit');

limitselect.addEventListener('change',()=>{
    const limit=parseInt(limitselect.value);
    localStorage.setItem('limit',limit);
})





//animate count
let count=0;
let value=0;
function increaseCount(){
    if(count<=total){
        totalexpense.innerHTML=count;
        count=count+value;
        value=value+3;
        setTimeout(increaseCount,1);
    }else{
        totalexpense.innerHTML=total;
    }
}
//decode token
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function addexpense(e){

 try{
    e.preventDefault();
    if(amount.value===''||date.value===''||reason.value===''||category.value==='')
    {
        msg.innerHTML="Please fill in all the Details";
        setTimeout(()=>msg.innerHTML='',3000)
    }
    else  {
    const expensedetails={
       amount:amount.value,
       date:date.value,
       reason:reason.value,
       category:category.value
    };
    const token=localStorage.getItem('token');
    const response =await axios.post('http://localhost:3000/expense/add-expense',expensedetails,{headers:{"Authorization":token}});

    total=response.data.totalExpense;
    totalexpense.innerHTML=total;
    console.log(response.data.message);
         create(response.data.message);
}
}
catch(err){
    console.log("Error at add Function:",err);
}
}
function create(data){
    try{
    Expenselist.innerHTML=Expenselist.innerHTML+`<tr id="${data.id}"><td>${data.date}</td><td>${data.amount}</td>
    <td>${data.reason}</td><td>${data.category}</td>
    <td><button class="btn btn-danger" onclick="del('${data.id}')">Delete</button></td>
    <td><button class="btn btn-outline-dark" onclick="edit('${data.id}','${data.amount}','${data.date}','${data.reason}','${data.category}')">Edit</button></td></tr>`;
    document.getElementById('myform').reset();
    }
    catch(err){
        console.log("Error at create Function:",err);
    } 
    
}  
window.addEventListener('DOMContentLoaded',async ()=>{

    try{
        const limit=localStorage.getItem('limit');
        const page=1;
        const token=localStorage.getItem('token');
        const decodedtoken=parseJwt(token);
        console.log(">>>>>>>>>>>>",decodedtoken);
        const ispremiumuser=decodedtoken.ispremiumuser;
        if(ispremiumuser){
            showpremiumuser();
        }

    const response =await axios.get(`http://localhost:3000/expense/get-expenses?page=${page}&limit=${limit}`,{headers:{"Authorization":token}});
    console.log(response);
    
        total=response.data.totalExpense;
        for(let i=0;i<response.data.message.length;i++)
        {
           
            create(response.data.message[i]);
        }
        console.log(">>>>>>>>>>",total)
            increaseCount();

            showpages(response.data);
        
    }
    catch(err){
        console.log("Error at Delete Function:",err);
    } 
})

    async function del(id){
    try{
        const token=localStorage.getItem('token');
       const tr=document.getElementById(`${id}`);
       const response= await axios.delete(`http://localhost:3000/expense/delete-expense/${id}`,{headers:{"Authorization":token}});
        total=response.data.totalExpense;
        totalexpense.innerHTML=total;
        Expenselist.removeChild(tr);
    }
    catch(err){
        console.log("Error at Delete Function:",err);
    }  
    }

    async function edit(id,amount,date,reason,category){
        try{
           
        const tr=document.getElementById(`${id}`);
        document.getElementById('amount').value=amount;
        document.getElementById('date').value=date;
        document.getElementById('reason').value=reason;
        document.getElementById('category').value=category;
        const token=localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:3000/expense/delete-expense/${id}`,{headers:{"Authorization":token}});
        total=response.data.totalExpense;
        totalexpense.innerHTML=total;
        Expenselist.removeChild(tr);
        }
        catch(err){
            console.log("Error at Edit Function:",err);
        } 
    }

   


   async function premiumuser(e){
    try{
        const token=localStorage.getItem('token');
        console.log(token);
        const response =await axios.get(`http://localhost:3000/purchase/premiummembership`,{headers:{'Authorization':token}});
        console.log(response);
        var options={
            "key":response.data.key_id,
            "order_id":response.data.order.id,
            "handler":async function(response){
               const result= await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
                order_id:options.order_id,
                payment_id:response.razor_payment_id},
                {headers:{"Authorization":token}})

                alert('You Are a Premium User Now')

                showpremiumuser();
                console.log(">>>>>>>",result.data.token);
                localStorage.setItem('token',result.data.token);
               

            },

        }
        const rp1=new Razorpay(options);
        rp1.open();
        e.preventDefault();

        rp1.on('payment.failed',function(response){
            console.log(response);
            alert('Something went wrong')
        })

    }
    catch(err){
        console.log(err);
        console.log("error at premiumbtn",err);
    }

   }

   function showpremiumuser(){
    document.getElementById('premiumbtn').style.display="none";
    document.getElementById('premiummsg').innerHTML="You are a Premium User";
    document.getElementById('leaderboardbtn').style.display="block";
    downloadbtn.style.display="block";
    downloadedfilesbtn.style.display="block";
    document.getElementById('downloadedfilesdiv').style.display="block";
  
    
   }

   async function showleaderboard(){
    try{
        
    const leaderboardtablebody=document.getElementById('leaderboardtablebody');
    const token=localStorage.getItem('token');
    const sortedarray= await axios.get(`http://localhost:3000/premium/leaderboard`,{headers:{'Authorization':token}});

    console.log(">>>>",sortedarray.data.leaderboarddetails);
    let i=1;
    leaderboardtablebody.innerHTML="";
    sortedarray.data.leaderboarddetails.forEach((data)=>{
        console.log(data);
        
        leaderboardtablebody.innerHTML=leaderboardtablebody.innerHTML+`<tr><td>Name : ${data.username} &nbsp;</td><td>Total Expense : ${data.totalexpenses}</td></tr>`;
        i++;
    })
    document.getElementById('leaderboarddetails').style.display="block";
   
    }
    catch(err){
        console.log(err);
    }
    
   }
    
   async function downloadexpenses(e){
    e.preventDefault();
    try{
        const token=localStorage.getItem('token');
        const response  =  await axios.get(`http://localhost:3000/expense/download`,{headers:{'Authorization':token}});
        
        console.log(response);
        if(response.status===200){
            const a=document.createElement('a');
            a.href=response.data.fileURL;
            a.download='myexpense.csv';
            a.click(); 
        }
        else{
             console.log(">>>>>")
            throw new Error(response.data.message);
        }   
    }catch(err){
        console.log(err);
    }
   }

   async function downloadedfiles(e){

            try{
                e.preventDefault();
               const token= localStorage.getItem('token');
            const response= await axios.get(`http://localhost:3000/expense/downloadedfiles`,{headers:{'Authorization':token}});

            const downloadedfileslist=document.getElementById('downloadedfileslist');
            for(let i=0;i<response.data.message.length;i++){

                //console.log(response.data.message[0].url);
                downloadedfileslist.innerHTML+=`<li><a href=${response.data.message[i].url}>TextFile${i}</a></li>`
            }
                

            }catch(err){
                console.log(err);
            }
   }
    
            const pages= document.getElementById('pages')
   async function showpages({currentpage,nextpage,previouspage,hasnextpage,haspreviouspage,lastpage}){
        try{
                pages.innerHTML='';

                    if(haspreviouspage){
                        const btn2=document.createElement('button');
                        btn2.className='btn btn-primary'
                        btn2.innerHTML=previouspage;
                        btn2.addEventListener('click',()=>getExpenses(previouspage))
                        pages.appendChild(btn2);
                    }
                    const btn1=document.createElement('button');
                    btn1.className='btn btn-success'
                    btn1.innerHTML=`<h3>${currentpage}</h3>`
                    btn1.addEventListener('click',()=>getExpenses(currentpage))
                    pages.appendChild(btn1);

                    if(hasnextpage){
                        const btn3=document.createElement('button')
                        btn3.className='btn btn-primary'
                        btn3.innerHTML=nextpage;
                        btn3.addEventListener('click',()=>getExpenses(nextpage))
                        pages.appendChild(btn3);
                    }

        }catch(err){
                console.log(err);
        }
   }

   async function getExpenses(page){
    try{
        const limit=localStorage.getItem('limit');
        const token= localStorage.getItem('token');
        const response =await axios.get(`http://localhost:3000/expense/get-expenses?page=${page}&limit=${limit}`,{headers:{"Authorization":token}});
    
            console.log("$$$$$$$$$$$",response)

            Expenselist.innerHTML="";
        for(let i=0;i<response.data.message.length;i++)
        {
            create(response.data.message[i]);
        }
        showpages(response.data);
        

    }catch(err){
        console.log(err);
    }
   }

   const logout = document.getElementById('logout')
   logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "./loginPage.html"
})
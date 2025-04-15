document.addEventListener("DOMContentLoaded",function(){
   const searchButton=document.getElementById("search-btn"); 
   const username=document.getElementById("user-input"); 
   const statusContainer=document.querySelector(".status-container"); 
   const easyCircle=document.querySelector(".easy-progress"); 
   const mediumCircle=document.querySelector(".medium-progress"); 
   const hardCircle=document.querySelector(".hard-progress");  
   const easyLabel=document.getElementById("easy-label"); 
   const mediumLabel=document.getElementById("medium-label"); 
   const hardLabel=document.getElementById("hard-label"); 
   const cardStatus=document.querySelector(".status-card"); 

   function validateUsername(Username){
    if(Username.trim()===""){
        alert("username should not be empty");
        return false;
    }
    const regEx=/^[a-zA-Z0-9_]{3,15}$/;
    const isMatching=regEx.test(Username);
    if(!isMatching){
        alert("Invalid Username");
    }
    return isMatching;
}

async function fetchUserDetails(Username) {
    try{
        searchButton.textContent="Searching...";
        searchButton.disabled=true;
        cardStatus.style.display = "none";
        cardStatus.innerHTML = "";
    const proxyurl='https://cors-anywhere.herokuapp.com/'
   

    // const proxyurl = "https://corsproxy.io/?";
    const targetUrl='https://leetcode.com/graphql/';
    // const targetUrl=`https://leetcode-stats-api.herokuapp.com/${Username}`;
    const myHeaders=new Headers();
    myHeaders.append("content-type","application/json");
    const graphql=JSON.stringify({
        query:"\n query userSessionProgress($Username:String!) {\n allQuestionsCount {\n difficulty\n count\n }\n matchedUser(username: $Username) {\n submitStats {\n   acSubmissionNum{\n    difficulty\n    count\n    submissions\n    }\n    totalSubmissionNum {\n    difficulty\n    count\n    submissions\n    }\n   }\n  }\n}\n   ",
        variables: { "Username": `${Username}` }
    })
    const requestOptions={
        method:"POST",
        headers:myHeaders,
        body:graphql,
        redirect:"follow"
    };
    const response=await fetch(proxyurl+targetUrl,requestOptions);
   if(!response.ok){
    throw new Error("Unable to fect user details");
   }
   const parsedData=await response.json();
   console.log("Logging data ",parsedData);
   displayUserData(parsedData);
}
catch(error){
    statusContainer.innerHTML = `<p>no data found ${error.message}</p>`;
}
finally{
    searchButton.textContent="Search";
    searchButton.disabled=false;
    }
}

function updateProgress(solved,total,label,circle){
    const progressDegree=(solved/total)*100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
}

function displayUserData(parsedData){
    const totalQues=parsedData.data.allQuestionsCount[0].count;
    const totalEasyQues=parsedData.data.allQuestionsCount[1].count;
    const totalMediumQues=parsedData.data.allQuestionsCount[2].count;
    const totalHardQues=parsedData.data.allQuestionsCount[3].count;

    const solvedTotalOues=parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
    const solvedEasyOues=parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
    const solvedMediumOues=parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
    const solvedHardOues=parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

    updateProgress(solvedEasyOues,totalEasyQues,easyLabel,easyCircle);
    updateProgress(solvedHardOues,totalHardQues,hardLabel,hardCircle);
    updateProgress(solvedMediumOues,totalMediumQues,mediumLabel,mediumCircle);

    const cardData=[
        {label: "Overall Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
        {label: "Overall Easy Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
        {label: "Overall Medium Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
        {label: "Overall Hard Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions},
    ];
    console.log("Card Data: ",cardData);
    cardStatus.innerHTML=cardData.map(
        data=>
            `<div class="card">
            <h4>${data.label}</h4>
            <p>${data.value}</p>
            </div>`   
    ).join("")
    cardStatus.style.display = "flex";

}

searchButton.addEventListener('click',function() {
    const Username=username.value;
    console.log("logging username :",Username);
    if(validateUsername(Username)){
        fetchUserDetails(Username);
    }
})

})
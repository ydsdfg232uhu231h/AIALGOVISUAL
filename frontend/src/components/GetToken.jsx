

function GetToken(name) {
   function getmyToken(){
    const value =  `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return parts;
}
const token = getmyToken("auth_token");
console.log(token)

  return (
    <>
    <h1 style={{color: "white"}}>hello</h1>
    </>
  )
}

export default GetToken;
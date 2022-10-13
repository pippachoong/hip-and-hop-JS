


let BASE_URL;
if( location.href.includes('netlify') ){
  BASE_URL = 'https://hipandhop.herokuapp.com/';
} else {
  BASE_URL = 'http://localhost:3000';
}

console.log(BASE_URL)

// let BASE_URL = 'http://localhost:3000'


$( function(){
  
  checkIfCurrentUser()
  
})

const checkIfCurrentUser = async () => {
  console.log('current user check')

  const token = localStorage.getItem("token")

  if (token){
    try{
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

      const res = await axios.get(`${BASE_URL}/current_user`)
  
      console.log('response:', res.data)

      $message = $(`<p>Hello there ${res.data.name}!</p>`)
      $logOutTag = $(`<a href="" id="logout">Logout</a>`)

      $('#welcome-msg').append($message)
      $('#nav-bar').append($logOutTag)

      $('#logout').on('click', function(){
        localStorage.removeItem("token");
        axios.defaults.headers.common['Authorization'] = undefined;
      })

  
    }catch(err){
      console.log('no user logged in')
    }

  } else {

    const $login = $(`<a href="/login.html">Login</a>`)
    const $signup = $(`<a href="/signup.html">Sign Up</a>`)

    $('#nav-bar').append($login)
    $('#nav-bar').append($signup)

  }

}



console.log(`loaded`)

let BASE_URL = 'http://localhost:3000'


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
      $logOutTag = $(`<a href="/home">Logout</a>`)

      $('#welcome-msg').append($message)
      $('#nav-bar').append($logOutTag)

  
    }catch(err){
      console.log('no user logged in')
    }

  }

}



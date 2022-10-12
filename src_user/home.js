console.log(`loaded`)

let BASE_URL = 'http://localhost:3000'


$( function(){
  
  checkIfCurrentUser()
  
})

const checkIfCurrentUser = async () => {
  console.log('current user check')

  const token = localStorage.getItem("token")

  console.log(token)

  if (token){
    try{
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

      const res = await axios.get(`${BASE_URL}/current_user`)
  
  
      console.log('response:', res.data)
  
    }catch(err){
      console.log('invalid user:', err)
    }

  }

}



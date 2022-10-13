
console.log(`signup loaded`)

let BASE_URL = 'http://localhost:3000'

$( function(){

  $('#signup-form').on('submit', function(ev){

    ev.preventDefault()
    const email = $('#email-signup').val()
    const name = $('#name-signup').val()
    const password = $('#password-signup').val()

    handleSignup(name, email, password)

  })


})

const handleSignup = async (name, email, password) => {

  // console.log(`handleSignup:`, name, email, password)

  try{
    const res = await axios.post(`${BASE_URL}/signup`, {
      name: name,
      email: email,
      passwordDigest: password
    })

    console.log(`signup response:`, res.data)

  } catch ( err ){
    console.log('error creating user:', err)
  }

}
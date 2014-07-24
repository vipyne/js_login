(function(window, document, undfined){ // trying to stay out of global scope

// placeholder //////////////
/////////////////////////////
/////////////////////////////

// fallback for HTML5 placeholder for IE8

var placeholder = (function(){

  var email = function(){
    var e = document.forms[0].children[0].children[1]
    return e.value = 'betty.white@goldengirl.com'
  }

  var password = function(){
    var p = document.forms[0].children[1].children[1]
    return p.value = 'bestPassword1'
  }

  var grey = function(){
    var inputs = document.querySelectorAll('.grey')
    for(var i = 0; i < inputs.length; i++){
      inputs[i].style.color = 'rgba(170,170,170,1)'
    }
  }

  var removeEmail = function(){
    var e = document.forms[0].children[0].children[1]
    e.attachEvent('onfocus', function(){
      e.value = ''
    }, false)
  }

  var removePassword = function(){
    var p = document.forms[0].children[1].children[1]
    p.attachEvent('onfocus', function(){
      p.value = ''
    }, false)
  }

  var IEcompatible = function(){ // public method to call private methods
    email()
    password()
    grey()
    removeEmail()
    removePassword()
  }

  return {
    IEcompatible: IEcompatible
  }

})()



// validate /////////////////
/////////////////////////////
/////////////////////////////

var validate = (function(){

  var form = document.querySelectorAll('.validate')[0]

  var errorHandler = function(message){
    var oldErrorP = document.getElementsByTagName('p')
    var errorP = document.createElement('p')
    var content = document.getElementById('content')
    var DOMContents = document.getElementById('content').children
    while(oldErrorP[0]) oldErrorP[0].parentNode.removeChild(oldErrorP[0]) // incase user retry login
    errorP.innerHTML = message
    content.appendChild(errorP)
    content.insertBefore(DOMContents[2], DOMContents[1])
  }

  var emailInput = function(email){
    var pattern = /^(?!\.)[\w\W]+@[\w\W]+\.[\w\W]{3}$/g // TODO - address if'.' is before '@'
    pattern.lastIndex = 0 // tests string from beginning again if user retry login
    return pattern.test(email)
  }

  var passwordInput = function(password){
    if(password.search(/\d/g) == -1){
      return 'no number'
    }else if(password.search(/[A-Z]/g) == -1){
      return 'no uppercase'
    }else if(password.search(/[a-z]/g) == -1){
      return 'no lowercase'
    }else{
      return false
    }
  }

  var message = function(input){
    var errors = {  // change to object literal?
      'email': 'sorry, that email is not valid',
      'no number': 'please include at least one number in your password',
      'no uppercase': 'please include at least one uppercase character in your password',
      'no lowercase': 'please include at least one lowercase character in your password',

      default: 'opps, something went wrong! please reload page and try again'
    }
  }

  var formInput = function(event){
    var email = document.querySelectorAll('.email-require')[0].value
    var password = document.querySelectorAll('.password-require')[0].value
    if(!emailInput(email)){ // check email
      event.preventDefault()
      errorHandler(message('email'))
    }else if(passwordInput(password)){ // check password
      event.preventDefault()
      errorHandler(message(passwordInput(password))) // i know this is ugly and inefficient
    }
  }

  // here too, realized most of these don't need to be public
  return {
    form: form,
    formInput: formInput
  }

})()



// controller ///////////////
/////////////////////////////
/////////////////////////////

// determine brower compatibility (attachEvent vs addEventListener)

if(validate.form.addEventListener){
  // memory inefficient but anonymous function works for now
  // need to bind this (or something) maybe better this way because
  // more compatible with older browswers
  validate.form.addEventListener('submit', function(event){
    validate.formInput(event)
  }, false)

  }else if(validate.form.attachEvent){
    placeholder().IEcompatible()
    validate.form.attachEvent('onsubmit', function(event){
      validate.formInput(event)
    }, false)
}

/////////////////////////////
})(window, document)
(function(window, document, undefined){ // trying to stay out of global scope

// browser utility //////////
/////////////////////////////
/////////////////////////////

// know i should've done this from beginning...
// all the IEs are snowflakes
// handles events cross browsers

var addEvent = function(theEvent, element, function){
  if(element.addEventListener){
    element.addEventListener(theEvent, function, false)
  }else if(element.attachEvent){
    element.attachEvent('on' + theEvent, function)
  }
}



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
    var placeholders = document.querySelectorAll('.grey')
    for(var i = 0; i < placeholders.length; i++){
      placeholders[i].style.color = 'rgb(170,170,170)' // ie8 doesn't understand alpha
    }
  }

  var removeEmail = function(){
    var e = document.forms[0].children[0].children[1]
    e.addEvent('onfocus', function(){
      e.value = ''
    }, false)
  }

  var removePassword = function(){
    var p = document.forms[0].children[1].children[1]
    p.addEvent('onfocus', function(){
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

  var email = function(){
    var email = document.querySelectorAll('.email-require')[0].value
    var pattern = /^(?!\.)[\w\W]+@[\w\W]+\.[\w\W]{3}$/g // TODO - address if '.' is before '@'
    if(email.search(pattern) == -1){
      return 'email'
    }else{
      return null // passed validation
    }
  }

  var password = function(){
    var password = document.querySelectorAll('.password-require')[0].value
    if(password.search(/\d/g) == -1){
      return 'no number'
    }else if(password.search(/[A-Z]/g) == -1){
      return 'no uppercase'
    }else if(password.search(/[a-z]/g) == -1){
      return 'no lowercase'
    }else{
      return null // passed validation
    }
  }

  var message = function(input){
    var err
    var errors = {
      'email': 'sorry, that email address is not valid',
      'no number': 'please include at least one number in your password',
      'no uppercase': 'please include at least one uppercase character in your password',
      'no lowercase': 'please include at least one lowercase character in your password',
      'none': null // passed validation
    }
    if(errors[input]){
      err = errors[input]
    }else{
      err = errors['none']
    }
    return err
  }

  var error = function(message){
    if(message == null){
      return false // passed validation
    }else{
      var oldErrorP = document.getElementsByTagName('p')
      var errorP = document.createElement('p')
      var content = document.getElementById('content')
      var DOMContents = document.getElementById('content').children
      while(oldErrorP[0]) oldErrorP[0].parentNode.removeChild(oldErrorP[0]) // incase user retry login
      errorP.innerHTML = message
      content.appendChild(errorP)
      content.insertBefore(DOMContents[2], DOMContents[1])
      return true // error message passed to DOM
    }
  }

  var formInput = function(event){
    if(error( message( email() )) || error( message( password() ))){
      event.preventDefault()
    }
  }

  return {
    form: form,
    formInput: formInput
  }

})()



// controller ///////////////
/////////////////////////////
/////////////////////////////

validate.form.addEvent('submit', function(event){
  placeholder.IEcompatible()
  validate.formInput(event)
})

/////////////////////////////
})(window, document)
(function(window, document, undefined){

// browser utility //////////
/////////////////////////////
/////////////////////////////

var addEvent = function(theEvent, element, func){
  if(element.addEventListener){
    element.addEventListener(theEvent, func, false)
  }else if(element.attachEvent){
    element.attachEvent('on' + theEvent, func)
  }
}



// placeholder //////////////
/////////////////////////////
/////////////////////////////

// fallback for HTML5 placeholder for IE8 and probably other browsers

var fallback = (function(input){

  var black = 'rgb(0,0,0)'

  var grey = 'rgb(170,170,170)'

  var color = function(input, color){
    input.style.color = color
  }

  var removeReplace = function(input){
    var placeholder
    if(input.getAttribute('id') == 'email'){
      placeholder = 'betty.white@goldengirl.com'
    }else{
      input.setAttribute('type', 'text')
      placeholder = 'Password1'
    }
    input.value = placeholder
    addEvent('focus', input, function(){
      if(input.value == placeholder){
        if(input.getAttribute('id') == 'password'){
          input.setAttribute('type', 'password')
        }
        input.value = ''
        color(input, black)
      }
    }, false)
    addEvent('blur', input, function(){
      if(input.value == ''){
        if(input.getAttribute('id') == 'password'){
          input.setAttribute('type', 'text')
        }
        input.value = placeholder
        color(input, grey)
      }
    }, false)
  }

  var placeholder = function(input){
    color(input, grey)
    removeReplace(input)
  }

  return {
    placeholder: placeholder
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
    if(message === null){
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

  // i like how pretty and short this is, but not sure if its confusing to have
  // logic where 'null' means 'passed validation'
  var formInput = function(event){
    if(error( message( email() )) || error( message( password() ))){
      if(event.preventDefault){
        event.preventDefault()
      }else{
        event.returnValue = false
      }
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

if(!'placeholder' in document.createElement('input')){
  var email = document.getElementById('email')
  var password = document.getElementById('password')
  fallback.placeholder(email)
  fallback.placeholder(password)
}

addEvent('submit', validate.form, function(event){
  validate.formInput(event)
}, false)

/////////////////////////////
})(window, document)
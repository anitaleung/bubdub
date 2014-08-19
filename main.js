// Prevent swipe to navigate on home page
$(document).on('swipeleft swiperight', '#home-page', function(event) {
 event.stopPropagation();
 event.preventDefault();
});

$(document).bind("mobileinit", function(){
  defaultPageTransition = 'fade';
});

$('#app-title').on('click', function(){
  
  $(this).hide();
  $('#pop-message').hide().html('You\'re ready!').show();
  window.setTimeout(function (){$('#home-page').contents().fadeOut('fast'); }, 800);
  window.setTimeout(function (){window.location.replace('#page-one'); }, 1500);
  $('#home-page').show();
});

// Change login color when username input has value
$('#loginUsername').keypress(function() {
  $('#login').css('color', '#fff');
});

// What to do when signing in
$('#login').on('click', function(){
  $('#page-one .ui-content').fadeOut('fast'); 
  window.setTimeout(function (){window.location.replace('#page-two'); }, 500);
});

// Add friends button effect
(function(){
  $('#add-friends-button').on('click', function(){
    $(this).animate({ 'margin-top': '-=2.6em' }, 200);
  });
  $('#addFriend').on('click', function(){
    $('#add-friends-button').animate({ 'margin-top': '+=2.6em' }, 200);
  });
})();


// 
// 
// 
//
//
//
//


var myDataRef = new Firebase('https://bubdub.firebaseio.com');
var currentUser,
    friendUser, 
    relationship,
    reference,
    viewingFriend;
var main_relationship;
var myPath;

$('#login').on('click', function(){
  if (!currentUser) { // If there is currently no one logged in
    currentUser = $('#loginUsername').val(); 
    // currentUser = currentUser.toLowerCase().charAt(0).toUpperCase();
    myDataRef.child('current_user').child(0).set(currentUser);
    displayUserInfo(currentUser); // Display current user on screen 
  }
});

// Show options menu when clicking options button
(function(){
  $('#options').on('click', function(e){
    e.preventDefault();
    $('#options-menu').toggle();
    return false;
  });
  $(document).on('click', function(){
    $('#options-menu').hide();
  })
})();



// When something is entered into username input box
$('#addFriend').on('click', function(){
    friendUser = $('#inputFriend').val();
    addRelationship(currentUser, friendUser);
    $('#inputFriend').val('');
});

$('#logout, #logout-friends').on('click', function(){
  myDataRef.child('current_user').child(0).set('');
  $('#login-group').show();
  $('.welcome').remove();
  $('#logout').hide();
  $('#loginUsername').val('');
  $('#page-one .ui-content').show();
});


function addRelationship(current, friend) {
  myDataRef.child('users').child(current + "_" + friend).child(0).set('Hi');
  myDataRef.child('current_user').child(0).set(current);
}


myDataRef.on('value', function(snapshot) {
  currentUser = snapshot.val().current_user[0]; // Set current user
  viewingFriend = snapshot.val().current_user['viewing']; // Set viewing friend
  main_relationship = currentUser + '_' + viewingFriend;
  if (currentUser && $('#userInfo').empty()) { // Do this if there is a current user (someone is logged in)
    displayUserInfo(currentUser); // Display current user on screen 
    displayUserFriends(snapshot, currentUser); // Display the user's friendlist
    displayFriendTitle(viewingFriend); // Display the friend's name on messages page
    $('#' + currentUser + '_' + currentUser).hide();
    enteredValue = snapshot.child('users').child(main_relationship).val();
    lastValue = enteredValue[Object.keys(enteredValue)[Object.keys(enteredValue).length - 1]];
    lastKey = Object.keys(enteredValue).pop();
    if ($('#inputMessage').val()) {
      $('<p class="single-message" id="' + lastKey + '">').html('<span>').text(lastValue).appendTo($('#message-list')).wrapInner('<span>');
    }
    $('.single-message').on('click', function() {
      thisId = $(this).attr('id');
      myDataRef.child('users').child(main_relationship).child(thisId).set(null);
      $(this).remove();
      var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', 'blop.mp3');
        //audioElement.load()

        $.get();

        audioElement.play().stop();
    });
  }
});

// Do this stuff if there's something in the database
// myDataRef.once('value', function(snapshot) {

//   currentUser = snapshot.val().current_user[0]; // Set current user
//   viewingFriend = snapshot.val().current_user['viewing']; // Set viewing friend
//   main_relationship = currentUser + '_' + viewingFriend;
//   // When database is used, save the value entered and set it as the currentUser
//   // myDataRef.child('users').child(main_relationship).on('child_added', function(childSnapshot) {
//   //   enteredValue = childSnapshot.val();
//   //   // console.log('ayyy ' + childSnapshot.name());
//   //   console.log('yes ' + main_relationship);
//   //   // $('<p class="single-message" id="' + childSnapshot.name() + '">').html('<span>').text(enteredValue).appendTo($('#message-list')).wrapInner('<span>');
//   //   // $('<p class="single-message">').text(enteredValue).appendTo($('#message-list'));
//   //   main_relationship = null;
//   // });
// });

// Displaying user's friend title on messages page
function displayFriendTitle(friendName) {
    $('#friend-title').html(friendName);
}

$('#sendMessage').on('click', function(){
  var text = $('#inputMessage').val();
  myDataRef.child('users').child(main_relationship).push(text);
});

function displayUserInfo(currentUser) {
  $('.welcome').html('');
  $('<span class="welcome">').text('Hi ' + currentUser).appendTo($('#userInfo'));
};

function displayUserFriends(snapshot, currentUser) {
  var object = snapshot.child('users').val();
  $('#friend-list').html(''); 
  for (var key in object) {
      var value = object[key];
      if(key.indexOf(currentUser) >= 0){
        var start = key.indexOf('_') + 1;
        var end = key.length;
        var friendName = key.substring(start, end);
        relationship = currentUser + '_' + friendName;
        $('<a href="#page-three" id="' + relationship + '" class="friend-name">').text(friendName).append().appendTo($('#friend-list')); // Display the message!
      }
  }
  $('.friend-name').on('click', function(e){ // When you click on a friend name
    e.preventDefault();
    relationship = $(this).attr('id');
    displayUserMessage(snapshot, currentUser, relationship);
    $('.single-message').wrapInner('<span>');
    var start = relationship.indexOf('_') + 1;
    var end = relationship.length;
    var friendName = relationship.substring(start, end);
    myDataRef.child('current_user').child('viewing').set(friendName);
  });
  $('#sendMessage').on('click', function(){
    var text = $('#inputMessage').val();
    // myDataRef.child('users').child(relationship).push(text);
    // console.log(reference.name()); // This should be the div id
    $('#inputMessage').val('');
  });
}

// // When database is used, save the value entered and set it as the currentUser
// myDataRef.child('users').child('Anita_Julie').on('child_added', function(childSnapshot) {
//   enteredValue = childSnapshot.val();
//   $('<span class="single-message">').text(enteredValue).appendTo($('#message-list'));
// });

function displayUserMessage(snapshot, currentUser, relationship) {
  var object = snapshot.child('users').val()[relationship];
  var otherObject = snapshot.child('users').child(relationship);
  $('#message-list').html(''); // Clear message list
  // object = snapshot.child('users').child(relationship).val();
  for (var key in object) {
    var value = object[key];
    $('<p class="single-message" id="' + key + '">').text(value).appendTo($('#message-list')); // Display the message!
  }
  $('.single-message').on('click', function() {
    thisId = $(this).attr('id');
    console.log(thisId);
    console.log(otherObject.child(thisId).val());
    console.log(myDataRef.child('users').child(relationship).child(thisId));
    myDataRef.child('users').child(relationship).child(thisId).set(null);
    $(this).remove();
  });
}

// Limit number of words
$limitWords = 1;

$("#inputMessage").keyup(function(e) {
    var $this = $(this);
    var wordcount = $this.val().split(/\b[\s,\.-:;]*/).length;
    if (wordcount > $limitWords) {
      $this.addClass('error').prop('disabled', true);
      window.setTimeout(function (){$this.removeClass('error').prop('disabled', false); }, 4000);
    } 
});

 $('html').keyup(function(e){if(e.keyCode == 8)$('#inputMessage').removeClass('error').prop('disabled', false).focus()})  

// Prevent the backspace key from navigating back.
$(document).unbind('keydown').bind('keydown', function (event) {
    var doPrevent = false;
    if (event.keyCode === 8) {
        var d = event.srcElement || event.target;
        if ((d.tagName.toUpperCase() === 'INPUT' && 
             (
                 d.type.toUpperCase() === 'TEXT' ||
                 d.type.toUpperCase() === 'PASSWORD' || 
                 d.type.toUpperCase() === 'FILE' || 
                 d.type.toUpperCase() === 'EMAIL' || 
                 d.type.toUpperCase() === 'SEARCH' || 
                 d.type.toUpperCase() === 'DATE' )
             ) || 
             d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        }
        else {
            doPrevent = true;
        }
    }

    function stopRed() {

    }

    if (doPrevent) {
        event.preventDefault();
    }
});


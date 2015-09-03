var FIREBASE_ROOT = "https://polipoll.firebaseio.com/";
var SINAR_API = "https://sinar-malaysia.popit.mysociety.org/api/v0.1/persons/";



var politicians = [];
var politician, politician_id;
var fbP;


//TODO: calling loadPoliticianData more than 1 time :'(


window.onhashchange = function()
{
  console.log("hash changed", location.hash);
  loadPolitician(location.hash.substring(1));
}

function loadPoliticianData(politician_id) {
  console.log("loadPoliticianData", politician_id);
  //53659684f1eab6270da6c8fc
  $.getJSON(SINAR_API + politician_id, function(e){
    console.log(e);

    fbPP.child("politician/" + politician_id + "/checked_person").set(true);
    fbPP.child("politician/" + politician_id + "/image").set(e.result.image || null);
    fbPP.child("politician/" + politician_id + "/html_url").set(e.result.html_url || "");
    fbPP.child("politician/" + politician_id + "/memberships").set(e.result.memberships || []);
    fbPP.child("politician/" + politician_id + "/summary").set(e.result.summary || "");
    fbPP.child("politician/" + politician_id + "/birth_date").set(e.result.birth_date || null);
    fbPP.child("politician/" + politician_id + "/death_date").set(e.result.death_date || null);

    //curl "https://polipoll.firebaseio.com/politician/545e48ea5222837c2c0597c87.json"

    console.log("SAVED ", politician_id);

    fbPP.child("politician/" + politician_id).once("value", function(snapshot){
      politician = snapshot.val();
      politician_id = snapshot.key();
      console.log("test", politician_id);
      showPoliticianData(politician);
    });

  });
}

function showPoliticianData() {
  console.log("showPoliticianData", politician);
  $(".politician_name").text(politician.politician_name);
  $(".politician_summary").text(politician.summary);

  if (politician.image) {
    $(".politician-photo").css("background-image", "url("+politician.image+")");
  } else {
    $(".politician-photo").css("background-image", "");
  }
}

function loadPolitician(id) {
  //politician_id = politicians[randomize];
  politician_id = id;
  console.log("POLITICIAN LOADED!", politician_id);

  fbPP.child("politician/" + politician_id).once("value", function(snapshot){
    politician = snapshot.val();

    if (!politician.checked_person) {
      loadPoliticianData(politician_id);
    } else {
      showPoliticianData();
    }
  });

}

function randomizePolitician() {
  var randomize = Math.floor(politicians.length * Math.random());
  //loadPolitician();
  location.hash = politicians[randomize]; // get the clicked link id

}






$(document).ready(function(){

  $("#btn_play").click(function(e){
    e.preventDefault();
    randomizePolitician();
  });
  console.log("OK");

  fbPP = new Firebase(FIREBASE_ROOT);


  fbPP.child("politicians").once("value", function(snapshot) {
    console.log("POLITICIANS LOADED!", politicians.length);
    politicians = snapshot.val();
    if (location.hash) {

      loadPolitician(location.hash.substring(1));

    } else {
      randomizePolitician();
    }
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


});

/*

myFirebaseRef.set({
  title: "Hello World 2015!",
  author: "Firebase",
  location: {
    city: "San Francisco",
    state: "California",
    zip: 94103
  }
});



var keys = [];


// GENERATE FIRST database
var ref = new Firebase("https://polipoll.firebaseio.com/");

var projects = {};
var politicians = [];

$.getJSON("database_projects.json", function(data_projects){
    console.log("projects", data_projects);
    projects = data_projects;
    $.getJSON("database.json", function(data){

      for (var key in data) {
          politicians.push(key);
      }

      console.log("saving data...", data);
      ref.set({
      "politicians": politicians,
      "politician": data,
      "projects": projects
    });
    console.log("data saved");
  });
});






//lista politicians
var ref = new Firebase("https://polipoll.firebaseio.com");
var politicians_list = [];


// Attach an asynchronous callback to read the data at our posts reference
ref.child("politicians").on("value", function(snapshot) {
  console.log("total itens", snapshot.numChildren());
  snapshot.forEach(function(level1) { politicians_list.push(level1.key()); console.log("level", level1.key()); });

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});








// Get a database reference to our posts
var ref = new Firebase("https://polipoll.firebaseio.com");

// Attach an asynchronous callback to read the data at our posts reference
ref.child("politicians").on("value", function(snapshot) {
  console.log("total itens", snapshot.numChildren());
  console.log("received", snapshot.val());
  snapshot.forEach(function(level1) { console.log("level", level1); });
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});



// Get a database reference to our posts
var ref = new Firebase("https://polipoll.firebaseio.com/politicians?shallow=true");

// Attach an asynchronous callback to read the data at our posts reference
ref.on("value", function(snapshot) {
  console.log("received", snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});





*/

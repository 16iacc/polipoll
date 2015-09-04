var FIREBASE_ROOT = "https://polipoll.firebaseio.com/";
var SINAR_API = "https://sinar-malaysia.popit.mysociety.org/api/v0.1/persons/";



var politicians = [];
var politician, politician_slug, politician_id;
var fbP;


window.onhashchange = function()
{
  console.log("hash changed", location.hash);
  loadPolitician(location.hash.substring(1));
}

function showResult(company_id) {

  $(".companies .c_"+company_id+" .votes .buttons").hide();
  $(".companies .c_"+company_id+" .votes .waiting").hide();
  $(".companies .c_"+company_id+" .votes .result").show();


  //TODO: show graphics
  fbPP = new Firebase(FIREBASE_ROOT + "votes/"+politician_slug+"/"+company_id);
  fbPP.once("value", function(snapshot){
    var votes = snapshot.val();
    var total = (votes.green || 0) + (votes.yellow || 0) + (votes.red || 0);

    console.log("votes", votes, total);

    var green_perc = (votes.green || 0) / total * 100;
    var yellow_perc = (votes.yellow || 0) / total * 100;
    var red_perc = (votes.red || 0) / total * 100;

    $(".companies .c_"+company_id+" .chart .green").css("width", green_perc + "%");
    $(".companies .c_"+company_id+" .chart .yellow").css("width", yellow_perc + "%");
    $(".companies .c_"+company_id+" .chart .red").css("width", red_perc + "%");

    $(".companies .c_"+company_id+" .green_perc").text(green_perc.toPrecision(4) + "%");
    $(".companies .c_"+company_id+" .yellow_perc").text(yellow_perc.toPrecision(4) + "%");
    $(".companies .c_"+company_id+" .red_perc").text(red_perc.toPrecision(4) + "%");


  });




}

function addVote(politician_slug, company_id, vote) {
  //TODO: save vote into Firebase

  //"votes/[politician_slug]/[company_id]/[vote_value]"
  fbPP = new Firebase(FIREBASE_ROOT + "votes/"+politician_slug+"/"+company_id+"/"+vote);
  // Try to create a user for wilma, but only if the user id 'wilma' isn't already taken

  fbPP.transaction(function(currentData) {
    if (currentData === null) {
      return 1;
    } else {
      console.log('Got data, add +1');
      return currentData+1; // Abort the transaction.
    }
  }, function(error, committed, snapshot) {
    if (error) {
      console.log('Transaction failed abnormally!', error);
    } else if (!committed) {
      console.log('Value added!');
      showResult(company_id);
    } else {
      console.log('New vote added!');
      showResult(company_id);
    }
    console.log("VOTE: ", snapshot.val());

  });

}

function setVotesClick(){
  $(".companies .mdl-button").click(function(e){
    e.preventDefault();

    var company_id = $(this).parents("tr").data("company_id");
    var vote = $(this).data("vote");

    console.log("company_id", company_id, vote);
    addVote(politician_slug, company_id, vote);

    $(".companies .c_"+company_id+" .votes .buttons").hide();
    $(".companies .c_"+company_id+" .votes .waiting").show();
    $(".companies .c_"+company_id+" .votes .result").hide();

  });
}

/*
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
*/

function showPoliticianData() {
  console.log("showPoliticianData", politician);
  $(".politician_name").text(politician.politician_name);
  $(".politician_summary").text(politician.summary);

  if (politician.image) {
    $(".politician-photo").css("background-image", "url("+politician.image+")");
  } else {
    $(".politician-photo").css("background-image", "");
  }

  for(var company_id in politician.companies){
    console.log(company_id);
    //.matches table tbody
    //TODO: fullfill the table of matches

    var certainty = (100.0 * parseFloat(politician.companies[company_id].certainty)).toPrecision(4);
    var company_name = politician.companies[company_id].company_name;
    var director_name = politician.companies[company_id].director_name;
    var project_count = politician.companies[company_id].project_count;
    var project_sum = politician.companies[company_id].project_sum;
    var projects = politician.companies[company_id].projects;

    $(".certainty").text(certainty);
    $(".company_name").text(company_name);
    $(".director_name").text(director_name);
    $(".project_count").text(project_count);
    $(".project_sum").text(project_sum);

    setVotesClick();
  }
  $(".matches, .vote").show();
  $(".loading").hide();
  $(".companies .votes .buttons").show();
  $(".companies .votes .waiting").hide();
  $(".companies .votes .result").hide();

}


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function showPoliticianData() {
  console.log("showPoliticianData", politician);
  $(".politician_name").text(politician.name);
  $(".politician_summary").text(politician.summary || "");

  if (politician.image) {
    $(".politician-photo").css("background-image", "url("+politician.image+")");
  } else {
    $(".politician-photo").css("background-image", "");
  }

  $(politician.projects).each(function(i, project) {
    $('.company-detail').append('\
    <tr>\
    <td class="mdl-data-table__cell--non-numeric">' + project.company + '</td>\
    <td class="mdl-data-table__cell--non-numeric">' + project.tajuk + '</td>\
    <td class="mdl-data-table__cell--non-numeric nowrap">' + project.tarikh_anugerah + '</td>\
    <td>' + numberWithCommas(project.nilai) + '</td>\
    </tr>\
    ');
  });

  $(politician.memberships).each(function(i, membership) {
    $('.membership-detail').append('\
    <tr>\
    <td class="mdl-data-table__cell--non-numeric">' + membership.role + '</td>\
    <td class="mdl-data-table__cell--non-numeric nowrap">' + membership.start_date + '</td>\
    </tr>\
    ');
  });

  var locations = []
  $(politician.contractors).map(function(i, k) {
    if ((k.location == undefined) || (k.location.Lat == "") || (k.location.Lat == null)) {
      return;
    }
    data = {
      'lat': parseFloat(k.location.Lat),
      'long': parseFloat(k.location.Long),
      'location_name': k.location.Name,
      'company_name': k.company
    }
    locations.push(data);
  });
  console.log("length of locations", locations.length)
  console.log("locations", locations)
  makeMap("companyLocations", locations);
  $(".companies tr").not(".model").remove();

  for(var idx in politician.contractors){
    //use cont_id as primary_key
    var element = $(".companies .model").clone();
    $(element).removeClass("model");
    var contractor = politician.contractors[idx];
    console.log("COMPANY ", idx, contractor);

    //.matches table tbody
    //TODO: fullfill the table of matches

    //var certainty = (100.0 * parseFloat(politician.companies[idx].certainty)).toPrecision(4);
    var company_id = contractor.cont_id;
    var company_name = contractor.company;
    var director_name = contractor.director_name;
    var speciality = contractor.cidb_pengkhususan;

    console.log(company_name, director_name, speciality);

    var num_projects = contractor.num_projects;
    var sum_projects_value = numberWithCommas(contractor.sum_projects_value || 0);

    //$(".certainty").text(certainty);
    $(element).data("company_id", company_id);
    $(element).addClass("c_" + company_id);

    $(element).find(".company_name").text(company_name == "" ? "***EMPTY***" : company_name);
    $(element).find(".director_name").text(director_name);
    $(element).find(".num_projects").text(num_projects);
    $(element).find(".sum_projects_value").text(sum_projects_value);
    $(element).find(".speciality").text(speciality);
    $(element).show();

    $(".companies").append(element);

  }
  $(".companies .model").hide();
  setVotesClick();

  $(".matches, .vote").show();
  $(".loading").hide();

  //TODO: review this
  $(".companies .votes .buttons").show();
  $(".companies .votes .waiting").hide();
  $(".companies .votes .result").hide();

}


/*
function loadPoliticianFirebase(id) {
  $(".loading").fadeIn();
  $(".politician_name").text("");
  $(".politician_summary").text("");
  $(".politician-photo").css("background-image", "");
  $(".matches, .vote").hide();
  $(".companies .votes .buttons").show();
  $(".companies .votes .waiting").hide();
  $(".companies .votes .result").hide();

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
*/


function loadPolitician(slug) {
  $(".loading").fadeIn();
  $(".politician_name").text("");
  $(".politician_summary").text("");
  $(".politician-photo").css("background-image", "");
  $(".matches, .vote").hide();

  //TODO: review this
  $(".companies .votes .buttons").show();
  $(".companies .votes .waiting").hide();
  $(".companies .votes .result").hide();

  //politician_id = politicians[randomize];
  politician_slug = slug;
  console.log("POLITICIAN LOADED!", politician_slug);

  $.getJSON("data/person/"+slug+".json", function(politician_data){
    politician = politician_data;
    showPoliticianData();
  });

}




function loadPoliticians() {
  $.getJSON("data/person.json", function(p) {
    var randomize = politicians.length == 0;
    politicians = p;
    if (randomize) { randomizePolitician(); }
  });
}

function randomizePolitician() {

  if (politicians.length == 0) {
      loadPoliticians();
      return;
  }

  var randomize = Math.floor(politicians.length * Math.random());
  //loadPolitician();
  console.log("randomize politician...", randomize);
  location.hash = politicians[randomize].slug; // get the clicked link id
}




$(document).ready(function(){
  $(".loading").fadeIn();
  $(".matches, .vote").hide();

  $("#btn_play").click(function(e){
    e.preventDefault();
    randomizePolitician();
  });


  $("#btn_savematch").click(function(e){
    e.preventDefault();
    //TODO: save data in Firebase
  });

  console.log("OK");

  fbPP = new Firebase(FIREBASE_ROOT);

  if (location.hash) {
    loadPolitician(location.hash.substring(1));
  } else {
    randomizePolitician();
  }


  fbPP = new Firebase(FIREBASE_ROOT);


  /*
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
  */

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

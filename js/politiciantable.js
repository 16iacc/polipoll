$(document).ready(function(){
  $.getJSON(address, function(e) {
    for(i=0;i<politicians.length;i++) {
      var tr = $('<tr></tr>');
      var poliname = $('<td></td>').addClass('mdl-data-table').text(data);
      var dirname = $('<td></td>').addClass('mdl-data-table').text(data);
      var numcomp = $('<td></td>').addClass('mdl-data-table').text(data);
      var totaward = $('<td></td>').addClass('mdl-data-table').text(data);
      tr.append(slug);
      tr.append(poliname);
      tr.append(dirname);
      tr.append(numcomp);
      tr.append(totaward);
      $('tbody#companies').append(tr);
    }
  });
});

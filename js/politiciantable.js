$(document).ready(function(){
  $.getJSON('data/person.json', function(data) {
    console.log(data)
    for(i=0;i<data.length;i++) {

      var tr = $('<tr></tr>');
      var poliname = $('<td></td>').addClass('mdl-data-table').text(data[i].politician_name);
      var dirname = $('<td></td>').addClass('mdl-data-table').text(data[i].director_name);
      var numcomp = $('<td></td>').addClass('mdl-data-table').text(data[i].num_projects);
      var totaward = $('<td></td>').addClass('mdl-data-table').text(data[i].sum_projects_value);
      tr.append(poliname);
      tr.append(dirname);
      tr.append(numcomp);
      tr.append(totaward);
      $('tbody.companies').append(tr);
    }
    $('table.mdl-data-table').DataTable({
      columnDefs: [ {
              targets: [ 0 ],
              orderData: [ 0, 1 ]
          }, {
              targets: [ 1 ],
              orderData: [ 1, 0 ]
          } ]
    });
  });


});

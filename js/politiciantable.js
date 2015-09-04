$(document).ready(function(){
  $.getJSON('data/person.json', function(data) {
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    for(i=0;i<data.length;i++) {

      var tr = $('<tr></tr>');
      var poliname = $('<td></td>').addClass('mdl-data-table').append('<a href="#' + data[i].slug + '">' + data[i].politician_name + '</a>');
      var dirname = $('<td></td>').addClass('mdl-data-table').append('<a href="#' + data[i].slug + '">' + data[i].director_name + '</a>');
      var numcomp = $('<td></td>').addClass('mdl-data-table').text(data[i].num_projects);
      var totaward = $('<td></td>').addClass('mdl-data-table').text(numberWithCommas(data[i].sum_projects_value));
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

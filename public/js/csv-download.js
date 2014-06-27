$(function(){
	$("#from, #to").datepicker({
		dateFormat: "d/m/yy"
	});
	$("#download_form").submit(function(event) {
		event.preventDefault();
		var form_data = $(this).serializeArray();
		var url = "http://localhost:8001/todmorden/";
    var sensor_name = form_data[2].value;
		if (sensor_name != "all") {
			url = url + sensor_name;
		}
		$.ajax({
			 url: url,
			 method: 'get',
			 success:function(json){
					console.log(json);	
					download(convert_to_csv(json));
			 },
			 error:function(){
			    alert("Error getting data");
			 }      		
		});
	});
});

function convert_to_csv(json) {
	var csv = "'sensor name', 'date/time', 'reading'\n";
	$.each(json.rows, function(i, row){
		csv += "'"+row.sensor_name+"', '"+row.reading_time+"', '"+row.reading_value+"'\n";
	});
	alert(csv);
	return csv;
}

function download(csv){}

$(function(){
	$("#from").datepicker({
		dateFormat: "d/m/yy",
		minDate: new Date(2014, 5, 26),
		maxDate: new Date(),
	});
	$("#to").datepicker({
		dateFormat: "d/m/yy",
		minDate: new Date(2014, 5, 26),
		maxDate: new Date(),
	});
});


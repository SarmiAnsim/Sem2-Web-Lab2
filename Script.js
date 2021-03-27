
$(function() {
	DataTableUpdate();

	$('#search').click(function () {
		console.log(`http://localhost:3002/:age=${$('#searchAge').val()}`);
		
		FindTableUpdate();
	});

	$('#update').click(function () {
		DataTableUpdate();
	});

	$('#change').click(function () {
		var tr = $('#Data tbody:last tr');

		var neded = [];
		for(var i = 0; i < tr.length; ++i)
			if(tr[i].childNodes[4].childNodes[0].checked)
				neded.push(tr[i]);

		for(var i = 0; i < neded.length; ++i)
		{
			var datastr = "";

			datastr += `id=${neded[i].childNodes[0].innerText}&`;	
			datastr += `name=${neded[i].childNodes[1].innerText}&`;
			datastr += `age=${Number(neded[i].childNodes[2].innerText)}&`;
			datastr += `email=${neded[i].childNodes[3].innerText}`;

			console.log(datastr);

			$.ajax({
				type: "PUT",
				url: "http://localhost:3002/change",
				data: datastr
			});
		}
		
		DataTableUpdate();
		$('#search').click();
	});

	$('#newadd').click(function () {
		var newid = Number($('#Data tbody:last tr:last')[0].childNodes[0].innerText);

		var datastr = 
			`id=${newid + 1}&`+	
			`name=&`+
			`age=&`+
			`email=`;

		$.ajax({
			type: "POST",
			url: "http://localhost:3002/add",
			data: datastr,
			success: function(data) {
				console.log(data);

				DataTableUpdate();
				$('#search').click();
			}
		});
	});

	$('#delete').click(function () {
		var datastr = "";
		var tr = $('#Data tbody:last tr');

		var neded = [];
		for(var i = 0; i < tr.length; ++i)
			if(tr[i].childNodes[4].childNodes[0].checked)
				neded.push(tr[i].childNodes[0].innerText)

		for(var i = 0; i < neded.length; ++i)
			datastr += `id=${neded[i]}${(i+1 == neded.length?"":"&")}`;	

		$.ajax({
			type: "DELETE",
			url: "http://localhost:3002/delete",
			data: `${datastr}`,
			success: function(data) {
				console.log(data);

				DataTableUpdate();
				$('#search').click();
			}
		});
	});
});



function DataTableUpdate() {
	const settings = {
		"url": "http://localhost:3002/",
		"method": "GET",
		"headers": {
			"content-type": "utf8"
		},
	};
	$.ajax(settings).done(function (response) {
		console.log(response);
		var Data = JSON.parse(response);

		$('#Data > tbody:last').empty();

		for(var i=0; i<Data.length; ++i) {
			$('#Data > tbody:last').append(
				'<tr tabindex="1">' +
				`<td>${Data[i].id}</td>` +
				`<td contenteditable='true'>${Data[i].name}</td>` + 
				`<td contenteditable='true'>${Data[i].age}</td>` + 
				`<td contenteditable='true'>${Data[i].email}</td>` +
				`<td class="checkbox">`+
				`<input type="checkbox" class="custom-checkbox" id="${i}">`+
				`<label for="${i}"></label>`+
				`</td>` +
				'</tr>');
		}

		var neded = $('#Data tbody:last tr');
					for(var i=0; i < neded.length; ++i) {
						if(neded[i].childNodes[2].innerText == $('#searchAge').val() &&
							$('#searchAge').val() != "")
							neded[i].classList.add('finded');
						else
							neded[i].classList.remove('finded');
					}
	});
}

function FindTableUpdate() {
	$.ajax({
			type: "GET",
			url: `http://localhost:3002/:age=${$('#searchAge').val()}`,
			success: function(data) {
				if(data != "Not found!")
				{
      				var Data = JSON.parse(data);

					$('#FindData > tbody:last').empty();

					if($('#searchAge').val() != "")
						for(var i=0; i<Data.length; i++) {
							$('#FindData > tbody:last').append(
								'<tr>' +
								`<td>${Data[i].id}</td>` +
								`<td>${Data[i].name}</td>` + 
								`<td>${Data[i].age}</td>` + 
								`<td>${Data[i].email}</td>` +
								'</tr>');
						}

					var neded = $('#Data tbody:last tr');
					for(var i=0; i < neded.length; ++i) {
						if(neded[i].childNodes[2].innerText == $('#searchAge').val())
							neded[i].classList.add('finded');
						else
							neded[i].classList.remove('finded');
					}

				}
				console.log(`Found: ${data}`);
    		}
		});
}
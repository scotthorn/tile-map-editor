var canvas, tiles, gridSize, columns, rows, scene, activeTile, activeTileImg, zoomText, borders;
var painting = false;

$(document).ready(function(){
	// jQuery Needs
	canvas = $('#canvas');
	tiles = $('#tiles');
	gridSize = $('#grid-size');
	columns = 16;
	rows = 16;
	scene = $('#scene');
	activeTileImg = $('#active-tile img');
	zoomText = $('#zoom-text');
	borders = $('input[name="borders"]');

	// Put the tiles in the tools
	$.each(tileNames, function(i, name){
		var t = document.createElement("div");
		t.className = 'tile';
		t.setAttribute('data-tile-name', name);
		var image = document.createElement("img");
		image.setAttribute('src', 'tiles/' + tileManifest[name].image);
		t.appendChild(image);
		tiles.append(t);
	});

	// Set the default tile
	useTile(defaultTile);

	// Draw the initial grid
	drawGrid(columns, rows);

	// Set the tools interface events
	$('.tile').click(function(){
		useTile(this.getAttribute('data-tile-name'));
	});
	$('#new-grid').click(function(){
		vex.dialog.open({
			message: 'New Grid (current will be lost)',
			input: "<input type=\"text\" value=\"16\" name=\"columns\"><label for=\"columns\">Columns</label><input type=\"text\" value=\"16\" name=\"rows\"><label for=\"rows\">Rows</label>",
			buttons: [
				$.extend({}, vex.dialog.buttons.YES, {
					text: 'Create New Grid'
				}), $.extend({}, vex.dialog.buttons.NO, {
					text: 'Cancel'
				})
			],
			callback: function(data) {
				if (data === false) {
					return console.log('Cancelled');
				}
				else {
					drawGrid(data.columns, data.rows);
				}
			}
		});
	});
	borders.click(function(){
		if (borders.is(':checked')) {
			canvas.removeClass('no-borders');
		}
		else {
			canvas.addClass('no-borders');
		}
	});
	zoomText.change(function(){
		var val = zoomText.val();
		$('#js-style').html('.grid img { width: ' + val + 'px; height: ' + val + 'px; }')
	});
	$('#save').click(function(){
		savePrompt();
	});

	// Set the painting events
	canvas.mousedown(function(){
		painting = true;
	});
	$(document).mouseup(function(){
		painting = false;
	});
});

function drawGrid(numColumns, numRows) {
	columns = numColumns;
	rows = numRows;

	scene.html('');
	var html = document.createElement("div");
	html.className = 'grid table';

	for (var i = 0; i < numColumns; i++) {
		var row = document.createElement("div");
		row.className = 'table-row';

		for (var j = 0; j < numRows; j++) {
			var cell = document.createElement("div");
			cell.className = 'table-cell grid-cell';
			cell.id = 'gc-' + i + '-' + j;
			var image = document.createElement('img');
			image.setAttribute('src', 'tiles/transparent.png');
			cell.appendChild(image);
			row.appendChild(cell);
		}

		html.appendChild(row);
	}

	scene.html(html);

	// Set the grid click event
	$('.grid-cell').mousedown(function(){
		painting = true;
		colorCell($(this));
	})
	.mouseover(function(){
		if (painting) {
			colorCell($(this));
		}
	})
}

function useTile(name) {
	activeTile = name;
	activeTileImg.attr('src', 'tiles/' + tileManifest[name].image);
}
function colorCell(jqobj) {
	jqobj.children().attr('src', activeTileImg.attr('src')).attr('data-tile-name', activeTile);
}

function savePrompt() {
	var state = new Object();
	state['rows'] = rows;
	state['columns'] = columns;
	state.grid = new Array();

	for (var i = 0; i < columns; i++) {
		state.grid[i] = new Array();

		for (var j = 0; j < rows; j++) {
			state.grid[i][j] = $('#gc-' + i + '-' + j + ' img').attr('data-tile-name');
		}
	}

	var jsonOutput = JSON.stringify(state);

	vex.dialog.open({
		message: 'Save Tile Map',
		input: '<input name="filename" value="tilemap.json"><label for="filename">File Name</label><textarea id="save-data" rows=5 onclick="this.focus();this.select()" style="display: none;">' + jsonOutput + '</textarea><div id="toggle-save-data">Show/Hide Data</div>',
		tileNames: tileNames,
		buttons: [
			$.extend({}, vex.dialog.buttons.YES, {
				text: 'Save File'
			}), $.extend({}, vex.dialog.buttons.NO, {
				text: 'Close'
			})
		],
		callback: function(data) {
			if (data === false) {
				return console.log('Cancelled');
			}
			else {
				var blob = new Blob([jsonOutput], {type: "application/json;charset=utf-8"});
				saveAs(blob, data.filename);
			}
		}
	});
	$('#toggle-save-data').click(function(){
		$('#save-data').toggle();
	});
}
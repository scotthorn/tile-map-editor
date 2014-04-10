var canvas, tiles, gridSize, columns, rows, scene, activeTile, activeTileImg;
var painting = false;

$(document).ready(function(){
	// jQuery Needs
	canvas = $('#canvas');
	tiles = $('#tiles');
	gridSize = $('#grid-size');
	columns = gridSize.children('[name="columns"]');
	rows = gridSize.children('[name="rows"]');
	scene = $('#scene');
	activeTileImg = $('#active-tile img');

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
	drawGrid(16, 16);

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
	$('#zoom-text').change(function(){
		var val = $('#zoom-text').val();
		$('#js-style').html('.grid img { width: ' + val + 'px; height: ' + val + 'px; }')
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
	jqobj.children().attr('src', activeTileImg.attr('src'));
}
var tiles, gridSize, columns, rows, scene;

$(document).ready(function(){
	// jQuery Needs
	tiles = $('#tiles');
	gridSize = $('#grid-size');
	columns = gridSize.children('[name="columns"]');
	rows = gridSize.children('[name="rows"]');
	scene = $('#scene');

	// Put the tiles in the tools
	$.each(tileManifest, function(i, tile){
		var t = document.createElement("div");
		t.className = 'tile';
		var image = document.createElement("img");
		image.setAttribute('src', 'tiles/' + tile.image);
		t.appendChild(image);
		tiles.append(t);
	});

	// Draw the initial grid
	drawGrid();
});

function drawGrid() {
	scene.html('');
	var html = document.createElement("div");
	html.className = 'grid table';
	var numColumns = columns.val();
	var numRows = rows.val();

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
}
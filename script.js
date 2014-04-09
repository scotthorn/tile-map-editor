var tiles, gridSize, columns, rows, scene, activeTile, activeTileImg;

$(document).ready(function(){
	// jQuery Needs
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
	drawGrid();

	// Set the tools interface events
	$('.tile').click(function(){
		useTile(this.getAttribute('data-tile-name'));
	});
	$('#grid-size [type="submit"]').click(function(){
		drawGrid();
	});
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

function useTile(name) {
	activeTile = name;
	activeTileImg.attr('src', 'tiles/' + tileManifest[name].image);
}
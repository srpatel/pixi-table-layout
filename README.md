# pixi-table-layout

`pixi-table-layout` is a very simple layout library for PixiJS.

The easiest way to see it in action is to look at the [examples](#examples).

It's a work-in-progress. Contributions welcome.

If you like this, you may like my other PixiJS library [pixi-actions](https://github.com/srpatel/pixi-actions).

## Building and linking

If this library is of interest to you, let me know. I can build and upload to npm sooner rather than later. Right now, the API is in flux.

This is not yet uploaded to npm, so you would need to build yourself, and link it to your project.

```bash
# From pixi-simple-ui
npm install
npm run build
cp package.json dist/
cd dist/
npm link

# From the project in which you want to use pixi-simple-ui
npm link pixi-simple-ui
```

## Usage

The crux of the layout system is the `Table` class. It's a `PIXI.Container` that manages the size and position of its child elements.

### Creating a Table

You can create an add a table to the stage as with any other `PIXI.Container`. Be sure to set the table's size as appropriate; this is what determines the bounds of its child elements.

```javascript
const root = new Table();
root.setSize(500, 500);
container.addChild(root);
```

If you are using a table to manage layout of the whole stage, and you want to take advantage of the automatic resizing capabilities, it makes sense to add a resize listener. For example, if you are using the `resizeTo` option, and adding the root directly to the stage:

```javascript
await app.init({ resizeTo: window });

const root = new Table();
app.stage.addChild(root);
function resizeTable() {
	root.setSize(app.renderer.width, app.renderer.height);
}
app.renderer.on('resize', resizeTable);
resizeTable();
```

### Layout

Tables are made up of rows, and rows are made up of cells. Rows and cells have a basis, which determines how much room they take up:

- `number` - the size in pixels to take up
- `string` of the form `"10%"` - the percentage of the total space in pixels
- `null` (default) - all remaining space is divided equally by items with a null-basis

That is, a row with a basis of `50` will have a height of `50px`. A cell with a basis of `25%` will take up `25%` of the total available width.

A cell can also have any number of elements. An element is a `PIXI.Container`, a sizing strategy and an anchor. Each of the cell's elements are added to the table, and the position and size of each are managed according to the sizing strategy and anchor.

| Sizing strategy| Details |
|:---|:---|
| `null` | _Default._ Do not size the element, manage only the position. |
| `'contain'` | Set size as large as possible whilst still fitting within the cell. Maintain aspect ratio. |
| `'cover'` | Set size to the minimum size such that the cell is entired covered. Maintain aspect ratio. |
| `'stretch'` or `'cover!'` | Set size to the exact size of the cell. Ignore aspect ratio. |
| `grow` | If the cell is larger than the initial size, grow the element to fit the cell. Maintain aspect ratio. |
| `grow!` | If the cell is larger than the initial size, grow the element to fit the cell. Ignore aspect ratio. |
| `shrink` | If the cell is smaller than the initial size, shrink the element to fit the cell. Maintain aspect ratio. |
| `shrink!` | If the cell is smaller than the initial size, shrink the element to fit the cell. Ignore aspect ratio. |

Cell anchor is a `PIXI.Point` representing the x and y anchors. There are some self-explanatory helper constants:

- `CellAnchor.TopLeft`
- `CellAnchor.Top`
- `CellAnchor.TopRight`
- `CellAnchor.Left`
- `CellAnchor.Middle` (default)
- `CellAnchor.Right`
- `CellAnchor.BottomLeft`
- `CellAnchor.Bottom`
- `CellAnchor.BottomRight`

### API

Add rows, cells and elements to the table using these methods:

- `Table.row(basis: Basis = null)`
- `Table.cell(basis: Basis = null)`
- `Table.element(element: PIXI.Container, strategy: SizingStrategy = null, anchor: PIXI.Point = null)`

You can turn on debug drawing which draws a red outline around each cell:

- `Table.debug = true;`

It is recommended to disable prettier for the table definition so you can use the indentation to visualise the layout.

## Examples

All of these examples are show with debug draw on.

<table>
	<thead>
		<tr>
			<th>Code</th>
			<th>Layout</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><b>Contain</b><pre lang="js">
// prettier-ignore
root
	.row()
        .cell()
        .cell("20%").element(PIXI.Sprite.from("doughnut.png"), "contain", CellAnchor.Top)
        .cell()
	.row("20%")
        .cell().element(PIXI.Sprite.from("doughnut.png"), "contain", CellAnchor.Left)
		.cell().element(PIXI.Sprite.from("doughnut.png"), "contain")
		.cell().element(PIXI.Sprite.from("doughnut.png"), "contain", CellAnchor.Right)
	.row()
        .cell()
        .cell("20%").element(PIXI.Sprite.from("doughnut.png"), "contain", CellAnchor.Bottom)
        .cell();
root.debug = true;</pre>
Sprites are resized to fit within cells, but aspect ratio is maintained.
</td>
			<td><img src="https://github.com/srpatel/pixi-table-layout/assets/4903502/fb31f4db-4ab5-4c34-a2ca-139d38ef855e">
</td>
		</tr>
		<tr>
			<td><b>Stretch</b><pre lang="js">
// prettier-ignore
root
	.row()
		.cell().element(PIXI.Sprite.from("doughnut.png"), "stretch")
		.cell().element(PIXI.Sprite.from("doughnut.png"), "stretch")
        .cell().element(PIXI.Sprite.from("doughnut.png"), "stretch")
	.row(20)
	.row()
		.cell()
			.element(PIXI.Sprite.from("doughnut.png"), "stretch");
root.debug = true;</pre>
Sprites are sized exactly to their containing cells.
</td>
			<td><img src="https://github.com/srpatel/pixi-table-layout/assets/4903502/54cb9a86-5a48-4232-9658-64b33181e438">
</td>
		</tr>
		<tr>
			<td><b>Cover</b><pre lang="js">
// prettier-ignore
root
	.row()
	.row(150)
		.cell(100)
		.cell().element(PIXI.Sprite.from("doughnut.png"), "cover", CellAnchor.Top)
		.cell(100)
	.row();
root.debug = true;</pre>
Sprite grows to completely cover the cell, even spilling outside the cell's bounds.
</td>
			<td><img src="https://github.com/srpatel/pixi-table-layout/assets/4903502/11e47a93-3f7f-4831-a4b4-599d24cb5aa6">
</td>
		</tr>
		<tr>
			<td><b>No sizing strategy</b><pre lang="js">
// prettier-ignore
root
	.row()
		.cell().element(PIXI.Sprite.from("doughnut.png"), CellAnchor.Top)
		.cell().element(PIXI.Sprite.from("doughnut.png"), new PIXI.Point(0.2, 0.9))
        .cell().element(PIXI.Sprite.from("doughnut.png"))
	.row()
		.cell()
			.element(PIXI.Sprite.from("doughnut.png"), CellAnchor.TopLeft)
			.element(PIXI.Sprite.from("doughnut.png"), CellAnchor.BottomRight);
root.debug = true;</pre>
Sprites are left at their original size, and simple placed according to their anchors. Note that one cell can have multiple elements
</td>
			<td><img src="https://github.com/srpatel/pixi-table-layout/assets/4903502/cb3fbce5-c0a3-40d1-8dc1-c1b948c6216d">
</td>
		</tr>
		<tr>
			<td><b>Sub-tables</b><pre lang="js">
// prettier-ignore
root
	.row()
		.cell("33%").element(subTable1, "stretch")
		.cell().element(PIXI.Sprite.from("doughnut.png"))
	.row()
		.cell().element(PIXI.Sprite.from("doughnut.png"))
		.cell(350).element(subTable2, "stretch");
root.debug = true;</pre>
Sub-tables are permitted and encouraged! When adding a table as an element, you almost certainly want to use the "stretch" sizing strategy.
</td>
			<td><img src="https://github.com/srpatel/pixi-table-layout/assets/4903502/756b7386-b501-402a-af62-5cac81b46397">
</td>
		</tr>
	</tbody>
</table>

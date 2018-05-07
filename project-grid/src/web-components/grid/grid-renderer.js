import * as d3 from "d3";

export class GridRenderer {
    constructor(parentElement, columns, data, renderer = undefined){
        this.parentElement = parentElement;
        this.canvas = d3.select(this.parentElement);
        this.columns = columns;
        this.data = data;
        this.renderer = renderer == undefined ? new GridHtmlRenderer(columns, data) : renderer;
    }

    render(){
        this.grid = d3.select(this.parentElement)
            .call(this.renderer.renderGrid);
    }
}

export class GridHtmlRenderer {
    dataGrid = "data-grid";
    dataGridHeader = `${this.dataGrid}-header`;
    dataGridRowBody = `${this.dataGrid}-body`;
    dataGridRow = `${this.dataGrid}-row`;
    dataGridCell = `${this.dataGrid}-cell`;

    constructor(columns, data){
        this.columns = columns;
        this.data = data;
    }

    renderGrid(grid){
        this.renderHeader(grid);
        this.renderRows(grid);
    }

    renderHeader(grid){
        grid.selectAll(`.${this.dataGridHeader}`)
            .data([true])
            .enter()
            .append('div')
            .attr('class', this.dataGridHeader);

        let header = grid.select(`.${this.dataGridHeader}`)
            .selectAll(`.${this.dataGridCell}`)
            .data(this.columns);

        header.enter()
            .append('div')
            .attr('style', this.calculateColumn)
            .classed(this.dataGridCell, true);

        header.exit().remove();

        grid.selectAll(`.${this.dataGridHeader} .${this.dataGridCell}`)
            .text(function(column) { return column});
    }

    renderRows(grid) {
        grid.select(`.${this.dataGridRowBody}`)
            .data([true])
            .enter()
            .append('div')
            .attr('class', this.dataGridRowBody);

        let rows = grid.select(`.${this.dataGridRowBody}`)
            .selectAll(`.${this.dataGridRow}`)
            .data(this.data);
        
        rows.enter()
            .append('div')
            .attr('class', this.dataGridRow);
        
        rows.exit().remove();
        
        let cells = grid.selectAll(`.${this.dataGridRowBody} .${this.dataGridRow}`)
            .data(function (row) { 
                this.columns.map(function (col) {
                    return row[col];
                })  
            });
        
        cells.enter().append('div')
            .attr('style', this.calculateColumn)
            .classed(this.dataGridCell);
        
        cells.exit.remove();
        grid.selectAll(`.${this.dataGridRowBody} .${this.dataGridRow}`)
            .text(function(d) { return d; });
    }

    calculateColumn(data, index){
        return `grid-column: ${data} \ ${index+1}`;
    }
}
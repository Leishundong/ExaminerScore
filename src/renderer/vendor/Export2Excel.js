/* eslint-disable */
require('script-loader!file-saver');
require('script-loader!vendor/Blob');
require('script-loader!xlsx/dist/xlsx.core.min');
var JSZip = require('jszip');
var modify = require('../config');
/*console.log(modify.default.ab2s());*/
function generateArray(table) {
    var out = [];
    var rows = table.querySelectorAll('tr');
    var ranges = [];
    for (var R = 0; R < rows.length; ++R) {
        var outRow = [];
        var row = rows[R];
        var columns = row.querySelectorAll('td');
        for (var C = 0; C < columns.length; ++C) {
            var cell = columns[C];
            var colspan = cell.getAttribute('colspan');
            var rowspan = cell.getAttribute('rowspan');
            var cellValue = cell.innerText;
            if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

            //Skip ranges
            ranges.forEach(function (range) {
                if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
                    for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
                }
            });

            //Handle Row Span
            if (rowspan || colspan) {
                rowspan = rowspan || 1;
                colspan = colspan || 1;
                ranges.push({s: {r: R, c: outRow.length}, e: {r: R + rowspan - 1, c: outRow.length + colspan - 1}});
            }
            ;

            //Handle Value
            outRow.push(cellValue !== "" ? cellValue : null);

            //Handle Colspan
            if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
        }
        out.push(outRow);
    }
    return [out, ranges];
};

function datenum(v, date1904) {
    if (date1904) v += 1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = {v: data[R][C]};
            if (cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}
export function export_table_to_excel(id) {
    var theTable = document.getElementById(id);
    console.log('a')
    var oo = generateArray(theTable);
    var ranges = oo[1];

    /* original data */
    var data = oo[0];
    var ws_name = "SheetJS";
    console.log(data);

    var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

    /* add ranges to worksheet */
    // ws['!cols'] = ['apple', 'banan'];
    ws['!merges'] = ranges;

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
    saveAs(new Blob([encrypt(Buffer.from(s2ab(wbout)))], {type: "application/octet-stream"}))
}

function formatJson(jsonData) {
}
var wb = new Workbook();
export function export_json_to_excel(th, jsonData, sheetsName, defaultTitle,a) {

    /* original data */

    var data = jsonData;
    data.unshift(th);
    var ws_name = sheetsName;

    var  ws = sheet_from_array_of_arrays(data);


    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    if(a == 1){
        var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary',});
        wb = new Workbook();
       /* encrypt(Buffer.from(s2ab(wbout)))*/
        var title = defaultTitle ;
        saveAs(new Blob([modify.default.s2ab(wbout)], {type: "application/octet-stream"}),title+".xlsx")
      /*
        var zip = new JSZip();
        zip.file(title+".xlsx", new Blob([s2ab(wbout)], {type: "application/octet-stream"}),{binary:true});
        zip.generateAsync({type:"blob"})
            .then(function(content) {
                // see FileSaver.js
                saveAs(content, title+".zip");
            });
        */

    }
}

export function encrypto_export_json_to_excel(th, jsonData, sheetsName, defaultTitle,a) {

    /* original data */

    var data = jsonData;
    data.unshift(th);
    var ws_name = sheetsName;

    var  ws = sheet_from_array_of_arrays(data);


    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    if(a == 1){
        var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary',});
        wb = new Workbook();
        /* encrypt(Buffer.from(s2ab(wbout)))*/
        var title = defaultTitle ;
        let bufs = modify.default.s2ab(wbout);
        let buf = modify.default.ab2s(bufs);
        saveAs(new Blob([modify.default.encrypt(buf)], {type: "application/octet-stream"}),title+".sec")
        /*
          var zip = new JSZip();
          zip.file(title+".xlsx", new Blob([s2ab(wbout)], {type: "application/octet-stream"}),{binary:true});
          zip.generateAsync({type:"blob"})
              .then(function(content) {
                  // see FileSaver.js
                  saveAs(content, title+".zip");
              });

          */

    }
}
export function exportSystem_json_to_excel(th, jsonData, sheetsName, defaultTitle,a) {

    /* original data */

    var data = jsonData;
    data.unshift(th);
    var ws_name = sheetsName;

    var  ws = sheet_from_array_of_arrays(data);


    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    if(a == 1){
        var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary',});
        wb = new Workbook();
        /* encrypt(Buffer.from(s2ab(wbout)))*/
        var title = defaultTitle ;
        saveAs(new Blob([modify.default.s2ab(wbout)], {type: "application/octet-stream"}),title+".xlsx")
        /*
          var zip = new JSZip();
          zip.file(title+".xlsx", new Blob([s2ab(wbout)], {type: "application/octet-stream"}),{binary:true});
          zip.generateAsync({type:"blob"})
              .then(function(content) {
                  // see FileSaver.js
                  saveAs(content, title+".zip");
              });
          */

    }
}
export function report_export_json_to_excel(th, jsonData, sheetsName, defaultTitle,a) {

    /* original data */

    var data = jsonData;
    data.unshift(th);
    var ws_name = sheetsName;

    var  ws = sheet_from_array_of_arrays(data);


    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    if(a == 1){
        var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary',password: '123456'});
        wb = new Workbook();
        /* encrypt(Buffer.from(s2ab(wbout)))*/
        var title = defaultTitle ;
        var zip = new JSZip();
        zip.file(title+".xlsx", new Blob([modify.default.s2ab(wbout)], {type: "application/octet-stream"}),{binary:true});
        zip.generateAsync({type:"blob"})
            .then(function(content) {
                // see FileSaver.js
                saveAs(content, title+".zip");
            });


    }
}

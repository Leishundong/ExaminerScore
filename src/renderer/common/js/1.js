window.onload = function () {
    tableToExcel('tableToExcel', '下载模板');
};
console.log(1);
//base64转码
var base64 = function (s) {
    return window.btoa(unescape(encodeURIComponent(s)));

};
//替换table数据和worksheet名字
var format = function (s, c) {
    return s.replace(/{(\w+)}/g,
        function (m, p) {
            return c[p];
        });
}
function tableToExcel(tableid, sheetName) {
    var uri = 'data:application/vnd.ms-excel;base64,';
    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"' +
        'xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
        + '<x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets>'
        + '</x:ExcelWorkbook></xml><![endif]-->' +
        ' <style type="text/css">' +
        'table td {' +
        'border: 1px solid #000000;' +
        'width: 200px;' +
        'height: 50.10pt;' +
        ' text-align: center;' +
        'background-color: #898779;' +
        'color: #ffffff;' +
        ' }' +
        '</style>' +
        '</head><body ><table class="excelTable">{table}</table></body></html>';
    if (!tableid.nodeType) tableid = document.getElementById(tableid);
    var ctx = {worksheet: sheetName || 'Worksheet', table: tableid.innerHTML};
    document.getElementById("excelOut").href = uri + base64(format(template, ctx));
}
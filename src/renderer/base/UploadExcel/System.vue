<template>
  <div>
    <span @click="handleUpload">导入设置文件</span>
    <input id="excel-upload-input3" type="file" accept=".xlsx, .xls" class="c-hide" @change="handkeFileChange">
  </div>
</template>

<script>
    import XLSX from 'xlsx'
    export default {
        data() {
            return {
                loading: false,
                excelData: {
                    header: null,
                    results: null,
                }
            }
        },
        methods: {
            generateDate({ header, results }) {
                this.excelData.header=header ;
                this.excelData.results=results;
                this.loading = false;
                this.$emit('on-selected-file', this.excelData)
            },
            handleUpload() {
                document.getElementById('excel-upload-input3').click();
            },
            handkeFileChange(e) {
                var fileLength = 0;
                this.loading = true;
                const files = e.target.files;
                var reader = new FileReader();
                reader.readAsArrayBuffer(files[fileLength]);
                reader.onabort = function(e) {
                    console.log("文件读取异常" + files[fileLength].name);
                };
                reader.onerror = function(e) {
                    console.log("文件读取出现错误" + files[fileLength].name);
                };
                reader.onload = e => {
                    if(e){
                        let data = e.target.result;
                        let fixedData = this.fixdata(data);
                        let workbook = XLSX.read(btoa(fixedData), { type: 'base64' });
                        for (var i=0;i<3;i++){
                            let firstSheetName = workbook.SheetNames[i];
                            let worksheet = workbook.Sheets[firstSheetName];
                            let header = this.get_header_row(worksheet);
                            let results = XLSX.utils.sheet_to_json(worksheet);
                            this.generateDate({ header, results })
                        }
                        this.$alert("完成导入" + files[fileLength].name);
                        fileLength++;
                        if(fileLength < files.length) {
                            reader.readAsArrayBuffer(files[fileLength]);
                        }else {
                        }
                    }
                }

                /* const files = e.target.files;
                 for(var j=0;j<files.length;j++){
                     this.excelData.addressName = files[j].name;
                     const itemFile = files[j]; // only use files[0]
                     const reader = new FileReader();
                     reader.onload = e => {
                         const data = e.target.result;
                         const fixedData = this.fixdata(data);
                         const workbook = XLSX.read(btoa(fixedData), { type: 'base64' });
                         for (var i=0;i<=2;i++){
                             const firstSheetName = workbook.SheetNames[i];
                             const worksheet = workbook.Sheets[firstSheetName];
                             const header = this.get_header_row(worksheet);
                             const results = XLSX.utils.sheet_to_json(worksheet);
                             this.generateDate({ header, results })
                         }
                     };
                     reader.readAsArrayBuffer(itemFile);
                     this.excelData.header = null;
                     this.excelData.results= null;
                 }*/
            },
            fixdata(data) {
                let o = '';
                let l = 0;
                const w = 10240;
                for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
                return o
            },
            get_header_row(sheet) {
                const headers = [];
                const range = XLSX.utils.decode_range(sheet['!ref']);
                let C;
                const R = range.s.r /* start in the first row */
                for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
                    var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]; /* find the cell in the first row */
                    var hdr = 'UNKNOWN ' + C // <-- replace with your desired default
                    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
                    headers.push(hdr)
                }
                return headers
            }
        }
    }
</script>

<style scoped>
  .cur{
    cursor: pointer;
  }
  #excel-upload-input3{
    display: none;
    z-index: -9999;
  }
  span{
    float: left;
    margin-top: 10px;
    margin-left: 25px;
    width: 170px;
    height: 39px;
    line-height: 39px;
    border-radius: 5px;
    background: #0098FE;
    text-align: center;
    color: #fff;
  }
</style>

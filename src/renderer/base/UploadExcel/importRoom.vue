<template>
    <div>
        <span class="cur"  @click="handleUploads">导入面试点设置表</span>
        <input id="excel-upload-input" type="file" accept=".xlsx, .xls" class="c-hide" @change="handkeFileChanges">
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
                    results: null
                }
            }
        },
        methods: {
            generateDates({ header, results }) {
                this.excelData.header = header;
                this.excelData.results = results;
                this.loading = false;
                this.$emit('on-selected-file', this.excelData)
            },
            handleUploads() {
                document.getElementById('excel-upload-input').click()
            },
            handkeFileChanges(e) {
                this.loading = true;
                const files = e.target.files;
                const itemFile = files[0]; // only use files[0]
                const reader = new FileReader();
                reader.onload = e => {
                    const data = e.target.result;
                    const fixedData = this.fixdata(data);
                    const workbook = XLSX.read(btoa(fixedData), { type: 'base64' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const header = this.get_header_row(worksheet);
                    const results = XLSX.utils.sheet_to_json(worksheet);
                    this.generateDates({ header, results })
                };
                reader.readAsArrayBuffer(itemFile)
            },
            fixdata(data) {
                let o = '';
                let l = 0;
                const w = 10240;
                for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
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
    #excel-upload-input{
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
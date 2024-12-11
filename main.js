import Papa from 'papaparse';

let combinedData = [];
const fileInput = document.getElementById('csvFiles');
const mergeButton = document.getElementById('mergeButton');
const previewDiv = document.getElementById('preview');

fileInput.addEventListener('change', handleFileSelect);
mergeButton.addEventListener('click', downloadMergedCSV);

function handleFileSelect(event) {
    combinedData = [];
    const files = event.target.files;
    let processedFiles = 0;

    for (const file of files) {
        Papa.parse(file, {
            complete: function(results) {
                combinedData = combinedData.concat(results.data);
                processedFiles++;

                if (processedFiles === files.length) {
                    showPreview();
                }
            },
            header: true
        });
    }
}

function showPreview() {
    if (combinedData.length === 0) return;

    const headers = Object.keys(combinedData[0]);
    const previewData = combinedData.slice(0, 5);

    let tableHTML = '<h2>プレビュー（最初の5行）</h2><table>';
    
    // ヘッダー行
    tableHTML += '<tr>';
    headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr>';

    // データ行
    previewData.forEach(row => {
        tableHTML += '<tr>';
        headers.forEach(header => {
            tableHTML += `<td>${row[header]}</td>`;
        });
        tableHTML += '</tr>';
    });

    tableHTML += '</table>';
    previewDiv.innerHTML = tableHTML;
}

function downloadMergedCSV() {
    if (combinedData.length === 0) {
        alert('CSVファイルを選択してください。');
        return;
    }

    const csv = Papa.unparse(combinedData);
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'combined.csv';
    link.click();
}
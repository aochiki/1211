import { FileProcessor } from './utils/fileProcessor';
import { UIManager } from './utils/uiManager';
import { DataValidator } from './utils/dataValidator';
import Papa from 'papaparse';

const fileInput = document.getElementById('files');
const mergeButton = document.getElementById('mergeButton');
const previewDiv = document.getElementById('preview');

const uiManager = new UIManager(previewDiv);
let processedData = [];

async function handleFileSelect(event) {
    try {
        const files = Array.from(event.target.files);
        if (!files.length) return;

        processedData = [];
        const processedFiles = await Promise.all(
            files.map(file => FileProcessor.processFile(file))
        );
        
        processedData = FileProcessor.combineData(processedFiles);
        
        if (DataValidator.validateData(processedData)) {
            uiManager.showPreview(processedData);
        }
    } catch (error) {
        console.error('ファイル処理エラー:', error);
        alert(`ファイルの処理中にエラーが発生しました: ${error.message}`);
    }
}

function downloadMergedFile() {
    if (!DataValidator.validateData(processedData)) {
        alert('ファイルを選択してください。');
        return;
    }

    try {
        const csv = Papa.unparse(processedData);
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { 
            type: 'text/csv;charset=utf-8;' 
        });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'combined.csv';
        link.click();
    } catch (error) {
        console.error('ダウンロードエラー:', error);
        alert('ファイルのダウンロード中にエラーが発生しました。');
    }
}

fileInput.addEventListener('change', handleFileSelect);
mergeButton.addEventListener('click', downloadMergedFile);
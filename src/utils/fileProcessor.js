import Papa from 'papaparse';
import { HeaderMapper } from './headerMapper';
import { DataFormatter } from './dataFormatter';
import { ExcelProcessor } from './excelProcessor';
import { FileTypeDetector } from './fileTypeDetector';

export class FileProcessor {
    static async processFile(file) {
        try {
            const fileType = FileTypeDetector.detectFileType(file);
            const isNexTone = FileTypeDetector.isNexToneFile(file.name);
            
            switch (fileType) {
                case 'csv':
                    return await this.processCSV(file, isNexTone);
                case 'txt':
                    return await this.processTXT(file, isNexTone);
                case 'excel':
                    return await ExcelProcessor.processExcel(file, isNexTone);
                default:
                    throw new Error(`未対応のファイル形式です: ${file.name}`);
            }
        } catch (error) {
            console.error('ファイル処理エラー:', error);
            throw error;
        }
    }

    static processCSV(file, isNexTone) {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                transformHeader: (header, index) => {
                    if (isNexTone && index === 0) return null;
                    return HeaderMapper.mapHeader(header);
                },
                complete: (results) => {
                    const validData = results.data.filter(row => Object.keys(row).length > 0);
                    const formattedData = DataFormatter.formatData(validData);
                    resolve(formattedData);
                },
                error: (error) => reject(new Error(`CSVパースエラー: ${error.message}`))
            });
        });
    }

    static async processTXT(file, isNexTone) {
        try {
            const text = await file.text();
            const lines = text.split('\n').filter(line => line.trim());
            
            if (lines.length === 0) {
                throw new Error('ファイルが空です');
            }

            const startIndex = isNexTone ? 1 : 0;
            const headers = HeaderMapper.normalizeHeaders(
                lines[startIndex].split('\t').map(header => header.trim())
            );

            const data = lines.slice(startIndex + 1).map(line => {
                const values = line.split('\t').map(value => value.trim());
                const row = {};
                headers.forEach((header, index) => {
                    if (header) {
                        row[header] = values[index] || '';
                    }
                });
                return row;
            });

            return DataFormatter.formatData(data);
        } catch (error) {
            console.error('TXTファイル処理エラー:', error);
            throw error;
        }
    }

    static combineData(dataArray) {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return [];
        }

        const combinedData = dataArray.flat().filter(row => 
            Object.keys(row).length > 0 && 
            Object.values(row).some(value => value)
        );

        return DataFormatter.formatData(combinedData);
    }
}
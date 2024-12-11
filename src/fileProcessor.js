import Papa from 'papaparse';
import { FILE_TYPES } from './constants';
import { HeaderMapper } from './utils/headerMapper';
import { DataFormatter } from './utils/dataFormatter';

export class FileProcessor {
    static async processFile(file) {
        const fileType = file.name.split('.').pop().toLowerCase();
        
        switch (fileType) {
            case FILE_TYPES.CSV:
                return await this.processCSV(file);
            case FILE_TYPES.TXT:
                return await this.processTXT(file);
            default:
                throw new Error('Unsupported file type');
        }
    }

    static processCSV(file) {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                transformHeader: header => HeaderMapper.mapHeaders([header])[0],
                complete: (results) => {
                    const orderedData = DataFormatter.reorderColumns(results.data);
                    resolve(orderedData);
                },
                error: (error) => reject(error)
            });
        });
    }

    static async processTXT(file) {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        const headers = HeaderMapper.mapHeaders(
            lines[0].split('\t').map(header => header.trim())
        );
        
        const data = lines.slice(1).map(line => {
            const values = line.split('\t').map(value => value.trim());
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index] || '';
                return obj;
            }, {});
        });

        return DataFormatter.reorderColumns(data);
    }

    static combineData(dataArray) {
        if (!dataArray.length) return [];
        
        const allHeaders = new Set();
        dataArray.forEach(data => {
            data.forEach(row => {
                Object.keys(row).forEach(header => allHeaders.add(header));
            });
        });

        const combinedData = dataArray.flat().map(row => {
            const newRow = {};
            allHeaders.forEach(header => {
                newRow[header] = row[header] || '';
            });
            return newRow;
        });

        return DataFormatter.reorderColumns(combinedData);
    }
}
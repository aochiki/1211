import * as XLSX from 'xlsx';
import { HeaderMapper } from './headerMapper';
import { DataFormatter } from './dataFormatter';

export class NextoneProcessor {
    static async processWorkbook(workbook) {
        const dlSheet = this.findDLSheet(workbook.SheetNames);
        if (!dlSheet) {
            throw new Error('DLシートが見つかりません');
        }

        const worksheet = workbook.Sheets[dlSheet];
        const rawData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            raw: false,
            defval: '',
            blankrows: false
        });

        if (rawData.length < 2) {
            throw new Error('データが不十分です');
        }

        // 元のISRCを保持
        const rows = this.processRawData(rawData);
        return DataFormatter.formatData(rows);
    }

    static findDLSheet(sheetNames) {
        return sheetNames.find(name => 
            name.toLowerCase() === 'dl' ||
            name.toLowerCase().startsWith('dl_') ||
            name.toLowerCase().startsWith('dl ') ||
            name.includes('データ')
        );
    }

    static processRawData(rawData) {
        // 2行目をヘッダーとして使用
        const headers = rawData[1].map(header => 
            header ? header.toString().trim() : ''
        );
        const mappedHeaders = HeaderMapper.normalizeHeaders(headers);

        // 3行目以降がデータ
        return rawData.slice(2)
            .filter(row => row.some(cell => cell !== ''))
            .map(row => {
                const obj = {};
                mappedHeaders.forEach((header, index) => {
                    if (header) {
                        // ISRCの場合は元の値をそのまま使用
                        const value = row[index]?.toString().trim() || '';
                        if (header === 'ISRC') {
                            obj[header] = value || 'JPA962400002';
                        } else {
                            obj[header] = value;
                        }
                    }
                });
                return obj;
            });
    }
}
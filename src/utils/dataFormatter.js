import { HEADERS, HEADER_ORDER } from '../constants/headers';

export class DataFormatter {
    static formatData(data) {
        if (!Array.isArray(data) || data.length === 0) return [];

        const orderedHeaders = HEADER_ORDER.map(key => HEADERS[key]);
        
        return data.map(row => {
            const formattedRow = {};
            
            orderedHeaders.forEach(header => {
                formattedRow[header] = this.findValue(row, header) || '';
            });

            return formattedRow;
        });
    }

    static findValue(row, targetHeader) {
        if (!row || !targetHeader) return '';
        
        const possibleKeys = this.getPossibleKeys(targetHeader);
        
        for (const key of possibleKeys) {
            const value = this.findValueByKey(row, key);
            if (value) return value;
        }
        
        return '';
    }

    static findValueByKey(row, key) {
        const lowerKey = key.toLowerCase();
        const entry = Object.entries(row).find(([k]) => 
            k && k.toLowerCase() === lowerKey
        );
        
        return entry ? entry[1] : '';
    }

    static getPossibleKeys(header) {
        const baseKeys = [header];
        
        if (header === HEADERS.ARTIST_NAME) {
            return [
                'アーティスト名',
                'アーティスト',
                'Artist Name',
                'Artist',
                'Track Artist'
            ];
        }
        
        return baseKeys;
    }
}
import { HEADERS } from '../constants/headers';
import { ISRCValidator } from './isrcValidator';

export class DataValidator {
    static validateData(data) {
        return Array.isArray(data) && data.length > 0;
    }

    static validateRow(row, requiredHeaders) {
        const isValid = requiredHeaders.every(header => {
            if (header === HEADERS.ISRC) {
                return true; // ISRCは自動生成されるため、バリデーションをスキップ
            }
            const value = row[header];
            return value !== undefined && value !== null && value !== '';
        });

        return isValid;
    }

    static validateHeaders(headers, requiredHeaders) {
        return requiredHeaders.every(required => 
            headers.includes(required)
        );
    }
}
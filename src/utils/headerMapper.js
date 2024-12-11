import { HEADER_MAPPINGS } from '../constants/headerMappings';

export class HeaderMapper {
    static mapHeader(header) {
        if (!header) return '';
        
        const trimmedHeader = header.trim();
        
        // 直接マッピング
        if (HEADER_MAPPINGS[trimmedHeader]) {
            return HEADER_MAPPINGS[trimmedHeader];
        }

        // 大文字小文字を区別しないマッピング
        const lowerHeader = trimmedHeader.toLowerCase();
        const mappings = this.createCaseInsensitiveMappings();
        
        return mappings[lowerHeader] || trimmedHeader;
    }

    static createCaseInsensitiveMappings() {
        return Object.fromEntries(
            Object.entries(HEADER_MAPPINGS).map(([key, value]) => [
                key.toLowerCase(),
                value
            ])
        );
    }

    static normalizeHeaders(headers) {
        if (!Array.isArray(headers)) return [];
        return headers.map(header => this.mapHeader(header));
    }

    static isValidHeader(header) {
        return header && typeof header === 'string' && header.trim().length > 0;
    }
}
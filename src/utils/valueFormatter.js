export class ValueFormatter {
    static formatNumber(value) {
        if (!value) return '0';
        const numValue = parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
        return isNaN(numValue) ? '0' : numValue.toString();
    }

    static formatQuantity(value) {
        if (!value) return '';
        const cleanValue = value.toString().trim().replace(/,/g, '');
        if (cleanValue === '') return '';
        
        const numValue = parseFloat(cleanValue);
        return isNaN(numValue) ? cleanValue : numValue.toString();
    }

    static calculateUnitPrice(distributionUnitPrice, distributionRate) {
        const price = this.formatNumber(distributionUnitPrice);
        const rate = parseFloat(this.formatNumber(distributionRate)) / 100;
        return rate > 0 ? (parseFloat(price) / rate).toString() : price;
    }
}
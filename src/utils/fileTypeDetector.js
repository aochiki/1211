export class FileTypeDetector {
    static detectFileType(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        
        switch (extension) {
            case 'csv':
                return 'csv';
            case 'txt':
                return 'txt';
            case 'xls':
            case 'xlsx':
                return 'excel';
            default:
                return 'unknown';
        }
    }

    static isNexToneFile(fileName) {
        const lowerFileName = fileName.toLowerCase();
        return lowerFileName.includes('nextone') || 
               lowerFileName.includes('nex') ||
               lowerFileName.includes('分配') ||
               lowerFileName.includes('データ');
    }

    static isDLSheet(sheetName) {
        if (!sheetName) return false;
        
        const lowerSheetName = sheetName.toLowerCase();
        return lowerSheetName === 'dl' ||
               lowerSheetName.startsWith('dl_') ||
               lowerSheetName.startsWith('dl ') ||
               lowerSheetName.includes('データ');
    }
}
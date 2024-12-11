export class UIManager {
    constructor(previewElement) {
        this.previewElement = previewElement;
        this.previewRowCount = 10;
    }

    showPreview(data) {
        if (!data || !data.length) {
            this.previewElement.innerHTML = '';
            return;
        }

        const headers = Object.keys(data[0]);
        const previewData = data.slice(0, this.previewRowCount);

        let html = `
            <div class="preview-container">
                <h2>プレビュー（最初の${this.previewRowCount}行）</h2>
                <div class="file-info">
                    <p>総行数: ${data.length}行</p>
                    <p>列数: ${headers.length}列</p>
                </div>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th class="row-header">#</th>
                                ${headers.map(header => 
                                    `<th class="column-header">${header}</th>`
                                ).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${previewData.map((row, index) => `
                                <tr>
                                    <td class="row-number">${index + 1}</td>
                                    ${headers.map(header => 
                                        `<td class="cell ${row[header] ? '' : 'empty-cell'}">${row[header] || '(空)'}</td>`
                                    ).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        this.previewElement.innerHTML = html;
    }
}
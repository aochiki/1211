from flask import Flask, render_template, request, send_file
import pandas as pd
import io
import os

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def upload_files():
    if request.method == 'POST':
        if 'files[]' not in request.files:
            return 'No files uploaded', 400
        
        files = request.files.getlist('files[]')
        if not files or files[0].filename == '':
            return 'No files selected', 400

        # 結合するデータフレームのリスト
        dfs = []
        
        for file in files:
            if file and file.filename.endswith('.csv'):
                # CSVファイルを読み込む
                df = pd.read_csv(file)
                dfs.append(df)

        if not dfs:
            return 'No valid CSV files uploaded', 400

        # データフレームを結合
        combined_df = pd.concat(dfs, ignore_index=True)
        
        # メモリ上にCSVファイルを作成
        output = io.BytesIO()
        combined_df.to_csv(output, index=False, encoding='utf-8-sig')
        output.seek(0)
        
        return send_file(
            output,
            mimetype='text/csv',
            as_attachment=True,
            download_name='combined.csv'
        )

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
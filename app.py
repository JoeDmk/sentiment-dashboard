from flask import Flask, request, jsonify, render_template
from sentiment import analyze_sentiment

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()

    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    
    text = data['text']

    result = analyze_sentiment(text)
    return jsonify(result)

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "An internal error occurred. Please try again later."}), 500

if __name__ == '__main__':
    app.run(debug=True)


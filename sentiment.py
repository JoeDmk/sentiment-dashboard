from transformers import pipeline
import torch

device = 0 if torch.cuda.is_available() else -1

print("Loading sentiment analysis model...")
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment-latest",
    device=device
)
print("Model loaded successfully.")

LABEL_MAP = {
    "negative": "Negative",
    "neutral": "Neutral",
    "positive": "Positive"
}

def analyze_sentiment(text: str) -> dict:
    if not text or not text.strip():
        raise ValueError("Input text cannot be empty.")
    
    text = text[:512]

    results = sentiment_pipeline(text, top_k=None)
    
    dominant = max(results, key=lambda x: x['score'])
    dominant_label = LABEL_MAP.get(dominant['label'].lower(), dominant['label'])

    scores = {}
    for result in results:
        label = LABEL_MAP.get(result['label'].lower(), result['label'])
        scores[label] = round(result['score'] * 100, 2)

    return {
            "label": dominant_label,
            "confidence": round(dominant['score'] * 100, 2),
            "scores": scores
        }
    
if __name__ == "__main__":
    test = "I absolutely love this project! It exceeded all my expectations."
    print(analyze_sentiment(test))

print("Raw results:", results)
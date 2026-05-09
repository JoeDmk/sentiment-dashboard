# Sentiment.exe 🎛️

![Python](https://img.shields.io/badge/Python-3.11-b44fff?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-ff3aff?style=flat-square&logo=flask&logoColor=white)
![HuggingFace](https://img.shields.io/badge/HuggingFace-Transformers-00ffe7?style=flat-square&logo=huggingface&logoColor=white)

## Demo

<img width="1751" height="956" alt="image" src="https://github.com/user-attachments/assets/00e36675-2b9a-47c1-bfcd-736976369806" />

## What it does

A real-time sentiment analysis dashboard built with a synthwave aesthetic. Paste any text and get an instant breakdown of positive, neutral, and negative sentiment scores powered by a fine-tuned RoBERTa model from Cardiff NLP.

Built as a solo project to practice end-to-end ML deployment — from model inference to a production-style Flask API to an animated frontend.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Sentiment Model | `cardiffnlp/twitter-roberta-base-sentiment-latest` |
| Backend | Python, Flask |
| ML Library | HuggingFace Transformers, PyTorch |
| Frontend | HTML, CSS, Vanilla JS, Canvas API |
| Fonts | Audiowide, Fira Code |

## Features

- Real-time sentiment scoring across three classes: Positive, Neutral, Negative
- Animated neon bar chart with staggered reveal on each analysis
- Synthwave canvas background with perspective grid, floating particles, and ripple effects on result
- Analysis history with click-to-repopulate
- Character counter with warning threshold
- Copy result to clipboard

## Run locally

**Prerequisites:** Python 3.11+, Git

```bash
# Clone the repo
git clone https://github.com/JoeDmk/sentiment-dashboard.git
cd sentiment-dashboard

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate     # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py
```

Then open `http://127.0.0.1:5000` in your browser.

> The first run will download the RoBERTa model (~500MB). This is cached locally after the first download.

## Model

This project uses [`cardiffnlp/twitter-roberta-base-sentiment-latest`](https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment-latest), a RoBERTa-base model fine-tuned on ~124M tweets and updated with the latest Twitter data. It outputs three sentiment classes with confidence probabilities.

---

*Built by [Youssef Damak](https://linkedin.com/in/youssef-damak-711774396)*

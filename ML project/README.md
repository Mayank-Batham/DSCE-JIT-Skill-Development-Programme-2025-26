# 📸 Instagram Recommendation System

A **beginner-friendly**, educational machine-learning project that demonstrates how modern social-media recommendation systems work — from raw data generation to a complete two-stage feed ranking pipeline.

> Built as a team project: each module is self-contained and easy to read.

---

## 📁 Project Structure

```
ml/
│
├── app/
│   ├── api.py                     # FastAPI REST server
│   └── cli_demo.py                # Interactive terminal demo (graph-based)
│
├── data/
│   └── generate_data.py           # Generates synthetic Instagram data
│
├── evaluation/
│   └── metrics.py                 # RMSE, Precision@K, Recall@K, NDCG@K
│
├── models/
│   ├── content_based.py           # TF-IDF content-based recommender
│   ├── collaborative_filtering.py # Matrix Factorization with SGD
│   ├── graph_recommender.py       # Jaccard / Adamic-Adar / PPR follow suggestions
│   └── two_stage_recommender.py   # Candidate retrieval + RF ranking
│
├── requirements.txt
└── README.md                      # ← you are here
```

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
cd ml
pip install -r requirements.txt
```

### 2. Generate synthetic data

```bash
cd ml/data
python generate_data.py
```

This creates a `generated_data/` folder (inside `data/`) with four CSV files:

| File | Description |
|---|---|
| `users.csv` | 50 users with age and interest category |
| `posts.csv` | 200 posts with captions, hashtags, categories |
| `follows.csv` | Follower → following edges |
| `interactions.csv` | 1 000 user-post engagements (liked, commented, shared, dwell_time) |

### 3. Run the CLI demo (graph-based)

```bash
cd ml
python -m app.cli_demo
```

Choose from the interactive menu:
1. **Feed recommendations** — content-based stub
2. **Follow suggestions** — graph-based (Jaccard, Adamic-Adar, PPR)
3. **Run benchmark** — Precision@K / Recall@K for link prediction

### 4. Start the FastAPI server

```bash
cd ml
uvicorn app.api:app --reload
```

Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) for the interactive Swagger UI.

| Endpoint | Description |
|---|---|
| `GET /` | Health check |
| `GET /recommend/feed/{user_id}?top_k=5` | Content-based post recommendations |
| `GET /recommend/users/{user_id}` | Placeholder for graph-based user suggestions |

---

## 🧠 How Each Model Works

### Content-Based Filtering (`models/content_based.py`)

1. Combine each post's `caption` and `hashtags` into a single text field.
2. Build a **TF-IDF matrix** over all posts.
3. For a given user, average the TF-IDF vectors of posts they liked → **user profile**.
4. Compute **cosine similarity** between the user profile and every unseen post.
5. Return the top-K most similar posts.

**Cold-start fallback:** if a user has no likes, recommend posts matching their declared `interest` category.

---

### Collaborative Filtering (`models/collaborative_filtering.py`)

Uses **Bias-Aware Matrix Factorization** trained with **Stochastic Gradient Descent (SGD)**.

**Core idea:** represent every user and every post as a short vector of *K* latent factors. The predicted rating is:

```
r̂(u, i) = μ + b_u + b_i + P[u] · Q[i]
```

| Symbol | Meaning |
|---|---|
| μ | Global average rating |
| b_u | User bias (generous vs. harsh rater) |
| b_i | Item bias (universally popular post) |
| P[u] | User latent-factor vector (length K) |
| Q[i] | Item latent-factor vector (length K) |

**Training loop (SGD):**
1. For each known (user, post, rating):
   - Compute prediction error: `e = r − r̂`
   - Update biases: `b_u += lr * (e − λ·b_u)`
   - Update latent factors: `P[u] += lr * (e·Q[i] − λ·P[u])`
2. Repeat for *n_epochs*.

**Standalone test:**
```bash
cd ml
python -m models.collaborative_filtering
```

---

### Graph-Based Recommender (`models/graph_recommender.py`)

Suggests **users to follow** by analysing the social graph.

Three link-prediction signals are combined:

| Signal | Formula | Intuition |
|---|---|---|
| **Jaccard Coefficient** | \|N(u) ∩ N(v)\| / \|N(u) ∪ N(v)\| | Shared neighbours relative to total |
| **Adamic-Adar Index** | Σ 1/log(deg(w)) for common neighbours w | Rare shared neighbours count more |
| **Personalised PageRank** | PageRank with restart at user u | Global influence weighted toward u |

Scores are min-max normalised and combined with tunable weights `(0.3, 0.3, 0.4)`.

**Standalone test:**
```bash
cd ml
python -m models.graph_recommender
```

---

### Two-Stage Recommender (`models/two_stage_recommender.py`)

Mirrors real production systems (YouTube, Instagram, TikTok):

#### Stage 1 — Candidate Retrieval (~50 posts)

| Source | Count | Signal |
|---|---|---|
| Collaborative filtering | 15 | Predicted rating |
| Content-based | 15 | TF-IDF similarity |
| Followed users' posts | 10 | Social graph |
| Trending posts | 10 | Global popularity |

#### Stage 2 — Ranking (RandomForestClassifier)

For each candidate, compute **5 features**:

| # | Feature | Description |
|---|---|---|
| 1 | `content_similarity` | Cosine similarity to user profile |
| 2 | `collab_score` | CF predicted rating |
| 3 | `popularity` | Total like count |
| 4 | `recency` | Normalised post ID (higher = newer) |
| 5 | `category_match` | 1 if post category = user interest |

The classifier predicts **P(user will like this post)** and candidates are sorted by this probability.

**Standalone test:**
```bash
cd ml
python -m models.two_stage_recommender
```

---

## 📊 Evaluation (`evaluation/metrics.py`)

| Metric | What it measures |
|---|---|
| **RMSE** | Rating prediction accuracy (lower is better) |
| **Precision@K** | Fraction of top-K that are relevant |
| **Recall@K** | Fraction of relevant items found in top-K |
| **NDCG@K** | Ranking quality — relevant items higher up score more |

All formulas are implemented from scratch (no black-box calls) for learning purposes.

**Standalone test:**
```bash
cd ml
python -m evaluation.metrics
```

---

## 🗺️ Role of Each File

| File | Owner | Purpose |
|---|---|---|
| `data/generate_data.py` | Teammate | Synthetic data generation |
| `models/content_based.py` | Teammate | TF-IDF content similarity |
| `models/graph_recommender.py` | Teammate | Social graph link prediction |
| `app/api.py` | Teammate | FastAPI REST endpoints |
| `app/cli_demo.py` | Teammate | Interactive terminal demo |
| `models/collaborative_filtering.py` | **JAY** | Matrix factorization (SGD) |
| `models/two_stage_recommender.py` | **JAY** | Two-stage retrieval + ranking |
| `evaluation/metrics.py` | **JAY** | RMSE, P@K, R@K, NDCG@K |

---

## 📝 Notes

- **No frontend, database, Docker, or cloud deployment** — this is a pure ML learning project.
- All code prioritises **readability and teaching** over production optimisation.
- The generated data is small on purpose so everything runs in seconds on a laptop.

---

## 📚 Recommended Reading

1. Koren, Bell & Volinsky — *Matrix Factorization Techniques for Recommender Systems* (2009)
2. Covington, Adams & Sargin — *Deep Neural Networks for YouTube Recommendations* (2016)
3. Liben-Nowell & Kleinberg — *The Link-Prediction Problem for Social Networks* (2007)

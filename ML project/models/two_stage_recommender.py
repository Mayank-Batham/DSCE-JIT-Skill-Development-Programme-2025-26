"""
two_stage_recommender.py
========================
Simple two-stage recommendation pipeline.
  Stage 1: Retrieve ~50 candidate posts from multiple sources.
  Stage 2: Rank them with a RandomForestClassifier.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# ===================== Stage 1 — Candidate Retrieval =====================

def retrieve_candidates(user_id, cf_model, posts_df, interactions_df,
                        follows_df, tfidf_matrix, target=50):
    """Gather ~50 candidates from 4 sources, de-duplicate."""
    candidates = []

    # 1) Collaborative filtering top picks
    if cf_model is not None:
        candidates += cf_model.recommend_posts(user_id, top_k=15)

    # 2) Content-based: posts similar to what user liked
    liked = interactions_df[
        (interactions_df["user_id"] == user_id) & (interactions_df["liked"] == 1)
    ]["post_id"].unique()
    liked_idx = posts_df[posts_df["post_id"].isin(liked)].index
    if len(liked_idx) > 0:
        profile = np.asarray(tfidf_matrix[liked_idx].mean(axis=0)).reshape(1, -1)
        scores = cosine_similarity(profile, tfidf_matrix).flatten()
        order = scores.argsort()[::-1]
        for i in order:
            pid = posts_df.iloc[i]["post_id"]
            if pid not in liked:
                candidates.append(pid)
            if len(candidates) >= 30:
                break

    # 3) Posts from followed users
    followed = follows_df[follows_df["follower_id"] == user_id]["following_id"]
    follow_posts = posts_df[posts_df["creator_id"].isin(followed)]["post_id"]
    candidates += follow_posts.head(10).tolist()

    # 4) Trending (most-liked overall)
    trending = (interactions_df[interactions_df["liked"] == 1]
                .groupby("post_id").size()
                .sort_values(ascending=False)
                .head(10).index.tolist())
    candidates += trending

    # De-duplicate & trim
    seen, unique = set(), []
    for pid in candidates:
        if pid not in seen:
            seen.add(pid)
            unique.append(pid)
    return unique[:target]


# ===================== Stage 2 — Feature Engineering =====================

def _features(user_id, post_id, cf_model, posts_df,
              interactions_df, tfidf_matrix, users_df):
    """Build 5 simple features for one (user, post) pair."""
    # 1. Content similarity
    liked = interactions_df[
        (interactions_df["user_id"] == user_id) & (interactions_df["liked"] == 1)
    ]["post_id"].unique()
    liked_idx = posts_df[posts_df["post_id"].isin(liked)].index
    post_idx = posts_df[posts_df["post_id"] == post_id].index
    if len(liked_idx) > 0 and len(post_idx) > 0:
        profile = np.asarray(tfidf_matrix[liked_idx].mean(axis=0)).reshape(1, -1)
        content_sim = float(cosine_similarity(profile, tfidf_matrix[post_idx[0]].reshape(1, -1))[0, 0])
    else:
        content_sim = 0.0

    # 2. Collaborative score
    collab = cf_model.predict(user_id, post_id) if cf_model else 0.0
    collab = collab or 0.0

    # 3. Popularity (like count)
    popularity = int((interactions_df["post_id"] == post_id).sum())

    # 4. Recency (higher post_id = newer)
    max_pid = posts_df["post_id"].max()
    recency = post_id / max_pid if max_pid > 0 else 0.0

    # 5. Category match
    post_row = posts_df[posts_df["post_id"] == post_id]
    user_row = users_df[users_df["user_id"] == user_id]
    if not post_row.empty and not user_row.empty:
        cat_match = 1.0 if post_row.iloc[0]["category"] == user_row.iloc[0]["interest"] else 0.0
    else:
        cat_match = 0.0

    return [content_sim, collab, popularity, recency, cat_match]


def build_training_data(interactions_df, posts_df, users_df, cf_model, tfidf_matrix):
    """Create feature matrix X and label vector y from interactions."""
    X, y = [], []
    for _, row in interactions_df.iterrows():
        X.append(_features(row["user_id"], row["post_id"],
                           cf_model, posts_df, interactions_df, tfidf_matrix, users_df))
        y.append(int(row["liked"]))
    print(f"Training samples: {len(y)}  |  Positive rate: {np.mean(y):.0%}")
    return np.array(X), np.array(y)


def train_ranker(X, y):
    """Train a small RandomForest as the stage-2 ranker."""
    clf = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)
    clf.fit(X, y)
    print(f"Ranker train accuracy: {clf.score(X, y):.0%}")
    return clf


def rank_candidates(user_id, candidate_ids, ranker, cf_model,
                    posts_df, interactions_df, tfidf_matrix, users_df):
    """Score candidates and return sorted post IDs."""
    X = [_features(user_id, pid, cf_model, posts_df,
                   interactions_df, tfidf_matrix, users_df)
         for pid in candidate_ids]
    probas = ranker.predict_proba(np.array(X))[:, 1]
    ranked = sorted(zip(candidate_ids, probas), key=lambda x: x[1], reverse=True)
    return [pid for pid, _ in ranked]


def recommend_feed(user_id, ranker, cf_model, posts_df, interactions_df,
                   follows_df, users_df, tfidf_matrix, top_k=10):
    """Full pipeline: retrieve candidates → rank → return top-K."""
    candidates = retrieve_candidates(user_id, cf_model, posts_df,
                                     interactions_df, follows_df, tfidf_matrix)
    if not candidates:
        return []
    ranked = rank_candidates(user_id, candidates, ranker, cf_model,
                             posts_df, interactions_df, tfidf_matrix, users_df)
    return ranked[:top_k]


# ---------- Quick demo ----------

if __name__ == "__main__":
    from models.collaborative_filtering import CollaborativeFiltering

    users_df        = pd.read_csv("generated_data/users.csv")
    posts_df        = pd.read_csv("generated_data/posts.csv")
    interactions_df = pd.read_csv("generated_data/interactions.csv")
    follows_df      = pd.read_csv("generated_data/follows.csv")

    posts_df["text"] = posts_df["caption"].fillna("") + " " + posts_df["hashtags"].fillna("")
    tfidf_matrix = TfidfVectorizer(stop_words="english").fit_transform(posts_df["text"])

    cf = CollaborativeFiltering(n_factors=10, lr=0.005, reg=0.02, n_epochs=15)
    cf.fit(interactions_df)

    X, y = build_training_data(interactions_df, posts_df, users_df, cf, tfidf_matrix)
    ranker = train_ranker(X, y)

    feed = recommend_feed(1, ranker, cf, posts_df, interactions_df,
                          follows_df, users_df, tfidf_matrix, top_k=5)
    print(f"\nFeed for user 1: {feed}")

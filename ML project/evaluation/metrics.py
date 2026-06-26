"""
metrics.py
==========
Simple evaluation metrics for recommendation systems.
All implemented from scratch — no hidden library calls.
"""

import math
import random
import numpy as np
import pandas as pd


def rmse(y_true, y_pred):
    """Root Mean Squared Error."""
    t, p = np.asarray(y_true, float), np.asarray(y_pred, float)
    return float(np.sqrt(np.mean((t - p) ** 2))) if len(t) > 0 else 0.0


def precision_at_k(recommended, relevant, k):
    """Fraction of top-K that are relevant."""
    top_k = recommended[:k]
    relevant = set(relevant)
    return sum(1 for x in top_k if x in relevant) / k if k > 0 else 0.0


def recall_at_k(recommended, relevant, k):
    """Fraction of relevant items found in top-K."""
    top_k = recommended[:k]
    relevant = set(relevant)
    return sum(1 for x in top_k if x in relevant) / len(relevant) if relevant else 0.0


def ndcg_at_k(recommended, relevant, k):
    """Normalised Discounted Cumulative Gain at K."""
    relevant = set(relevant)
    top_k = recommended[:k]

    # DCG: sum of 1/log2(pos+1) for each hit
    dcg = sum(1.0 / math.log2(i + 2) for i, x in enumerate(top_k) if x in relevant)

    # Ideal DCG: best possible arrangement
    ideal_hits = min(len(relevant), k)
    idcg = sum(1.0 / math.log2(i + 2) for i in range(ideal_hits))

    return dcg / idcg if idcg > 0 else 0.0


def train_test_split_interactions(interactions_df, test_ratio=0.2, seed=42):
    """Split interactions per user into train/test sets."""
    rng = random.Random(seed)
    train, test = [], []

    for _, group in interactions_df.groupby("user_id"):
        idx = group.index.tolist()
        rng.shuffle(idx)
        n_test = max(1, int(len(idx) * test_ratio))
        test.extend(group.loc[idx[:n_test]].to_dict("records"))
        train.extend(group.loc[idx[n_test:]].to_dict("records"))

    return pd.DataFrame(train), pd.DataFrame(test)


def evaluate_model(model, test_df, k=5):
    """Run all metrics on a trained model against held-out data."""
    from models.collaborative_filtering import engagement_to_rating

    # Rating prediction → RMSE
    y_true, y_pred = [], []
    for _, row in test_df.iterrows():
        pred = model.predict(row["user_id"], row["post_id"])
        if pred is not None:
            true_r = row.get("rating")
            if true_r is None:
                true_r = engagement_to_rating(row)
            y_true.append(true_r)
            y_pred.append(pred)

    # Ranking metrics per user
    precs, recs, ndcgs = [], [], []
    user_relevant = test_df.groupby("user_id")["post_id"].apply(set).to_dict()

    for uid, rel in user_relevant.items():
        reco = model.recommend_posts(uid, top_k=k)
        if reco:
            precs.append(precision_at_k(reco, rel, k))
            recs.append(recall_at_k(reco, rel, k))
            ndcgs.append(ndcg_at_k(reco, rel, k))

    results = {
        "rmse":        round(rmse(y_true, y_pred), 4) if y_true else float("nan"),
        "precision@k": round(np.mean(precs), 4) if precs else 0.0,
        "recall@k":    round(np.mean(recs), 4)  if recs  else 0.0,
        "ndcg@k":      round(np.mean(ndcgs), 4) if ndcgs else 0.0,
    }

    print(f"Evaluation (K={k}):")
    for m, v in results.items():
        print(f"  {m:15s} = {v}")
    return results


# ---------- Quick demo ----------

if __name__ == "__main__":
    print("RMSE          :", rmse([4, 3, 5, 2], [3.5, 3.2, 4.8, 2.5]))
    print("Precision@5   :", precision_at_k([10, 20, 30, 40, 50], {20, 40, 60, 80}, 5))
    print("Recall@5      :", recall_at_k([10, 20, 30, 40, 50], {20, 40, 60, 80}, 5))
    print("NDCG@5        :", ndcg_at_k([10, 20, 30, 40, 50], {20, 40, 60, 80}, 5))

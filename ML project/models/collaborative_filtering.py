"""
collaborative_filtering.py
===========================
Simple Matrix Factorization using SGD (Stochastic Gradient Descent).

Predicted rating:  r̂(u,i) = global_mean + b_u + b_i + P[u] · Q[i]
"""

import numpy as np
import pandas as pd


# ---------- Helper: engagement columns → single 0-5 rating ----------

def engagement_to_rating(row):
    score = (2.0 * row["liked"]
             + 1.5 * row["commented"]
             + 1.0 * row["shared"]
             + 0.5 * row["dwell_time"] / 120.0)
    return min(max(score, 0.0), 5.0)


# ---------- Main class ----------

class CollaborativeFiltering:

    def __init__(self, n_factors=10, lr=0.005, reg=0.02, n_epochs=20):
        self.n_factors = n_factors
        self.lr = lr
        self.reg = reg
        self.n_epochs = n_epochs

    def fit(self, interactions_df):
        """Train on an interactions DataFrame."""
        df = interactions_df.copy()

        # Build ID ↔ index maps
        users = sorted(df["user_id"].unique())
        posts = sorted(df["post_id"].unique())
        self.uid_map = {uid: i for i, uid in enumerate(users)}
        self.pid_map = {pid: i for i, pid in enumerate(posts)}
        self.uid_rev = {i: uid for uid, i in self.uid_map.items()}
        self.pid_rev = {i: pid for pid, i in self.pid_map.items()}

        n_u, n_p = len(users), len(posts)

        # Compute ratings if not present
        if "rating" not in df.columns:
            df["rating"] = df.apply(engagement_to_rating, axis=1)

        # Initialise parameters
        self.mu = df["rating"].mean()                          # global bias
        self.b_u = np.zeros(n_u)                               # user biases
        self.b_i = np.zeros(n_p)                               # item biases
        rng = np.random.RandomState(42)
        self.P = rng.normal(0, 0.1, (n_u, self.n_factors))    # user factors
        self.Q = rng.normal(0, 0.1, (n_p, self.n_factors))    # item factors

        u_idx = df["user_id"].map(self.uid_map).values
        i_idx = df["post_id"].map(self.pid_map).values
        r_val = df["rating"].values

        # Cache seen posts per user (for recommend_posts)
        self.seen = df.groupby("user_id")["post_id"].apply(set).to_dict()

        # SGD training loop
        for epoch in range(1, self.n_epochs + 1):
            order = rng.permutation(len(r_val))
            sse = 0.0
            for idx in order:
                u, i, r = u_idx[idx], i_idx[idx], r_val[idx]
                pred = self.mu + self.b_u[u] + self.b_i[i] + self.P[u] @ self.Q[i]
                err = r - pred
                sse += err ** 2

                # Update biases
                self.b_u[u] += self.lr * (err - self.reg * self.b_u[u])
                self.b_i[i] += self.lr * (err - self.reg * self.b_i[i])

                # Update latent factors (save old P[u] first)
                old_pu = self.P[u].copy()
                self.P[u] += self.lr * (err * self.Q[i] - self.reg * self.P[u])
                self.Q[i] += self.lr * (err * old_pu    - self.reg * self.Q[i])

            if epoch % 5 == 0 or epoch == 1:
                print(f"  Epoch {epoch}/{self.n_epochs}  RMSE={np.sqrt(sse/len(r_val)):.4f}")

    def predict(self, user_id, post_id):
        """Predict rating for a single (user, post) pair."""
        u = self.uid_map.get(user_id)
        i = self.pid_map.get(post_id)
        if u is None or i is None:
            return None
        return float(self.mu + self.b_u[u] + self.b_i[i] + self.P[u] @ self.Q[i])

    def recommend_posts(self, user_id, top_k=5):
        """Return top-K unseen post IDs for a user."""
        u = self.uid_map.get(user_id)
        if u is None:
            return []

        scores = self.mu + self.b_u[u] + self.b_i + self.Q @ self.P[u]
        seen = self.seen.get(user_id, set())

        ranked = sorted(
            [(self.pid_rev[i], s) for i, s in enumerate(scores)
             if self.pid_rev[i] not in seen],
            key=lambda x: x[1], reverse=True
        )
        return [pid for pid, _ in ranked[:top_k]]


# ---------- Quick test ----------

if __name__ == "__main__":
    interactions_df = pd.read_csv("generated_data/interactions.csv")

    model = CollaborativeFiltering(n_factors=10, lr=0.005, reg=0.02, n_epochs=20)
    model.fit(interactions_df)

    uid = interactions_df["user_id"].iloc[0]
    pid = interactions_df["post_id"].iloc[0]
    print(f"\nPredicted rating  user={uid}, post={pid}: {model.predict(uid, pid):.3f}")
    print(f"Top-5 for user {uid}: {model.recommend_posts(uid, top_k=5)}")

"""
graph_recommender.py
====================
Graph-based recommendation engine using NetworkX.

Extracted from the teammate's Jupyter notebook.
Uses Jaccard Coefficient, Adamic-Adar Index, and
Personalized PageRank to suggest users to follow.
"""

import random
import math
import networkx as nx
import pandas as pd
import numpy as np

random.seed(42)
np.random.seed(42)

# ---------------------------------------------------------------------------
# Data Generation (self-contained, mirrors notebook cells)
# ---------------------------------------------------------------------------

N_USERS = 40
CATEGORIES = [
    'travel', 'fitness', 'food', 'tech', 'art',
    'music', 'fashion', 'gaming', 'nature', 'comedy'
]

users = []
for uid in range(N_USERS):
    n_interests = random.randint(1, 3)
    interests = random.sample(CATEGORIES, n_interests)
    users.append({
        'user_id': uid,
        'username': f'user_{uid:03d}',
        'interests': interests
    })

users_df = pd.DataFrame(users)


def shared_interest(u1, u2):
    a = set(users_df.loc[users_df.user_id == u1, 'interests'].values[0])
    b = set(users_df.loc[users_df.user_id == u2, 'interests'].values[0])
    return len(a & b) > 0


follow_edges = set()
for uid in range(N_USERS):
    n_follows = random.randint(3, 10)
    others = [u for u in range(N_USERS) if u != uid]
    weights = [3.0 if shared_interest(uid, o) else 1.0 for o in others]
    chosen = random.choices(others, weights=weights, k=min(n_follows, len(others)))
    for c in set(chosen):
        follow_edges.add((uid, c))

follows_df = pd.DataFrame(list(follow_edges), columns=['follower_id', 'followee_id'])

posts = []
post_id_counter = 0
for uid in range(N_USERS):
    interests = users_df.loc[users_df.user_id == uid, 'interests'].values[0]
    for _ in range(random.randint(2, 5)):
        posts.append({
            'post_id': post_id_counter,
            'author_id': uid,
            'category': random.choice(interests)
        })
        post_id_counter += 1

posts_df = pd.DataFrame(posts)

engagement = []
for _, post in posts_df.iterrows():
    viewers = random.sample(range(N_USERS), min(random.randint(2, 8), N_USERS))
    for v in viewers:
        if v == post['author_id']:
            continue
        likes = random.choice([0, 1])
        comments = random.choice([0, 0, 0, 1, 2])
        dwell_time = round(random.uniform(0, 60), 1)
        rating = min(20, likes * 8 + comments * 4 + (dwell_time / 60) * 8)
        engagement.append({
            'user_id': v,
            'post_id': post['post_id'],
            'likes': likes,
            'comments': comments,
            'dwell_time': dwell_time,
            'rating': round(rating, 2)
        })

engagement_df = pd.DataFrame(engagement)

# ---------------------------------------------------------------------------
# Build Social Graph
# ---------------------------------------------------------------------------

G = nx.DiGraph()
G.add_nodes_from(users_df['user_id'])
G.add_edges_from(follows_df[['follower_id', 'followee_id']].values)

# ---------------------------------------------------------------------------
# Graph Metrics
# ---------------------------------------------------------------------------


def get_neighbors(graph, node):
    return set(graph.successors(node)) | set(graph.predecessors(node))


def jaccard_coefficient(graph, u, v):
    nu, nv = get_neighbors(graph, u), get_neighbors(graph, v)
    union = nu | nv
    return len(nu & nv) / len(union) if union else 0.0


def adamic_adar_index(graph, u, v):
    common = get_neighbors(graph, u) & get_neighbors(graph, v)
    score = 0.0
    for w in common:
        deg = len(get_neighbors(graph, w))
        if deg > 1:
            score += 1.0 / math.log(deg)
    return score


def personalized_pagerank(graph, user, alpha=0.85):
    personalization = {n: 0.0 for n in graph.nodes()}
    personalization[user] = 1.0
    return nx.pagerank(graph, alpha=alpha, personalization=personalization)

# ---------------------------------------------------------------------------
# Scoring & Suggestion
# ---------------------------------------------------------------------------


def _normalize(d):
    if not d:
        return {}
    vals = list(d.values())
    lo, hi = min(vals), max(vals)
    if hi == lo:
        return {k: 0.0 for k in d}
    return {k: (v - lo) / (hi - lo) for k, v in d.items()}


def suggest_follows(graph, user_id, top_n=5, weights=(0.3, 0.3, 0.4)):
    already = set(graph.successors(user_id))
    candidates = [n for n in graph.nodes() if n != user_id and n not in already]

    jacc = {c: jaccard_coefficient(graph, user_id, c) for c in candidates}
    adar = {c: adamic_adar_index(graph, user_id, c) for c in candidates}
    ppr_full = personalized_pagerank(graph, user_id)
    ppr = {c: ppr_full.get(c, 0.0) for c in candidates}
    jacc_n, adar_n, ppr_n = _normalize(jacc), _normalize(adar), _normalize(ppr)
    w_j, w_a, w_p = weights

    scored = []
    for c in candidates:
        combined = w_j * jacc_n.get(c, 0) + w_a * adar_n.get(c, 0) + w_p * ppr_n.get(c, 0)
        scored.append({
            'user_id': c,
            'username': users_df.loc[users_df.user_id == c, 'username'].values[0],
            'jaccard': round(jacc[c], 4),
            'adamic_adar': round(adar[c], 4),
            'ppr': round(ppr[c], 6),
            'combined_score': round(combined, 4)
        })
    scored.sort(key=lambda x: x['combined_score'], reverse=True)
    return scored[:top_n]

# ---------------------------------------------------------------------------
# Stubs for content-based & collaborative filtering
# ---------------------------------------------------------------------------


def content_based_recommend_stub(user_id, top_n=5):
    interests = set(users_df.loc[users_df.user_id == user_id, 'interests'].values[0])
    candidates = posts_df[posts_df.author_id != user_id].copy()
    candidates['score'] = candidates['category'].apply(
        lambda c: round(random.uniform(0.6, 1.0), 3) if c in interests else round(random.uniform(0.0, 0.4), 3))
    return candidates.sort_values('score', ascending=False).head(top_n)[
        ['post_id', 'author_id', 'category', 'score']].to_dict('records')


def collaborative_filtering_predict_stub(user_id, top_n=5):
    seen = set(engagement_df.loc[engagement_df.user_id == user_id, 'post_id'])
    candidates = posts_df[(~posts_df.post_id.isin(seen)) & (posts_df.author_id != user_id)].copy()
    candidates['predicted_rating'] = [round(random.uniform(5, 20), 2) for _ in range(len(candidates))]
    return candidates.sort_values('predicted_rating', ascending=False).head(top_n)[
        ['post_id', 'author_id', 'predicted_rating']].to_dict('records')

# ---------------------------------------------------------------------------
# Evaluation helpers
# ---------------------------------------------------------------------------


def evaluate_link_prediction_methods(k=5, n_test_users=15, hide_fraction=0.3):
    test_users = [u for u in G.nodes() if G.out_degree(u) >= 2][:n_test_users]
    methods = ['jaccard', 'adamic_adar', 'ppr', 'combined']
    results = {m: {'p': 0.0, 'r': 0.0, 'n': 0} for m in methods}
    for u in test_users:
        out_edges = list(G.successors(u))
        hidden = set(random.sample(out_edges, max(1, int(len(out_edges) * hide_fraction))))
        if not hidden:
            continue
        G_test = G.copy()
        G_test.remove_edges_from([(u, h) for h in hidden])
        cands = [n for n in G_test.nodes() if n != u and n not in set(G_test.successors(u))]
        jacc = {c: jaccard_coefficient(G_test, u, c) for c in cands}
        adar = {c: adamic_adar_index(G_test, u, c) for c in cands}
        ppr = {c: personalized_pagerank(G_test, u).get(c, 0.0) for c in cands}
        jn, an, pn = _normalize(jacc), _normalize(adar), _normalize(ppr)
        comb = {c: 0.3 * jn.get(c, 0) + 0.3 * an.get(c, 0) + 0.4 * pn.get(c, 0) for c in cands}
        for m, scores in {'jaccard': jacc, 'adamic_adar': adar, 'ppr': ppr, 'combined': comb}.items():
            ranked = [c for c, _ in sorted(scores.items(), key=lambda x: x[1], reverse=True)[:k]]
            hits = len(set(ranked) & hidden)
            results[m]['p'] += hits / k
            results[m]['r'] += hits / len(hidden)
            results[m]['n'] += 1
    return [
        [m, round(results[m]['p'] / (results[m]['n'] or 1), 3),
         round(results[m]['r'] / (results[m]['n'] or 1), 3)]
        for m in methods
    ]


if __name__ == "__main__":
    print("Graph Recommender — quick test")
    recs = suggest_follows(G, user_id=0, top_n=5)
    for r in recs:
        print(r)

import pandas as pd
import numpy as np
import networkx as nx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sklearn.feature_extraction.text import TfidfVectorizer

# Import baseline models, evaluation tools, and dataframes
from models.content_based import recommend_posts, posts_df, users_df, interactions_df
from models.collaborative_filtering import CollaborativeFiltering
from models.two_stage_recommender import recommend_feed, build_training_data, train_ranker
import models.graph_recommender as gr

app = FastAPI(
    title="Instagram Recommendation System",
    description="Integrated recommendation API for feed posts and user suggestions.",
    version="1.0"
)

# Enable CORS for Vite frontend server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load graph follower data from CSV
follows_df = pd.read_csv("generated_data/follows.csv")

# Override graph_recommender's mock datasets to use generated_data
gr.users_df = users_df
gr.follows_df = follows_df
gr.G = nx.DiGraph()
gr.G.add_nodes_from(users_df["user_id"])
gr.G.add_edges_from(follows_df[["follower_id", "following_id"]].values)

# Setup content tfidf matrix
posts_df["text"] = posts_df["caption"].fillna("") + " " + posts_df["hashtags"].fillna("")
tfidf_vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = tfidf_vectorizer.fit_transform(posts_df["text"])

# Train CF model
cf_model = CollaborativeFiltering(n_factors=10, lr=0.005, reg=0.02, n_epochs=15)
cf_model.fit(interactions_df)

# Train Stage 2 Random Forest ranker
X, y = build_training_data(interactions_df, posts_df, users_df, cf_model, tfidf_matrix)
ranker_model = train_ranker(X, y)

def get_user_profile(user_id: int):
    """
    Formats user data matching the frontend User schema.
    """
    row = users_df[users_df["user_id"] == user_id]
    if row.empty:
        username = f"user_{user_id}"
        interest = "explore"
    else:
        username = row.iloc[0]["username"]
        interest = row.iloc[0]["interest"]
        
    return {
        "id": str(user_id),
        "username": username,
        "name": f"User {user_id}",
        "avatar": f"https://i.pravatar.cc/150?u={username}",
        "verified": user_id % 7 == 0,
        "bio": f"Passionate about {interest} ✨",
        "website": f"user{user_id}.com",
        "posts": int(posts_df[posts_df["creator_id"] == user_id].shape[0]),
        "followers": (user_id * 17) % 500 + 50,
        "following": int(follows_df[follows_df["follower_id"] == user_id].shape[0])
    }

def format_post(post_row):
    """
    Maps backend post dataframe rows into frontend Post types.
    """
    post_id = int(post_row["post_id"])
    creator_id = int(post_row["creator_id"])
    
    # Calculate actual likes from interactions or use deterministic hash fallback
    likes = int(interactions_df[(interactions_df["post_id"] == post_id) & (interactions_df["liked"] == 1)].shape[0])
    if likes == 0:
        likes = (post_id * 13) % 120 + 5
        
    caption = f"{post_row['caption']} {post_row['hashtags']}"
    
    return {
        "id": f"p{post_id}",
        "user": get_user_profile(creator_id),
        "image": f"https://picsum.photos/seed/post{post_id}/600/600",
        "caption": caption,
        "likes": likes,
        "comments": [
            {
                "id": f"c_{post_id}_1",
                "user": get_user_profile((creator_id + 1) % 50 + 1),
                "text": "Stunning shot! 🔥"
            },
            {
                "id": f"c_{post_id}_2",
                "user": get_user_profile((creator_id + 2) % 50 + 1),
                "text": "Love this vibe!"
            }
        ],
        "time": f"{(post_id % 12) + 1}h ago"
    }

@app.get("/")
def home():
    return {
        "message": "Instagram Recommendation System API is running successfully!"
    }

@app.get("/users")
def list_users():
    """
    Returns list of all users in the system (for frontend switcher).
    """
    return [get_user_profile(int(uid)) for uid in users_df["user_id"]]

@app.get("/user/{user_id}")
def get_user(user_id: int):
    """
    Returns profile information for a user.
    """
    if user_id not in users_df["user_id"].values:
        raise HTTPException(status_code=404, detail="User not found")
    return get_user_profile(user_id)

@app.get("/user/{user_id}/posts")
def get_user_posts(user_id: int):
    """
    Returns list of posts authored by a user.
    """
    if user_id not in users_df["user_id"].values:
        raise HTTPException(status_code=404, detail="User not found")
        
    creator_posts = posts_df[posts_df["creator_id"] == user_id]
    return [format_post(row) for _, row in creator_posts.iterrows()]

@app.get("/recommend/feed/{user_id}")
def recommend_feed_endpoint(user_id: int, top_k: int = 10):
    """
    Serves personalized feeds using the Two-Stage Ranker pipeline.
    """
    if user_id not in users_df["user_id"].values:
        raise HTTPException(status_code=404, detail="User not found")
        
    recommended_post_ids = recommend_feed(
        user_id, ranker_model, cf_model, posts_df, interactions_df,
        follows_df, users_df, tfidf_matrix, top_k=top_k
    )
    
    recommendations = []
    for post_id in recommended_post_ids:
        post_row = posts_df[posts_df["post_id"] == post_id].iloc[0]
        recommendations.append(format_post(post_row))
        
    return {
        "user_id": user_id,
        "total_recommendations": len(recommendations),
        "recommendations": recommendations
    }

@app.get("/recommend/users/{user_id}")
def recommend_users_endpoint(user_id: int, top_k: int = 5):
    """
    Returns follow recommendations based on Jaccard, Adamic-Adar, and PPR.
    """
    if user_id not in users_df["user_id"].values:
        raise HTTPException(status_code=404, detail="User not found")
        
    suggestions = gr.suggest_follows(gr.G, user_id, top_n=top_k)
    
    formatted = []
    for s in suggestions:
        formatted.append({
            "user": get_user_profile(int(s["user_id"])),
            "reason": f"Suggested (Score: {s['combined_score']:.2f})"
        })
        
    return {
        "user_id": user_id,
        "suggestions": formatted
    }

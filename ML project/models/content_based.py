import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

users_df = pd.read_csv("generated_data/users.csv")
posts_df = pd.read_csv("generated_data/posts.csv")
interactions_df = pd.read_csv("generated_data/interactions.csv")

posts_df["text"] = (
    posts_df["caption"].fillna("") +
    " " +
    posts_df["hashtags"].fillna("")
)

vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(posts_df["text"])

def recommend_posts(user_id, top_k=5):
    """
    Recommend posts based on the content of posts
    previously liked by the user.

    Cold-start users receive recommendations based
    on their declared interest category.
    """

    liked = interactions_df[
        (interactions_df["user_id"] == user_id) &
        (interactions_df["liked"] == 1)
    ]

    if liked.empty:

        interest_series = users_df.loc[
            users_df["user_id"] == user_id,
            "interest"
        ]

        if interest_series.empty:
            return []

        interest = interest_series.iloc[0]

        recommendations = posts_df[
            posts_df["category"] == interest
        ].head(top_k)

        return recommendations["post_id"].tolist()

    liked_post_ids = liked["post_id"].unique().tolist()

    liked_indices = posts_df[
        posts_df["post_id"].isin(liked_post_ids)
    ].index

    if len(liked_indices) == 0:
        return []

    liked_vectors = tfidf_matrix[liked_indices]

    user_profile = np.asarray(
        liked_vectors.mean(axis=0)
    ).reshape(1, -1)

    similarity_scores = cosine_similarity(
        user_profile,
        tfidf_matrix
    ).flatten()

    recommendations = posts_df.copy()

    recommendations["score"] = similarity_scores

    recommendations = recommendations[
        ~recommendations["post_id"].isin(liked_post_ids)
    ]

    recommendations = recommendations.sort_values(
        by="score",
        ascending=False
    )

    return recommendations.head(top_k)["post_id"].tolist()


if __name__ == "__main__":

    user_id = 1

    recommended_posts = recommend_posts(user_id)

    print("=" * 50)
    print(f"Top Recommendations for User {user_id}")
    print("=" * 50)

    if not recommended_posts:
        print("No recommendations found.")

    else:

        for post_id in recommended_posts:

            post = posts_df[
                posts_df["post_id"] == post_id
            ].iloc[0]

            print(f"\nPost ID   : {post['post_id']}")
            print(f"Category  : {post['category']}")
            print(f"Caption   : {post['caption']}")
            print(f"Hashtags  : {post['hashtags']}")

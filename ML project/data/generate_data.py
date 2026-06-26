import pandas as pd
import random
import os

NUM_USERS = 50
NUM_POSTS = 200
NUM_INTERACTIONS = 1000

INTERESTS = [
    "tech",
    "travel",
    "food",
    "sports",
    "fashion",
    "art",
    "music",
    "fitness"
]

CAPTIONS = {
    "tech": "Exploring the latest AI innovations!",
    "travel": "A beautiful journey across the mountains.",
    "food": "Trying an amazing homemade recipe today.",
    "sports": "Training hard for the next competition.",
    "fashion": "Today's outfit inspiration.",
    "art": "Creating colorful digital artwork.",
    "music": "Enjoying my favorite playlist.",
    "fitness": "Morning workout completed successfully."
}

OUTPUT_FOLDER = "generated_data"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

users = []

for user_id in range(1, NUM_USERS + 1):

    users.append({
        "user_id": user_id,
        "username": f"user_{user_id}",
        "age": random.randint(18, 35),
        "interest": random.choice(INTERESTS)
    })

users_df = pd.DataFrame(users)

posts = []

for post_id in range(1, NUM_POSTS + 1):

    category = random.choice(INTERESTS)

    posts.append({
        "post_id": post_id,
        "creator_id": random.randint(1, NUM_USERS),
        "caption": CAPTIONS[category],
        "hashtags": f"#{category} #trending #explore #instagram",
        "category": category
    })

posts_df = pd.DataFrame(posts)

follows = []

for follower in users:

    follower_id = follower["user_id"]
    follower_interest = follower["interest"]

   
    similar_users = [
        user for user in users
        if user["interest"] == follower_interest
        and user["user_id"] != follower_id
    ]

    if similar_users:
        selected_users = random.sample(
            similar_users,
            min(3, len(similar_users))
        )

        for followed in selected_users:

            follows.append({
                "follower_id": follower_id,
                "following_id": followed["user_id"]
            })

follows_df = pd.DataFrame(follows)

interactions = []

for _ in range(NUM_INTERACTIONS):

    interactions.append({
        "user_id": random.randint(1, NUM_USERS),
        "post_id": random.randint(1, NUM_POSTS),

        "liked": random.choice([0, 1]),
        "commented": random.choice([0, 1]),
        "shared": random.choice([0, 1]),
        "dwell_time": random.randint(5, 120)
    })

interactions_df = pd.DataFrame(interactions)

users_df.to_csv(
    os.path.join(OUTPUT_FOLDER, "users.csv"),
    index=False
)

posts_df.to_csv(
    os.path.join(OUTPUT_FOLDER, "posts.csv"),
    index=False
)

follows_df.to_csv(
    os.path.join(OUTPUT_FOLDER, "follows.csv"),
    index=False
)

interactions_df.to_csv(
    os.path.join(OUTPUT_FOLDER, "interactions.csv"),
    index=False
)

print("  ")
print(" Synthetic Instagram Data Generated")
print("  ")
print(f"Users         : {len(users_df)}")
print(f"Posts         : {len(posts_df)}")
print(f"Follows       : {len(follows_df)}")
print(f"Interactions  : {len(interactions_df)}")
print()
print(f"Files saved in '{OUTPUT_FOLDER}' folder.")

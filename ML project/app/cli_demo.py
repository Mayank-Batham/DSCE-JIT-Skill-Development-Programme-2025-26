"""
cli_demo.py
===========
Interactive CLI demo extracted from the teammate's notebook.
Provides feed recommendations, follow suggestions, and benchmark.
"""

from models.graph_recommender import (
    users_df, posts_df, engagement_df, G, N_USERS,
    suggest_follows, content_based_recommend_stub,
    jaccard_coefficient, adamic_adar_index,
    personalized_pagerank, _normalize,
    evaluate_link_prediction_methods
)


# ---------------------------------------------------------------------------
# Pretty-print helper
# ---------------------------------------------------------------------------

def print_ascii_table(headers, rows):
    if not rows:
        print("(no data)")
        return
    str_rows = [[str(c) for c in row] for row in rows]
    widths = [len(h) for h in headers]
    for row in str_rows:
        for i, c in enumerate(row):
            widths[i] = max(widths[i], len(c))

    def fmt(cells):
        return "| " + " | ".join(c.ljust(widths[i]) for i, c in enumerate(cells)) + " |"

    sep = "+-" + "-+-".join("-" * w for w in widths) + "-+"
    print(sep)
    print(fmt(headers))
    print(sep)
    for row in str_rows:
        print(fmt(row))
    print(sep)


# ---------------------------------------------------------------------------
# Display functions
# ---------------------------------------------------------------------------

def show_feed_recommendations(user_id, top_n=5):
    uname = users_df.loc[users_df.user_id == user_id, 'username'].values[0]
    print(f"\nTop {top_n} feed recommendations for {uname}:")
    recs = content_based_recommend_stub(user_id, top_n)
    print_ascii_table(
        ['post_id', 'author_id', 'category', 'score'],
        [[r['post_id'], r['author_id'], r['category'], r['score']] for r in recs]
    )


def show_follow_suggestions(user_id, top_n=5):
    uname = users_df.loc[users_df.user_id == user_id, 'username'].values[0]
    print(f"\nTop {top_n} accounts to follow for {uname}:")
    recs = suggest_follows(G, user_id, top_n)
    print_ascii_table(
        ['user_id', 'username', 'jaccard', 'adamic_adar', 'ppr', 'combined_score'],
        [[r['user_id'], r['username'], r['jaccard'], r['adamic_adar'],
          r['ppr'], r['combined_score']] for r in recs]
    )


def run_benchmark(k=5):
    print(f"\nBenchmark: Precision@{k} / Recall@{k}")
    print_ascii_table(
        ['method', f'precision@{k}', f'recall@{k}'],
        evaluate_link_prediction_methods(k=k)
    )


# ---------------------------------------------------------------------------
# Interactive menu
# ---------------------------------------------------------------------------

def interactive_cli():
    print('=== Instagram Recommendation System CLI Demo ===')
    while True:
        print('\nMenu:\n  1) Feed recommendations\n  2) Follow suggestions\n  3) Run benchmark\n  4) Exit')
        choice = input('Choose (1-4): ').strip()
        if choice == '4':
            print('Goodbye!')
            break
        elif choice in ('1', '2'):
            uid_str = input(f'user_id (0-{N_USERS - 1}): ').strip()
            if not uid_str.isdigit() or int(uid_str) not in range(N_USERS):
                print('Invalid user_id.')
                continue
            uid = int(uid_str)
            if choice == '1':
                show_feed_recommendations(uid)
            else:
                show_follow_suggestions(uid)
        elif choice == '3':
            run_benchmark()
        else:
            print('Invalid option.')


if __name__ == "__main__":
    interactive_cli()

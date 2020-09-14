from newspaper import Article


def handle(event, context):
    url = event.query['url']

    article = Article(url)
    article.download()
    article.parse()

    result = {
        "text": article.text,
        "description": article.meta_data["og"].get("description"),
        "meta_data": article.meta_data,
        "title": article.title,
        "image": article.top_image,
        "url": url
    }

    return {
        "statusCode": 200,
        "body": result
    }

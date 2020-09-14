from PIL import Image
import requests
from io import BytesIO
from flask import send_file


def handle(event, context):
    response = requests.get(
        "https://thumbs.mskog.com/150x150/filters:still()/https://a.thumbs.redditmedia.com/ITCEHqP6MinHV9KTCi4K-CRfhObYBvddkbhPJZKyUP4.jpg")
    img = Image.open(BytesIO(response.content))

    img_io = BytesIO()
    img.save(img_io, 'JPEG', quality=70)
    img_io.seek(0)

    return {
        "headers": {'Content-Type': 'image/jpeg'},
        "statusCode": 200,
        "body": img_io.read()
    }

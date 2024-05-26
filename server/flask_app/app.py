from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import numpy as np
import pandas as pd
import cv2
from skimage import io
import tensorflow as tf
import tensorflow_hub as hub

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"
m = hub.KerasLayer(
    "https://www.kaggle.com/models/google/aiy/TensorFlow1/vision-classifier-food-v1/1"
)

labelmap_url = "https://www.gstatic.com/aihub/tfhub/labelmaps/aiy_food_V1_labelmap.csv"
input_shape = (224, 224)

 
@app.route("/predict",  methods=["POST"])
@cross_origin()
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image sent."}), 400

    image_file = request.files["image"]
    image = np.asarray(io.imread(image_file), dtype="float")
    image = cv2.resize(image, dsize=input_shape, interpolation=cv2.INTER_CUBIC)
    # Scale values to [0, 1].
    image = image / image.max()
    # The model expects an input of (?, 224, 224, 3).
    images = np.expand_dims(image, 0)
    # This assumes you're using TF2.
    output = m(images)
    predicted_index = output.numpy().argmax()
    classes = list(pd.read_csv(labelmap_url)["name"])
    prediction = classes[predicted_index]

    return jsonify({"prediction": prediction}), 200


if __name__ == "__main__":
    app.run(host='localhost', port=5000)

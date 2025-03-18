from flask import Flask, jsonify, request
from flask_cors import CORS
import tensorflow as tf
import numpy as np
#import logging
from io import BytesIO

# logging.basicConfig(
#     level=logging.DEBUG,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
# )
# logger = logging.getLogger(__name__)

app = Flask(__name__)
cors = CORS(app, origins=["http://localhost:3000"])
# logger.info("Line 15 Passed")
model = tf.keras.models.load_model("dog_cat_model_improvement4.keras")

def preprocess_image(file):
    # logger.info("Line 19 Passed")
    img_bytes = file.read()
    # logger.debug(f"Read {len(img_bytes)} bytes from file")
    if not img_bytes:
        raise ValueError("No bytes read from file")
    img = tf.keras.utils.load_img(BytesIO(img_bytes), target_size=(256, 256))
    # logger.debug("Loaded image")
    img_array = tf.keras.utils.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    # logger.info("Line 23 Passed")
    return img_array

@app.route("/api/upload", methods=["POST"])
def dogorcat():
    file = request.files["file"]
    if not file:
        return jsonify({"error":"No file provided"}), 400
    try:
        # logger.info("Starting preprocessing")
        preprocessed_image = preprocess_image(file)
        # logger.info("Preprocessing passed correctly, Line 33")
        prediction = model.predict(preprocessed_image)[0][0]
        # logger.info("Got prediction correctly, line 35")
        result = "Dog" if prediction >= 0.5 else "Cat"
        probability = float(prediction)
        return jsonify({"result": result, "probability":probability})
    except Exception as e:
        # logger.error(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=False, port=8080)
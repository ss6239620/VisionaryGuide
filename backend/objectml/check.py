import cv2
import numpy as np
import threading
import time

# Load YOLOv3 weights and configuration
config_path = "./objectml/cfg/yolov3.cfg"
weights_path = "./objectml/weights/yolov3.weights"
net = cv2.dnn.readNet(weights_path, config_path)

with open("./objectml/data/coco.names", "r") as f:
    classes = f.read().strip().split("\n")

# Initialize the camera or video feed
# Initialize a lock for thread synchronization
lock = threading.Lock()

# Initialize variables for object detection results
objects = []
frames = []
checker=''

temp = True

# Define the frame skip interval
frame_skip_interval = 5  # Process every nth frame

def detect_objects():
    cap = cv2.VideoCapture('rtmp://localhost:1935/live/check')  # You may need to adjust the camera index

    global objects
    global height, width
    frame_counter = 0
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        height, width = frame.shape[:2]
        frames.append(frame)
        frame_counter += 1

        # Skip frames if needed
        if frame_counter % frame_skip_interval != 0:
            continue

        # Prepare the frame for object detection
        blob = cv2.dnn.blobFromImage(frame, 1/255.0, (416, 416), swapRB=True, crop=False)
        net.setInput(blob)

        # Perform object detection
        outs = net.forward(net.getUnconnectedOutLayersNames())

        # Store the object detection results
        objects.append(outs)

object_detection_thread = threading.Thread(target=detect_objects)
object_detection_thread.daemon = True
object_detection_thread.start()

def check():
    return direction

def main():
    print('starting...')
    global direction
    temp=True
    while True:
        with lock:
            # Get the latest object detection results
            if objects:
                local_detections = objects.pop(0)
            else:
                local_detections = []

        class_ids = []
        confidences = []
        boxes = []

        # Define minimum confidence threshold and NMS threshold
        confidence_threshold = 0.5
        nms_threshold = 0.4

        for out in local_detections:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]

                if confidence > confidence_threshold:
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)

                    # Calculate bounding box coordinates
                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)

                    class_ids.append(class_id)
                    confidences.append(float(confidence))
                    boxes.append([x, y, w, h])

        # Apply non-maximum suppression to remove redundant boxes
        indices = cv2.dnn.NMSBoxes(boxes, confidences, confidence_threshold, nms_threshold)

        # Initialize collision avoidance decision
        direction = "FORWARD"

        # Iterate over the filtered boxes
        for i in indices:
            box = boxes[i]
            x, y, w, h = box
            class_id = class_ids[i]
            label = classes[class_id]

            # Calculate the center of the detected object
            object_center_x = x + w / 2

            # Calculate the relative position of the object
            relative_position = object_center_x / width

            # Adjust the direction based on the object's position
            if relative_position < 0.4:
                direction = "HARD LEFT"
            elif relative_position < 0.45:
                direction = "LEFT"
            elif relative_position > 0.6:
                direction = "HARD RIGHT"
            elif relative_position > 0.55:
                direction = "RIGHT"


        # Display the collision avoidance direction
        if temp:
            time.sleep(5)

        for frame in frames:
            cv2.putText(frame, f"Direction: {direction}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

            # Display the result
            cv2.imshow("Object Detection", frame)

        # Exit the loop if 'q' is pressed
        temp = False
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break


# main()
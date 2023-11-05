import cv2
import pytesseract
from PIL import Image

def extract_text_from_video_frame():
    vidcap = cv2.VideoCapture('rtmp://localhost:1935/live/check')
    
    # Skip to the desired frame
    vidcap.set(cv2.CAP_PROP_POS_FRAMES, 10)

    success, frame = vidcap.read()
    print('starting...')
    
    if success:
        # Convert the frame to grayscale (Tesseract works better with grayscale images)
        frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Use OpenCV to convert the frame to a format Tesseract can process
        _, frame_binary = cv2.threshold(frame_gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Use Tesseract to extract text from the frame
        text = pytesseract.image_to_string(frame_binary)
        
        print("Extracted text from the frame:")
        print(text)
    else:
        print("Frame not found or unable to process.")

    vidcap.release()

    return text


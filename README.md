# Hatheq - ADHD Gaze Tracking System

Overview

a Computer Vision-based system designed to monitor eye gaze and analyze attention levels.
The project aims to assist in identifying focus patterns that may relate to ADHD behavior.

---

## Key Features

*  Real-time gaze tracking
*  Attention analysis
*  ADHD behavior indication (basic inference)
*  Full-stack application (Frontend + Backend)
*  Docker support for easy deployment

---

##  System Architecture

* **Frontend:** User interface for visualization
* **Backend:** Handles gaze tracking & processing
* **Model:** Eye tracking logic using computer vision

---

##  Tech Stack

* Python (OpenCV, NumPy)
* JavaScript (Frontend)
* Docker & Docker Compose

---

##  Installation & Setup

###  Option 1: using Docker (Recommended)

```bash
docker-compose up --build
```

---

###  Option 2: Manual Setup

#### Backend:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### Frontend:

```bash
cd frontend
npm install
npm run dev
```

---

##  Demo / Screenshots

> <img width="773" height="711" alt="image" src="https://github.com/user-attachments/assets/2144304a-af3a-42ae-a6c9-407e77a9a8a0" />
> <img width="646" height="638" alt="image" src="https://github.com/user-attachments/assets/75c41cf8-5fbb-4b07-9e8f-a0c70a5aaad4" />


---

##  How It Works

1. Capture video input from camera
2. Detect eyes using computer vision
3. Track gaze direction
4. Analyze attention patterns

---

##  Future Improvements

*  Use Deep Learning models
*  Improve accuracy
*  Mobile support
*  Add dataset training

---

##  Author

**Nehal Kamal & teammates in graduation project**

---

##  Notes

This project is for educational purposes and demonstrates practical use of Computer Vision in real-world problems.
[Hatheq Book.pdf](https://github.com/user-attachments/files/27125693/Hatheq.Book.pdf)


import os
import tempfile
import time
from pathlib import Path

import google.generativeai as genai
import streamlit as st
from dotenv import load_dotenv

load_dotenv()

# Support both Streamlit Cloud secrets and local .env
GEMINI_API_KEY = (
    st.secrets.get("GEMINI_API_KEY")
    if hasattr(st, "secrets")
    else None
) or os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-1.5-flash"

SUPPORTED_EXTENSIONS = {".mp4", ".mov", ".avi", ".webm", ".mkv", ".mpeg", ".mpg", ".3gp", ".wmv", ".flv"}

MIME_TYPES = {
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".avi": "video/x-msvideo",
    ".webm": "video/webm",
    ".mkv": "video/x-matroska",
    ".mpeg": "video/mpeg",
    ".mpg": "video/mpeg",
    ".3gp": "video/3gpp",
    ".wmv": "video/x-ms-wmv",
    ".flv": "video/x-flv",
}

ANALYSIS_PROMPT = (
    "Please provide a comprehensive analysis of this video. Include:\n"
    "1. Overall summary and narrative arc\n"
    "2. Key subjects, people, or objects visible\n"
    "3. Notable scenes, actions, or events with approximate timestamps\n"
    "4. Setting, environment, and visual style\n"
    "5. Any visible text, titles, or graphics\n"
    "6. Key takeaways or themes"
)


def init_session_state():
    defaults = {
        "messages": [],
        "video_analysis": None,
        "analysis_complete": False,
        "chat_session": None,
    }
    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value


def upload_and_wait(video_path: str, mime_type: str):
    """Upload video to Gemini File API and wait until processing is complete."""
    video_file = genai.upload_file(path=video_path, mime_type=mime_type)

    # Poll until the file is ready (usually a few seconds)
    while video_file.state.name == "PROCESSING":
        time.sleep(2)
        video_file = genai.get_file(video_file.name)

    if video_file.state.name == "FAILED":
        raise ValueError("Gemini failed to process the video file.")

    return video_file


def analyze_video_with_gemini(video_path: str, mime_type: str) -> tuple[str, object]:
    """Upload video, analyze it, and return (analysis_text, video_file)."""
    video_file = upload_and_wait(video_path, mime_type)

    model = genai.GenerativeModel(MODEL_NAME)
    response = model.generate_content(
        [video_file, ANALYSIS_PROMPT],
        request_options={"timeout": 120},
    )
    return response.text, video_file


def start_chat_session(video_file, analysis: str):
    """Start a Gemini chat session with video + analysis as context."""
    model = genai.GenerativeModel(
        MODEL_NAME,
        system_instruction=(
            "You are a helpful assistant answering questions about a video. "
            "You have access to the full video and the following pre-generated analysis:\n\n"
            f"{analysis}\n\n"
            "Use both the video and the analysis to answer questions accurately. "
            "If a question cannot be answered from the video, say so clearly."
        ),
    )
    # Seed the history with the video so the model can reference it
    chat = model.start_chat(history=[
        {"role": "user", "parts": [video_file, "I've shared this video with you for reference."]},
        {"role": "model", "parts": ["Got it! I've reviewed the video and I'm ready to answer your questions."]},
    ])
    return chat


def main():
    st.set_page_config(
        page_title="Video Analysis with Gemini",
        page_icon="🎬",
        layout="wide",
    )

    init_session_state()

    st.title("Video Analysis Assistant")
    st.caption("Upload a video — Gemini analyzes it natively, then you can ask questions about it.")

    if not GEMINI_API_KEY:
        st.error(
            "**Missing API key.** Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey). "
            "On Streamlit Cloud: go to **Manage app → Secrets** and add "
            "`GEMINI_API_KEY = \"your-key-here\"`. Locally: set it in a `.env` file."
        )
        st.stop()

    # --- Section 1: Upload ---
    st.header("1. Upload Video")

    valid_types = [ext.lstrip(".") for ext in SUPPORTED_EXTENSIONS]
    uploaded_file = st.file_uploader(
        "Choose a video file",
        type=valid_types,
        help=f"Supported formats: {', '.join(sorted(valid_types)).upper()}",
    )

    analyze_button = st.button(
        "Analyze Video",
        disabled=(uploaded_file is None),
        type="primary",
    )

    if analyze_button and uploaded_file is not None:
        st.session_state.analysis_complete = False
        st.session_state.video_analysis = None
        st.session_state.messages = []
        st.session_state.chat_session = None

        suffix = Path(uploaded_file.name).suffix.lower() or ".mp4"
        mime_type = MIME_TYPES.get(suffix, "video/mp4")
        tmp_path = None
        try:
            with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp_file:
                tmp_file.write(uploaded_file.getvalue())
                tmp_path = tmp_file.name

            with st.spinner("Uploading video and analyzing with Gemini... This may take a moment."):
                analysis, video_file = analyze_video_with_gemini(tmp_path, mime_type)
                chat = start_chat_session(video_file, analysis)

            st.session_state.video_analysis = analysis
            st.session_state.chat_session = chat
            st.session_state.analysis_complete = True
            st.success("Analysis complete! Scroll down to ask questions.")

        except ValueError as e:
            st.error(f"Video error: {e}")
        except Exception as e:
            st.error(f"Error: {e}")
        finally:
            if tmp_path and os.path.exists(tmp_path):
                os.unlink(tmp_path)

    # --- Section 2: Analysis ---
    if st.session_state.analysis_complete and st.session_state.video_analysis:
        st.header("2. Gemini's Video Analysis")
        with st.expander("View Full Analysis", expanded=True):
            st.markdown(st.session_state.video_analysis)

        st.divider()

        # --- Section 3: Chat ---
        st.header("3. Ask Questions About the Video")
        st.caption("Gemini has the full video and analysis as context for every answer.")

        for msg in st.session_state.messages:
            with st.chat_message(msg["role"]):
                st.markdown(msg["content"])

        user_input = st.chat_input(
            "Ask something about the video...",
            disabled=not st.session_state.analysis_complete,
        )

        if user_input:
            with st.chat_message("user"):
                st.markdown(user_input)

            with st.chat_message("assistant"):
                with st.spinner("Thinking..."):
                    try:
                        response = st.session_state.chat_session.send_message(user_input)
                        reply = response.text
                        st.markdown(reply)
                        st.session_state.messages.append({"role": "user", "content": user_input})
                        st.session_state.messages.append({"role": "assistant", "content": reply})
                    except Exception as e:
                        st.error(f"Error: {e}")


if __name__ == "__main__":
    main()

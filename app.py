import base64
import os
import tempfile
from pathlib import Path

import anthropic
import cv2
import streamlit as st
from dotenv import load_dotenv

load_dotenv()

# Support both Streamlit Cloud secrets and local .env
ANTHROPIC_API_KEY = (
    st.secrets.get("ANTHROPIC_API_KEY")
    if hasattr(st, "secrets")
    else None
) or os.getenv("ANTHROPIC_API_KEY")
client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None

MAX_FRAMES = 20
FRAME_WIDTH = 1280
JPEG_QUALITY = 85

SUPPORTED_EXTENSIONS = {".mp4", ".mov", ".avi", ".webm", ".mkv", ".mpeg", ".mpg", ".3gp", ".wmv", ".flv"}

ANALYSIS_PROMPT = (
    "Please provide a comprehensive analysis of this video based on the sampled frames above. Include:\n"
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
    }
    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value


def extract_frames(video_path: str) -> tuple[list[tuple[float, str]], float]:
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    duration = total_frames / fps if fps > 0 else 0

    num_frames = min(MAX_FRAMES, total_frames)
    if num_frames == 0:
        cap.release()
        raise ValueError("Could not read any frames from the video file.")

    frame_indices = [int(i * total_frames / num_frames) for i in range(num_frames)]

    frames = []
    for idx in frame_indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if not ret:
            continue
        timestamp = idx / fps

        h, w = frame.shape[:2]
        if w > FRAME_WIDTH:
            scale = FRAME_WIDTH / w
            frame = cv2.resize(frame, (FRAME_WIDTH, int(h * scale)))

        _, buffer = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, JPEG_QUALITY])
        b64 = base64.b64encode(buffer).decode("utf-8")
        frames.append((timestamp, b64))

    cap.release()

    if not frames:
        raise ValueError("No frames could be extracted from the video.")

    return frames, duration


def analyze_video_with_claude(video_path: str) -> str:
    frames, duration = extract_frames(video_path)

    mins = int(duration // 60)
    secs = int(duration % 60)
    duration_str = f"{mins}:{secs:02d}"

    content = []
    for i, (timestamp, b64) in enumerate(frames):
        ts_mins = int(timestamp // 60)
        ts_secs = int(timestamp % 60)
        content.append({
            "type": "text",
            "text": f"**Frame {i + 1} — {ts_mins}:{ts_secs:02d}**"
        })
        content.append({
            "type": "image",
            "source": {"type": "base64", "media_type": "image/jpeg", "data": b64}
        })

    content.append({
        "type": "text",
        "text": (
            f"The {len(frames)} frames above are sampled evenly from a {duration_str}-long video.\n\n"
            + ANALYSIS_PROMPT
        )
    })

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=4096,
        messages=[{"role": "user", "content": content}]
    )
    return response.content[0].text


def chat_with_claude(user_message: str) -> str:
    system_prompt = (
        "You are a helpful assistant answering questions about a video. "
        "You analyzed the video by examining evenly-sampled frames and produced "
        "the following analysis:\n\n"
        f"{st.session_state.video_analysis}\n\n"
        "Use this analysis to answer the user's questions accurately and helpfully. "
        "If a question cannot be answered from the visual analysis alone, say so clearly."
    )

    st.session_state.messages.append({"role": "user", "content": user_message})

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=2048,
        system=system_prompt,
        messages=st.session_state.messages
    )
    reply = response.content[0].text
    st.session_state.messages.append({"role": "assistant", "content": reply})
    return reply


def main():
    st.set_page_config(
        page_title="Video Analysis with Claude",
        page_icon="🎬",
        layout="wide",
    )

    init_session_state()

    st.title("Video Analysis Assistant")
    st.caption("Upload a video — Claude analyzes the frames, then you can ask questions about it.")

    if not ANTHROPIC_API_KEY:
        st.error(
            "**Missing API key.** On Streamlit Cloud: go to **Manage app → Secrets** and add "
            "`ANTHROPIC_API_KEY = \"your-key-here\"`. Locally: set it in a `.env` file."
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

        suffix = Path(uploaded_file.name).suffix.lower() or ".mp4"
        tmp_path = None
        try:
            with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp_file:
                tmp_file.write(uploaded_file.getvalue())
                tmp_path = tmp_file.name

            with st.spinner(
                f"Extracting up to {MAX_FRAMES} frames and analyzing with Claude... "
                "This may take a moment for longer videos."
            ):
                analysis = analyze_video_with_claude(tmp_path)

            st.session_state.video_analysis = analysis
            st.session_state.analysis_complete = True
            st.success("Analysis complete! Scroll down to ask questions.")

        except ValueError as e:
            st.error(f"Video error: {e}")
        except anthropic.APIError as e:
            st.error(f"Claude API error: {e}")
        except Exception as e:
            st.error(f"Unexpected error: {e}")
        finally:
            if tmp_path and os.path.exists(tmp_path):
                os.unlink(tmp_path)

    # --- Section 2: Analysis ---
    if st.session_state.analysis_complete and st.session_state.video_analysis:
        st.header("2. Claude's Video Analysis")
        with st.expander("View Full Analysis", expanded=True):
            st.markdown(st.session_state.video_analysis)

        st.divider()

        # --- Section 3: Chat ---
        st.header("3. Ask Questions About the Video")
        st.caption("Claude has the full analysis above as context for every answer.")

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
                        reply = chat_with_claude(user_input)
                        st.markdown(reply)
                    except anthropic.APIError as e:
                        st.error(f"Claude API error: {e}")
                    except Exception as e:
                        st.error(f"Unexpected error: {e}")


if __name__ == "__main__":
    main()

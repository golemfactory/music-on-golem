import scipy
from transformers import AutoTokenizer, AutoModelForTextToWaveform
import argparse

parser = argparse.ArgumentParser(description="Process some arguments.")
parser.add_argument("--prompt", dest="prompt_text", type=str, help="Prompt text")
parser.add_argument(
    "--duration", dest="duration_sec", type=int, help="Duration in seconds"
)

args = parser.parse_args()

tokenizer = AutoTokenizer.from_pretrained("facebook/musicgen-small")
model = AutoModelForTextToWaveform.from_pretrained("facebook/musicgen-small")

# ~50 tokens per second
tokens_to_generate = 50 * args.duration_sec
prompt = args.prompt_text

inputs = tokenizer(
    text=[
        prompt,
    ],
    padding=True,
    return_tensors="pt",
)

audio_values = model.generate(
    **inputs,
    min_new_tokens=tokens_to_generate,
    max_new_tokens=tokens_to_generate,
)

sampling_rate = model.config.audio_encoder.sampling_rate
scipy.io.wavfile.write(
    "/golem/output/out.wav", rate=sampling_rate, data=audio_values[0, 0].numpy()
)

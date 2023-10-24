from transformers import AutoTokenizer, AutoModelForTextToWaveform

tokenizer = AutoTokenizer.from_pretrained("facebook/musicgen-small")
model = AutoModelForTextToWaveform.from_pretrained("facebook/musicgen-small")

FROM python:3.10

RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
RUN pip install scipy
RUN pip install git+https://github.com/huggingface/transformers.git

COPY run.py /golem/work/run.py
COPY prepare-model.py /golem/work/prepare-model.py

VOLUME /golem/output /golem/input
WORKDIR /golem/work

# this will download the weights for the model
RUN python prepare-model.py 
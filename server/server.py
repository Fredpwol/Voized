import socket
import pyaudio
import wave


chunk = 1024
fs = 44100
sample_format = pyaudio.paInt16
channel = 2
seconds = 3

audio = pyaudio.PyAudio()

stream = audio.open(rate=fs, channels=channel, format=sample_format, frames_per_buffer=chunk, input=True)

frames = []

for _ in range(0, int(fs / chunk * 5)):
    data = stream.read(chunk)
    frames.append(data)

stream.stop_stream()
stream.close()

audio.terminate()

print('Finished recording')

# Save the recorded data as a WAV file

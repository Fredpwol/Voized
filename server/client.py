import pyaudio
import wave

filename = 'testout.wav'
chunk = 1024  

# Open the sound file 
wf = wave.open(filename, 'rb')

audio = pyaudio.PyAudio()

stream = audio.open(format = audio.get_format_from_width(wf.getsampwidth()),
                channels = wf.getnchannels(),
                rate = wf.getframerate(),
                output = True)


data = wf.readframes(chunk)
while data != b'':
    stream.write(data)
    data = wf.readframes(chunk)

stream.close()
audio.terminate()
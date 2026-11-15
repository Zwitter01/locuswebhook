class SoundEngine {
  private ctx: AudioContext | null = null
  private droneGain: GainNode | null = null
  private windGain: GainNode | null = null
  private oscLow: OscillatorNode | null = null
  private oscHigh: OscillatorNode | null = null
  private isMuted = true

  init() {
    if (this.ctx) return
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    this.ctx = new AudioCtx()

    // Master drone sub-bass
    this.droneGain = this.ctx.createGain()
    this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime)

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(110, this.ctx.currentTime)

    this.oscLow = this.ctx.createOscillator()
    this.oscLow.type = 'sawtooth'
    this.oscLow.frequency.setValueAtTime(46, this.ctx.currentTime)

    this.oscHigh = this.ctx.createOscillator()
    this.oscHigh.type = 'sine'
    this.oscHigh.frequency.setValueAtTime(92, this.ctx.currentTime)

    this.oscLow.connect(filter)
    this.oscHigh.connect(filter)
    filter.connect(this.droneGain)
    this.droneGain.connect(this.ctx.destination)

    this.oscLow.start()
    this.oscHigh.start()

    // Ambient space wind / storm white noise
    const bufferSize = this.ctx.sampleRate * 2
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    const whiteNoise = this.ctx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true

    const bandpass = this.ctx.createBiquadFilter()
    bandpass.type = 'bandpass'
    bandpass.frequency.setValueAtTime(240, this.ctx.currentTime)
    bandpass.Q.setValueAtTime(1.6, this.ctx.currentTime)

    this.windGain = this.ctx.createGain()
    this.windGain.gain.setValueAtTime(0, this.ctx.currentTime)

    whiteNoise.connect(bandpass)
    bandpass.connect(this.windGain)
    this.windGain.connect(this.ctx.destination)
    whiteNoise.start()
  }

  setMuted(muted: boolean) {
    this.isMuted = muted
    if (!this.ctx) {
      if (!muted) this.init()
      else return
    }
    if (this.ctx && this.ctx.state === 'suspended' && !muted) {
      this.ctx.resume()
    }
    const targetGain = muted ? 0 : 0.14
    const windTarget = muted ? 0 : 0.06
    const t = this.ctx?.currentTime || 0
    this.droneGain?.gain.setTargetAtTime(targetGain, t, 0.3)
    this.windGain?.gain.setTargetAtTime(windTarget, t, 0.4)
  }

  getMuted() {
    return this.isMuted
  }

  playThunder() {
    if (this.isMuted || !this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(75, now)
    osc.frequency.exponentialRampToValueAtTime(24, now + 1.4)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(160, now)
    filter.frequency.linearRampToValueAtTime(50, now + 1.6)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.7)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 1.8)
  }

  playSingularityDive(depth: number) {
    if (this.isMuted || !this.ctx) return
    const now = this.ctx.currentTime
    const freq = 46 + depth * 120
    this.oscLow?.frequency.setTargetAtTime(freq, now, 0.15)
  }
}

export const soundEngine = new SoundEngine()

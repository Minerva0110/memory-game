'use client'

import { useRouter } from 'next/navigation'
import './intro.scss'

export default function IntroPage() {
  const router = useRouter()

  return (
    <main className="intro">
      <h1>Minni­sleikurinn: Vísindaskáldskapur</h1>
      <p>
  Velkomin í Memory Game! Þú ert að fara að para saman flísur með tækni­tákn úr fjarlægum vetrarbrautum. <br />
  Snúðu við tvær í einu og sjáðu hvort þær passa. Þetta snýst um hraða, minni og smá gaman.
</p>


      <button onClick={() => router.push('/game')}>Hefja leik</button>
    </main>
  )
}

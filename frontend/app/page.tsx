'use client'

import { useRouter } from 'next/navigation'
import './intro.scss'

export default function IntroPage() {
  const router = useRouter()

return (
  <div className="star-background">
  <div className="stars" />
  <main className="intro">
    <h1>Minni­sleikurinn: SCI-FI Edition</h1>
    <p>
      Velkomin(n) í Memory Game! <br />
      Snúðu við tveimur flísum í einu og sjáðu hvort þær passa. Þú getur valið milli keppni, æfingu eða frjálsan leik. <br />
      Þetta snýst um hraða, minni og smá gaman. <br />
      Takk fyrir að skoða verkefnið mitt! ⭐️ 
    </p>
    <button onClick={() => router.push('/game')}>Hefja leik</button>
  </main>
</div>

)

}  
/* Gabby's crest — her circle logo with the orbiting orange twist */
export default function WhiskeyGlass() {
  return (
    <div className="glass-scene" aria-hidden="true">
      <div className="crest-bob">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-gabbys.png"
          alt="Gabby's Corner"
          className="crest-img"
        />
      </div>

      {/* orbiting garnish: elegant orange twist */}
      <div className="orbit">
        <svg className="garnish" viewBox="0 0 60 60">
          <path
            d="M14 44 C10 32, 18 20, 30 18 C42 16, 50 24, 48 33 C46 41, 37 44, 32 39 C27 34, 31 26, 38 27"
            fill="none"
            stroke="#d99a3e"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M14 44 C10 32, 18 20, 30 18 C42 16, 50 24, 48 33 C46 41, 37 44, 32 39 C27 34, 31 26, 38 27"
            fill="none"
            stroke="#5e2634"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>
    </div>
  );
}

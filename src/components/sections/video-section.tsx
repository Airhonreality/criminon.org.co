import { siteConfig } from "@/lib/config";
import { mediaUrl } from "@/lib/media";

export function MinijusticiaVideoSection() {
  const video = siteConfig.media.minijusticia;
  const src = mediaUrl(video.src);

  return (
    <section
      id="minijusticia"
      className="relative overflow-hidden bg-[#1B3A5C] py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#C5A55A]/10 blur-3xl"
      />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="inline-block rounded-full border border-[#C5A55A]/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A55A]">
            Documental
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            {video.title}
          </h2>
          <p className="mt-4 text-stone-300">{video.description}</p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/10">
            <video
              className="h-full w-full"
              controls
              playsInline
              preload="none"
              poster={video.poster}
              aria-label={`Video: ${video.title}`}
            >
              <source src={src} type="video/mp4" />
              Tu navegador no puede reproducir este video.{" "}
              <a href={src} className="underline">
                Ábrelo en una pestaña nueva
              </a>
              .
            </video>
          </div>

          <p className="mt-3 text-center text-xs text-stone-400">
            Duración: {video.duration} · Criminon Colombia
          </p>
        </div>
      </div>
    </section>
  );
}

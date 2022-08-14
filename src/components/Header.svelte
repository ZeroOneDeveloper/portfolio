<script lang="ts">
  import { goto } from '$app/navigation'
  import { gsap, Cubic } from 'gsap'

  import { scrollToAnchor } from '~/utils/scroll'

  const scrollToIntroduce = () => scrollToAnchor('main-section__introduce')

  const scrollToTop = async () => {
    await goto('/')
    gsap.to(window.simplebar.getScrollElement(), {
      duration: 1,
      scrollTo: {
        y: 0
      },
      ease: Cubic.easeOut
    })
  }
</script>

<nav class="fixed left-0 top-0 w-full z-10">
  <div class="bg-black/60 w-full h-full absolute left-0 top-0 backdrop-blur-sm z-[-1]" />

  <div class="relative w-full">
    <div class="w-full px-6">
      <div class="max-w-[1000px] w-full mx-auto py-6 flex">
        <div
          class="text-transparent bg-clip-text cursor-pointer select-none bg-gradient-to-r from-blue-400 to-pink-200 text-2xl font-thin"
          on:click={scrollToTop}
        >
          ZeroOne
        </div>
        <div class="flex-grow" />
        <div class="text-2xl font-thin select-none cursor-pointer" on:click={scrollToIntroduce}>
          INTRODUCE
        </div>
      </div>
    </div>
  </div>
</nav>

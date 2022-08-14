<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { gsap } from 'gsap'

  export let title: string

  let titleElem: HTMLDivElement

  let itemsElem: HTMLDivElement

  const tweens: gsap.core.Tween[] = []

  onMount(() => {
    tweens.push(
      gsap.fromTo(
        titleElem,
        {
          opacity: 0,
          y: 24
        },
        {
          opacity: 1,
          duration: 1,
          y: 0,
          scrollTrigger: {
            scroller: window.simplebar.getScrollElement(),
            trigger: titleElem,
            start: 'top center',
            scrub: false
          }
        }
      ),
      gsap.fromTo(
        itemsElem.children,
        {
          opacity: 0,
          y: 24
        },
        {
          opacity: 1,
          duration: 1,
          delay: 0.4,
          y: 0,
          stagger: 0.4,
          scrollTrigger: {
            scroller: window.simplebar.getScrollElement(),
            trigger: itemsElem,
            start: 'top center',
            scrub: false
          }
        }
      )
    )
  })

  onDestroy(() => {
    tweens.forEach((x) => x.targets().forEach((y) => x.kill(y as object)))
  })
</script>

<div class="lg:flex-grow lg:flex-shrink-0 lg:w-0">
  <div class="text-blue-600 text-4xl lg:text-5xl" bind:this={titleElem}>
    {title}
  </div>
  <div class="mt-8 flex flex-col gap-4" bind:this={itemsElem}>
    <slot />
  </div>
</div>

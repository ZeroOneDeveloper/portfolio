<script lang="ts">
  import FaInstagram from 'svelte-icons/fa/FaInstagram.svelte'
  import FaGitHub from 'svelte-icons/fa/FaGithub.svelte'
  import FaTwitter from 'svelte-icons/fa/FaTwitter.svelte'
  import { scrollToAnchor } from '~/utils/scroll'
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'
  import { sineOut } from 'svelte/easing'
  import { gsap, Sine } from 'gsap'

  const scrollToIntroduce = () => scrollToAnchor('main-section__introduce')

  let start = false

  onMount(() => {
    setTimeout(() => (start = true), 600)
  })

  let scrollButton: HTMLDivElement

  $: buttonTween = {
    subscribe: () => {
      if (scrollButton) {
        const timeout = setTimeout(() => {
          gsap.fromTo(
            scrollButton,
            {
              y: 0
            },
            {
              y: -12,
              repeat: -1,
              yoyo: true,
              ease: Sine.easeInOut
            }
          )
        }, 6400)
        return () => {
          clearTimeout(timeout)
        }
      }

      return () => {}
    }
  }

  $buttonTween
</script>

<div
  class="w-full min-h-screen px-4 flex flex-col items-center justify-center text-center relative"
>
  {#if start}
    <div
      in:fly={{
        duration: 2000,
        easing: sineOut,
        y: 48
      }}
      class="text-4xl lg:text-6xl"
    >
      Creativity Makes World Change.
    </div>
    <div
      in:fly={{
        duration: 2000,
        easing: sineOut,
        y: 48,
        delay: 2000
      }}
      class="text-2xl font-thin mt-4 lg:text-4xl"
    >
      Hello, World! I'm a student who makes creativity!
    </div>
    <div class="mt-36 flex gap-10">
      <a
        in:fly={{
          duration: 1000,
          easing: sineOut,
          y: 36,
          delay: 4400
        }}
        href="https://www.instagram.com/ZeroOne.ed"
        target="_blank"
        rel="noreferrer"
        class="w-8 opacity-60 hover:opacity-100 transition-all"
      >
        <FaInstagram />
      </a>
      <a
        in:fly={{
          duration: 1000,
          easing: sineOut,
          y: 36,
          delay: 4000
        }}
        href="https://github.com/ZeroOneDeveloper"
        target="_blank"
        rel="noreferrer"
        class="w-8 opacity-60 hover:opacity-100 transition-all"
      >
        <FaGitHub />
      </a>
      <a
        in:fly={{
          duration: 1000,
          easing: sineOut,
          y: 36,
          delay: 4800
        }}
        href="https://twitter.com/ZeroOneDevelop"
        target="_blank"
        rel="noreferrer"
        class="w-8 opacity-60 hover:opacity-100 transition-all"
      >
        <FaTwitter />
      </a>
      <a
        in:fly={{
          duration: 1000,
          easing: sineOut,
          y: 36,
          delay: 5200
        }}
        href="mailto:me@zero0ne.dev"
        target="_blank"
        rel="noreferrer"
        class="w-8 opacity-60 hover:opacity-100 transition-all"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_206_96)">
            <path
              d="M16.94 2.63606C16.6506 2.48198 16.3278 2.40139 16 2.40139C15.6722 2.40139 15.3494 2.48198 15.06 2.63606L3.06 9.03606C2.74004 9.20643 2.47241 9.46055 2.2857 9.77126C2.09899 10.082 2.00024 10.4376 2 10.8001V12.4341L13.5 19.3341L16 17.8341L18.5 19.3341L30 12.4341V10.8001C29.9998 10.4376 29.901 10.082 29.7143 9.77126C29.5276 9.46055 29.26 9.20643 28.94 9.03606L16.94 2.63606V2.63606ZM30 14.7661L20.444 20.5001L30 26.2341V14.7661ZM29.93 28.5261L16 20.1641L2.07 28.5241C2.18505 28.9478 2.43637 29.322 2.78517 29.5887C3.13398 29.8555 3.56088 30 4 30.0001H28C28.4391 30 28.866 29.8555 29.2148 29.5887C29.5636 29.322 29.815 28.9478 29.93 28.5241V28.5261ZM2 26.2321L11.556 20.4981L2 14.7661V26.2341V26.2321ZM14.118 0.870058C14.6972 0.561209 15.3436 0.399658 16 0.399658C16.6564 0.399658 17.3028 0.561209 17.882 0.870058L29.882 7.27006C30.5218 7.61122 31.0569 8.1199 31.43 8.74168C31.803 9.36345 32.0001 10.0749 32 10.8001V28.0001C32 29.0609 31.5786 30.0783 30.8284 30.8285C30.0783 31.5786 29.0609 32.0001 28 32.0001H4C2.93913 32.0001 1.92172 31.5786 1.17157 30.8285C0.421427 30.0783 2.00078e-08 29.0609 2.00078e-08 28.0001V10.8001C-7.24933e-05 10.0749 0.196961 9.36345 0.570028 8.74168C0.943095 8.1199 1.47816 7.61122 2.118 7.27006L14.118 0.870058V0.870058Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_206_96">
              <rect width="32" height="32" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </a>
    </div>
    <div
      bind:this={scrollButton}
      in:fly={{
        delay: 5400,
        y: -36,
        duration: 1000
      }}
      class="absolute cursor-pointer bottom-12 left-1/2 -translate-x-1/2"
      on:click={scrollToIntroduce}
    >
      <svg fill="#c2c2c2" class="w-12 h-12" viewBox="0 0 16 16">
        <path
          fill-rule="evenodd"
          d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"
        />
      </svg>
    </div>
  {/if}
</div>

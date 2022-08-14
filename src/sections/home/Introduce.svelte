<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { gsap } from 'gsap'

  import IntroduceSection from '~/components/IntroduceSection.svelte'
  import IntroduceSectionItem from '~/components/IntroduceSectionItem.svelte'

  let title: HTMLDivElement

  const tweens: gsap.core.Tween[] = []

  onMount(() => {
    tweens.push(
      gsap.fromTo(
        title,
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
            trigger: title,
            start: 'center center',
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

<div class="min-h-screen w-screen pt-48 px-6 pb-12" id="main-section__introduce">
  <div class="max-w-[1400px] w-full mx-auto">
    <div
      bind:this={title}
      class="text-4xl lg:text-6xl lg:font-bold font-medium border-b inline-block pr-8 pb-2 border-white"
    >
      Introduce
    </div>
    <div class="flex mt-12 flex-col lg:flex-row gap-8">
      <IntroduceSection title="EXPERIENCES">
        <IntroduceSectionItem title="UniqueCode Project Number 1" year="2020">
          <div>Team Owner | Backend Engineer</div>
        </IntroduceSectionItem>
        <IntroduceSectionItem title="UniqueCode Project Number 2" year="2022">
          <div>Team Owner | Backend Engineer | Developer Training Course Mentor</div>
        </IntroduceSectionItem>
      </IntroduceSection>
      <IntroduceSection title="EDUCATION">
        <IntroduceSectionItem title="ELEMENTARY SCHOOL" year="2013">
          <div>Chungmyoung Elementary School</div>
          <div>Haneulbit Elementary School</div>
          <div>Byeolgaram Elementary School</div>
        </IntroduceSectionItem>
        <IntroduceSectionItem title="MIDDLE SCHOOL" year="2019">
          <div>Byeolgaram Middle School</div>
          <div>Seokgwean Middle School</div>
        </IntroduceSectionItem>
        <IntroduceSectionItem title="HIGH SCHOOL" year="2022">
          <div>Kyunghee High School</div>
        </IntroduceSectionItem>
      </IntroduceSection>
    </div>
  </div>
</div>

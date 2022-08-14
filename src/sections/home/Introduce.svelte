<script>
  import IntroduceSection from '~/components/IntroduceSection.svelte'
  import IntroduceSectionItem from '~/components/IntroduceSectionItem.svelte'
</script>

<div class="min-h-screen w-screen pt-36 px-6 pb-12" id="main-section__introduce">
  <div class="max-w-[1400px] w-full mx-auto">
    <div
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
        <IntroduceSectionItem title="ELEMENTARY SCHOOL" year="2020">
          <div>Chungmyoung Elementary School</div>
          <div>Haneulbit Elementary School</div>
          <div>Byeolgaram Elementary School</div>
        </IntroduceSectionItem>
        <IntroduceSectionItem title="MIDDLE SCHOOL" year="2020">
          <div>Byeolgaram Middle School</div>
          <div>Seokgwean Middle School</div>
        </IntroduceSectionItem>
        <IntroduceSectionItem title="HIGH SCHOOL" year="2020">
          <div>Kyunghee High School</div>
        </IntroduceSectionItem>
      </IntroduceSection>
    </div>
  </div>
</div>

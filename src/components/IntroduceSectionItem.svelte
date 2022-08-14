<script lang="ts">
  export let title: string
  export let year: string
</script>

<div class="flex gap-2 mb-8 md:mb-0 md:gap-[36px] flex-col md:flex-row">
  <div class="font-thin text-2xl text-blue-600">{year}</div>
  <div>
    <div class="font-thin text-[1.4rem] text-blue-600">
      {title}
    </div>
    <div class="mt-2 text-yellow-400 font-light text-lg">
      <slot />
    </div>
  </div>
</div>

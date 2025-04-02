<template>
  <div id="hero" class="container mx-auto md:h-[60vh] overflow-hidden">
    <!-- Main hero content -->
    <section class="relative h-full bg-primary overflow-hidden text-white pb-48 md:pb-16 rounded-xl">
      <div class="container mx-auto px-4 pt-6 md:px-10 md:pt-12 md:py-16">
        <div class="flex flex-col md:flex-row items-center">
          <!-- Left content -->
          <div class="w-full md:w-1/2 mb-8 md:mb-0 text-center flex flex-col items-center md:items-start md:text-left">
            <h1 class="text-4xl md:text-5xl font-bold leading-tight mb-4">
              We bring the store<br />to your door
            </h1>
            <p class="text-teal-100 mb-8 max-w-md">
              Get organic produce and sustainably sourced groceries delivery at up to 4% off grocery.
            </p>
            <button class="bg-secondary hover:bg-secondaryDark text-primaryDark font-medium px-8 py-3 rounded-md transition-colors">
              Shop now
            </button>
          </div>
          
          <!-- Right image -->
          <div class="relative md:static flex justify-center items-center w-full md:w-1/2">
            <img 
              src="../assets/grocery-bag-3.png" 
              alt="Grocery bag with fresh produce" 
              class="absolute -bottom-72 w-[250px] md:-bottom-52 md:right-36 md:w-[500px] mx-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
    
    <!-- Curved bottom edge - convex curve -->
    <!-- <div class="curve absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
      <div class="bg-white w-[200%] h-32 rounded-t-[50%] relative -top-16 left-1/2 transform -translate-x-1/2"></div>
    </div> -->
  </div>
</template>

<script setup>
// No additional imports needed
</script>

<style scoped>
#hero section{
  /* mask: radial-gradient(60% 70px at top,#0000 100%,#000); */
  clip-path: ellipse(120% 100% at top);
}


</style>
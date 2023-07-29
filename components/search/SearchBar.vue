<template>
  <section
    id="search"
    class="mb-2 pt-2 lg:px-0 lg:pb-0 border-b-2 border-red-700 mx-auto lg:w-full sm:w-3/4 lg:border-b-0"
  >
    <div
      class="bg-tint rounded lg:rounded-bl-none text-base text-center relative"
    >
      <div class="tag section">Search</div>
      <form class="w-full">
        <div class="p-2">
          <input
            v-model="searchTerm"
            class="appearance-none border border-solid border-transparent w-full text-white py-1 px-2 leading-tight bg-tint-light rounded-sm focus:bg-gray-500 focus:outline-none focus:border-white"
            type="text"
            placeholder="Search player or outfit name / tag"
            aria-label="Full name"
            @keyup="search"
          />
        </div>
      </form>
      <div id="results" class="mb-2 px-2">
        <SearchResult
          v-for="result in results"
          :key="result.name"
          :result="result"
        />
      </div>
      <div v-show="loading" class="text-center">
        <i class="fas fa-spinner fa-spin"></i> Loading...
      </div>
      {{ error.message }}
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CancelToken } from 'axios'
import ApiRequest from '~/api-request'
import SearchResult from '~/components/search/SearchResult.vue'
import { Endpoints } from '@/constants/Endpoints'
import { PS2AlertsSearchResultInterface } from '~/ps2alerts-constants/interfaces/PS2AlertsSearchResultInterface'

export default defineComponent({
  name: 'SearchBar',
  components: { SearchResult },
  data: () => {
    return {
      results: [] as PS2AlertsSearchResultInterface[],
      loading: false,
      error: { message: '' },
      searchTerm: '',
      apiRequest: new ApiRequest(),
      source: CancelToken.source(),
    }
  },
  methods: {
    async search(criteria: KeyboardEvent): Promise<void> {
      const target = criteria.target as HTMLInputElement
      const searchTerm = target.value
      if (this.searchTerm === '') {
        this.results = []
        return
      }

      this.loading = true

      // If a request is in flight, cancel it
      if (this.source) {
        this.source.cancel('Canceled due to new request')
      }

      // Re-initialize the token
      this.source = CancelToken.source()

      console.log('Searching for', searchTerm)

      this.error = { message: '' }

      try {
        const results: PS2AlertsSearchResultInterface[] =
          await this.apiRequest.get(
            `${Endpoints.SEARCH}?searchTerm=${searchTerm}`,
            { sortBy: 'name', order: 'asc' },
            this.source
          )

        console.log('Results', results)

        if (!results || results.length === 0) {
          this.error = { message: 'No results found' }
          return
        }

        // Parse the results into a format the frontend understands
        results.map((result) => {
          if (result.character) {
            result.name = result.character.name
            result.type = 'player' // Yay for consistency
            result.faction = result.character.faction
            result.world = result.character.world
          } else if (result.outfit) {
            result.name = result.outfit.name
            result.type = 'outfit'
            result.faction = result.outfit.faction
            result.world = result.outfit.world
          }

          return result
        })

        console.log('Results parsed', results)
        this.results = results
        this.loading = false
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error(error)
        }
      }
    },
  },
})
</script>

<style scoped lang="scss">
#search {
  .tag {
    margin: 0;
  }
}

#results {
  margin-bottom: 1px; // Gotta love CSS
}
</style>

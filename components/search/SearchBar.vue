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
        <div class="p-2 flex items-center">
          <input
            v-model="searchTerm"
            class="mr-2 appearance-none border border-solid border-transparent w-full text-white py-1 px-2 leading-tight bg-tint-light rounded-sm focus:bg-gray-500 focus:outline-none focus:border-white"
            type="text"
            placeholder="e.g. DIG, Maelstrome"
            aria-label="Full name"
          />
          <button class="btn" :disabled="loading" @click="search">
            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
          </button>
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
import axios from 'axios'
import ApiRequest from '~/api-request'
import SearchResult from '~/components/search/SearchResult.vue'
import { Endpoints } from '@/constants/Endpoints'
import {
  SearchCharacterInterface,
  SearchOutfitInterface,
  SearchResultComponentInterface,
} from '~/ps2alerts-constants/interfaces/PS2AlertsSearchResultInterface'

export default defineComponent({
  name: 'SearchBar',
  components: { SearchResult },
  data: () => {
    return {
      results: [] as SearchResultComponentInterface[],
      loading: false,
      error: { message: '' },
      searchTerm: '',
      apiRequest: new ApiRequest(),
      source: axios.CancelToken.source(),
    }
  },
  methods: {
    parseResults(
      characterResults: SearchCharacterInterface[],
      outfitResults: SearchOutfitInterface[]
    ): (SearchCharacterInterface | SearchOutfitInterface)[] {
      const searchTermLower = this.searchTerm.toLowerCase()

      characterResults.forEach((result) => {
        let score = 0

        // Higher weight for exact matches
        if (result.character.name.toLowerCase() === searchTermLower) {
          score = 100
        } else {
          // Lower weight for partial matches
          const searchTermRegex = new RegExp(searchTermLower, 'i')

          if (result.character.name.match(searchTermRegex)) {
            score = 5
          }
        }

        result.matchScore = score
        result.type = 'player'
        result.faction = result.character.faction

        if (result.character.outfit?.tag) {
          result.name = `[${result.character.outfit.tag}] ${result.character.name}`
        } else {
          result.name = result.character.name
        }
      })

      // Sort Characters by score
      characterResults.sort((a, b) =>
        this.searchScores(a.matchScore, b.matchScore)
      )

      outfitResults.forEach((result) => {
        let score = 0

        // Higher weight for exact matches on tag and name
        if (
          result.outfit.tag?.toLowerCase() === searchTermLower ||
          result.outfit.name.toLowerCase() === searchTermLower
        ) {
          score = 100
        } else {
          // Lower weight for partial matches
          const searchTermRegex = new RegExp(searchTermLower, 'i')

          if (result.outfit.tag?.match(searchTermRegex)) {
            score = 20
          } else if (result.outfit.name.match(searchTermRegex)) {
            score = 10
          }
        }

        result.matchScore = score
        result.type = 'outfit'
        result.faction = result.outfit.faction

        if (result.outfit.tag) {
          result.name = `[${result.outfit.tag}] ${result.outfit.name}`
        } else {
          result.name = result.outfit.name
        }
      })

      return [...characterResults, ...outfitResults].sort((a, b) =>
        this.searchScores(a.matchScore, b.matchScore)
      )
    },
    async search(criteria: KeyboardEvent): Promise<void> {
      const target = criteria.target as HTMLInputElement
      const searchTerm = target.value

      this.results = []

      if (this.searchTerm === '' || this.loading) {
        return
      }

      this.loading = true

      // If a request is in flight, cancel it
      if (this.source) {
        this.source.cancel('Canceled due to new request')
      }

      // Re-initialize the token
      this.source = axios.CancelToken.source()

      console.log('Searching for', searchTerm)

      this.error = { message: '' }

      try {
        const characterPromise: Promise<SearchCharacterInterface[]> =
          this.apiRequest.get(
            Endpoints.SEARCH.replace('{type}', 'characters'),
            { searchTerm: this.searchTerm },
            this.source
          )
        const outfitPromise: Promise<SearchOutfitInterface[]> =
          this.apiRequest.get(
            Endpoints.SEARCH.replace('{type}', 'outfits'),
            { searchTerm: this.searchTerm },
            this.source
          )

        const searchResults = await Promise.all([
          characterPromise,
          outfitPromise,
        ])

        const characterResults: SearchCharacterInterface[] = searchResults[0]
        const outfitResults: SearchOutfitInterface[] = searchResults[1]

        console.log('characterResults', characterResults)
        console.log('outfitResults', outfitResults)

        if (characterResults.length === 0 && outfitResults.length === 0) {
          this.error = { message: 'No results found!' }
          return
        }

        // Parse the results into a SearchResult component friendly format
        const results: SearchResultComponentInterface[] = this.parseResults(
          characterResults,
          outfitResults
        )

        console.log('Results parsed', results)
        this.results = results
        this.loading = false
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error(error)
          this.error = {
            message: `An error occurred while searching! Message: ${error}`,
          }
        }
      }
    },
    searchScores(a: number | undefined, b: number | undefined): number {
      if (a && b) {
        return b - a
      }
      return 0
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

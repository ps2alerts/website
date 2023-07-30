<template>
  <section
    id="search"
    class="mb-2 pt-2 lg:px-0 lg:pb-0 border-b-2 border-red-700 mx-auto lg:w-full sm:w-3/4 lg:border-b-0"
  >
    <div
      class="bg-tint rounded lg:rounded-bl-none text-base text-center relative"
    >
      <div class="tag section">
        Search <span class="label red">New in v4.5!</span>
      </div>
      <div class="p-2">
        <div class="flex items-center">
          <input
            v-model="searchTerm"
            class="mr-2 appearance-none border border-solid border-transparent w-full text-white py-1 px-2 leading-tight bg-tint-light rounded-sm focus:bg-gray-500 focus:outline-none focus:border-white"
            type="text"
            placeholder="e.g. DIG, Maelstrome"
            aria-label="Full name"
            @keyup="search"
          />
          <button class="btn p-0" :disabled="loading" @click="clear">
            <font-awesome-icon :icon="['fas', 'xmark']"></font-awesome-icon>
          </button>
        </div>
        <div id="results" class="mb-2">
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
    </div>
  </section>
</template>

<script lang="ts">
/* eslint-disable import/no-named-as-default-member */
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
        result.name = result.character.name
        result.tag = result.character?.outfit?.tag ?? undefined
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

        // If there's a space on the end of the string, rank them lower (e.g. 'Dignity of War Tactical ')
        if (searchTermLower.endsWith(' ')) {
          score = score / 2
        }

        result.matchScore = score
        result.type = 'outfit'
        result.faction = result.outfit.faction
        result.name = result.outfit.name
        result.tag = result.outfit.tag
      })

      return [...characterResults, ...outfitResults].sort((a, b) =>
        this.searchScores(a.matchScore, b.matchScore)
      )
    },
    clear() {
      this.searchTerm = ''
      this.results = []
      this.error = { message: '' }
    },
    async search(criteria: KeyboardEvent): Promise<void> {
      const target = criteria.target as HTMLInputElement
      const searchTerm = target.value

      this.results = []

      if (this.loading) {
        if (this.source) {
          this.source.cancel('Canceled due to new request')
          console.log('Canceled due to new request')
        }
      }

      // If less than 3 chars are entered, don't search and tell the user
      if (this.searchTerm.length < 3) {
        this.error = {
          message: 'Please enter at least 3 chars.',
        }
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

        if (characterResults.length === 0 && outfitResults.length === 0) {
          this.error = { message: 'No results found!' }
          this.loading = false
          return
        }

        // Limit the results to the top 5 so we're not rendering a million things
        characterResults.splice(5)
        outfitResults.splice(5)

        // Parse the results into a SearchResult component friendly format
        this.results = this.parseResults(characterResults, outfitResults)
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

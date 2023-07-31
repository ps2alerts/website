<template>
  <section
    id="search"
    class="mb-2 pt-2 lg:px-0 lg:pb-0 border-b-2 border-red-700 mx-auto lg:w-full sm:w-3/4 lg:border-b-0"
  >
    <div
      class="bg-tint rounded lg:rounded-bl-none text-base text-center relative"
    >
      <div class="tag section">
        Search <span class="label green">New in v4.5!</span>
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
          <button
            id="clearButton"
            class="btn"
            :disabled="loading || !searchTerm"
            @click="clear"
          >
            <font-awesome-icon
              v-show="!loading"
              :icon="['fas', 'xmark']"
              fixed-width
            ></font-awesome-icon>
            <font-awesome-icon
              v-show="loading"
              :icon="['fas', 'sync']"
              class="animate-spin"
              fixed-width
            ></font-awesome-icon>
          </button>
        </div>
        <div id="results" class="mb-2">
          <SearchResult
            v-for="result in results"
            :key="result.name"
            :result="result"
          />
        </div>
        {{ error.message }}
      </div>
    </div>
  </section>
</template>

<script lang="ts">
/* eslint-disable import/no-named-as-default-member */
import { defineComponent } from 'vue'
import axios, { CancelTokenSource } from 'axios'
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
      source: axios.CancelToken.source() as CancelTokenSource,
    }
  },
  methods: {
    parseResults(
      characterResults: SearchCharacterInterface[],
      outfitResults: SearchOutfitInterface[]
    ): (SearchCharacterInterface | SearchOutfitInterface)[] {
      const searchTermLower = this.searchTerm.toLowerCase()

      characterResults.map((result) => {
        let score = 0

        // Higher weight for exact matches
        if (result.character.name.toLowerCase() === searchTermLower) {
          score = 100
        }

        result.matchScore = score
        result.type = 'player'
        result.faction = result.character.faction
        result.name = result.character.name
        result.tag = result.character?.outfit?.tag ?? undefined
        return result
      })

      // Sort Characters by score
      characterResults.sort((a, b) => b.matchScore - a.matchScore)

      outfitResults.map((result) => {
        let score = 0

        // Higher weight for exact matches on tag and name
        // This also handles trolls who name outfits after tags e.g. the outfit "DIGT"
        if (result.outfit.tag?.toLowerCase() === searchTermLower) {
          score = 100
        } else if (result.outfit.name.toLowerCase() === searchTermLower) {
          score = 75
        }

        // If there's a space on the end of the string, rank them lower (e.g. 'Dignity of War Tactical ') to punish trolling
        if (searchTermLower.endsWith(' ')) {
          score = score / 2
        }

        result.matchScore = score
        result.type = 'outfit'
        result.faction = result.outfit.faction
        result.name = result.outfit.name
        result.tag = result.outfit.tag
        return result
      })

      outfitResults.sort((a, b) => b.matchScore - a.matchScore)

      // Trim results to top 5 results
      outfitResults = outfitResults.slice(0, 5)
      characterResults = characterResults.slice(0, 5)

      return [...characterResults, ...outfitResults].sort(
        (a, b) => b.matchScore - a.matchScore
      )
    },
    clear() {
      this.searchTerm = ''
      this.results = []
      this.error = { message: '' }
      this.loading = false
      if (this.source) {
        this.source.cancel('Canceled due to clearing')
        console.log('Cancelled request due to clearing')
      }
    },
    async search(): Promise<void> {
      if (this.loading) {
        if (this.source) {
          this.source.cancel('Canceled due to new request')
          console.log('Canceled due to new request')
        }
      }

      this.loading = false

      // If user deleted everything, reset
      if (this.searchTerm.length === 0) {
        this.clear()
        return
      }

      // If less than 3 chars are entered, don't search and tell the user
      if (this.searchTerm.length < 3) {
        this.error = {
          message: 'Please enter at least 3 characters',
        }
        this.results = []
        return
      }

      this.loading = true

      // If a request is in flight, cancel it
      if (this.source) {
        this.source.cancel('Canceled due to new request')
      }

      // Re-initialize the token
      this.source = axios.CancelToken.source()

      this.error = { message: '' }

      try {
        const characterPromise: Promise<SearchCharacterInterface[]> =
          this.apiRequest.get(
            Endpoints.SEARCH.replace('{type}', 'characters'),
            { searchTerm: this.searchTerm },
            // @ts-ignore it's valid yet not valid :shrug:
            this.source
          )
        const outfitPromise: Promise<SearchOutfitInterface[]> =
          this.apiRequest.get(
            Endpoints.SEARCH.replace('{type}', 'outfits'),
            { searchTerm: this.searchTerm },
            // @ts-ignore it's valid yet not valid :shrug:
            this.source
          )

        const searchResults = await Promise.all([
          characterPromise,
          outfitPromise,
        ])

        const characterResults: SearchCharacterInterface[] = searchResults[0]
        const outfitResults: SearchOutfitInterface[] = searchResults[1]

        if (characterResults.length === 0 && outfitResults.length === 0) {
          this.results = []
          this.error = { message: 'No results found!' }
          this.loading = false
          return
        }

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
  },
})
</script>

<style scoped lang="scss">
#search {
  .tag {
    margin: 0;
  }
}

#clearButton {
  padding: 0.5rem 0.75rem;
}

#results {
  margin-bottom: 1px; // Gotta love CSS
}
</style>

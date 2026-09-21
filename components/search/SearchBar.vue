<template>
  <section
    id="search"
    class="mb-2 pt-2 lg:px-0 lg:pb-0 border-b-2 border-red-700 mx-auto lg:w-full sm:w-3/4 lg:border-b-0"
  >
    <div
      class="bg-tint rounded lg:rounded-bl-none text-base text-center relative"
    >
      <div class="tag section">
        Search
        <span class="label green"
          ><InfoTooltip
            text="New in v4.5!"
            tooltip='You are now able to search for your Character and Outfit! You can "Pin" (top right of the result) up to 5 results to easily search yourself again, which will be saved to your device.'
          ></InfoTooltip>
        </span>
      </div>
      <div class="p-2">
        <div class="flex items-center">
          <input
            v-model="searchTerm"
            class="mr-2 appearance-none border border-solid border-transparent w-full text-white py-1 px-2 leading-tight bg-tint-light rounded-sm focus:bg-gray-500 focus:outline-none focus:border-white"
            type="search"
            placeholder="e.g. DIG, Maelstrome"
            aria-label="Full name"
            @input="search"
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
            :key="`${result.type}-${result.id}`"
            :result="result"
            @pinned="handlePinEvent"
            @selected="clear"
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
      pinnedCharacters: new Map() as Map<
        string,
        SearchResultComponentInterface
      >,
      pinnedOutfits: new Map() as Map<string, SearchResultComponentInterface>,
    }
  },
  created() {
    this.loadPinned()
    this.injectPinned()
  },
  methods: {
    parseResults(
      characterResults: SearchCharacterInterface[],
      outfitResults: SearchOutfitInterface[]
    ): (SearchCharacterInterface | SearchOutfitInterface)[] {
      const term = this.searchTerm.trim().toLowerCase()

      // Exact matches outrank prefix matches, and outfits outrank characters at the same level:
      // searching "DIG" should surface the outfit tag first, then the outfit name, then players called Dig...
      const scoreOf = (
        exactTag: boolean,
        exactName: boolean,
        prefixTag: boolean
      ): number => {
        if (exactTag) return 100
        if (exactName) return 90
        if (prefixTag) return 30
        return 20
      }

      characterResults.forEach((result) => {
        result.id = result.character.id
        result.matchScore =
          result.character.name.toLowerCase() === term ? 80 : 10
        result.type = 'player'
        result.faction = result.character.faction
        result.name = result.character.name
        result.tag = result.character?.outfit?.tag ?? undefined
      })

      outfitResults.forEach((result) => {
        const tag = result.outfit.tag?.toLowerCase() ?? ''
        const name = result.outfit.name.toLowerCase()

        result.id = result.outfit.id
        result.matchScore = scoreOf(
          tag === term,
          name === term,
          tag.startsWith(term)
        )
        result.type = 'outfit'
        result.faction = result.outfit.faction
        result.name = result.outfit.name
        result.tag = result.outfit.tag
      })

      // Both lists arrive sorted by name, so exact matches are first and ties keep alphabetical order
      const byScore = (
        a: SearchResultComponentInterface,
        b: SearchResultComponentInterface
      ) => b.matchScore - a.matchScore

      return [
        ...outfitResults.sort(byScore).slice(0, 5),
        ...characterResults.sort(byScore).slice(0, 5),
      ].sort(byScore)
    },
    clear() {
      this.searchTerm = ''
      this.results = []
      this.injectPinned()
      this.error = { message: '' }
      this.loading = false
      if (this.source) {
        this.source.cancel('Canceled due to clearing')
      }
    },
    async search(): Promise<void> {
      if (this.loading) {
        if (this.source) {
          this.source.cancel('Canceled due to new request')
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
        this.injectPinned()
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
            { searchTerm: this.searchTerm.trim() },
            // @ts-ignore it's valid yet not valid :shrug:
            this.source
          )
        const outfitPromise: Promise<SearchOutfitInterface[]> =
          this.apiRequest.get(
            Endpoints.SEARCH.replace('{type}', 'outfits'),
            { searchTerm: this.searchTerm.trim() },
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
          this.injectPinned()
          this.error = { message: 'No results found!' }
          this.loading = false
          return
        }

        // Parse the results into a SearchResult component friendly format
        this.results = this.parseResults(characterResults, outfitResults)
        this.injectPinned()
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
    handlePinEvent(result: SearchResultComponentInterface): void {
      result.isPinned = !result.isPinned

      if (result.isPinned) {
        // Detect the type
        if (result.type === 'player') {
          this.pinnedCharacters.set(result.id, result)
        } else if (result.type === 'outfit') {
          this.pinnedOutfits.set(result.id, result)
        }
      } else {
        if (result.type === 'player') {
          this.pinnedCharacters.delete(result.id)
        } else if (result.type === 'outfit') {
          this.pinnedOutfits.delete(result.id)
        }

        // Remove from current result set
        this.results = this.results.filter((r) => r.id !== result.id)
      }

      // Update local storage
      localStorage.setItem(
        'pinnedCharacters',
        JSON.stringify(Array.from(this.pinnedCharacters.values()))
      )
      localStorage.setItem(
        'pinnedOutfits',
        JSON.stringify(Array.from(this.pinnedOutfits.values()))
      )

      this.injectPinned()
    },
    loadPinned(): void {
      // Load pinned characters and outfits from local storage
      this.pinnedCharacters = new Map(
        JSON.parse(localStorage.getItem('pinnedCharacters') || '[]').map(
          (pinned: SearchResultComponentInterface) => [pinned.id, pinned]
        )
      )
      this.pinnedOutfits = new Map(
        JSON.parse(localStorage.getItem('pinnedOutfits') || '[]').map(
          (pinned: SearchResultComponentInterface) => [pinned.id, pinned]
        )
      )
    },
    injectPinned(): void {
      // Take the current result set and inject the pinned results right at the top, and remove them from the result set if present
      const pinnedCharacters = Array.from(this.pinnedCharacters.values())
      const pinnedOutfits = Array.from(this.pinnedOutfits.values())

      // Remove pinned results from the result set
      this.results = this.results.filter((result) => {
        return !(
          (result.type === 'player' &&
            pinnedCharacters.find((pinned) => pinned.id === result.id)) ||
          (result.type === 'outfit' &&
            pinnedOutfits.find((pinned) => pinned.id === result.id))
        )
      })

      // Inject the pinned results at the top
      this.results = [...pinnedCharacters, ...pinnedOutfits, ...this.results]
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

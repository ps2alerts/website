<template>
  <section :id="`profiles-${type}`">
    <MetaHead :title="pageTitle" :description="pageDesc"></MetaHead>
    <div v-if="error" class="text-center card">
      <h1 class="text-title">{{ error.title }}</h1>
      <p class="mb-4">{{ error.message }}</p>
      <button class="btn" @click="load">
        <font-awesome-icon
          :icon="['fas', 'sync']"
          fixed-width
        ></font-awesome-icon>
        Try again
      </button>
    </div>
    <div v-else-if="!summary" class="text-center">
      <h1>Loading...</h1>
    </div>
    <ProfileLayout
      v-else
      :type="type"
      :summary="summary"
      :days="days"
      :loading="loading"
      @updatedDaysFilter="updateDays"
    />
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import ProfileLayout from '~/components/profiles/ProfileLayout.vue'
import {
  ProfileSummaryInterface,
  ProfileType,
} from '~/interfaces/profiles/ProfileMetricsInterface'
import { profileApi } from '~/utilities/ProfileApi'
import { World } from '~/ps2alerts-constants/world'

// Shared body of the /player and /outfit pages: resolves the subject, then hands the summary to the layout
export default Vue.extend({
  name: 'ProfilePage',
  components: { ProfileLayout },
  props: {
    type: {
      type: String as () => ProfileType,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    world: {
      type: Number as () => World | null,
      default: null,
    },
  },
  data() {
    return {
      summary: null as ProfileSummaryInterface | null,
      days: null as number | null,
      loading: false,
      error: null as { title: string; message: string } | null,
    }
  },
  computed: {
    noun(): string {
      return this.type === 'character' ? 'Player' : 'Outfit'
    },
    displayName(): string {
      if (!this.summary) {
        return ''
      }

      const identity = this.summary.identity as Record<string, any>
      const subject = identity[this.type] ?? {}
      const tag =
        subject.outfit?.tag ?? (this.type === 'outfit' ? subject.tag : null)

      return `${tag ? `[${tag}] ` : ''}${subject.name ?? ''}`
    },
    pageTitle(): string {
      return this.summary
        ? `${this.displayName} | ${this.noun} Stats`
        : `${this.noun} Stats`
    },
    pageDesc(): string {
      return this.summary
        ? `Alert combat statistics for ${this.displayName}`
        : `${this.noun} alert combat statistics`
    },
  },
  created() {
    this.load()
  },
  methods: {
    async load(): Promise<void> {
      this.error = null
      this.loading = true

      try {
        this.summary = await profileApi.summary({
          type: this.type,
          id: this.id,
          world: this.world,
          days: this.days,
        })
      } catch (e: any) {
        const status = e?.response?.status

        this.error =
          status === 404
            ? {
                title: `${this.noun} not found`,
                message: `No alert data exists for ${this.type} ID ${this.id}.`,
              }
            : {
                title: 'Something went wrong',
                message: `The stats could not be loaded (${
                  status ? `HTTP ${status}` : e?.message ?? 'network error'
                }).`,
              }
      } finally {
        this.loading = false
      }
    },
    updateDays(days: number | null): void {
      this.days = days
      this.load()
    },
  },
})
</script>

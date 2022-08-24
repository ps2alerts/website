<template>
  <section
    id="outfitwars"
    ref="outfitwarsTop"
    class="grid grid-cols-12 gap-2 text-center relative"
  >
    <MetaHead :title="pageTitle" :description="pageDesc"> </MetaHead>
    <div class="col-span-12">
      <h1 class="text-title">Rankings &amp; Brackets</h1>
    </div>
    <div class="col-span-3">
      <img src="/img/MillerBadge.png" class="mx-auto my-4 max-h-60" />

      <v-card max-width="600" class="mx-auto" dark>
        <div class="py-4 bg-tint">
          <p class="text-2xl text-center">Miller Gigachads</p>
        </div>

        <v-list subheader>
          <v-subheader><b>Qualified</b></v-subheader>

          <v-list-item v-for="outfit in qualified" :key="outfit.title">
            <v-list-item-avatar>
              <img :src="outfit.image" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="outfit.title"></v-list-item-title>

              <v-list-item-subtitle
                ><b>{{ outfit.subtitle }}</b> - {{ outfit.wins }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-arrow-right</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider></v-divider>
          <v-subheader>Disqualified</v-subheader>

          <v-list-item
            v-for="outfit in disqualified"
            :key="outfit.title"
            disabled
          >
            <v-list-item-avatar>
              <img :src="outfit.image" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="outfit.title"></v-list-item-title>

              <v-list-item-subtitle
                ><b>{{ outfit.subtitle }}</b> - {{ outfit.wins }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-arrow-right</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
    <div class="col-span-3">
      <img src="/img/ConneryBadge.png" class="mx-auto my-4 max-h-60" />
      <v-card max-width="600" class="mx-auto" dark>
        <div class="py-4 bg-tint">
          <p class="text-2xl text-center">Connery "ping 1000+"</p>
        </div>

        <v-list subheader>
          <v-subheader>Qualified</v-subheader>

          <v-list-item v-for="outfit in qualified" :key="outfit.title">
            <v-list-item-avatar>
              <v-icon class="grey lighten-1" dark> mdi-folder </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="outfit.title"></v-list-item-title>

              <v-list-item-subtitle
                v-text="outfit.subtitle"
              ></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-arrow-right</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider></v-divider>
          <v-subheader>Disqualified</v-subheader>

          <v-list-item
            v-for="outfit in disqualified"
            :key="outfit.title"
            disabled
          >
            <v-list-item-avatar>
              <v-icon class="grey darken-1" dark> mdi-folder </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="outfit.title"></v-list-item-title>

              <v-list-item-subtitle
                v-text="outfit.subtitle"
              ></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-arrow-right</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
    <div class="col-span-3">
      <img src="/img/EmeraldBadge.png" class="mx-auto my-4 max-h-60" />

      <v-card max-width="600" class="mx-auto" dark>
        <div class="py-4 bg-tint">
          <p class="text-2xl text-center">Memerald</p>
        </div>
        <v-list subheader>
          <v-subheader>Qualified</v-subheader>
          <v-list-item v-for="outfit in qualified" :key="outfit.title">
            <v-list-item-avatar>
              <v-icon class="grey lighten-1" dark> mdi-folder </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="outfit.title"></v-list-item-title>

              <v-list-item-subtitle
                v-text="outfit.subtitle"
              ></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-arrow-right</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider></v-divider>
          <v-subheader>Disqualified</v-subheader>

          <v-list-item
            v-for="outfit in disqualified"
            :key="outfit.title"
            disabled
          >
            <v-list-item-avatar>
              <v-icon class="grey darken-1" dark> mdi-folder </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="outfit.title"></v-list-item-title>

              <v-list-item-subtitle
                v-text="outfit.subtitle"
              ></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-arrow-right</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
    <div class="col-span-3">
      <img src="/img/CobaltBadge.png" class="mx-auto my-4 max-h-60" />

      <v-card max-width="600" class="mx-auto" dark>
        <div class="py-4 bg-tint">
          <p class="text-2xl text-center">Cobad</p>
        </div>

        <v-list subheader>
          <v-subheader>Qualified</v-subheader>

          <v-list-item v-for="outfit in qualified" :key="outfit.title">
            <v-list-item-avatar>
              <v-icon class="grey lighten-1" dark> mdi-folder </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="outfit.title"></v-list-item-title>

              <v-list-item-subtitle
                v-text="outfit.subtitle"
              ></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-arrow-right</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider></v-divider>
          <v-subheader>Disqualified</v-subheader>

          <v-list-item
            v-for="outfit in disqualified"
            :key="outfit.title"
            disabled
          >
            <v-list-item-avatar>
              <v-icon class="grey darken-1" dark> mdi-folder </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="outfit.title"></v-list-item-title>

              <v-list-item-subtitle
                v-text="outfit.subtitle"
              ></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-arrow-right</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import MetaHead from '~/components/MetaHead.vue'

export default Vue.extend({
  name: 'OutfitWarsRankings',
  components: {
    MetaHead,
  },
  data() {
    return {
      pageTitle: 'Outfit Wars - Rankings',
      pageDesc: 'View all Rankings / Brackets for the Outfit Wars tournament!',
      // loading: false,
      // loaded: false,
      qualified: [
        {
          subtitle: '1st Place',
          wins: '4 wins | 1 losses',
          title: '[DIG] Dignity Of War',
          image:
            'https://www.outfit-tracker.com/outfit-logo/37509488620604883.png',
        },
        {
          subtitle: '2nd Place',
          wins: '3 wins | 2 losses',
          title: '[VCBC] Vanu Creme Bun Community',
          image:
            'https://www.outfit-tracker.com/outfit-logo/37512998641482810.png',
        },
        {
          subtitle: '3rd Place',
          wins: '2 wins | 3 losses',
          title: '[EDIM] Emerald Immersion',
          image:
            'https://www.outfit-tracker.com/outfit-logo/37511594860086186.png',
        },
      ],
      disqualified: [
        {
          subtitle: '4th Place',
          wins: '1 wins | 4 losses',
          title: '[NCAV] New Conglomerate Cavalry Corps',
          image:
            'https://www.outfit-tracker.com/outfit-logo/37568950690946355.png',
        },
        {
          subtitle: '5th Place',
          wins: '1 wins | 4 losses',
          title: '[ELME] Elementary Beginnings',
          image:
            'https://www.outfit-tracker.com/outfit-logo/37513995010205725.png',
        },
        {
          subtitle: '6th Place',
          wins: '0 wins | 5 losses',
          title: '[1PRC] 1E REGIMENT DES PARA COMMANDOS',
          image:
            'https://www.outfit-tracker.com/outfit-logo/37513677696702165.png',
        },
        {
          subtitle: '7th Place',
          wins: '0 wins | 5 losses',
          title: '[SIN]Singularity of Dark Stars',
          image:
            'https://www.outfit-tracker.com/outfit-logo/37562834348233054.png',
        },
        {
          subtitle: '8th Place',
          wins: '0 wins | 5 losses',
          title: '[NCAV] New Conglomerate Cavalry Corps',
          image:
            'https://www.outfit-tracker.com/outfit-logo/37568950690946355.png',
        },
        {
          subtitle: '9th Place',
          wins: '0 wins | 5 losses',
          title: '[NCAV] New Conglomerate Cavalry Corps',
          image:
            'https://www.outfit-tracker.com/outfit-logo/37568950690946355.png',
        },
      ],
    }
  },
  head(): object {
    return {
      title: this.pageTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.pageDesc,
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${this.$config.baseUrl}/outfit-wars`,
        },
      ],
    }
  },
})
</script>

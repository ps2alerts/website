<template>
  <section
    id="outfitwars"
    ref="outfitwarsTop"
    class="grid grid-cols-12 gap-2 text-center relative"
  >
    <MetaHead :title="pageTitle" :description="pageDesc"> </MetaHead>
    <div class="col-span-12">
      <h1 class="text-title">Rankings</h1>
      <iframe
        src="https://giphy.com/embed/xTiIzJSKB4l7xTouE8"
        width="480"
        height="208"
        class="giphy-embed m-auto"
        allowFullScreen
      ></iframe>
    </div>
    <div class="col-span-3">
      <p>Obviously rough</p>
      <v-card max-width="600" class="mx-auto" dark>
        <v-toolbar color="light-blue" dark>
          <v-toolbar-title>Miller Gigachads</v-toolbar-title>
        </v-toolbar>

        <v-list subheader two-line>
          <v-subheader inset>Qualified</v-subheader>

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

          <v-divider inset></v-divider>

          <v-subheader inset>Disqualified</v-subheader>

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
      <p>Obviously rough</p>
      <v-card max-width="600" class="mx-auto" dark>
        <v-toolbar color="light-blue" dark>
          <v-toolbar-title>Connery "where my ping at"</v-toolbar-title>
        </v-toolbar>

        <v-list subheader two-line>
          <v-subheader inset>Qualified</v-subheader>

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

          <v-divider inset></v-divider>

          <v-subheader inset>Disqualified</v-subheader>

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
      <p>Obviously rough</p>
      <v-card max-width="600" class="mx-auto" dark>
        <v-toolbar color="light-blue" dark>
          <v-toolbar-title>Memerald</v-toolbar-title>
        </v-toolbar>

        <v-list subheader two-line>
          <v-subheader inset>Qualified</v-subheader>

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

          <v-divider inset></v-divider>

          <v-subheader inset>Disqualified</v-subheader>

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
      <p>Obviously rough</p>
      <v-card max-width="600" class="mx-auto" dark>
        <v-toolbar color="light-blue" dark>
          <v-toolbar-title>Cobad</v-toolbar-title>
        </v-toolbar>

        <v-list subheader two-line>
          <v-subheader inset>Qualified</v-subheader>

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

          <v-divider inset></v-divider>

          <v-subheader inset>Disqualified</v-subheader>

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
          icon: 'mdi-clipboard-text',
          subtitle: '1st Place',
          title: '[DIG] Dignity Of War',
        },
        {
          icon: 'mdi-gesture-tap-button',
          subtitle: '2nd Place',
          title: '[VCBC] Vanu Creme Bun Community',
        },
        {
          icon: 'mdi-gesture-tap-button',
          subtitle: '3rd Place',
          title: '[EDIM] Emerald Immerson',
        },
      ],
      disqualified: [
        {
          icon: 'mdi-gesture-tap-button',
          subtitle: '4th Place',
          title: '[FOO] Foobar',
        },
        {
          icon: 'mdi-gesture-tap-button',
          subtitle: '5th Place',
          title: '[EDIM] Emerald Immerson',
        },
        {
          icon: 'mdi-gesture-tap-button',
          subtitle: '6th Place',
          title: '[EDIM] Emerald Immerson',
        },
        {
          icon: 'mdi-gesture-tap-button',
          subtitle: '7th Place',
          title: '[EDIM] Emerald Immerson',
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

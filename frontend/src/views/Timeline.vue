<template>
    <div class="timeline-container">
        <!-- Timeline Header (Optional) -->
        <div class="timeline-header">
            <h2>
                <template v-if="timescale === 'hour'">
                    {{ String(currentTime.getHours()).padStart(2, '0') }}:{{ String(currentTime.getMinutes()).padStart(2,
                        '0')
                    }}
                </template>
                <template v-else-if="timescale === 'day'">
                    {{ currentTime.toLocaleDateString(undefined, { weekday: 'long' }) }}
                </template>
                <template v-else-if="timescale === 'week'">
                    {{ currentTime.getDate() }}
                </template>
                <template v-else-if="timescale === 'month'">
                    {{ currentTime.toLocaleDateString(undefined, { month: 'long' }) }}
                </template>
                <template v-if="timescale === 'year'">
                    {{ currentTime.getFullYear() }}
                </template>
                <template v-if="timescale === 'decade'">
                    {{ Math.floor(currentTime.getFullYear() / 10) * 10 }}s
                </template>
                <template v-if="timescale === 'century'">
                    XXI siècle
                </template>

            </h2>
        </div>


        <!-- Posts -->
        <div v-for="post in filteredPosts" :key="post.id" class="post-item" :style="{ top: post.position + '%' }">
            <div class="item-overlay" @click="handleItemClick(post, 'post')">

                <div v-for="tagId in post.tagIds" :key="`post-${post.id}-tag-${tagId}`" class="tag-dot"
                    :style="{ backgroundColor: getTagColor(tagId) }"></div>
            </div>
        </div>

        <!-- Media Items -->
        <div v-for="mediaItem in filteredMedia" :key="mediaItem.id" class="media-item"
            :style="{ top: mediaItem.position + '%' }">
            <div class="item-overlay" @click="handleItemClick(mediaItem, 'media')">

                <div v-for="tagId in mediaItem.tagIds" :key="`media-${mediaItem.id}-tag-${tagId}`" class="tag-dot"
                    :style="{ backgroundColor: getTagColor(tagId) }"></div>
            </div>
        </div>

        <!-- Modal Component -->
        <div v-if="isModalVisible" class="modal">
            <div class="modal-content">
                <button class="close-modal" @click="closeModal">×</button>
                <div v-if="modalContent">
                    <h3>{{ modalContent.user.username }}</h3>
                    <p>{{ modalContent.content }}</p>
                </div>
            </div>
            <div class="modal-backdrop" @click="closeModal"></div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Tags from './Tags.vue';

export default {
    components: {
        Tags // This registers the Tags component locally
    },
    props: {
        timescale: String,
        posts: Array,
        media: Array,
        tagColors: Object
    },
    data() {
        return {
            currentTime: new Date(),
            visibleContent: {},
            intervalId: null,
        };
    },
    mounted() {
        this.intervalId = setInterval(() => {
            this.currentTime = new Date();
        }, 60000);
    },
    beforeDestroy() {
        clearInterval(this.intervalId);
    },
    methods: {
        getTagColor(tagId) {
            return this.tagColors[tagId] || '#defaultColor';
        },
        showContent(itemId) {
            this.$set(this.visibleContent, itemId, true);
        },
        hideContent(itemId) {
            this.$set(this.visibleContent, itemId, false);
        },
        isContentVisible(itemId) {
            return !!this.visibleContent[itemId];
        },
        handleItemClick(item, itemType) {
            this.$store.dispatch('fetchItemDetails', { itemId: item.id, itemType });
        },
        handleTagClick(tagId) {
            this.$store.dispatch('toggleTagSelection', tagId);
        },
        closeModal() {
            this.$store.commit('setIsItemDetailVisible', false);
        },
        postPreview(post) {
            return post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content;
        },
        toggleTagSelection(tagId) {
            // Now dispatches an action or commits mutation to Vuex store to update selectedTags globally
            this.$store.dispatch('toggleTagSelection', tagId); // Assuming you have this action in your store
        },
        handleSelectedTagsUpdate(payload) {
            // Assuming payload contains the selected tags, you might need to adjust based on actual payload structure
            this.$store.commit('setSelectedTags', payload.tags.map(tag => tag.id));
        },
        formatMilestoneLabel(date) {
            switch (this.timescale) {
                case 'hour':
                    // Show every 15 minutes within the hour, going back from the current time
                    return date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0');
                case 'day':
                    // Show every hour, on the hour, for the last 24 hours, starting from the current hour
                    return date.getHours() + ':00';
                case 'week':
                    // Show the weekday for each day of the week, starting from the current day
                    return date.toLocaleDateString(undefined, { weekday: 'short' });
                case 'month':
                    // Show the date for each day of the month, starting from the current day
                    return String(date.getDate());
                case 'year':
                    // Show the month for each month of the year, starting from the current month
                    return date.toLocaleDateString(undefined, { month: 'short' });
                case 'decade':
                    // Show the year for each year of the decade, starting from the current year
                    return String(date.getFullYear());
                case 'century':
                    // Show the decade for each decade of the century, starting from the current decade
                    return (Math.floor(date.getFullYear() / 10) * 10) + 's';
                default:
                    return '';
            }
        },
        calculatePosition(date) {
            const timescaleMilliseconds = {
                'hour': 3600000,
                'day': 86400000,
                'week': 604800000,
                'month': new Date(this.currentTime.getFullYear(), this.currentTime.getMonth() + 1, 0).getDate() * 86400000, // Days in month * milliseconds per day
                'year': (new Date(this.currentTime.getFullYear(), 0, 1) - new Date(this.currentTime.getFullYear() - 1, 0, 1)), // Current year - last year to account for leap years
                'decade': 315569520000, // Average decade in milliseconds, accounting for leap years
                'century': 3155695200000 // Average century in milliseconds, accounting for leap years and leap centuries
            };

            const milestoneCount = {
                'hour': 4,
                'day': 6, // Assuming one milestone per hour
                'week': 7, // One for each day of the week
                'month': new Date(this.currentTime.getFullYear(), this.currentTime.getMonth() + 1, 0).getDate(), // Number of days in the current month
                'year': 12, // One for each month
                'decade': 10, // One for each year in a decade
                'century': 10 // One for each decade in a century
            };

            const timescale = timescaleMilliseconds[this.timescale];
            const position = ((this.currentTime.getTime() - date.getTime()) / timescale) * 100; // Ensure we are using getTime() to get milliseconds
            const milestoneSpacing = 100 / milestoneCount[this.timescale];

            return Math.round(position / milestoneSpacing) * milestoneSpacing;
        }
    },
    computed: {
        ...mapState(['selectedTags', 'isModalVisible', 'modalContent']), // Use selectedTags from Vuex store

        filteredPosts() {
            const timescaleMilliseconds = {
                'hour': 3600000,
                'day': 86400000,
                'week': 604800000,
                'month': 2592000000,
                'year': 31536000000,
                'decade': 315360000000
            };

            let timescale = timescaleMilliseconds[this.timescale];
            let oldestTime = this.currentTime.getTime() - timescale;
            let threshold = 0; // Top 5%

            return this.posts.filter(post => {
                const postTime = new Date(post.created_time).getTime();
                let isWithinTimeFrame = postTime >= oldestTime && postTime <= this.currentTime.getTime();
                let matchesSelectedTags = this.selectedTags.length === 0 || post.tagIds.some(tagId => this.selectedTags.includes(tagId));

                return isWithinTimeFrame && matchesSelectedTags;
            }).map(post => {
                const postTime = new Date(post.created_time).getTime();
                let position = ((this.currentTime - postTime) / timescale) * 100;

                if (position <= threshold) {
                    return null;
                }

                let color = this.getTagColor(post.tagIds[0]);
                return { ...post, position, color };
            }).filter(post => post !== null);
        },


        filteredMedia() {
            const timescaleMilliseconds = {
                'hour': 3600000,
                'day': 86400000,
                'week': 604800000,
                'month': 2592000000,
                'year': 31536000000,
                'decade': 315360000000
            };

            let timescale = timescaleMilliseconds[this.timescale];
            let oldestTime = this.currentTime.getTime() - timescale;

            return this.media.filter(item => {
                const itemTime = new Date(item.created_time).getTime();
                let isWithinTimeFrame = itemTime >= oldestTime && itemTime <= this.currentTime.getTime();
                let matchesSelectedTags = this.selectedTags.length === 0 || item.tagIds.some(tagId => this.selectedTags.includes(tagId));

                return isWithinTimeFrame && matchesSelectedTags;
            }).map(item => {
                const itemTime = new Date(item.created_time).getTime();
                let position = ((this.currentTime - itemTime) / timescale) * 100;

                if (position <= 5) {
                    return null;
                }

                let color = this.getTagColor(item.tagIds[0]);
                return { ...item, position, color };
            }).filter(item => item !== null);
        },
        milestones() {
            const milestones = [];
            const start = new Date(this.currentTime);

            switch (this.timescale) {
                case 'hour':
                    const currentMinutes = this.currentTime.getMinutes();
                    const startMinute = currentMinutes - (currentMinutes % 15); // Find the nearest quarter-hour mark
                    for (let i = 0; i < 4; i++) { // Assuming you want to show 4 milestones within the hour
                        const minute = startMinute - (i * 15);
                        const adjustedDate = new Date(this.currentTime);
                        adjustedDate.setMinutes(minute);
                        milestones.push(adjustedDate);
                    }
                    break;
                case 'day':
                    start.setHours(0, 0, 0, 0);
                    for (let i = 0; i < 6; i++) {
                        milestones.push(new Date(start.getTime() + i * 4 * 3600000));
                    }
                    break;
                case 'week':
                    start.setDate(start.getDate() - start.getDay());
                    start.setHours(0, 0, 0, 0);
                    for (let i = 0; i < 7; i++) {
                        milestones.push(new Date(start.getTime() + i * 86400000));
                    }
                    break;
                case 'month':
                    start.setDate(1);
                    start.setHours(0, 0, 0, 0);
                    const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
                    for (let i = 1; i <= daysInMonth; i += 7) {
                        milestones.push(new Date(start.getFullYear(), start.getMonth(), i));
                    }
                    break;
                case 'year':
                    start.setMonth(0, 1);
                    start.setHours(0, 0, 0, 0);
                    for (let i = 0; i < 12; i++) {
                        milestones.push(new Date(start.getFullYear(), i, 1));
                    }
                    break;
                case 'decade':
                    const decadeStart = Math.floor(start.getFullYear() / 10) * 10;
                    for (let i = 0; i < 10; i++) {
                        milestones.push(new Date(decadeStart + i, 0, 1));
                    }
                    break;
                case 'century':
                    const centuryStart = Math.floor(start.getFullYear() / 100) * 100;
                    for (let i = 0; i < 10; i++) {
                        milestones.push(new Date(centuryStart + i * 10, 0, 1));
                    }
                    break;
            }

            return milestones.map(date => {
                return {
                    label: this.formatMilestoneLabel(date),
                    position: this.calculatePosition(date)
                };
            });
        },
    }
};
</script>


<style>
.timeline-container {
    position: relative;
    margin-top: Opx;
    padding: 10px;
    /* height: 100; */
    overflow: visible;

    /* Equivalent to p-2.5 */
}

.post-item,
.media-item {
    position: absolute;
    left: 0;
    overflow: visible;
}

.post-content,
.media-content {
    position: absolute;
    overflow: visible;
    display: none;
    left: 20px;
    background-color: white;
    padding: 10px;
    border-radius: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    width: 208px;
    margin-bottom: 10px;
}

.tag-dot {
    width: 40px;
    height: 8px;
    margin-left: 25%;
    border-radius: 28%;
    display: inline-block;
    margin-right: 5px;


}

.milestone {
    position: relative;
    left: 2;
    height: 100;
    color: #666;
    font-size: 0.8em;

}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    }

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    z-index: 1001;
    position: relative;
}

.close-modal {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}


@media (max-width: 600px) {
    .timeline-container {
        padding-left: 5%;
        padding-top: 5%;
        margin: 0%;
        overflow: visible;
    }

    .post-content,
    .media-content {
        display: none;
        position: absolute;
        top: 1;
        overflow: visible;
        background-color: white;
        padding: 10px;
        border-radius: 6px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        min-width: auto;
        max-width: auto;
        z-index: 2000;

    }

    .show-content {
        display: block;
        width: 300px;
        position: fixed;
        z-index: 1010;
        overflow: visible;
    }

    .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    }

    .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        z-index: 1001;
        position: relative;
    }

    .close-modal {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
    }

    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    }
    }
    </style>

    
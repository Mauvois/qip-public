<template>
    <div class="tags-search-container">
        <div class="flex-container">
            <!-- Search Input Container -->
            <div class="search-input-container">
                <input type="text" placeholder="Recherche..." class="tags-search-bar" v-model="searchTerm"
                    @input="searchTags" />
                <!-- Display searchResults as a list below the search bar -->
                <ul v-if="searchResults.length > 0" class="search-results">
                    <li v-for="tag in searchResults" :key="tag.id" @click="selectTag(tag)">
                        {{ tag.name }}
                    </li>
                </ul>
            </div>
            <!-- Selected Tags Container -->
            <div class="selected-tags">
                <!-- Display selected tags as chips -->
                <span v-for="tag in selectedTags" :key="tag.id" class="tag-chip"
                    :style="{ backgroundColor: tagColors[tag.id] }">
                    {{ tag.name }}
                    <button @click.stop="removeTag(tag)">×</button>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@/axios.js'; // Ensure the path is correct

export default {
    data() {
        return {
            searchTerm: '',
            searchResults: [],
            selectedTags: [],
            colors: ['#FF6961', '#77DD77', '#AEC6CF', '#CDA4DE', '#FDFD96', '#FFB347', '#FFB6C1', '#CFCFC4', '#B0A59F'],
            tagColors: {},
        };
    },
    mounted() {
        // Add event listener to handle clicks outside the component
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeDestroy() {
        // Remove the event listener when the component is destroyed
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        async searchTags() {
            if (this.searchTerm.length > 2) {
                try {
                    const response = await axios.get(`/tag_search/?q=${this.searchTerm}`);
                    this.searchResults = response.data;
                } catch (error) {
                    console.error('Failed to search tags:', error);
                    this.searchResults = [];
                }
            } else {
                this.searchResults = [];
            }
        },
        selectTag(tag) {
            if (!this.selectedTags.some(t => t.id === tag.id)) {
                this.selectedTags.push(tag);
                this.assignColorToTag(tag); // Assign a color to the tag when it is selected
                this.searchTerm = ''; // Clear the search bar
                this.searchResults = [];
                console.log('Emitting update:selectedTags with', this.selectedTags);
                this.$emit('update:selectedTags', {
                    tags: this.selectedTags,
                    tagColors: this.tagColors
                }); // Notify the parent component
            }
        },
        removeTag(tagToRemove) {
            this.selectedTags = this.selectedTags.filter(tag => tag.id !== tagToRemove.id);
            delete this.tagColors[tagToRemove.id];
            console.log('Emitting update:selectedTags with', this.selectedTags);
            this.$emit('update:selectedTags', {
                tags: this.selectedTags,
                tagColors: this.tagColors
            }); // Notify the parent component
        },
        handleClickOutside(event) {
            // Close the dropdown if click is outside the component
            if (!this.$el.contains(event.target)) {
                this.searchResults = [];
            }
        },
        assignColorToTag(tag) {
            if (!this.tagColors[tag.id]) { // If the tag doesn't have a color assigned yet
                this.tagColors[tag.id] = this.colors[Object.keys(this.tagColors).length % this.colors.length];
            }
        },

    },
};
</script>

<style>
.flex-container {
    display: flex;
    justify-content: space-between;
    align-items: normal;
    background-color: #4B6075;
    gap: 2%;
    margin: 0%;
    /* border: #4B6075; */
    padding: 1%;
    border: none;
    width: 100%;
    position: fixed;
    height: 7%;
}

.search-input-container {
    flex: 40%;
    /* flex:3; */
    width: 100%;
    height: 55%;
    margin-left: 2%;
    border: none;
    background-color: #ffffff;
    font-size: 1rem;
    border-radius: 4px;
    color: rgb(47, 47, 47);
    z-index: 600;
}

.selected-tags {
    flex: 60%;
    /* flex: 1; */
    display: flex;
    position: normal;
    max-height: 100%;
    padding: 0%;
    margin-right: 2%;
    padding-top: 1%;
    padding-left: 1%;
    border-style: dashed;
    border-color: #4B6075;
    flex-wrap: wrap;
    background-color: white;
    gap: 10px;
    border-radius: 4px;
}

.tag-chip {
    background-color: #ffffff;
    max-height: 33%;
    ;
    max-width: fit-content;
    border: #4B6075;
    border-radius: 4px;
    font-size: 10px;
    padding-left: 1%;
    padding-right: 1%;
    display: flex;
    border: 1px solid #4B6075;
    justify-content: space-evenly;
    align-items: space-evenly;
}

.search-results {
    max-height: 100%;
    max-width: 35%;
    position: absolute;
    border-radius: 4px;
    margin: 1%;
    width: 100%;
    color: rgb(82, 82, 82);
    background-color: rgb(255, 255, 255);
    border: 1px;
    z-index: 1000;
    bottom: 100%;
}

.tags-search-bar {
    width: 90%;
    border: none;
    height: 80%;
    color: rgb(58, 58, 58);
    background-color: #ffffff;
    margin: 2%;
}

.search-results li {
    padding: 5px;
    border: none;
    cursor: pointer;
}

.search-results li:hover {
    background-color: #30cf1e;
    border: none;

}

@media (min-width: 600px) {
    .tags-search-container {
        width: 16%;
        /* Corrected the typo from 'inherti' to 'inherit' */
        height: auto;
        top: 15em;
        align-items: center;
        display: flex;
        flex-direction: column;
        position: absolute;
    }

    .search-results {
        max-height: 100%;
        max-width: 60%;
        position: absolute;
        border-radius: 4px;
        margin: 1%;
        font-size: medium;
        width: 100%;
        color: rgb(82, 82, 82);
        background-color: rgb(255, 255, 255);
        border: 1px;
        z-index: 1000;
        bottom: 110%;
    }

    .search-input-container {
        width: 90%;
        max-height: 8%;
        height: 30px;
        position: relative;
        flex: 40%;
        margin-left: 8%;
        margin-bottom: 1%;
        /* Reduced bottom margin to bring it closer to the next element */
        border: none;
        background-color: #4B6075;
        font-size: 1rem;
        border-radius: 4px;
        color: rgb(47, 47, 47);
        z-index: 600;
        top: 3%;
    }

    .tags-search-bar {
        width: 90%;
        border: none;
        /* Same as above regarding 'position: inherit' */
        position: relative;
        /* Changed for better control */
        height: 80%;
        max-height: 40px;
        color: rgb(58, 58, 58);
        background-color: #ffffff;
        margin: 0%;
        border-radius: 4px;
        padding-left: 3%;
    }

    .tag-chip {
        background-color: #ffffff;
        max-height: 18%;
        max-width: fit-content;
        position: auto;
        border: 1px solid #4B6075;
        /* Consolidated border property */
        border-radius: 4px;
        font-size: 12px;
        padding: 0 1%;
        /* Combined padding-left and padding-right */
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        /* Changed from 'space-evenly' to 'center' for align-items */
    }

    .selected-tags {
        position: relative;
        /* flex: auto; */
        max-height: 16%;
        width: 90%;
        padding: 2% 2% 0;
        margin-top: 1%;
        /* Reduced top margin to decrease the space from the previous element */
        margin-right: 2%;
        margin-left: 5%;
        margin-bottom: 40%;
        /* top: 10%; */
        bottom: 42%;
        background-color: white;
        /* gap: 100px; */
        border-radius: 4px;
    }

    .flex-container {
        background-color: #4B6075;
        position: absolute;
        gap: 2%;
        margin: 0;
        padding: 1%;
        top: 0;
        border: none;
        height: 100%;
        flex-direction: column;
        justify-content: space-between;
        /* Removed the duplicated 'position: absolute' property */
    }

    .search-results li {
        padding: 5px;
        border: none;
        cursor: pointer;
    }

    .search-results li:hover {
        background-color: #e3e3e3;
        border: none;
    }
}
</style>
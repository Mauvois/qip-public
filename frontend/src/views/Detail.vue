<template>
    <div class="modal-backdrop" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-modal" @click="closeModal">×</button>
        <div v-if="modalContent">
          <h3>{{ modalContent.user }}</h3>
          <p v-if="modalContent.type === 'post'">{{ modalContent.caption }}</p>
          <img
            v-if="modalContent.type === 'media' && modalContent.media_type === 'image'"
            :src="modalContent.signed_url"
            :alt="modalContent.caption"
          />
          <video
            v-if="modalContent.type === 'media' && modalContent.media_type === 'video'"
            controls
          >
            <source :src="modalContent.signed_url" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      content: Object,
    },
    computed: {
      modalContent() {
        return {
          ...this.content,
          type: this.content.media_type ? 'media' : 'post',
          user: this.content.user || 'Unknown',
          signed_url: this.content.signed_url || ''
        };
      },
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
    },
  };
  </script>
  
  <style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
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
  </style>
  
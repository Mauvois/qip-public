<template>
    <div class="modal">
        <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <h2>Add New Item</h2>
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label for="postContent">Post Content</label>
                    <textarea id="postContent" v-model="postData.content"></textarea>
                </div>
                <div class="form-group">
                    <label for="mediaUpload">Media Upload</label>
                    <input type="file" id="mediaUpload" @change="handleFileUpload" accept="image/*,video/*">
                </div>
                <div class="form-group">
                    <label for="tags">Tags</label>
                    <select id="tags" v-model="selectedTags" multiple>
                        <option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
                    </select>
                    <input type="text" v-model="newTag" placeholder="Add new tag" @keypress.enter.prevent="addTag"/>
                </div>
                <div class="form-group">
                    <label for="createdDate">Date</label>
                    <input type="date" id="createdDate" v-model="postData.createdDate">
                </div>
                <div class="form-group">
                    <label for="createdTime">Time</label>
                    <input type="time" id="createdTime" v-model="postData.createdTime">
                </div>
                <button type="submit">Add Item</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from '@/axios.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
const MAX_TEXT_LENGTH = 500; // Maximum length for post content and captions

export default {
    props: {
        tags: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            postData: {
                content: '',
                createdDate: '',
                createdTime: ''
            },
            selectedTags: [],
            newTag: '',
            mediaFile: null,
            mediaUploadUrl: ''
        };
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        async handleFileUpload(event) {
            this.mediaFile = event.target.files[0];
            if (this.mediaFile) {
                if (this.mediaFile.size > MAX_FILE_SIZE) {
                    alert("File size should not exceed 5MB");
                    return;
                }
                if (!ALLOWED_FORMATS.includes(this.mediaFile.type)) {
                    alert("Unsupported file format");
                    return;
                }
                try {
                    const response = await axios.get('/generate-signed-url/', {
                        params: {
                            filename: this.mediaFile.name,
                            contentType: this.mediaFile.type
                        }
                    });
                    this.mediaUploadUrl = response.data.signedUrl;
                    console.log('Generated Signed URL:', this.mediaUploadUrl);
                    
                    // Perform the actual file upload using the signed URL
                    await this.uploadToGCP(this.mediaUploadUrl, this.mediaFile);
                    console.log('File uploaded successfully:', this.mediaUploadUrl);

                    // Store the URL to the file (without the query parameters) in the database
                    const urlWithoutParams = this.mediaUploadUrl.split('?')[0];
                    this.postData.media_url = urlWithoutParams;
                } catch (error) {
                    console.error('Error generating signed URL:', error);
                }
            }
        },
        async uploadToGCP(url, file) {
            try {
                const response = await fetch(url, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to upload to GCP');
                }
            } catch (error) {
                console.error('Error uploading to GCP:', error);
            }
        },

        async addTag() {
            if (this.newTag) {
                try {
                    const response = await axios.post('/tags/add/', { name: this.newTag });
                    this.tags.push(response.data);
                    this.selectedTags.push(response.data.id);
                    this.newTag = '';
                } catch (error) {
                    console.error('Error adding new tag:', error);
                }
            }
        },
        async submitForm() {
            if (this.postData.content.length > MAX_TEXT_LENGTH) {
                alert("Content exceeds the maximum allowed length");
                return;
            }
            const isMedia = this.mediaFile !== null;
            const formData = {
                content: this.postData.content,
                created_time: this.postData.createdDate && this.postData.createdTime ? 
                            `${this.postData.createdDate}T${this.postData.createdTime}` : null,
                media_url: this.postData.media_url,
                tags: this.selectedTags,
                is_media: isMedia
            };
            try {
                await axios.post('/items/add/', formData);
                this.$emit('submit', formData);
                this.closeModal();
            } catch (error) {
                console.error('Error adding item:', error);
            }
        }
    }
};
</script>



<style scoped>
.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: auto;
    background-color: #56595C;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1050;
}

.modal-content {
    color: #E6EDF5;
}

.close {
    position: absolute;
    top: 10px;
    right: 15px;
    cursor: pointer;
    font-size: 24px;
    color: #E6EDF5;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input[type="file"],
.form-group input[type="date"],
.form-group input[type="time"],
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #56595C;
}

.form-group textarea {
    height: 100px;
}

button[type="submit"] {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    background-color: #6C8AA8;
    color: #FFFFFF;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
    background-color: #5A7080;
}
</style>

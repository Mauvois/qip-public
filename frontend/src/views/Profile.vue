<template>
    <div class="profile-modal">
        <span class="close-btn" @click="closeModal">&times;</span>
        <h1>Profile</h1>
        <div class="profile-info">
            <p><strong>Username:</strong> {{ username }}</p>
            <p><strong>Photo:</strong> <!-- Placeholder for user photo --></p>
            <p><strong>Bio:</strong> {{ bio }}</p>
            <p><strong>Links:</strong> <!-- Placeholder for user links --></p>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'Profile',
    props: ['username', 'bio'], // Receive username and bio as props
    data() {
        return {
            // Your settings data here
        };
    },
    methods: {
        closeModal() {
            console.log("Emitting close event");
            this.$emit('close'); // Emit an event to close the modal
        },
    }
    // Add data, methods, computed properties, etc., as needed for your profile functionality
};

</script>
  
<style scoped>
.profile-modal {
    position: fixed;
    /* Changed to fixed positioning */
    top: 50%;
    /* Align vertically to the middle */
    left: 50%;
    /* Align horizontally to the middle */
    transform: translate(-50%, -50%);
    /* Center the modal */
    padding: 20px;
    /* border: 1px solid #ddd; */
    border-radius: 5px;
    width: 300px;
    /* Or any other width you prefer */
    background-color: #56595C;
    z-index: 1050;
    /* Ensure it's above other elements */
    /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
    /* Optional: Adds a shadow for better visibility */
    text-align: center;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
}

.profile-modal h1 {
    color: #E6EDF5;
    margin-bottom: 15px;
}

.profile-info {
    color: #E6EDF5;
    text-align: left;
}
</style>

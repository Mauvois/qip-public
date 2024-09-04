<template>
    <div class="settings-modal">
        <span class="close-btn" @click="closeModal">&times;</span>
        <h1>Settings</h1>
        <form>
            <div class="form-group">
                <label>Theme :</label>
                <div class="theme-buttons">
                    <button :class="{ 'active': selectedTheme === 'light' }" @click="selectedTheme = 'light'">Light</button>
                    <button :class="{ 'active': selectedTheme === 'dark' }" @click="selectedTheme = 'dark'">Dark</button>
                </div>
            </div>
            <form>
                <label>Change Password :</label>
                <div class="form-group">
                    <input type="password" placeholder="Actual Password" v-model="actualPassword">
                </div>
                <div class="form-group">
                    <input type="password" placeholder="New Password" v-model="newPassword">
                </div>
                <div class="form-group">
                    <input type="password" placeholder="Confirm New Password" v-model="confirmNewPassword">
                </div>
            </form>
            <button type="submit" @click.prevent="saveSettings">Save</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'Settings',
    data() {
        return {
            selectedTheme: 'light',
            cookieManagement: false,
            newPassword: ''
        };
    },
    methods: {
        closeModal() {
            console.log("Emitting close event");
            this.$emit('close'); // Emit an event to close the modal
        },
        saveSettings() {
            // Save settings logic
            console.log('Saving settings...');
        }
    }
}
</script>

<style scoped>
.settings-modal {
    position: fixed;
    /* Changed to fixed positioning */
    top: 50%;
    /* Align vertically to the middle */
    left: 50%;
    /* Align horizontally to the middle */
    transform: translate(-50%, -50%);
    /* Center the modal */
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 300px;
    /* Or any other width you prefer */
    background-color: #56595C;
    z-index: 1050;
    /* Ensure it's above other elements */
    /* box-shadow: 0 4px 8px rgba(0,0,0,0.1); Optional: Adds a shadow for better visibility */
}

.settings-modal h1 {
    text-align: center;
    color: #E6EDF5;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    color: #E6EDF5;
}

input[type="text"],
input[type="password"],
select {
    width: 100%;
    padding: 8px;
    border: 0px solid #ccc;
    border-radius: 4px;
    color: #E6EDF5;
    background-color: #56595C;
    /* Adjust background color */
}

button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    background-color: #9EA3A8;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #56595C;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
}

.theme-buttons {
    display: flex;
    box-shadow: #ccc;
    border: solid 1px #ccc;
    ;
    border-radius: 4px;
    justify-content: space-between;
}

.theme-buttons button {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #9EA3A8;
    color: white;
    cursor: pointer;
}

input[type="password"] {
    width: 100%;
    max-height: 30px;
    padding: 8px;
    border: 0px solid #ccc;
    border-radius: 4px;
    background-color: #f2f2f2;
    /* Lighter background color */
    color: #56595C;
    /* Text color */
}

.theme-buttons button.active {
    background-color: #56595C;
}

.theme-buttons button:first-child {
    margin-right: 5px;
    /* Add some space between the buttons */
}

.theme-buttons button:last-child {
    margin-left: 5px;
    /* Add some space between the buttons */
}</style>
